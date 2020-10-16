import {LitElement, property, html, css, customElement} from 'lit-element';
import {styleMap} from 'lit-html/directives/style-map';

@customElement('drive-audio-initializer')
export class WPInitializer extends LitElement {
  @property() progress:number = 0

  static get styles() {
    return css`
    :host {
      display: flex;
      width: 100%;
      height: var(--height);
    }
    [seek] {
      pointer-events: none;
      transition: all 0.2s;
      background-color: var(--p-col-h);
      position: absolute;
      left: 0px;
      bottom: 8px;
      top: 8px;
    }`;
  }

  render() {
    const progress = this.progress;
    const percent = 100 * progress;
    return html`<div seek style=${styleMap({width: percent+'%'})}></div>`;
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
  
 