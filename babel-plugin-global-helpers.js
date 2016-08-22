'use strict'

const jsSettings=require('./js-settings')

module.exports=({ types: t })=>({
	pre(file) {
		file.set('helperGenerator',name=>t.identifier(jsSettings.babelHelperPrefix+name))
	},
})
