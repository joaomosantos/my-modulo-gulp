var gulp = require('gulp');
less = require('gulp-less'),
minifyCSS = require('gulp-minify-css'),
concat = require('gulp-concat'),
rename = require('gulp-rename'),
browserSync = require('browser-sync'),
ssi = require('browsersync-ssi'),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
image = require('gulp-image');

var configs = {
  less: {
    source: './css/less/*.less',
    dest: './css/'
  },
  sass: {
    source: './css/sass/*.scss',
    dest: './css/'
  },
  css: {
    source: './css/*.css',
    dest: './css/final/',
    main: 'all.css',
    root: './css/'
  },
  sync: {
    ext: [
    '*.html',
    '*.shtm',
    '*.shtml',
    './css/**/*.css'
    ]
  },
  img: {
    source: './images/**/*',
    dest: './images/'
  }
};

gulp.task('default', function() {});

/* Compilar LESS */
gulp.task('compiler-less', function() {
  gulp.src(configs.less.source)
  .pipe(less())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.less.dest))
  .pipe(browserSync.stream());
});

/* Compilar SASS */
gulp.task('compiler-sass', function() {
  gulp.src(configs.sass.source)
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.sass.dest))
  .pipe(browserSync.stream());
});

/* Sincronizar browser*/
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html',
      middleware: ssi({
        baseDir: __dirname,
        ext: '.shtm'
      })
    }
  });
  gulp.watch(configs.less.source, ['compiler-less'], browserSync.reload);
  gulp.watch(configs.sass.source, ['compiler-sass'], browserSync.reload);
  gulp.watch(configs.sync.ext, browserSync.reload);
});

/* Concatenar em um único CSS */
gulp.task('concat-css', function() {
  gulp.src(configs.css.source)
  .pipe(concat(configs.css.main))
  .pipe(gulp.dest(configs.css.dest));
});

/* Gerar CSS minificado */
gulp.task('minify-css', ['concat-css'], function() {
  gulp.src(configs.css.dest + configs.css.main)
  .pipe(minifyCSS())
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest(configs.css.dest));
});

// Adicionar auto prefixo
gulp.task('autoprefixer-css', function() {
  gulp.src(configs.css.source)
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(configs.css.root));
});

// Comprimir imagem
gulp.task('images', function () {
  gulp.src(configs.img.source)
    .pipe(image())
    .pipe(gulp.dest(configs.img.dest));
});
