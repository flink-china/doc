const generateDoc = require("./generate/doc");
const generateBlog = require("./generate/blog");
const generateCommunity = require("./generate/community");
generateDoc("markdown/doc", "SUMMARY.md", "dist", "doc");
generateBlog("markdown/blog", "dist", "blog");
generateCommunity("markdown/community", "dist", "community");