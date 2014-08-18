// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelHTML.js v0.1.0 - GelHTML core library
 *  part of the gelHTML library.
 *
 *  Requires: nothing
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
	return console.error("ERROR! gelHTML requires a web browser (window object)");
else
	var global = window;	// NOTE: var global is here //
// - ----------------------------------------------------------------------------------------- - //
global.hasGelHTML = true;
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// Shims and core-library addons //
// - ----------------------------------------------------------------------------------------- - //
window.requestAnimationFrame = 
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame;
window.cancelAnimationFrame = 
	window.cancelAnimationFrame ||
	window.webkitCancelAnimationFrame ||
	window.mozCancelAnimationFrame;
// - ----------------------------------------------------------------------------------------- - //
window.Gamepad = 
	window.Gamepad ||
	window.webkitGamepad ||
	window.mozGamepad;
// - ----------------------------------------------------------------------------------------- - //
Array.prototype.clear = function() {
	// Erase all Array elements - http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
	while(this.length > 0) { this.pop(); }
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelHas Library - Functions and globals for checking supported HTML5 features //
// - ----------------------------------------------------------------------------------------- - //
// Minimum Spec: Chrome 5 [Blob]
//               Firefox 4 [Blob]
//               Internet Explorer 10 [Blob] (IE9 w/o gelLoad)
//               Safari 5.1 [Blob]
//               Android 3 [Blob]
// - ----------------------------------------------------------------------------------------- - //
// Tentative Spec: Chrome 20 [Blob Constructor]
//                 Firefox 13 [Blob Constructor]
//                 Internet Explorer 10 [Blob Constructor]
//                 Safari 6 [Blob Constructor]
//                 Android 4 [Blob URL]
// - ----------------------------------------------------------------------------------------- - //
// Mandatory Features //
// - ----------------------------------------------------------------------------------------- - //
// [Canvas] | Chrome 4 | Firefox 3.6 | Internet Explorer 9 | Safari 3.1 [Mobile 3.2] | Android 3 (2.1*)
// * .clip not working http://code.google.com/p/android/issues/detail?id=21099
global.hasCanvas = (global.gelHasCanvas = function() { return !!window.HTMLCanvasElement; })();
// NOTE: Canvas2D support is the Minimum Spec for gelHTML. Fail and exit if unavailable. //
if ( !global.hasCanvas ) {
	return document.write("ERROR! gelHTML requires canvas support!");
}
// - ----------------------------------------------------------------------------------------- - //
// [Blob] | Chrome 5 | Firefox 4 | Internet Explorer 10 | Safari 5.1 [Mobile 6.1] | Android 3
// [Blob URL] | Chrome 8 | Firefox 4 | Internet Explorer 10 | Safari 6 [Mobile 6.1] | Android 4
// [Blob constructor] | Chrome 20 | Firefox 13 | Internet Explorer 10 | Safari 6* [Mobile 6] | Android 3 (BlobBuilder)
// * Use .buffer http://stackoverflow.com/questions/14347534/blob-constructor-not-working-in-safari-opera
global.hasBlob = (global.gelHasBlob = function() { return !!window.Blob; })();
if ( !global.hasBlob ) {
	return document.write("ERROR! gelHTML requires Blob support!");
}
// [URL] | Chrome 8 | Firefox 4 | Internet Explorer 10 | Safari 6.1 [Mobile 6.1] | Android 4
global.hasURL = (global.gelHasURL = function() { return !!window.URL; })();
//if ( !global.hasBlob ) {
//	return document.write("ERROR! gelHTML requires Blob+URL support!");
//}
// - ----------------------------------------------------------------------------------------- - //
// Optional Features //
// - ----------------------------------------------------------------------------------------- - //
// [WebGL] | Chrome 9 | Firefox 4 | Internet Explorer 11 | Safari 5.1 [Mobile 8] | Android NONE
// https://developer.mozilla.org/en-US/docs/Web/WebGL
global.hasWebGL = (global.gelHasWebGL = function() {
	if ( window.WebGLRenderingContext )
		return true;
	// http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
	var canvas = document.createElement("canvas");
	if ( canvas.getContext ) {
		return !!canvas.getContext("webgl") ||
			!!canvas.getContext("experimental-webgl");
	}
	return false;		
})();
// - ----------------------------------------------------------------------------------------- - //
// [WebAudio] | Chrome 10 [Mobile 33] | Firefox 25 [26] | Internet Explorer 12 ?? | Safari 6 [6]
global.hasWebAudio = (global.gelHasWebAudio = function() { return !!window.AudioContext || !!window.webkitAudioContext; })();
// [Gamepad API] | Chrome 25 (21) | Firefox 29 | Internet Explorer 12 | Safari NONE | Android NONE
// https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
global.hasGamepad = (global.gelHasGamepad = function() { return !!window.Gamepad; })();
// - ----------------------------------------------------------------------------------------- - //
//global.hasJSON = (global.gelHasJSON = function() { return !!window.JSON; })(); // PART OF MINIMUM SPEC! //
// - ----------------------------------------------------------------------------------------- - //
// iOS devices require certain workarounds that other platforms don't. //
global.hasIOS = (global.gelHasIOS = function() {
	var iDevice = ['iPad', 'iPhone', 'iPod'];
	
	for ( var i = 0; i < iDevice.length ; i++ ) {
	    if( navigator.platform === iDevice[i] ){ 
	    	return true;
	    }
	}
	return false;
})();
// - ----------------------------------------------------------------------------------------- - //
// Touch means the browser supports touch, not necessarily the device. //
global.hasTouch = (global.gelHasTouch = function() {
	// TODO: Figure out how to check for touch support. //
	return false;
})();
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// GelSignal Class - Arrays of functions that can be called //
// - ----------------------------------------------------------------------------------------- - //
global.GelSignal = function() {
	this.Func = [];
	this.TimesCalled = 0;
}
// - ----------------------------------------------------------------------------------------- - //
GelSignal.prototype = {
//	add: function( _func ) {
//		this.Func.push(_func);
//	},
	push: function( _func ) {
		this.Func.push(_func);
	},
	call: function() {
		for ( var idx = 0; idx < this.Func.length; ++idx ) {
			this.Func[idx].apply(this, arguments);
		}
		this.TimesCalled++;
	},
	clear: function() {
		this.Func.clear();
	}
};
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// PRIVATE: GelKey Class - Type for tracking 
// - ----------------------------------------------------------------------------------------- - //
var GelKey = function() {
	this.Pressed = 0;
	this.Frame = 0;
	this.OldFrame = 0;
}
// - ----------------------------------------------------------------------------------------- - //
GelKey.prototype = {
	frameDiff: function() {
		return this.Frame-this.OldFrame;
	},
	keyDown: function() {
		this.Pressed = true;
		this.OldFrame = this.Frame;
		this.Frame = gelFrameGet();		
	},
	keyUp: function() {
		this.Pressed = false;
		this.OldFrame = this.Frame;
		this.Frame = gelFrameGet();		
	}
};
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// PRIVATE: GelInternal Class - Internal variables go here to avoid polluting the global namespace.
// - ----------------------------------------------------------------------------------------- - //
var cGelInternal = function() {
	// gelTime //
	this.Frame = 0;
	
	// gelLoad //
	this.ThingsToLoad = 0;
	this.ThingsLoaded = 0;
	this.OnLoad = new GelSignal();	// Function(s) to call once all Loads are finished.
	
	// gelEvents //
	this.OnBlur = new GelSignal();
	this.OnFocus = new GelSignal();
	this.OnResize = new GelSignal();

	this.Key = new Array(256);
	for ( var idx = 0; idx < this.Key.length; idx++ ) {
		this.Key[idx] = new GelKey();
	}
}
// - ----------------------------------------------------------------------------------------- - //
cGelInternal.prototype = {
	// gelLog //
	Log: function() { console.debug.apply( console, arguments ); },
	Err: function() { console.error.apply( console, arguments ); },
	
	// gelLoad //
	IncLoad: function() {
		this.ThingsToLoad++;
		this.IsLoadedCall();
	},
	DecLoad: function() {
		this.ThingsToLoad--;
		this.IsLoadedCall();
	},
	IncLoaded: function() {
		this.ThingsLoaded++;
		this.IsLoadedCall();
	},
	IsLoaded: function() {
		return (this.ThingsLoaded == this.ThingsToLoad);
	},
	
	CallOnLoad: function() {
		this.OnLoad.call();
		this.OnLoad.clear();
	},
	IsLoadedCall: function() {
		if ( this.IsLoaded() ) {
			this.CallOnLoad();
		}
	},
	
	// gelCSS //
	InitCSS: function() {
		// Add Style Sheet //
		var StyleElement = document.createElement("style");
		StyleElement.type = "text/css";
		var StyleIndex = document.styleSheets.length;
		document.head.appendChild( StyleElement );
		this.Sheet = document.styleSheets[StyleIndex];
		
		// Inject our style sheet rules //
		this.InjectRule( "body { margin: 0px; overflow:hidden; }" );
	},
		
	InjectRule: function( _rule ) {
		var Len = this.Sheet.cssRules.length;
		this.Sheet.insertRule(_rule, Len); // Add it to the end //
	},
}
// - ----------------------------------------------------------------------------------------- - //
global.GelInternal = new cGelInternal();	// Singleton //
// NOTE: This being here means it executes before the DOM is finished loading. //
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelLog -- Logging Functions (NOTE: Utility! Does not follow gel naming scheme) //
// - ----------------------------------------------------------------------------------------- - //
global.Msg = console.log.bind(console);		// Things to tell the player. You may want to replace this.
global.Log = console.log.bind(console);		// Things to tell the developer.
global.Err = console.error.bind(console);	// Bad things to tell the developer.
// - ----------------------------------------------------------------------------------------- - //
var GLogPrefix = "gelHTML: ";
function GLog( _msg ) { GelInternal.Log(GLogPrefix + _msg); }	// Internal Logging //
function GErr( _msg ) { GelInternal.Err(GLogPrefix + _msg); }	// Internal Logging //
// TODO: Look at this https://gist.github.com/bgrins/5108712
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelTime -- Time Functions //
// - ----------------------------------------------------------------------------------------- - //
global.gelTimeGet = function() { return Date.now(); }
global.gelFrameGet = function() { return GelInternal.Frame; }
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelEvent Library - Functions for adding event handlers all have  //
// - ----------------------------------------------------------------------------------------- - //
global.gelOnBlur = function( _func ) { GelInternal.OnBlur.push( _func ); }
global.gelOnFocus = function( _func ) { GelInternal.OnFocus.push( _func ); }
global.gelOnResize = function( _func ) { GelInternal.OnResize.push( _func ); }
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelLoad Library - Functions for loading data. Images, Assets, etc. //
// - ----------------------------------------------------------------------------------------- - //
global.gelOnLoad = function( _func ) {
	var Target = GelInternal;
	Target.OnLoad.push( _func );
	Target.IsLoadedCall();
}
// - ----------------------------------------------------------------------------------------- - //
global.gelLoadImage = function( _file ) {
	var Target = GelInternal;
	Target.IncLoad();
	
	var MyImage = new Image();
	MyImage.onload = function(e) { 
		this.IncLoaded();
	}.bind( Target );
	MyImage.onerror = function(e) {
		this.DecLoad();
	}.bind( Target );
	MyImage.src = _file;
	
	return MyImage;
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
window.addEventListener("keydown", function(e) {
	if (e.keyCode !== undefined) {
		if ( e.keyCode < GelInternal.Key.length ) {
			GelInternal.Key[e.keyCode].keyDown();
		}
		else {
			GLog("ERROR! WHOA! KEYCODE OUT OF RANGE IN KEYDOWN: " + e.keyCode );
		}
	}
//		// Consume the event for suppressing "double action".
//		event.preventDefault();
}, true);
// - ----------------------------------------------------------------------------------------- - //
window.addEventListener("keyup", function(e) {
	if (e.keyCode !== undefined) {
		if ( e.keyCode < GelInternal.Key.length ) {
			GelInternal.Key[e.keyCode].keyUp();
		}
		else {
			GLog("ERROR! WHOA! KEYCODE OUT OF RANGE IN KEYUP: " + e.keyCode );
		}
	}
//		// Consume the event for suppressing "double action".
//		event.preventDefault();
}, true);
// - ----------------------------------------------------------------------------------------- - //
document.addEventListener("DOMContentLoaded", function(e) {
	// Triggered once all HTML and JS files are finished loading. //
	GLog("DOM loaded.");
	
	// Inject some CSS in to our document //
	GelInternal.InitCSS();

	// Wire up our Signals that respond to events //
	window.onblur = function(e) { GelInternal.OnBlur.call(e); };
	window.onfocus = function(e) { GelInternal.OnFocus.call(e); };
	window.onresize = function(e) { GelInternal.OnResize.call(e); };

	// User Function (With Error Message) //
	if ( window.Setup )
		Setup( e );
	else
		GErr("ERROR! No Setup() function found!"); 
});
// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
