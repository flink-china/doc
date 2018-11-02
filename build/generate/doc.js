const fs = require("fs-extra");
const generateNavStructure = require("../doc-plugin/nav-ast");
const generateNavHTML = require("../doc-plugin/nav-html");
const generateDocHTML = require("../doc-plugin/doc-html");
const generateSubNavHTML = require("../doc-plugin/subnav-html");

module.exports = function(baseURL, navFileName, releasePath, prefixPath) {
  const navFile = fs.readFileSync(`${baseURL}/${navFileName}`);
  const templateFile = fs.readFileSync(`${releasePath}/doc.html`);
  const navStructure = generateNavStructure(navFile, prefixPath);
  const ast = navStructure.ast;
  const listOfNav = navStructure.list;
  listOfNav.forEach((nav, index) => {
    const listOfPath = nav.path.split("/");
    listOfPath.pop();
    const ensurePath = listOfPath.join("/");
    fs.ensureDir(`${releasePath}/${prefixPath}/${ensurePath}`).then(() => {
      try {
        const docFile = fs.readFileSync(`${baseURL}/${nav.path}`);
        const navHTML = generateNavHTML(ast, nav.path);
        const docHTML = generateDocHTML(docFile);
        const subNavHTML = generateSubNavHTML(listOfNav[index - 1], listOfNav[index + 1]);
        const targetFile = String(templateFile).replace("$nav", navHTML).replace("$doc", docHTML).replace("$subnav", subNavHTML);
        const targetPath = `${releasePath}/${nav.url}`;
        fs.writeFileSync(`${targetPath}`, targetFile);
      } catch (e) {
      }
    });
  });
};