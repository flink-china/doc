module.exports = function(pre, next) {
  // language=HTML
  const preHTML = pre ? `<a class="prev-page" href="${pre.url}">${pre.text}</a>` : "";
  const nextHTML = next ? `<a class="next-page" href="${next.url}">${next.text}</a>` : "";
  return `<section class="prev-next-nav">
      ${preHTML}
      ${nextHTML}
    </section>`;
};