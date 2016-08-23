'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path,{file}) {
			const isStringLiteralExpression=(object)=>(
				t.isBinaryExpression(object,{ operator: '+' }) && (
					t.isStringLiteral(object.left) || t.isStringLiteral(object.right)
				)
			)
			const hasStringTypeDeclaration=({trailingComments})=>(trailingComments && trailingComments.some(
				({value})=>/^\s*:\s*string\s*$/.test(value)
			))
			const object=path.node.object
			const property=path.node.property
			if (
				t.isIdentifier(property,{ name: 'repeat' }) && (
					t.isStringLiteral(object) ||
					isStringLiteralExpression(object) ||
					hasStringTypeDeclaration(object)
				)
			) {
				path.replaceWith(
					t.callExpression(
						t.callExpression(
							t.identifier('require'),
							[t.stringLiteral('crnx-build/babel-helpers/string-prototype-repeat.es5')]
						),
						[object]
					)
				)
			}
		}
	}
})
