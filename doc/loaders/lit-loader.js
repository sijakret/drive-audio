module.exports = function loader(source) {
  if (this.resourcePath.toLowerCase().endsWith('.ui')) {
    return `
      import { html } from 'lit-element';
      export default html\`${ source }\`;
    `;
  } else {
    return `
      import { css } from 'lit-element';
      export default css\`${ source }\`;
    `;
  }
}