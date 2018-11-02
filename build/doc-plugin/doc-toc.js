module.exports = function(tocList, levelList) {
  let innerHTML = "";
  tocList.filter(toc => levelList.indexOf(toc.level) > -1).forEach(toc => {
    innerHTML += `<li title="${toc.title}"><a onclick="window.location.hash='${toc.slug}'" style="padding-left:${toc.level * 8}px">${toc.title}</a></li>`;
  });
  return `<div class="toc-affix"><div><ul class="toc">${innerHTML}</ul></div></div>`;
};