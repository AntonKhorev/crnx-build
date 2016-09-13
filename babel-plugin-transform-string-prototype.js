'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path,{file}) {
			const prototypeMethods={
				includes: 'arraylike-prototype-includes',
				repeat: 'string-prototype-repeat',
			}
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
				t.isIdentifier(property) &&
				property.name in prototypeMethods && (
					t.isStringLiteral(object) ||
					isStringLiteralExpression(object) ||
					hasStringTypeDeclaration(object)
				)
			) {
				path.replaceWith(
					t.callExpression(
						t.callExpression(
							t.identifier('require'),
							[t.stringLiteral(`${__dirname}/babel-helpers/${prototypeMethods[property.name]}.es5`)]
						),
						[object]
					)
				)
			}
		}
	}
})
