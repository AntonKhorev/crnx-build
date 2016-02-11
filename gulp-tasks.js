'use strict';

const fs=require('fs');
const reload=require('require-reload')(require);
const notify=require('gulp-notify');
const file=require('gulp-file');
const browserify=require('browserify');
const babelify=require('babelify');
//const babelPresets=[require('babel-preset-es2015-loose')]; // can't use this preset with npm packages, have to specify plugins by hand
const babelPlugins=[
	// enough to run on Firefox 44+ or Chromium:
		// classes
		[require('babel-plugin-transform-es2015-classes'), {loose: true}],
		require('babel-plugin-external-helpers-2'),
		// spread operator
		[require('babel-plugin-transform-es2015-spread'), {loose: true}],
		// block-scoped fns
		require('babel-plugin-transform-es2015-block-scoped-functions'),
		// regexp u flag
		require('babel-plugin-transform-es2015-unicode-regex'),
	// required for IE 11
		// arrow fns
		require('babel-plugin-transform-es2015-arrow-functions'),
		// template strings
		[require('babel-plugin-transform-es2015-template-literals'), {loose: true}],
		// object literal extensions
		require('babel-plugin-transform-es2015-shorthand-properties'),
		[require('babel-plugin-transform-es2015-computed-properties'), {loose: true}],
	//
	// done even if module is not included (?)
		require('babel-plugin-transform-es2015-literals'),
];
const source=require('vinyl-source-stream');
const buffer=require('vinyl-buffer');
const sourcemaps=require('gulp-sourcemaps');
const wrapJS=require('gulp-wrap-js');
const uglify=require('gulp-uglify');
const less=require('gulp-less');
const autoprefixer=require('gulp-autoprefixer');
const cssnano=require('gulp-cssnano');
const mocha=require('gulp-mocha');

const packageJson=JSON.parse(fs.readFileSync('./package.json','utf8'));
const demoDestination='public_html/en/base';
const libDestination='public_html/lib';

// https://github.com/greypants/gulp-starter/blob/master/gulp/util/handleErrors.js
function handleErrors() {
	const args=Array.prototype.slice.call(arguments);
	notify.onError({
		title: "Compile Error",
		message: "<%= error %>"
	}).apply(this,args);
	this.emit('end');
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
			.bundle()
			.on('error',handleErrors)
			.pipe(source(packageJson.name+'.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(wrapJS(
				reload('./babel-helpers-wrapper.js')()
			));
		if (doUglify) {
			stream=stream.pipe(uglify());
		}
		stream
			.pipe(sourcemaps.write('.',{
				sourceRoot: '.'
			}))
			.pipe(gulp.dest(libDestination));
	}
}

function makeTasks(gulp,pageTitle,cssUrls,jsUrls) {
	gulp.task('html',()=>{
		return file(
			'index.html',
			reload('./template.js')(packageJson,pageTitle,cssUrls,jsUrls),
			{src: true}
		)
			.pipe(gulp.dest(demoDestination));
	});

	gulp.task('css',()=>{
		gulp.src('src/'+packageJson.name+'.less')
			.pipe(sourcemaps.init())
			.pipe(less())
			.on('error',handleErrors)
			.pipe(autoprefixer())
			.pipe(cssnano())
			.pipe(sourcemaps.write('.',{
				sourceRoot: '.'
			}))
			.pipe(gulp.dest(libDestination));
	});

	gulp.task('js',makeJsTaskFn(gulp,true));
	gulp.task('js-no-uglify',makeJsTaskFn(gulp,false));

	gulp.task('watch',()=>{
		gulp.watch(['demos/*'],['html']);
		gulp.watch(['src/**/*.js'],['js']);
		gulp.watch(['src/*.less'],['css']);
	});

	gulp.task('test',()=>{
		gulp.src('tests/**/*.js')
			.pipe(mocha());
	});

	gulp.task('default',['html','css','js']);
}

module.exports=makeTasks;
