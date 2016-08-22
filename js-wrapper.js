const jsSettings=require('./js-settings')
const p=jsSettings.babelHelperPrefix

// helpers copied from Babel
// inherits modified to keep __proto__ intact
// typeof gets invoked in strange situations
module.exports=()=>
`(function(){
	"use strict";
	function ${p}typeof(obj) {
		return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
	}
	function ${p}createClass(Constructor, protoProps, staticProps) {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	}
	function ${p}classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
	function ${p}possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}
	function ${p}inherits(subClass, superClass) {
		function defaults(obj, defaults) {
			var keys = Object.getOwnPropertyNames(defaults);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var value = Object.getOwnPropertyDescriptor(defaults, key);
				if (value && value.configurable && obj[key] === undefined) {
					Object.defineProperty(obj, key, value);
				}
			}
			return obj;
		}
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}
		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) defaults(subClass, superClass);
	}
	function ${p}taggedTemplateLiteralLoose(strings, raw) {
		strings.raw = raw;
		return strings;
	}
	;
	%= body %
})();`
