module.exports = function(file, name) {
  const marked = require("marked");
  const YFM = require("yaml-front-matter");
  const meta = YFM.loadFront(file);
  const content = meta.__content;
  const markdownHTML = marked(content);
  return {
    title   : meta.title,
    name    : name,
    order   : meta.order,
    time    : meta.time,
    img     : meta.img,
    location: meta.location,
    html    : `<article class="blog-content"><section class="markdown">${markdownHTML}</section></article>`
  };
};