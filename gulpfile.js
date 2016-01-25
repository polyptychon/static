{
  "name": "kastoria",
  "version": "0.1.0",
  "description": "kastoria.gr",
  "homepage": "https://github.com/polyptychon/kastoria",
  "bugs": "",
  "main": "src/coffee/main.coffee",
  "author": {
    "name": "Harris Sidiropoulos",
    "email": "sidiropoulos@polyptychon.gr"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/polyptychon/kastoria"
  },
  "browserify": {
    "transform": [
      "coffeeify",
      "jadeify"
    ]
  },
  "license": "MIT",
  "devDependencies": {
    "browserify": "^11.2.0",
    "coffee-script": "^1.7.1",
    "coffeeify": "^0.6.0",
    "del": "^1.2.0",
    "dotenv": "^0.5.1",
    "glob": "^4.0.6",
    "gulp": "^3.9.0",
    "gulp-autoprefixer": "0.0.7",
    "gulp-buffer": "0.0.2",
    "gulp-changed": "^1.0.0",
    "gulp-concat": "^2.3.4",
    "gulp-cssnano": "^2.1.0",
    "gulp-duration": "0.0.0",
    "gulp-fingerprint": "^0.3.2",
    "gulp-flatten": "0.0.2",
    "gulp-if": "~1.2.0",
    "gulp-jade": "^0.5.0",
    "gulp-livereload": "^2.1.1",
    "gulp-plumber": "^0.6.5",
    "gulp-rev": "^1.0.0",
    "gulp-sass": "^2.0.4",
    "gulp-size": "^1.0.0",
    "gulp-sourcemaps": "^1.6.0",
    "gulp-uglify": "~0.3.0",
    "gulp-util": "^3.0.0",
    "gulp-webserver": "^0.8.3",
    "jade": "^1.5.0",
    "jadeify": "^4.4.0",
    "lodash": "^4.0.0",
    "minifyify": "^7.1.0",
    "napa": "^0.4.1",
    "plumber": "^0.4.4",
    "run-sequence": "^0.3.7",
    "uglifyify": "^3.0.1",
    "vinyl-paths": "^1.0.0",
    "vinyl-source-stream": "^0.1.1",
    "yargs": "^1.3.2"
  },
  "dependencies": {
    "animationframe": "git://github.com/HarrisSidiropoulos/animationframe",
    "jquery": "^2.1.1",
    "jquery.transit": "^0.9.12",
    "photoswipe": "^4.0.7"
  },
  "scripts": {
    "install": "napa",
    "start": "gulp server"
  },
  "napa": {
    "bootstrap": "twbs/bootstrap-sass",
    "ihover": "gudh/ihover"
  }
}
