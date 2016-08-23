'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path,{file}) {
			if (
				t.isIdentifier(path.node.property,{ name: 'repeat' })
			) {
				const comments=path.node.object.trailingComments
				if (comments && comments.some(
					({value})=>(value==':string'))
				) {
					path.replaceWith(
						t.callExpression(
							t.callExpression(
								t.identifier('require'),
								[t.stringLiteral('crnx-build/babel-helpers/string-prototype-repeat.es5')]
							),
							[path.node.object]
						)
					)
				}
			}
		}
	}
})
