const { src, dest, series, parallel, watch } = require('gulp')

const webpack = require('webpack-stream')

const pug = require('gulp-pug')
const sass = require('gulp-sass')
const rename  = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const htmlbeautify = require('gulp-html-beautify')
const autoprefixer = require('gulp-autoprefixer')


function pugCompile() {
  return src('src/**/*.pug')
    .pipe( pug() )
    .pipe( htmlbeautify({ indent_size: 2, inline: ['input'] }) )
    .pipe( dest('plugin') )
}
function pugWatch(cb) {
  watch([
    'src/**/*.pug',
    'plugin/ui.css',
    'plugin/ui.js'
  ], pugCompile)
  cb()
}


function sassCompile() {
  return src('src/**/*.+(sass|scss|css)')
    .pipe( sass({ includePaths: ['node_modules'] }) )
    .pipe( autoprefixer() )
    .pipe( cleanCSS() )
    .pipe( dest('plugin') )
}
function sassWatch(cb) {
  watch(['src/**/*.+(sass|scss|css)'], sassCompile)
  cb()
}


function jsPluginCompile() {
  return src('src/code.js')
    .pipe( webpack({ mode: 'production' }) )
    .pipe( rename({ basename: 'code' }) )
    .pipe( dest('plugin') )
}
function jsPluginWatch(cb) {
  watch(['src/code.js'], jsPluginCompile)
  cb()
}


function jsUiCompile() {
  return src('src/ui.js')
    .pipe( webpack({ mode: 'production' }) )
    .pipe( rename({ basename: 'ui' }) )
    .pipe( dest('plugin') )
}
function jsUiWatch(cb) {
  watch(['src/ui.js'], jsUiCompile)
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


exports.default = series(
    staticMove,
    sassCompile,
    jsUiCompile,
    pugCompile,
    jsPluginCompile,
    staticWatch,
    sassWatch,
    jsUiWatch,
    pugWatch,
    jsPluginWatch
  )