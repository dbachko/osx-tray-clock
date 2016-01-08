'use strict';

var gulp          = require('gulp');

var $             = require('gulp-load-plugins')();
var del           = require('del');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var preprocessify = require('preprocessify');
var runSequence   = require('run-sequence');
var domain        = require('domain');

var env           = 'dev';
var webserver     = false;

var log = function log(task, start) {
  if (!start) {
    setTimeout(function() {
      $.util.log('Starting', '\'' + $.util.colors.cyan(task) + '\'...');
    }, 1);
  } else {
    var time = ((new Date() - start) / 1000).toFixed(2) + ' s';
    $.util.log('Finished', '\'' + $.util.colors.cyan(task) + '\'', 'after', $.util.colors.magenta(time));
  }
};

gulp.task('clean:dev', function() {
  return del(['.tmp']);
});

gulp.task('clean:app', function() {
  return del(['app']);
});

gulp.task('scripts', function() {
  var dev = env === 'dev';
  var filePath = './src/scripts/app.js';
  var extensions = ['.jsx'];

  var bundle = function() {
    if (dev) {
      var start = new Date();
      log('scripts:bundle');
    }
    return browserify({
      entries: [filePath],
      extensions: extensions,
      debug: env === 'dev'
    }).transform(preprocessify({
      env: env
    }, {
      includeExtensions: extensions
    })).transform('reactify')
    .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('.tmp/scripts/bundle'))
      .pipe($.if(dev, $.tap(function() {
        log('scripts:bundle', start);
        if (!webserver) {
          runSequence('webserver');
        }
      })));
  };

  if (dev) {
    gulp.src(filePath)
      .pipe($.plumber())
      .pipe($.tap(function(file) {
        var d = domain.create();

        d.on('error', function(err) {
          $.util.log($.util.colors.red('Browserify compile error:'), err.message, '\n\t', $.util.colors.cyan('in file'), file.path);
          $.util.beep();
        });

        d.run(bundle);
      }));
  } else {
    return bundle();
  }
});

gulp.task('compass', function() {
  var dev = env === 'dev';
  return gulp.src('src/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.cached('compass')))
    .pipe($.compass({
      css: '.tmp/styles',
      sass: 'src/styles'
    }));
});

gulp.task('imagemin', function() {
  return gulp.src('src/img/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('app/img'));
});

gulp.task('copy', function() {
  return gulp.src(['src/*.txt', 'src/*.ico'])
    .pipe(gulp.dest('app'));
});

gulp.task('copyFonts', function() {
  return gulp.src(['src/fonts/*.*'])
    .pipe(gulp.dest('app/fonts'));
});

gulp.task('bundle', function () {
  var revAll = new $.revAll({dontRenameFile: [/^\/favicon.ico$/g, '.html']});
  var jsFilter = $.filter(['**/*.js'], {restore: true});
  var cssFilter = $.filter(['**/*.css'], {restore: true});
  var htmlFilter = $.filter(['*.html'], {restore: true});

  return gulp.src('src/index.html')
    .pipe($.plumber())
    .pipe($.preprocess())
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe($.cssnano())
    .pipe(cssFilter.restore)
    .pipe(htmlFilter)
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(htmlFilter.restore)
    .pipe(revAll.revision())
    .pipe(gulp.dest('app'))
    .pipe($.size());
});

gulp.task('webserver', function() {
  webserver = gulp.src(['.tmp', 'app'])
    .pipe($.webserver({
      host: '0.0.0.0', //change to 'localhost' to disable outside connections
      livereload: {
        enable: true,
        filter: function(filePath) {
          if (/app\\(?=scripts|styles)/.test(filePath)) {
            $.util.log('Ignoring', $.util.colors.magenta(filePath));
            return false;
          } else {
            return true;
          }
        }
      },
      open: true
    }));
});

gulp.task('serve', function() {
  runSequence('clean:dev', ['scripts', 'compass']);
  gulp.watch('src/*.html');
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/scripts/**/*.jsx', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['compass'])
    .on('change', function (event) {
      if (event.type === 'deleted') {
        delete $.cached.caches.compass[event.path];
      }
    });
});

gulp.task('build', function() {
  env = 'prod';
  runSequence(['clean:dev', 'clean:app'],
              ['scripts', 'compass', 'imagemin'],
              'bundle', 'copy', 'copyFonts');
});

gulp.task('default', ['build']);
