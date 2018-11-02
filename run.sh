rm -f ./markdown/community/*
cp ~/GitBook/Library/Import/blink-doc-opensource/community/* ./markdown/community/
rm -f ./markdown/blog/*
cp ~/GitBook/Library/Import/blink-doc-opensource/blog/* ./markdown/blog/
rm -rf ./markdown/doc/* 
cp -r ~/GitBook/Library/Import/blink-doc-opensource/* ./markdown/doc/
rm -rf ./markdown/doc/activity
rm -rf ./markdown/doc/community
rm -rf ./markdown/doc/blog
npm run site
