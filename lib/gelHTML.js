// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelHTML.js v0.1.0 - gelHTML's core library.
 *  part of the gelHTML library.
 *
 *  Requires: nothing
 *
 *  (c) 2011-2014, Mike Kasprzak (@mikekasprzak) of SYKRONICS
 *  sykronics.com
 *
 *  MIT License
 */
// - ----------------------------------------------------------------------------------------- - //
(function(){
// - ----------------------------------------------------------------------------------------- - //
// Erase all Array elements - http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
Array.prototype.clear = function() {
	while(this.length > 0) { this.pop(); }
}
// - ----------------------------------------------------------------------------------------- - //
window.isIOS = function() {
	var iDevice = ['iPad', 'iPhone', 'iPod'];
	
	for ( var i = 0; i < iDevice.length ; i++ ) {
	    if( navigator.platform === iDevice[i] ){ 
	    	return true;
	    }
	}
	return false;
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// GelSignal Class - Arrays of functions that can be called //
var GelSignal = function() {
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
function GelKey() {
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
	}
	keyUp: function() {
		this.Pressed = false;
		this.OldFrame = this.Frame;
		this.Frame = gelFrameGet();		
	}
};
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// GelInternal Class //
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
		// Add a Style Sheet if the document currently has none //
		//if ( document.styleSheets.length == 0 ) 
//		{
			//GLog("No <style> element. Adding one.");
			var StyleElement = document.createElement("style");
			StyleElement.type = "text/css";
			var StyleIndex = document.styleSheets.length;
			document.head.appendChild( StyleElement );
//		}
		Log( document.styleSheets );
		this.Sheet = document.styleSheets[StyleIndex];
		
		// Inject our style sheet rules //
		this.InjectRule( "body { margin: 0px; overflow:hidden; }" );
	},
		
	InjectRule: function( _rule ) {
//		this.Sheet.insertRule(_rule);
		
		// Will fail in some Firefoxes because cssRules accesses freaks it out. //
		// http://stackoverflow.com/questions/21642277/security-error-the-operation-is-insecure-in-firefox-document-stylesheets
		var Len = this.Sheet.cssRules.length;
		this.Sheet.insertRule(_rule, Len); // Add it to the end //
	},
}
// - ----------------------------------------------------------------------------------------- - //
var GelInternal = new cGelInternal();	// Singleton //
// NOTE: This being here means it executes before the DOM is finished loading. //
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// gelLog -- Logging Functions (NOTE: Utility! Does not follow gel naming scheme) //
// - ----------------------------------------------------------------------------------------- - //
var Msg = console.log.bind(console);	// Things to tell the player. You may want to replace this.
var Log = console.log.bind(console);	// Things to tell the developer.
var Err = console.error.bind(console);	// Bad things to tell the developer.
// - ----------------------------------------------------------------------------------------- - //
var GLogPrefix = "gelHTML: ";
function GLog( _msg ) { GelInternal.Log(GLogPrefix + _msg); }	// Internal Logging //
function GErr( _msg ) { GelInternal.Err(GLogPrefix + _msg); }	// Internal Logging //
// TODO: Look at this https://gist.github.com/bgrins/5108712
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// gelTime -- Time Functions //
// - ----------------------------------------------------------------------------------------- - //
function gelTimeGet() { return Date.now(); }
function gelFrameGet() { return GelInternal.Frame; }
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// gelLoad -- Simple functions for loading data. Adds to cache. //
// - ----------------------------------------------------------------------------------------- - //
function gelOnLoad( _func ) {
	var Target = GelInternal;
	Target.OnLoad.push( _func );
	Target.IsLoadedCall();
}
// - ----------------------------------------------------------------------------------------- - //
function gelLoadImage( _file ) {
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
function gelOnBlur( _func ) { GelInternal.OnBlur.push( _func ); }
function gelOnFocus( _func ) { GelInternal.OnFocus.push( _func ); }
function gelOnResize( _func ) { GelInternal.OnResize.push( _func ); }
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
window.addEventListener("keydown", function(e) {
	if (e.keyCode !== undefined) {
		if ( e.keyCode < GelInternal.Key.length ) {
			GelInternal.Key[e.keyCode].keyDown();
		}
		else {
			GLog("ERROR! WHOA! KEYCODE OUT OF RANGE: " + e.keyCode );
		}
	}
//	if (handled) {
//		// Consume the event for suppressing "double action".
//		event.preventDefault();
//	}
}, true);
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// EVENT - Once all code is loaded //
document.addEventListener("DOMContentLoaded", function(e) {
	// Triggered once all HTML and JS files are finished loading. //
	GLog("DOM loaded.");
	
	// Inject some CSS (a style tag) in case our document lacks one //
	GelInternal.InitCSS();

	// If we are a Browser //
	if (typeof window !== "undefined") {
		// Wire up our Signals //
		window.onblur = function(e) { GelInternal.OnBlur.call(e); };
		window.onfocus = function(e) { GelInternal.OnFocus.call(e); };
		window.onresize = function(e) { GelInternal.OnResize.call(e); };
	}

	// User Function (With Error Message) //
	if ( typeof Setup === "function" ) { Setup( e ); }
	else { GErr("ERROR! No Setup() function found!"); }
});
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
if (typeof window !== "undefined") {
	window.GelInternal = GelInternal;

	// gelLog //
	window.Msg = Msg.bind(console);		// ** //
	window.Log = Log.bind(console);		// ** //
	window.Err = Err.bind(console);		// ** //
	
	// gelTime //
	window.gelTimeGet = gelTimeGet;
	window.gelFrameGet = gelFrameGet;

	// gelLoad //
	window.gelOnLoad = gelOnLoad;
	window.gelLoadImage = gelLoadImage;	

	// gelEvent //
	window.gelOnBlur = gelOnBlur;
	window.gelOnFocus = gelOnFocus;
	window.gelOnResize = gelOnResize;
}
// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
