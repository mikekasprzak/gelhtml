// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelCanvas.js v0.1.0 - Canvas 2D Graphics Playground
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
	return console.error("ERROR! gelCanvas requires a web browser (window object)!");
else
	var global = window;	// NOTE: var global is here //
// - ----------------------------------------------------------------------------------------- - //
if ( !global.hasGelHTML )
	return document.write("ERROR! gelCanvas requires gelHTML.js!");
// - ----------------------------------------------------------------------------------------- - //
global.hasGelCanvas = true;
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
var GLogPrefix = "gelCanvas: ";
function GLog( _msg ) { GelInternal.Log(GLogPrefix + _msg); }	// Internal Logging //
function GErr( _msg ) { GelInternal.Err(GLogPrefix + _msg); }	// Internal Logging //
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// Create a gelCanvas canvas element //
global.gelCanvasCreate = function( _ob ) {
	var canvas = document.createElement("canvas");
	canvas.ctx = canvas.getContext("2d");
	
	// If an object, assign all specified members the values given //
	if ( typeof _ob === "object" ) {
		for ( var arg in _ob ) {
			if ( _ob.hasOwnProperty(arg) ) {
				canvas[arg] = _ob[arg];
			}
		}
	}
	// If a string, assign the Id //
	else if ( typeof _ob === "string" ) {
		canvas.id = _ob;
	}
	
	// Have a canvas! //
	return canvas;
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
global.gelOnPauseDraw = function( _func ) {
	GelInternal.OnPauseDraw = _func;
}
// - ----------------------------------------------------------------------------------------- - //
global.gelHasFocus = function() {
	return window.hasFrameFocus;
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelColor Library - Color making helpers //
// - ----------------------------------------------------------------------------------------- - //
global.RGB = function(r,g,b){ return "rgb("+r+","+g+","+b+")"; };
global.RGBA = function(r,g,b,a){ return "rgba("+r+","+g+"b"+b+","+(a/255.0)+")"; };
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelCanvas Library  - //
// - ----------------------------------------------------------------------------------------- - //
global.gelCanvasSmoothing = function( canvas, value ) {
	if ( typeof value !== "undefined" )
		canvas.ctx.gelImageSmoothingEnabled = value;
	else
		value = canvas.ctx.gelImageSmoothingEnabled;

	canvas.ctx.imageSmoothingEnabled = value;
	canvas.ctx.mozImageSmoothingEnabled = value;
	canvas.ctx.webkitImageSmoothingEnabled = value;
	canvas.ctx.msImageSmoothingEnabled = value;
}
// - ----------------------------------------------------------------------------------------- - //
global.gelCanvasClear = function( ctx, _color ) {
	ctx.save();
	ctx.setTransform( 1,0, 0,1, 0,0 );	// Identity //

	if ( typeof _color === "string" ) {
		ctx.fillStyle = _color;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
	else {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	ctx.restore();
}
// - ----------------------------------------------------------------------------------------- - //
global.gelCanvasIdentity = function( ctx ) {
	ctx.setTransform( 1,0, 0,1, 0,0 );	
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelSimple Library - //
// - ----------------------------------------------------------------------------------------- - //
global.gelSimpleSetup = function( _title ) {
	GLog("Using SimpleSetup.");
	
	// Set Window Title //
	if ( typeof _title === "undefined" ) {
		document.title = gelUtilGenerateTitle();
	}
	else if ( typeof _title === "string" ) {
		document.title = _title;
	}
	//else // use a null to make SimpleSetup not set a title //
	
	// Create a Canvas //
	var Canvas = gelCanvasCreate();
	document.body.appendChild( Canvas );
	
	// Return the Context //
	return Canvas.ctx;
}
// - ----------------------------------------------------------------------------------------- - //
global.gelSimpleStart = function( ctx ) {
	GLog("Starting Simple...");

	// *** //

	ctx.Step = function(){};
	ctx.Draw = function(){};
	if ( typeof Step === "function" ) ctx.Step = Step;
	if ( typeof Draw === "function" ) ctx.Draw = Draw;

	var GameLoop = function() {
		ctx.Step();
		GelInternal.Frame++;
		
		ctx.Draw();
		ctx.rafFrame = requestAnimationFrame( GameLoop );
	}
	
	ctx.rafFrame = null;
	
	document.addEventListener('touchmove', function(e){
		e.preventDefault();
	},false	);
	
	gelOnPauseDraw(function(ctx){
		if ( !gelHasFocus() ) {
			var HalfWidth = ctx.canvas.width >> 1;
			var HalfHeight = ctx.canvas.height >> 1;
			ctx.setTransform(
				1,0,						// A B 0 //
				0,1,						// C D 0 //
				HalfWidth,HalfHeight		// E F 1 //
			);

			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(-ctx.canvas.width>>1, -ctx.canvas.height>>1, ctx.canvas.width, ctx.canvas.height);

			var OldStyle = ctx.fillStyle;
			var OldFont = ctx.font;
			
			var Text = "PAUSED";
			var TextHeight = (HalfWidth/4);
			ctx.font = "bold " + TextHeight +"px Calibri";
			var TextWidth = ctx.measureText(Text).width;
			
			ctx.fillStyle = "#420";
			ctx.fillText(Text,-TextWidth>>1,(TextHeight>>1)+(TextHeight>>5));
			ctx.fillStyle = "#FC0";
			ctx.fillText(Text,-TextWidth>>1,(TextHeight>>1)-(TextHeight>>5));
			
			ctx.font = OldFont;
			ctx.fillStyle = OldStyle;
		}
	});
	
	window.hasFrameFocus = false;

	gelOnBlur(function(e){
		window.hasFrameFocus = false;

		GelInternal.OnPauseDraw(ctx);
		if (ctx.rafFrame) 
			cancelAnimationFrame( ctx.rafFrame );
		
		GLog("Focus Lost. Stopped.");
	});
	gelOnFocus(function(e){
		window.hasFrameFocus = true;

		GLog("GOT FOCUS! Starting...");

		if (ctx.rafFrame) 
			cancelAnimationFrame( ctx.rafFrame );
		ctx.rafFrame = requestAnimationFrame( GameLoop );
	});
	
	var Resize = function() {
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		gelCanvasSmoothing( ctx.canvas );	// Smoothing seems to get reset if a canvas changes shape //

		// Repaint //
		ctx.Draw();
		GelInternal.OnPauseDraw(ctx);
	};
	
	Resize();
	gelOnResize( Resize );

	// *** //

	GLog("Simple Started.");
	
	// *** //

//	if ( isIOS() ) {
//	}
//	else {
		// Call Focus Function //
		if ( top === self && document.hasFocus() ) {
			GLog("Window has focus. Starting...");
			GelInternal.OnFocus.call();
		}
		else {
			GLog("Window does not have focus. Stopped.");
			GelInternal.OnBlur.call();
		}
//	}
}
// - ----------------------------------------------------------------------------------------- - //
function gelUtilGenerateTitle() {
	var Title = document.URL;
	var End = Title.length;
	if ( Title.charAt(End-1) == "/" )
		End = Title.lastIndexOf("/");
	var Begin = Title.lastIndexOf("/",End-1)+1;
	return Title.substring(Begin,End);	
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
