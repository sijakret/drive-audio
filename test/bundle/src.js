import {render,html} from 'lit-html';

// check some basic imports
import {transition, mark} from 'web-play';

// super basic sanity test
render(transition(mark(html`<div></div>`,'test'), document.body));