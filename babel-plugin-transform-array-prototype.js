'use strict'

module.exports=({ types: t })=>({
	visitor: {
		MemberExpression(path,{file}) {
			const prototypeMethods={
				includes: 'arraylike-prototype-includes',
			}
			const hasArrayTypeDeclaration=({trailingComments})=>(trailingComments && trailingComments.some(
				({value})=>/^\s*:\s*Array(<.*>)?\s*$/.test(value)
			))
			const object=path.node.object
			const property=path.node.property
			if (
				t.isIdentifier(property) &&
				property.name in prototypeMethods && (
					t.isArrayExpression(object) ||
					hasArrayTypeDeclaration(object)
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
