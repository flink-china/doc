# Flink China Doc

Markdown Support & Auto Deploy


![preview_01](https://img.alicdn.com/tfs/TB1iN2gw4D1gK0jSZFsXXbldVXa-2850-5954.png)
![preview_02](https://img.alicdn.com/tfs/TB1ZVrdwWL7gK0jSZFBXXXZZpXa-2850-1374.png)

## Generate Doc

### Environment


> **Note**: Please make sure you have installed [Node](https://nodejs.org/en/) already.

You can generate and preview static site by the following command

```bash
    $ npm run generate
    $ cd dist
    $ python -m SimpleHTTPServer 8080
```


## Contribute Guide

> **Note**: Please fork this repo and send pull request, netlify robot will generate deploy preview for you. The site will be auto deployed and refreshed when master branch updated.

### New Blog

Add markdown file to `markdown/blog`

```md
-----
title: {{ blog title here }}
author: {{ blog author here }}
time: {{ created time here }}
order: {{ blog order here }}
comment: {{ blog comment here }}
---
```

### Add Community Activity

```md
-----
title: {{ activity title }}
time: {{ activity time }}
img: {{ img link }}
order: {{ community order }}
location: {{ community location }}
---
```

### Update Doc

`markdown/doc`

