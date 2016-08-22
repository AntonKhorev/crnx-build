'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path) {
			if (
				t.isIdentifier(path.node.object,{ name: 'Math' }) &&
				t.isIdentifier(path.node.property,{ name: 'sign' }) &&
				!path.scope.getBindingIdentifier(path.node.object.name) // no local binding, it's global
			) {
				path.replaceWithSourceString(`require('crnx-build/babel-helpers/math-sign.es5')`) // .es5 to avoid global browserify transforms
			}
		}
	},
})
