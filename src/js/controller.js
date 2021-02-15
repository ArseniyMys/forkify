import { async } from 'regenerator-runtime';

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { getHash } from './helpers.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = getHash();
    if (!id) return;

    recipeView.renderSpinner();

    const page = model.getSearchResultsPage();
    resultsView.update(page);
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    controlPagination();

    console.log(model.state.search);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlPagination = function (pageToLoad) {
  const page = model.getSearchResultsPage(pageToLoad);
  resultsView.render(page);

  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);

  recipeView.update(model.state.recipe);
};

const controlNewBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  bookmarksView.render(model.state.bookmarks);
};

const controlUpdateBookmark = function () {
  controlNewBookmark();
  recipeView.update(model.state.recipe);
};

const controlLoadBookmarks = function () {
  model.loadBookmarks();
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    controlNewBookmark();
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function() {
  console.log('Welcome to the app!')
}

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBookmark(controlUpdateBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlLoadBookmarks);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature()
};
init();
