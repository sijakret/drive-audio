import './index.scss';

import { html } from 'lit-element';
import {cache} from 'lit-html/directives/cache';
import router from './router';
import github from './assets/github.svg';
import {version} from './version';
import {name} from '../package.json';


// main app
class Component extends router() {

  render() {
    return html`
    <div app>
    ${cache(
      html`<header>
      <a href=https://github.com/sijakret/drive-audio>${github}</a>
    </header>`
    )}
    ${
      this.route === 'Landing' ?
        html`<drive-audio-folder
        folderId="1bMhdqWhVxMsz2qkKJNAVQokfhYvPR5ND"
        apiKey="AIzaSyDRbhyb-TWaXC4yYxksZB_5KekU4ujzLO4">
      </drive-audio-folder>
        `: this.page}
    </div>`;
  }

  get nav() {
    return index.map(i => {
      const active = this.route===i.title;
      return [
        html`<a href=${i.route} ?active=${active}>${i.title}</a>`,
        // subsections
        active ? html`<ul>
          ${i.index.map((s,j) => html`<li>
          <a href=${`${i.route}#sec-${j}`}>${s}</a>
          </li>` )}
        </ul>` : undefined
      ]
    });
  }
  
  get page() {
    return this.renderContent
  }
}

customElements.define('doc-app', Component);