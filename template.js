'use strict'

const fs=require('fs')

module.exports=function(packageJson,langs,lang,versions,version,pageTitle,cssUrls,jsUrls){
	const langData={
		en: {
			name: "English",
			repo: "source code",
			bugs: "report bugs",
			nojs: "JavaScript is disabled. This page requires JavaScript to function properly.",
			versions: {
				base: "current version",
				old: "old version",
			},
		},
		ru: {
			name: "Русский",
			repo: "исходный код",
			bugs: "сообщения об ошибках",
			nojs: "JavaScript отключен. Данной странице требуется JavaScript для нормального функционирования.",
			versions: {
				base: "текущая версия",
				old: "старая версия",
			},
		},
	}
	const versionLibs={
		base: 'lib',
		old: 'lib.old',
	}
	const templateCss=fs.readFileSync(`${__dirname}/template.css`,'utf8')
	const allCssUrls=[...cssUrls,`../../${versionLibs[version]}/${packageJson.name}.css`]
	const allJsUrls=['https://code.jquery.com/jquery-3.1.0.slim.min.js',...jsUrls,`../../${versionLibs[version]}/${packageJson.name}.js`]
	return [
		"<!DOCTYPE html>",
		`<html lang=${lang}>`,
		"<head>",
		"<meta charset=utf-8>",
		`<title>${pageTitle}</title>`,
		allCssUrls.map(cssUrl=>`<link rel=stylesheet href=${cssUrl}>`).join("\n"),
		allJsUrls.map(jsUrl=>`<script src=${jsUrl}></script>`).join("\n"),
		"<style>",
		templateCss.trim(),
		"</style>",
		"</head>",
		"<body>",
		"<nav>",
		...langs.length<=1?[]:[
			"<ul>",
			...langs.map(otherLang=>{
				if (lang==otherLang) {
					return `<li class=active>${langData[otherLang].name}</li>`
				} else {
					return `<li><a href=../../${otherLang}/${version}/ lang=${otherLang} hreflang=${otherLang}>${langData[otherLang].name}</a></li>`
				}
			}),
			"</ul>",
		],
		...versions.length<=1?[]:[
			"<ul>",
			...versions.map(otherVersion=>{
				if (version==otherVersion) {
					return `<li class=active>${langData[lang].versions[otherVersion]}</li>`
				} else {
					return `<li><a href=../${otherVersion}/>${langData[lang].versions[otherVersion]}</a></li>`
				}
			}),
			"</ul>",
		],
		"<ul class=external>",
		`<li><a href=https://github.com/${packageJson.repository}>${langData[lang].repo}</a></li>`,
		`<li><a href=${packageJson.bugs.url}>${langData[lang].bugs}</a></li>`,
		"</ul>",
		"</nav>",
		`<div class=${packageJson.name}>${langData[lang].nojs}</div>`,
		"</body>",
		"</html>",
	].join("\n")
}
