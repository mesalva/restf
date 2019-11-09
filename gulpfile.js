const { parallel, src, dest } = require('gulp')
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')

function build() {
  return src('src/**/*.js')
  // .pipe(babel())
    .pipe(rename(function(path){
      path.basename = path.basename.toLowerCase()
    }))
    .pipe(uglify())
    .pipe(dest('dist'))
}

function copyPack() {
  return src('package.json')
    .pipe(dest('dist'))
}

exports.default = parallel(build, copyPack)
