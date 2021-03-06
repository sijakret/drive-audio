import { LitElement, html } from 'lit-element';
import { navigator, router } from 'lit-element-router';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';

import { mark } from 'drive-audio';
import { scrolly } from './utils';

// routing
const routes = [
  {
    name: 'Landing',
    pattern: '/:folderId'
  },
  {
    name: 'not-foud',
    pattern: '*',
    data: {
      render: () => html`<div>How on earth did you get here??</div>`,
      title: '404 - Ooops'
    }
  },
];

export default function() {
  return class Router extends navigator(router(LitElement)) {
    static get properties() {
      return {
        route: { type: String },
        params: { type: Object },
        query: { type: Object },
        routeData: { type: Object },
        menu: Boolean
      };
    }
  
    static get routes() {
      return routes;
    }

    get baseRoute() {
      return PUBLIC_PATH;
    }

    // make css bleed in
    createRenderRoot() {
      return this;
    }
  
    constructor() {
      super();
      this.route = '';
      this.params = {};
      this.query = {};
    }
  
    router(route, params, query, data) {
      this.route = route;
      this.params = params;
      this.query = query;
      this.routeData = data;
    }

    navigate(href) {
      this.menu = false;
      super.navigate(href);
      this.scroll(href);
    }

    scroll(href) {
      const anchor = (href+'#top').split('#')[1];
      scrolly('#'+anchor, anchor!='top'?100:0);
    }

    firstUpdated() {
      // the proper wayof doing this would be
      // to make sure the page has rendered..
      setTimeout(() => {
        this.scroll(window.location.href);
      }, 100);
    }
  
    get routeTitle() {
      return this.routeData && html`<h1 title>
        ${this.routeData.title}
      </h1>`;
    }
    
    get renderContent() {
      return this.routeData && this.routeData.render();
    }
  }
};