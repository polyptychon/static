var gulp = require('gulp'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),

    cssnano = require('gulp-cssnano'),
    glob = require('glob'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    gutil = require('gulp-util'),
    flatten = require('gulp-flatten'),
    fingerprint = require('gulp-fingerprint'),
    buffer = require('gulp-buffer'),
    size = require('gulp-size'),
    fs = require('fs'),
    crypto = require('crypto'),
    _ = require('lodash'),

    camelCase = require('camelcase'),
    slugify = require('slugify'),

    del = require('del'),
    vinylPaths = require('vinyl-paths'),

    webserver = require('gulp-webserver'),

    source = require('vinyl-source-stream'),
    coffee = require('coffee-script'),

    duration = require('gulp-duration'),
    argv = require('yargs').argv,

    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload'),
    fileExtension = require('file-extension'),
    gulpif = require('gulp-if');

var DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    USE_FINGERPRINTING = false,
    USE_VENDOR = false,
    BUILD = "builds/",
    ASSETS = "/assets",
    MOCKUPS = "_mockups",
    SRC = "_src",
    useServer = false,
    TEST = "test",
    watching = false,
    not_in_dependencies_libs = ['jquery', 'bootstrapify'];

var acc = function (t) {
  t = t.replace(/Ά/g, "Α");
  t = t.replace(/ά/g, "α");
  t = t.replace(/Έ/g, "Ε");
  t = t.replace(/έ/g, "ε");
  t = t.replace(/Ή/g, "Η");
  t = t.replace(/ή/g, "η");
  t = t.replace(/Ί/g, "Ι");
  t = t.replace(/Ϊ/g, "Ι");
  t = t.replace(/ί/g, "ι");
  t = t.replace(/ϊ/g, "ι");
  t = t.replace(/ΐ/g, "ι");
  t = t.replace(/Ό/g, "Ο");
  t = t.replace(/ό/g, "ο");
  t = t.replace(/Ύ/g, "Υ");
  t = t.replace(/Ϋ/g, "Υ");
  t = t.replace(/ύ/g, "υ");
  t = t.replace(/ϋ/g, "υ");
  t = t.replace(/ΰ/g, "υ");
  t = t.replace(/Ώ/g, "Ω");
  t = t.replace(/ώ/g, "ω");
  return t.toUpperCase();
};

var greekToLatin = function (t) {
  t = t.replace(/Ά/g, "A");
  t = t.replace(/ά/g, "a");
  t = t.replace(/Έ/g, "E");
  t = t.replace(/έ/g, "e");
  t = t.replace(/Ή/g, "H");
  t = t.replace(/ή/g, "h");
  t = t.replace(/Ί/g, "I");
  t = t.replace(/Ϊ/g, "I");
  t = t.replace(/ί/g, "i");
  t = t.replace(/ϊ/g, "i");
  t = t.replace(/ΐ/g, "i");
  t = t.replace(/Ό/g, "O");
  t = t.replace(/ό/g, "o");
  t = t.replace(/Ύ/g, "Y");
  t = t.replace(/Ϋ/g, "Y");
  t = t.replace(/ύ/g, "u");
  t = t.replace(/ϋ/g, "u");
  t = t.replace(/ΰ/g, "u");
  t = t.replace(/Ώ/g, "W");
  t = t.replace(/ώ/g, "w");

  t = t.replace(/Β/g, "B");
  t = t.replace(/Γ/g, "G");
  t = t.replace(/Δ/g, "D");
  t = t.replace(/Ζ/g, "Z");
  t = t.replace(/Θ/g, "TH");
  t = t.replace(/Κ/g, "K");
  t = t.replace(/Λ/g, "L");
  t = t.replace(/Μ/g, "M");
  t = t.replace(/Ν/g, "N");
  t = t.replace(/Ξ/g, "KS");
  t = t.replace(/Π/g, "P");
  t = t.replace(/Ρ/g, "R");
  t = t.replace(/Σ/g, "S");
  t = t.replace(/Τ/g, "T");
  t = t.replace(/Φ/g, "F");
  t = t.replace(/Χ/g, "X");
  t = t.replace(/Ψ/g, "PS");

  t = t.replace(/β/g, "b");
  t = t.replace(/γ/g, "g");
  t = t.replace(/δ/g, "d");
  t = t.replace(/ζ/g, "z");
  t = t.replace(/θ/g, "th");
  t = t.replace(/κ/g, "k");
  t = t.replace(/λ/g, "l");
  t = t.replace(/μ/g, "m");
  t = t.replace(/ν/g, "n");
  t = t.replace(/ξ/g, "ks");
  t = t.replace(/π/g, "p");
  t = t.replace(/ρ/g, "r");
  t = t.replace(/σ/g, "s");
  t = t.replace(/ς/g, "s");
  t = t.replace(/τ/g, "t");
  t = t.replace(/φ/g, "f");
  t = t.replace(/χ/g, "x");
  t = t.replace(/ψ/g, "ps");

  return t.toUpperCase();
};

var env = process.env.NODE_ENV || DEVELOPMENT;
if (env!==DEVELOPMENT) env = PRODUCTION;

var jadeFiles = argv.jade || '*';
var dependencies = [];//Object.keys(packageJson && packageJson.dependencies || []);

_.forEach(not_in_dependencies_libs, function(d) {
  dependencies.push(d);
});

function getOutputDir() {
  return BUILD+env;
}
function catchErr(e) {
  console.log(e);
  this.emit('end');
}

gulp.task('jade', function() {
  var jsManifest = vendorManifest = cssManifest = jsonManifest = imagesManifest = soundsManifest = {}
  try { jsManifest      = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/js/rev-manifest.json', "utf8")))        : {}; } catch(e) {}
  try { vendorManifest  = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/js-vendor/rev-manifest.json', "utf8"))) : {}; } catch(e) {}
  try { cssManifest     = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/css/rev-manifest.json', "utf8")))       : {}; } catch(e) {}
  try { jsonManifest    = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/json/rev-manifest.json', "utf8")))      : {}; } catch(e) {}
  try { imagesManifest  = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/images/rev-manifest.json', "utf8")))    : {}; } catch(e) {}
  try { soundsManifest  = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/sounds/rev-manifest.json', "utf8")))    : {}; } catch(e) {}

  var config = {
    "production": env === PRODUCTION,
    "pretty": env === DEVELOPMENT,
    "locals": {
      'acc': acc,
      'slugify': slugify,
      'camelCase': camelCase,
      'greekToLatin': greekToLatin,
      'data': "",
      'production': env === PRODUCTION,
    }
  };

  return gulp.src(SRC+"/templates/"+jadeFiles+".jade")
    .pipe(duration('jade'))
    .pipe(jade(config)).on('error', catchErr)
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && jsManifest, fingerprint(jsManifest, { base:'assets/js/', prefix: 'assets/js/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && vendorManifest, fingerprint(vendorManifest, { base:'assets/js/', prefix: 'assets/js/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && jsonManifest, fingerprint(jsonManifest, { mode:"replace", base:'assets/json/', prefix: 'assets/json/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && soundsManifest, fingerprint(soundsManifest, { mode:"replace", base:'assets/sounds/', prefix: 'assets/sounds/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && cssManifest, fingerprint(cssManifest, { base:'assets/css/', prefix: 'assets/css/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && imagesManifest, fingerprint(imagesManifest, { mode:"replace", base:'assets/images/', prefix: 'assets/images/' })))
    .pipe(gulpif(env === PRODUCTION, size()))
    .pipe(gulp.dest(getOutputDir())).on('end', function() {
      if (watching) livereload.changed('');
    });
});


gulp.task('coffee', function() {
  function myCoffee() {
    var bundler = browserify({debug: env === DEVELOPMENT})
      .add('./'+SRC+'/coffee/main.coffee');
    if (USE_VENDOR) bundler.external(dependencies);
    return bundler.bundle().on('error', catchErr)
      .pipe(duration('coffee'))
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(gulpif(env === PRODUCTION, uglify()))
      .pipe(gulpif(env === PRODUCTION, size()))
      .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
      .pipe(gulp.dest(getOutputDir()+ASSETS+'/js'))
      .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
      .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/js')))
      .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
      .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/js')))
  }

  gulp.src('./'+SRC+'/coffee/main.coffee')
    .pipe(plumber())
    .pipe(myCoffee());
});

gulp.task('clean-js', function() {
  return gulp.src(getOutputDir()+ASSETS+'/js', { read: false })
    .pipe(gulpif(env === PRODUCTION, vinylPaths(del).on('error', catchErr)))
});
gulp.task('vendor', function() {
  return gulp.src(dependencies)
    .pipe(gulpif(env === DEVELOPMENT, sourcemaps.init()))
    .pipe(concat('vendor.js'))
    .pipe(gulpif(env === DEVELOPMENT, sourcemaps.write()))
    .pipe(gulpif(env === PRODUCTION, uglify({mangle:false})))
    .pipe(gulpif(env === PRODUCTION, size()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/js'))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/js-vendor')))
});

gulp.task('autoVariables', function() {
  return gulp.src(MOCKUPS+'/ai/autovariables.scss')
    .pipe(changed(SRC+'/sass'))
    .pipe(gulp.dest(SRC+'/sass'))
});
gulp.task('spriteSass', function() {
  return gulp.src(MOCKUPS+'/sprite/sprites.scss')
    .pipe(changed(SRC+'/sass'))
    .pipe(gulp.dest(SRC+'/sass'))
});
gulp.task('sass', function() {
  var imagesManifest = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/images/rev-manifest.json', "utf8"))) : {};
  var config = { errLogToConsole: true };

  if (env === DEVELOPMENT) {
    config.sourceComments = 'map';
  } else if (env === PRODUCTION) {
    config.outputStyle = 'compressed';
  }
  return gulp.src(SRC+'/sass/main.scss')
    .pipe(duration('sass'))
    .pipe(plumber())
    .pipe(gulpif(env === DEVELOPMENT, sourcemaps.init()))
    .pipe(sass(config)).on('error', catchErr)
    .pipe(gulpif(env === DEVELOPMENT, sourcemaps.write()))
    //.pipe(gulpif(env === PRODUCTION, prefix("last 2 versions", "> 1%", "ie 8", "ie 7", { cascade: true })))
    .pipe(gulpif(env === PRODUCTION, cssnano()))
    .pipe(gulpif(env === PRODUCTION, size()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, fingerprint(imagesManifest, { base:'../images/', prefix: '../images/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/css'))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/css')))
});
gulp.task('editorSass', function() {
  var imagesManifest = {}
  try { imagesManifest = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/images/rev-manifest.json', "utf8"))) : {}; } catch(e) {}
  var config = { errLogToConsole: true };

  if (env === DEVELOPMENT) {
    config.sourceComments = 'map';
  } else if (env === PRODUCTION) {
    config.outputStyle = 'compressed';
  }
  return gulp.src(SRC+'/sass/editor.scss')
    .pipe(duration('sass'))
    .pipe(plumber())
    .pipe(sass(config)).on('error', catchErr)
    //.pipe(gulpif(env === PRODUCTION, prefix("last 2 versions", "> 1%", "ie 8", "ie 7", { cascade: true })))
    .pipe(gulpif(env === PRODUCTION, cssnano()))
    .pipe(gulpif(env === PRODUCTION, size()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING && imagesManifest, fingerprint(imagesManifest, { base:'../images/', prefix: '../images/' })))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/css'))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/css')))
});
gulp.task('clean-css', function() {
  return gulp.src(getOutputDir()+ASSETS+'/css', { read: false })
    .pipe(gulpif(env === PRODUCTION, vinylPaths(del).on('error', catchErr)))
});
gulp.task('images', function() {
  return gulp.src([MOCKUPS+'/{images,sprite}/**/*.{jpg,png,gif,svg}'])
    .pipe(duration('images'))
    .pipe(flatten()).on('error', catchErr)
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/images').on('error', catchErr))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/images')))
});
gulp.task('clean-images', function() {
  return new Promise(function (resolve, reject) {
    var vp = vinylPaths();

    gulp.src(getOutputDir()+ASSETS+'/images')
      .pipe(vp)
      .pipe(gulp.dest(getOutputDir()+ASSETS+'/images'))
      .on('end', function () {
        del(vp.paths).then(resolve).catch(reject);
      });
  });
});

gulp.task('json', function() {
  var imagesManifest = soundsManifest = {}
  try { imagesManifest  = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/images/rev-manifest.json', "utf8"))) : {}; } catch(e) {}
  try { soundsManifest = env === PRODUCTION && USE_FINGERPRINTING ? (JSON.parse(fs.readFileSync("./"+BUILD+'/rev/sounds/rev-manifest.json', "utf8"))) : {}; } catch(e) {}

  return gulp.src([SRC+'/json/*.json'])
    .pipe(duration('json'))
    .pipe(gulpif( env === PRODUCTION && USE_FINGERPRINTING && imagesManifest, fingerprint(imagesManifest, { mode:'replace' }) ))
    .pipe(gulpif( env === PRODUCTION && USE_FINGERPRINTING && soundsManifest, fingerprint(soundsManifest, { mode:'replace' }) ))
    .pipe(flatten()).on('error', catchErr)
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/json').on('error', catchErr))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/json')))
});
gulp.task('clean-json', function() {
  return gulp.src(getOutputDir()+ASSETS+'/json', { read: false })
    .pipe(gulpif(env === PRODUCTION, vinylPaths(del).on('error', catchErr)))
});

gulp.task('sounds', function() {
  return gulp.src([MOCKUPS+'/sounds/*.mp3'])
    .pipe(duration('sounds'))
    .pipe(flatten()).on('error', catchErr)
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev()))
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/sounds').on('error', catchErr))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, rev.manifest()))
    .pipe(gulpif(env === PRODUCTION && USE_FINGERPRINTING, gulp.dest(BUILD+'/rev/sounds')))
});
gulp.task('clean-sounds', function() {
  return new Promise(function (resolve, reject) {
    var vp = vinylPaths();

    gulp.src(getOutputDir()+ASSETS+'/sounds')
      .pipe(vp)
      .pipe(gulp.dest(getOutputDir()+ASSETS+'/sounds'))
      .on('end', function () {
        del(vp.paths).then(resolve).catch(reject);
      });
  });
});

gulp.task('fonts', function() {
  return gulp.src(['node_modules/bootstrap-sass/assets/fonts/**', MOCKUPS+"/fonts/*"])
    .pipe(gulp.dest(getOutputDir()+ASSETS+'/fonts'))
});

gulp.task('watch', function() {
  watching = true;
  livereload.listen();
  gulp.watch(SRC+'/templates/*.jade', ['jade']).on('change', function(file) {
    var paths = file.path.split('/')
    var lastPath = paths[paths.length-1].split('.')[0];
    console.log("Watching: " + lastPath);
    jadeFiles = lastPath;
  });
  gulp.watch(SRC+'/json/*.json', ['json']).on('error', catchErr);
  gulp.watch(SRC+'/**/*.{jade,json}', ['jade']).on('error', catchErr);
  gulp.watch(SRC+'/**/*.{js,coffee,json}', ['coffee']).on('error', catchErr);
  gulp.watch(SRC+'/**/*.scss', ['sass']).on('error', catchErr);
  gulp.watch(BUILD+env+'/assets/**').on('change', function(file) {
    console.log(file.path);
    livereload.changed(file.path);
  }).on('error', catchErr);
});

gulp.task('connect', function() {
  useServer = true;
  gulp.src(BUILD+env)
    .pipe(webserver({
      host: '0.0.0.0',
      livereload: false,
      middleware: function(req, res, next) {
        req.method = "GET"
        if (fileExtension(req.url) === "html") {
          var fileName = req.url.replace('.html', '').replace('/', '');
          console.log("Watching: " + fileName);
          jadeFiles = fileName
        }
        next();
      },
      fallback: 'index.html',
      directoryListing: true,
      open: jadeFiles === '*' ? "index.html" : jadeFiles + '.html'
    }));
});

gulp.task('clean', ['clean-json','clean-images','clean-sounds','clean-css', 'clean-js']);
gulp.task('assets', ['images','sounds','json','fonts']);
gulp.task('default', ['json', 'coffee', 'sass', 'jade']);
gulp.task('live', ['json', 'coffee', 'jade', 'sass', 'watch']);
gulp.task('editor', ['editorSass']);

gulp.task('build', function() {
  runSequence(['clean-images'],['fonts','images','sounds','spriteSass','autoVariables'],['json', 'fonts','coffee','sass'],['jade']);
});
gulp.task('server', ['connect', 'watch']);
gulp.task('production', function() {
  env = PRODUCTION;
  runSequence(['clean-json','clean-images','clean-sounds','clean-css', 'clean-js'],['images','sounds','json','fonts'],['coffee','sass'],['jade']);
});

//gulp watch --jade=filename
