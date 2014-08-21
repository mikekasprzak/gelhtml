// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelMath.js v0.1.0 - Math Library
 *  part of the gelHTML library.
 *
 *  Requires: none
 *
 *  (c) 2011-2014, Mike Kasprzak (@mikekasprzak)
 *  sykronics.com
 *
 *  MIT License
 */
// - ----------------------------------------------------------------------------------------- - //
(function(){
// - ----------------------------------------------------------------------------------------- - //
if ( typeof window !== "undefined" )
	window.global = window;
// - ----------------------------------------------------------------------------------------- - //
global.hasGelMath = true;
// - ----------------------------------------------------------------------------------------- - //
"use strict"
// - ----------------------------------------------------------------------------------------- - //
Object.defineProperty( global.Float32Array.prototype, "x", {
	get: function() { return this[0]; },
	set: function(v) { this[0] = v; }
});
Object.defineProperty( global.Float32Array.prototype, "y", {
	get: function() { return this[1]; },
	set: function(v) { this[1] = v; }
});
Object.defineProperty( global.Float32Array.prototype, "z", {
	get: function() { return this[2]; },
	set: function(v) { this[2] = v; }
});
Object.defineProperty( global.Float32Array.prototype, "w", {
	get: function() { return this[3]; },
	set: function(v) { this[3] = v; }
});
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
global.vec = function() {
	return new Float32Array(arguments);
}
// - ----------------------------------------------------------------------------------------- - //
// NOTE: because of ||0, omitted and undefined arguments become 0 instead of NaN. Strings will NaN.
// - ----------------------------------------------------------------------------------------- - //
global.vec1 = function(a) {
	return new Float32Array([a||0]);
}
// - ----------------------------------------------------------------------------------------- - //
global.vec2 = function(a,b) {
	return new Float32Array([a||0,b||0]);
}
// - ----------------------------------------------------------------------------------------- - //
global.vec3 = function(a,b,c) {
	return new Float32Array([a||0,b||0,c||0]);
}
// - ----------------------------------------------------------------------------------------- - //
global.vec4 = function(a,b,c,d) {
	return new Float32Array([a||0,b||0,c||0,d||0]);
}
// - ----------------------------------------------------------------------------------------- - //
//vec2.prototype = {
//	add: function(a,b) {
//		a[0] += b[0];
//		a[1] += b[1];
//	},
//	get x() { return this[0]; },
//	get y() { return this[1]; }
//}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
