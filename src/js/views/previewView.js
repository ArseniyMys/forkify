import { async } from 'regenerator-runtime';

import View from './View.js';
import { getHash } from '../helpers.js';
import icons from 'url:../../img/icons.svg';

export default class PreviewView extends View {
  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }

  _generateMarkupPreview(res) {
    const id = getHash();

    return `
      <li class="preview">
        <a class="preview__link ${
          res.id === id ? 'preview__link--active' : ''
        }" href="#${res.id}">
          <figure class="preview__fig">
            <img src="${res.image}" alt="${res.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${res.title}</h4>
            <p class="preview__publisher">${res.title}</p>
            ${
              res.key
                ? `
                  <div class="recipe__user-generated">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
                `
                : ''
            }
          </div>
        </a>
      </li> 
    `;
  }
}
