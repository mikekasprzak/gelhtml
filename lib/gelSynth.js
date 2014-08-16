// - ----------------------------------------------------------------------------------------- - //
/*!
 *  gelSynth.js v0.1.0 - Audio Synthesis Playground
 *  part of the gelHTML library.
 *
 *  Requires: gelHTML.js
 *
 *  (c) 2011-2014, Mike Kasprzak (@mikekasprzak) of SYKRONICS
 *  sykronics.com
 *
 *  MIT License
 */
// - ----------------------------------------------------------------------------------------- - //
(function(){
// - ----------------------------------------------------------------------------------------- - //
// Safari Fix //
if ( typeof window.AudioContext === "undefined" ) {
	if ( typeof window.webkitAudioContext !== "undefined" ) {
		window.webkitAudioContext.prototype.createScriptProcessor = (function(){
			return window.webkitAudioContext.prototype.createScriptProcessor ||
				window.webkitAudioContext.prototype.createJavaScriptNode;
		})();
	}
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function GelSynth( BufferSize, Inputs, Outputs ) {
	if (typeof AudioContext !== 'undefined')
		this.ctx = new AudioContext();
	else if (typeof webkitAudioContext !== 'undefined')
		this.ctx = new webkitAudioContext();
	else
		this.ctx = null;

	this.hasWebAudio = false;
		
	Log( "Web Audio Context:", this.ctx );
	if ( this.ctx ) {
		if ( typeof this.ctx.createScriptProcessor !== "undefined" ) {
			this.node = this.ctx.createScriptProcessor(BufferSize,Inputs,Outputs);
			this.node.onaudioprocess = function(e) { this.process(e); }.bind(this);
			this.hasWebAudio = true;
		}
	}
}
// - ----------------------------------------------------------------------------------------- - //
GelSynth.prototype = {
	play: function() {
		if (this.hasWebAudio) {
			this.node.connect(this.ctx.destination);
		}
	},
	pause: function() {
		if (this.hasWebAudio) {
			this.node.disconnect();
		}
	}	
};
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function gelSynth( _func, _initFunc ) {
	var Synth = new GelSynth(null,0,1);
	if ( Synth ) {
		Synth.process = _func;
		
		if ( typeof _initFunc === "function" )
			_initFunc.call(Synth);
		
		gelOnBlur( function() { this.pause(); }.bind(Synth) );
		gelOnFocus( function() { this.play(); }.bind(Synth) );
		
		return Synth;
	}
	return null;
}
// - ----------------------------------------------------------------------------------------- - //
function gelSynthStereo( _func, _initFunc ) {
	var Synth = new GelSynth(null,0,2);
	if ( Synth ) {
		Synth.process = _func;
		
		if ( typeof _initFunc === "function" )
			_initFunc.call(Synth);
		
		gelOnBlur( function() { this.pause(); }.bind(Synth) );
		gelOnFocus( function() { this.play(); }.bind(Synth) );
		
		return Synth;
	}
	return null;
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// Reference. NOTE: If setting an input, YOU MUST HAVE AN INPUTS > 0! This was my Safari fail. //
//	this.dummySource = this.ctx.createBufferSource();
//	this.dummySource.buffer = this.ctx.createBuffer(1,1024,44100);
//	this.node = this.ctx.createScriptProcessor(1024,1,1); // SampleRate, Inputs, Outputs //
//	this.node.onaudioprocess = function(e) { this.process(e); }.bind(this);
//
//	this.dummySource.connect( this.node );
//
//	if (typeof this.dummySource.start === 'undefined') {
//		this.dummySource.noteOn(0);
//	} else {
//		this.dummySource.start(0);
//	}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
// Example //
// - ----------------------------------------------------------------------------------------- - //
//	gelSynth(function(e){
//		var data = e.outputBuffer.getChannelData(0);
//		
//		for (var i = 0; i < data.length; ++i) {
//			var t = this.x;
//			
//			var value = t*(((t>>12)|(t>>8))&(63&(t>>4)));
//			data[i] = (( value ) & 65535) * (1/(65536/2)) - 1;
//
//			this.x++;
//		}
//	},
//	// Synth Init //
//	function(){
//		if ( typeof this.x === "undefined" )
//			this.x = 0;
//	});
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
if (typeof window !== "undefined") {
	window.gelSynth = gelSynth;
	window.gelSynthStereo = gelSynthStereo;
}
// - ----------------------------------------------------------------------------------------- - //
})();
// - ----------------------------------------------------------------------------------------- - //
