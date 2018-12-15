git clone -b gh-pages --depth 1 https://$GH_TOKEN@github.com/ZhangZisu/perilla publish
rm -rf publish/*
cp -r dist/* publish
cd publish
echo "perilla.js.org" > CNAME
git add .
git commit -m 'CircleCI Build'
git push -u origin gh-pages
