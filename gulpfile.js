/*jshint globalstrict: true*/
/*global require*/

'use strict'

const gulp = require('gulp')
const typescript = require('gulp-typescript')
const connect = require('gulp-connect')
const jdists = require('gulp-jdists')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const open = require('gulp-open')
const examplejs = require('gulp-examplejs')

const port = 20172

gulp.task('connect', function () {
  connect.server({
    port: port,
    livereload: true
  })
})

gulp.task('watch', function () {
  gulp.watch(['./example/*.html', './src/ts/*.ts'], ['build', 'jdists', 'reload'])
})

gulp.task('reload', function () {
  gulp.src(['./example/*.html', './src/ts/*.ts'])
    .pipe(connect.reload())
})

gulp.task('build', function () {
  gulp.src('./src/ts/*.ts')
    .pipe(typescript({
      target: 'ES5'
    }))
    .pipe(gulp.dest('./src/js'))
})

gulp.task('jdists', function () {
  gulp.src('./src/h5i18n.jdists.js')
    .pipe(jdists())
    .pipe(rename('h5i18n.js'))
    .pipe(gulp.dest('./'))

  gulp.src('./src/compiler.jdists.js')
    .pipe(jdists())
    .pipe(rename('compiler.js'))
    .pipe(gulp.dest('./lib/'))
})

gulp.task('open', function () {
  gulp.src(__filename)
    .pipe(open({ uri: `http://localhost:${port}/example/index.html` }))
})

gulp.task('uglify', function () {
  gulp.src('h5i18n.js')
    .pipe(uglify())
    .pipe(rename('h5i18n.min.js'))
    .pipe(gulp.dest('./'))
})

gulp.task('example', function() {
  return gulp.src([
      'src/ts/*.ts'
    ])
    .pipe(examplejs({
      header: `
global.h5i18n = require('../h5i18n.js');
      `,
      globals: 'document,NodeFilter'
    }))
    .pipe(rename({
      extname: '.js'
    }))
    .pipe(gulp.dest('test'))
})

gulp.task('dist', ['build', 'jdists', 'uglify'])
gulp.task('debug', ['build', 'jdists', 'connect', 'watch', 'open'])