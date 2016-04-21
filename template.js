'use strict'

const fs=require('fs')

module.exports=function(packageJson,langs,lang,pageTitle,cssUrls,jsUrls){
	const langData={
		en: {
			name: "English",
			repo: "source code",
			bugs: "report bugs",
			nojs: "JavaScript is disabled. This page requires JavaScript to function properly.",
		},
		ru: {
			name: "Русский",
			repo: "исходный код",
			bugs: "сообщения об ошибках",
			nojs: "JavaScript отключен. Данной странице требуется JavaScript для нормального функционирования.",
		},
	}
	const templateCss=fs.readFileSync(`${__dirname}/template.css`,'utf8')
	const allCssUrls=[...cssUrls,`../../lib/${packageJson.name}.css`]
	const allJsUrls=['https://code.jquery.com/jquery-2.2.3.min.js',...jsUrls,`../../lib/${packageJson.name}.js`]
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
					return `<li><a href=../../${otherLang}/base/ lang=${otherLang} hreflang=${otherLang}>${langData[otherLang].name}</a></li>`
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
