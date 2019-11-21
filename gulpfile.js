const { parallel, src, dest } = require('gulp')
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')
const ts = require('gulp-typescript')

function build() {
  return src('src/**/*.ts')
    .pipe(ts())
  // .pipe(babel())
  //   .pipe(rename(function(path){
  //     path.basename = path.basename.toLowerCase()
  //   }))
  //   .pipe(uglify())
    .pipe(dest('dist'))
}

function copyPack() {
  return src('package.json')
    .pipe(dest('dist'))
}

exports.default = parallel(build, copyPack)
