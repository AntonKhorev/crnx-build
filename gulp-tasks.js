'use strict'

const fs=require('fs')
const path=require('path')
const reload=require('require-reload')(require)
const notify=require('gulp-notify')
const file=require('gulp-file')
const browserify=require('browserify')
const collapse=require('bundle-collapser/plugin')
const babelify=require('babelify')
//const babelPresets=[require('babel-preset-es2015-loose')] // can't use this preset with npm packages, have to specify plugins by hand
const babelPlugins=[
	// necessary babel setup:
		// define babel helpers as (almost) global variables
		require('./babel-plugin-global-helpers'),
	// enough to run on Firefox 44+ or Chromium:
		// classes
		[require('babel-plugin-transform-es2015-classes'), {loose: true}],
		// spread operator
		[require('babel-plugin-transform-es2015-spread'), {loose: true}],
		// block-scoped fns
		require('babel-plugin-transform-es2015-block-scoped-functions'),
	// required for IE 11:
		// arrow fns
		require('babel-plugin-transform-es2015-arrow-functions'),
		// template strings
		[require('babel-plugin-transform-es2015-template-literals'), {loose: true}],
		// object literal extensions
		require('babel-plugin-transform-es2015-shorthand-properties'),
		[require('babel-plugin-transform-es2015-computed-properties'), {loose: true}],
		// destructuring
		[require('babel-plugin-transform-es2015-destructuring'), {loose: true}],
		// default (and destructuring) parameters
		require('babel-plugin-transform-es2015-parameters'),
		// for-of loops
		require('babel-plugin-transform-for-of-array'),
		// regexp unicode flag
		require('babel-plugin-transform-es2015-unicode-regex'),
		// Math methods
		require('./babel-plugin-transform-math'),
		// String.prototype methods
		require('./babel-plugin-transform-string-prototype'),
		// Array.prototype methods
		require('./babel-plugin-transform-array-prototype'),
	// satisfies tools like UglifyJS and Firefox 43:
		// const/let
		require('babel-plugin-check-es2015-constants'),
		require('babel-plugin-transform-es2015-block-scoping'),
	// done even if module is not included (?):
		require('babel-plugin-transform-es2015-literals'),
	// additional processing:
		// remove repeated strict mode directives
		require('babel-plugin-transform-remove-strict-mode'),
	/*
	// unused but defined in es2015-loose preset:
		require('babel-plugin-transform-es2015-function-name'),
		[require('babel-plugin-transform-es2015-for-of'), {loose: true}], // use babel-plugin-transform-for-of-array instead
		require('babel-plugin-transform-es2015-sticky-regex'),
		require('babel-plugin-transform-es2015-typeof-symbol'),
		[require('babel-plugin-transform-es2015-modules-commonjs'), {loose: true}],
		[require('babel-plugin-transform-regenerator'), {async: false, asyncGenerators: false}],
	*/
]
const source=require('vinyl-source-stream')
const buffer=require('vinyl-buffer')
const sourcemaps=require('gulp-sourcemaps')
const wrapJS=require('gulp-wrap-js')
const uglify=require('gulp-uglify')
const less=require('gulp-less')
const autoprefixer=require('gulp-autoprefixer')
const cssnano=require('gulp-cssnano')

const packageJson=JSON.parse(fs.readFileSync('./package.json','utf8'))
const destination='public_html'
const demoDestination='public_html/en/base'

// https://github.com/greypants/gulp-starter/blob/master/gulp/util/handleErrors.js
function handleErrors() {
	const args=Array.prototype.slice.call(arguments)
	notify.onError({
		title: "Compile Error",
		message: "<%= error %>"
	}).apply(this,args)
	this.emit('end')
}

function makeJsTaskFn(gulp,doUglify) {
	return ()=>{
		let stream=browserify({
			entries: 'src/main.js',
			debug: true,
		})
			.transform(babelify,{
				plugins: babelPlugins,
				global: true,
			})
			.plugin(collapse)
			.bundle()
			.on('error',handleErrors)
			.pipe(source(packageJson.name+'.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(wrapJS(
				reload('./js-wrapper.js')()
			))
		if (doUglify) {
			stream=stream.pipe(uglify({
				compress: {
					passes: 2,
				},
				mangle: {
					eval: true, // webgl-starter uses eval "safely"
				},
			}))
		}
		stream
			.pipe(sourcemaps.write('.',{
				sourceRoot: '.'
			}))
			.pipe(gulp.dest(`${destination}/lib`))
	}
}

function makeTasks(gulp,pageTitles,cssUrls,jsUrls,lessPaths) {
	if (typeof pageTitles == 'string') {
		pageTitles={en:pageTitles}
	}
	const versions=['base']
	if (fs.existsSync(`${destination}/lib.old`)) {
		versions.push('old')
	}
	const langs=[]
	for (const lang in pageTitles) {
		langs.push(lang)
	}
	langs.sort()
	for (const lang of langs) {
		const pageTitle=pageTitles[lang]
		for (const version of versions) {
			gulp.task(`html-${lang}-${version}`,()=>{
				return file(
					'index.html',
					reload('./template.js')(packageJson,langs,lang,versions,version,pageTitle,cssUrls,jsUrls),
					{src: true}
				)
					.pipe(gulp.dest(`${destination}/${lang}/${version}`))
			})
		}
		gulp.task(`html-${lang}`,versions.map(version=>`html-${lang}-${version}`))
	}
	gulp.task('html',langs.map(lang=>`html-${lang}`))

	gulp.task('css',()=>{
		gulp.src(`src/${packageJson.name}.less`)
			.pipe(sourcemaps.init())
			.pipe(less({
				paths: lessPaths.map(lessPath=>path.dirname(lessPath))
			}))
			.on('error',handleErrors)
			.pipe(autoprefixer())
			.pipe(cssnano())
			.on('error',handleErrors) // invalid svg can cause an error here
			.pipe(sourcemaps.write('.',{
				sourceRoot: '.'
			}))
			.pipe(gulp.dest(`${destination}/lib`))
	})

	gulp.task('js',makeJsTaskFn(gulp,true))
	gulp.task('js-no-uglify',makeJsTaskFn(gulp,false))

	gulp.task('watch',()=>{
		gulp.watch(['demos/*'],['html'])
		gulp.watch(['src/**/*.js'],['js'])
		gulp.watch(['src/*.less'],['css'])
	})

	gulp.task('default',['html','css','js'])
}

module.exports=makeTasks
