import { LitElement, html} from 'lit-element';
import {asyncReplace} from 'lit-html/directives/async-replace.js';
import {transition} from 'lit-transition';
import {transTeaser as trans, transWaitBar} from './transitions';
import arrow from './assets/arrow.svg';
import {name} from '../package.json';
const interval = 8000;

class Component extends LitElement {

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
    <div><div>
      <div short>
        <div>
          <h1 underline>${name}</h1>
          
          <p>
            A tiny yet effective media player web component
          </p>

          <a href="about">
            ${arrow}
            GET STARTED
          </a>
        </div>
      </div>
      <div teaser>
        ${asyncReplace(this.teaser())}
      </div>
    </div></div>`;
  }

  async *teaser() {
    while (true) {
      let one = teasers[0];
      teasers.splice(0,1);
      teasers.push(one);
      // wrapping a template using transition directive will
      // automatically animate it on change
      yield transition(one,trans);
      await new Promise(r => setTimeout(r, interval));
    }
  }
}

customElements.define('doc-landing', Component);

const teasers = [
html `
<h2>Dead simple</h2>
<doc-demo .code=${`
// js
import 'drive-audio';

// html
<drive-audio-player
  url="https://drive.google.com/file/d/1kY2PkRGa116ubnpkWbx9PjLKsmERKLnU/view?usp=sharing">
  </drive-audio-player>
  `
}></doc-demo>`,
html `
<h2>Configurable</h2>
<doc-demo .code=${`
// use custom styles & hooks for transitions
transition(
  template, {
    mode: 'in-out',
    onAfterEnter: () => { /* hook */ }
    css: \`
      .my-enter {
        rotate3d(...)
      }\`
  }
)`
}></doc-demo>`
].map(t => html`<div>
${t}
${transition(html`<div></div>`, transWaitBar(interval))}
</div>`);