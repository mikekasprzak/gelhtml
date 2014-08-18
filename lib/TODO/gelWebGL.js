// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelWebGL.js v0.0.0 - WebGL Graphics Playground
 *  part of the gelHTML library.
 *
 *  Requires: gelHTML.js
 *
 *  (c) 2011-2014, Mike Kasprzak (@mikekasprzak)
 *  sykronics.com
 *
 *  MIT License
 */
// - ----------------------------------------------------------------------------------------- - //
(function(){
// - ----------------------------------------------------------------------------------------- - //
if ( typeof window === "undefined" )
	return console.error("ERROR! gelWebGL requires a web browser (window object)!");
else
	var global = window;	// NOTE: var global is here //
// - ----------------------------------------------------------------------------------------- - //
if ( !global.hasGelHTML )
	return console.error("ERROR! gelWebGL requires gelHTML.js!");
// - ----------------------------------------------------------------------------------------- - //
if ( !global.hasWebGL )
	return console.error("ERROR! gelWebGL requires WebGL Support!");
// - ----------------------------------------------------------------------------------------- - //
global.hasGelWebGL = true;
// - ----------------------------------------------------------------------------------------- - //
// TODO: WebGL Graphics Library
// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
