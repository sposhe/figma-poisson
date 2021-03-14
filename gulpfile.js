const { src, dest, series, parallel, watch } = require('gulp')

const webpack = require('webpack-stream')
const rename  = require('gulp-rename')

function jsCompile() {
  return src('src/code.js')
    .pipe( webpack({ mode: 'production' }) )
    .pipe( rename({ basename: 'code' }) )
    .pipe( dest('plugin') )
}
function jsWatch(cb) {
  watch(['src/**/*.js'], jsCompile)
  cb()
}

function staticMove() {
  return src('src/**/*.json')
    .pipe( dest('plugin') )
}
function staticWatch(cb) {
  watch(['src/**/*.json'], staticMove)
  cb()
}

exports.default = series(staticMove, jsCompile, staticWatch, jsWatch)