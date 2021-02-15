import { async } from 'regenerator-runtime';

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.parentElement;

      if (!btn.classList.contains('btn--inline')) return;

      const pageToLoad = +btn.dataset.goto;

      handler(pageToLoad);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    //1st page
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next');
    }

    //Only 1 page
    if (curPage === 1 && numPages === 1) {
      return '';
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev');
    }

    //Other page
    if (curPage < numPages && numPages > 1) {
      return this._generateMarkupBtn('next') + this._generateMarkupBtn('prev');
    }
  }

  _generateMarkupBtn(type) {
    const curPage = this._data.page;

    if (type === 'prev')
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;

    if (type === 'next')
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
  }
}

export default new PaginationView();
