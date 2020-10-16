import {LitElement, html, css, customElement} from 'lit-element';

@customElement('drive-audio-initializer')
export class WPInitializer extends LitElement {

  static get styles() {
    return css`
    .loader,
.loader:before,
.loader:after {
  top: -24px;
  width: 10px;
  height: 10px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
.loader {
  color: var(--p-col-h);
  font-size: 10px;
  margin: auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0px;
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
    
    div, :host {
      display: flex;
      width: 100%;
      height: var(--height);
    }`;
  }

  render() {
    return html`<div><slot></slot></div>`; //html`<div class="loader"></div>`
  }
}

/*

    @keyframes move {
      0% {
        background-position: -468px 0;
      }
      50% {
        background-position: 468px 0;
      }
      100% {
        background-position: -468px 0;
      }
    }
    
    div1 {
      width: 100%;
      animation-duration: 1.25s;
      animation-fill-mode: forwards;
      animation-iteration-count: infinite;
      animation-name: move;
      animation-timing-function: linear;
      background: var(--p-col-h);
      background: linear-gradient(to right, var(--p-col-h) 8%, var(--a-col), var(--p-col-h) 33%);
      background-size: 800px 104px;
      position: relative;
      align-items: center;
      padding-left: 10px;
      display: flex;
      color: var(--a-col);
    }
    
    */
  
 