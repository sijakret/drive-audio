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
      <span>${version}</span>
      <a href=https://github.com/sijakret/drive-audio>${github}</a>
    </header>
    `
    )}
    <div player>
    ${
      this.params.folderId ?
        html`
        <drive-audio-folder
          folderId=${this.params.folderId}
          apiKey="AIzaSyDRbhyb-TWaXC4yYxksZB_5KekU4ujzLO4">
        </drive-audio-folder>
        
        `: html`
        <h2>todo</h2><input placeholder="paste google drive folder link or id"/>`}
      </div>
    </div>`;
  }
}

customElements.define('doc-app', Component);