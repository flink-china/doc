const fs = require("fs-extra");
const generateCommunityHTML = require("../community-plugin/community-html");
module.exports = function(baseURL, releasePath, prefixPath) {
  const templateFile = fs.readFileSync(`${releasePath}/blog.html`);
  const ctemplateFile = fs.readFileSync(`${releasePath}/community.html`);
  const sourceDir = fs.readdirSync(baseURL);
  const targetDir = `${releasePath}/${prefixPath}`;
  const listOfCommunity = [];
  fs.ensureDirSync(targetDir);
  sourceDir.forEach(communityName => {
    const communityFile = fs.readFileSync(`${baseURL}/${communityName}`);
    const community = generateCommunityHTML(communityFile, communityName);
    listOfCommunity.push(community);
  });
  listOfCommunity.sort((pre, next) => +next.order - +pre.order);
  let mainHTML = ``;
  listOfCommunity.forEach(community => {
    const targetLink = community.name.replace('.md','.html');
    fs.writeFileSync(`${targetDir}/${targetLink}`, String(templateFile).replace("$content", community.html));
    mainHTML += `<div class="item">
        <a href="${prefixPath}/${targetLink}">
          <div style="background-image:url('${community.img}')"></div>
        </a>
        <div class="intro">
          <h4>${community.title}</h4>
          <p><i class="anticon anticon-environment-o"></i>${community.location}</p>
          <p><i class="anticon anticon-calendar"></i> ${community.time}</p>
        </div>
      </div>`;
  });
  const outputHTML = `<div class="community-list">${mainHTML}</div>`;
  const targetFile = String(ctemplateFile).replace("$content", outputHTML);
  fs.writeFileSync(`${targetDir}/index.html`, targetFile);
};