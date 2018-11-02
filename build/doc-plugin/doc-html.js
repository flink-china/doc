const marked = require("marked");
const Prism = require("node-prismjs");
const renderer = new marked.Renderer();
let toc = [];
const tocGenerate = require("./doc-toc");
const YFM = require('yaml-front-matter');

renderer.heading = (text, level) => {
  const slug = text.toLowerCase().replace(/[^a-zA-Z_0-9\u4e00-\u9fa5]+/g, "-");
  toc.push({
    level: level,
    slug : slug,
    title: text
  });
  let hHTML = `<h${level} id=${slug}><span>${text}</span><a onclick="window.location.hash='${slug}'" class="anchor">#</a></h${level}>`;
  if (level === 1) {
    hHTML = `<div class="h-title">${hHTML}</div>`;
  }
  return hHTML;
};

marked.setOptions(
  {
    gfm      : true,
    highlight: function(code, lang) {
      const language = Prism.languages[lang] || Prism.languages.autoit;
      return Prism.highlight(code, language);
    },
    renderer : renderer
  }
);
module.exports = function(file) {
  toc = [];
  const meta = YFM.loadFront(file);
  const content = meta.__content;
  const markdownHTML = marked(content);
  const tocHTML = tocGenerate(toc, [2, 3]);
  return `<article>${tocHTML}<section class="markdown">${markdownHTML}</section></article>`;
};