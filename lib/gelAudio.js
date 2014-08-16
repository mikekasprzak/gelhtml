// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelAudio.js v0.1.0 - Audio and Music Playback Library
 *  part of the gelHTML library.
 *
 *  Requires: howler.js
 *
 *  (c) 2011-2014, Mike Kasprzak (@mikekasprzak) of SYKRONICS
 *  sykronics.com
 *
 *  MIT License
 */
// - ----------------------------------------------------------------------------------------- - //
(function(){
// - ----------------------------------------------------------------------------------------- - //
function gelLoadAudio( _ob, _ob2 ) {
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
if (typeof window !== "undefined") {
	window.gelLoadAudio = gelLoadAudio;	
}
// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
