const docSearch = require('docsearch.js/dist/npm');

export function initDocSearch() {
  const searchBox = document.getElementById('search-box');
  if (searchBox) {
    const inputBox = searchBox.getElementsByTagName('input')[ 0 ];
    inputBox.addEventListener('focus', () => {
      searchBox.classList.add('focus');
    });
    inputBox.addEventListener('blur', () => {
      searchBox.classList.remove('focus');
    });
    docSearch({
      appId         : 'F2KVBKF9R4',
      apiKey        : 'b24ddf524e41792fc4aab2682402b052',
      indexName     : 'flink_china',
      inputSelector : '#search-box input',
      algoliaOptions: { hitsPerPage: 5 },
      transformData(hits: any) {
        hits.forEach((hit: any) => {
          hit.url = hit.url.replace('localhost:3000', location.host);
          hit.url = hit.url.replace('https:', location.protocol);
        });
        return hits;
      },
      debug         : false
    });
  }

}