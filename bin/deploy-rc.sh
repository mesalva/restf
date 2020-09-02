cp .npmrc dist/.npmrc
yarn build &&
cd dist &&
npm publish --tag rc &&
cd ..
