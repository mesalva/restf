cp .npmrc dist/.npmrc 2> /dev/null
yarn build &&
cd dist &&
npm publish --tag rc &&
cd ..
