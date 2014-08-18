// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelAudio.js v0.1.0 - Audio and Music Playback Library
 *  part of the gelHTML library.
 *
 *  Requires: howler.js
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
	return console.error("ERROR! gelAudio requires a web browser (window object)!");
else
	var global = window;	// NOTE: var global is here //
// - ----------------------------------------------------------------------------------------- - //
if ( !window.Howler )
	return console.error("ERROR! gelAudio requires howler.js!");
// - ----------------------------------------------------------------------------------------- - //
global.hasGelAudio = true;
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
// howler.js hack. Add a function for controlling playback rate //
window.Howl.prototype.setRate = function( rate ) {
	this._rate = rate;
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
global.gelLoadAudio = function( _ob, _ob2 ) {
	var Target = GelInternal;
	Target.IncLoad();
	
	var Ob;

	if ( typeof _ob === "string" ) {
		Ob = { 
			urls: [_ob],
			onload: function() {
				this.IncLoaded();
			}.bind( Target ),
			onloaderror: function() {
				this.DecLoad();
			}.bind( Target )
		};
		
		if ( typeof _ob2 === "object" ) {
			for ( var arg in _ob2 ) {
				if ( _ob2.hasOwnProperty(arg) ) {
					Ob[arg] = _ob2[arg];
				}
			}
		}
	}
	else if ( typeof _ob === "object" ) {
		Ob = { 
			onload: function() {
				this.IncLoaded();
			}.bind( Target ),
			onloaderror: function() {
				this.DecLoad();
			}.bind( Target )
		};
		
		if ( typeof _ob === "object" ) {
			for ( var arg in _ob ) {
				if ( _ob.hasOwnProperty(arg) ) {
					Ob[arg] = _ob[arg];
				}
			}
		}
	}
	else {
		Target.DecLoad();
		return;
	}
	
	return new Howl( Ob );
}
// - ----------------------------------------------------------------------------------------- - //


// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
