const path = require("path");
const hash = require("hash-sum");

module.exports = function vueJsxHotLoader(output, sourceMap) {
  if (typeof this.cacheable === 'function') {
        this.cacheable();
    }

    const api = JSON.stringify(require.resolve("vue-jsx-hot-loader/src/api"));

    const moduleId = `_vue_jsx_hot-${hash(this.resourcePath)}`;
    const fileName = path.basename(this.resourcePath);
    const hotId = JSON.stringify(`${moduleId}/${fileName}`);

    this.callback(
        null,
        `${output}\n// VUE JSX HOT LOADER //\nif (module.hot) require(${api})({ Vue: require('vue'), ctx: __webpack_exports__, module: module, hotId: ${hotId} });`,
        sourceMap,
    );
};