const remark = require("remark")();
const listOfLink = [];

function preParseAST(data, prefixPath) {
  const list = ["position", "ordered", "start", "loose", "checked", "title"];
  if (data.type === "paragraph") {
    if (data.children[0].url) {
      data.path = data.children[0].url;
      data.url = data.children[0].url.replace(/.md$/, ".html");
      if (data.url === "/README.html" || data.url === "README.html") {
        data.url = "index.html";
      }
      data.url = `${prefixPath}/${data.url}`;
      data.text = data.children[0].children[0].value;
    } else {
      data.text = data.children[0].value;
      data.path = '';
      data.url = '';
    }
    delete data.children;
  }
  list.forEach(r => {
    delete data[r];
  });
  if (data.children) {
    data.children.forEach(child => {
      preParseAST(child, prefixPath);
    });
  }
}

function transformAST(data, level, parent) {
  data["level"] = level;
  data["parent"] = parent;
  switch (data.type) {
    case "list":
      data.type = "ul";
      data["expanded"] = false;
      break;
    case "listItem":
      data.type = "li";
      data["expanded"] = false;
      if (data.children.length === 1) {
        data["hasSub"] = false;
        data["link"] = data.children[0];
        listOfLink.push(data["link"]);
        delete data.children;
      } else {
        data["hasSub"] = true;
        data["link"] = data.children.shift();
      }
      data["link"]["active"] = false;
      break;
  }
  if (data.children) {
    level++;
    data.children.forEach(child => {
      transformAST(child, level, data);
    });
  }
}


module.exports = function(file, prefixPath) {
  const AST = remark.parse(file);
  preParseAST(AST, prefixPath);
  transformAST(AST, 0, null);
  return {
    ast : AST,
    list: listOfLink
  };
};
