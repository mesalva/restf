rm -rf dist &&
yarn run tsc &&
ls dist/*.js | xargs -n 1 -I file yarn run uglifyjs file -c -m -o file
cp package.json dist/package.json
