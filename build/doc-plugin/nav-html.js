let isRootParsed = false;
let html = "";

function resetAST(data) {
  if (data.type === "li" || data.type === "ul") {
    data["expanded"] = false;
  }
  if (data.children) {
    data.children.forEach(child => {
      resetAST(child);
    });
  }
}

function parseAST(data, link) {
  if (data.type === "li") {
    if (data["link"]["path"] === link) {
      setActiveLink(data);
      data["link"]["active"] = true;
    } else {
      data["link"]["active"] = false;
    }
  }
  if (data.children) {
    data.children.forEach(child => {
      parseAST(child, link);
    });
  }
}

function setActiveLink(data) {
  if (data.type === "li" || data.type === "ul") {
    data["expanded"] = true;
  }
  if (data.parent) {
    setActiveLink(data.parent);
  }
}

function generateHTML(data) {
  if (data.type === "ul") {
    let className = "";
    if (isRootParsed) {
      className = "ant-menu ant-menu-sub ant-menu-inline";
      if (!data.expanded) {
        className += " ant-menu-hidden";
      }
    } else {
      className = "ant-menu aside-container menu-site ant-menu-light ant-menu-root ant-menu-inline";
    }
    html += `<ul class="${className}">`;
    isRootParsed = true;
  }
  if (data.type === "li") {
    const style = `padding-left:${data.level / 2 * 40}px`;
    if (data.hasSub) {
      html += `<li class="ant-menu-submenu ant-menu-submenu-inline ${data.expanded ? "ant-menu-submenu-open" : ""}"><div class="ant-menu-submenu-title" style="${style}"><h4>${data.link.text}</h4><i class="ant-menu-submenu-arrow"></i></div>`;
    } else {
      html += `<li class="ant-menu-item ${data.link.active ? "ant-menu-item-selected" : ""}" style="${style}"><a href="${data.link.url}">${data.link.text}</a>`;
    }
  }
  if (data.children) {
    data.children.forEach(child => {
      generateHTML(child);
    });
  }
  if (data.type === "ul") {
    html += `</ul>`;
  }
  if (data.type === "li") {
    html += `</li>`;
  }
  return html;
}

module.exports = function(AST, link) {
  isRootParsed = false;
  html = "";
  resetAST(AST);
  parseAST(AST, link);
  generateHTML(AST.children[0]);
  return html;
};