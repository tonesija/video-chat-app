cd client
npm run build
cd ..
git add *
git commit -m "client build"
git subtree push --prefix=server heroku master
