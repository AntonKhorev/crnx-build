'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path) {
			const mathMethods={
				log10: true,
				sign: true,
			}
			const object=path.node.object
			const property=path.node.property
			if (
				t.isIdentifier(object,{ name: 'Math' }) &&
				t.isIdentifier(property) &&
				property.name in mathMethods &&
				!path.scope.getBindingIdentifier(object.name) // no local binding, it's global
			) {
				path.replaceWith(
					t.callExpression(
						t.identifier('require'),
						[t.stringLiteral(`${__dirname}/babel-helpers/math-${property.name}.es5`)] // .es5 to avoid global browserify transforms
					)
				)
			}
		}
	},
})
