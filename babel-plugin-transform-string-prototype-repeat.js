'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path,{file}) {
			const hasStringTypeDeclaration=(comments)=>(comments && comments.some(
				({value})=>(value==':string'))
			)
			if (
				t.isIdentifier(path.node.property,{ name: 'repeat' }) && (
					t.isStringLiteral(path.node.object) ||
					hasStringTypeDeclaration(path.node.object.trailingComments)
				)
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
})
