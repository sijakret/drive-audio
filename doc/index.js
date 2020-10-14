import './index.scss';
import 'highlight.js/styles/atelier-savanna-dark.css';
import './demo';
import './landing';

import { html } from 'lit-element';
import {cache} from 'lit-html/directives/cache';
import {index} from './loaders/md-loader?folder=./guide!';
import router from './router';
import github from './assets/github.svg';
import {version} from './version';
import {name} from '../package.json';


// main app
class Component extends router() {

  render() {
    return html`
    <div app @click=${(e) => {
      if(e.target.tagName === 'A') {
        const href = e.target.href;
        if(href.startsWith(window.location.origin)) {
          e.preventDefault();
          this.navigate(href);
        }
      }
    }}>
    ${cache(
      html`<header>
      <a @click=${() => {
        this.route === 'Landing' && this.navigate('about')
        this.menu = !this.menu;
      }} mobile-menu-button>☰</a>
      <a href=${this.baseRoute} underline title>
        ${name}
        <span>${version}</span>
        
      </a>
      <a href=https://github.com/sijakret/drive-audio>${github}</a>
      <a href=${index[0].route}>doc</a>
    </header>`
    )}
    ${
      this.route === 'Landing' ?
        html`
        <doc-landing>
        </doc-landing>
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
    return html`<div layout>
      <nav ?menu=${this.menu}>
        ${this.nav}
      </nav>
      <main>
        <div id="top"></div>
        <content>
          ${this.routeTitle}
          ${this.renderContent}
        </content>
      </main>
    </div>`;
  }
}

customElements.define('doc-app', Component);