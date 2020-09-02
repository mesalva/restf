cp .npmrc dist/.npmrc
yarn build &&
cd dist &&
npm publish &&
cd ..
