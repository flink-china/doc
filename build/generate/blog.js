const fs = require("fs-extra");
const generateBlogHTML = require("../blog-plugin/blog-html");
module.exports = function(baseURL, releasePath, prefixPath) {
  const templateFile = fs.readFileSync(`${releasePath}/blog.html`);
  const sourceDir = fs.readdirSync(baseURL);
  const targetDir = `${releasePath}/${prefixPath}`;
  const listOfBlog = [];
  fs.ensureDirSync(targetDir);
  sourceDir.forEach(blogName => {
    const blogFile = fs.readFileSync(`${baseURL}/${blogName}`);
    const blog = generateBlogHTML(blogFile, blogName);
    listOfBlog.push(blog);
  });
  listOfBlog.sort((pre, next) => +next.order - +pre.order);
  let mainHTML = ``;
  listOfBlog.forEach(blog => {
    const targetLink = blog.name.replace('.md','.html');
    fs.writeFileSync(`${targetDir}/${targetLink}`, String(templateFile).replace("$content", blog.html));
    mainHTML += `<a class="blog-item ant-row" href="${prefixPath}/${targetLink}">
      <div class="title">
        <h1><i class="anticon anticon-paper-clip"></i>${blog.title}</h1>
        <span class="time"><i class="anticon anticon-calendar"></i> ${blog.time}</span>
        <span class="author"><i class="anticon anticon-user"></i> ${blog.author}</span>
      </div>
      <div class="comment">${blog.comment}</div>
    </a>`;
  });
  const outputHTML = `<div class="blog-list">${mainHTML}</div>`;
  const targetFile = String(templateFile).replace("$content", outputHTML);
  fs.writeFileSync(`${targetDir}/index.html`, targetFile);
};