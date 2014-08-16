// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");

		gelSynth(function(e){
			var data = e.outputBuffer.getChannelData(0);
			
			for (var i = 0; i < data.length; ++i) {
				
				//var t = ((this.x*0.125|0)+(i&7)) & 65535;
				//var t = this.x & 65535;
				//var t = (((this.x>>2)<<1)|(i&1)) & 65535;
				//var t = (((this.x>>4)<<2)|(i&3));
				//var t = (((this.x>>3)<<2)|(i&3)) & 65535;
				//var t = (((this.x >> 4) << 2)|(i&3)) & 65535;
				var t = this.x;
				
				var value = 
					t*(((t>>12)|(t>>8))&(63&(t>>4)));
					//(t & t >> 9) & (t & t>>3);
					//(t & t >> 8);
				
				//data[i] = (( value ) & 65535) / 65536;
				data[i] = (( value ) & 65535) * (1/(65536/2)) - 1;
				//data[i] = value;
	
				this.x++;
			}
		},
		// Synth Init //
		function(){
			if ( typeof this.x === "undefined" )
				this.x = 0;
		});
		
		var ctx = gelSimpleSetup();		// Standard Full-Window/Full-Screen Setup //
		gelSimpleStart( ctx );
	});
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function Step() {
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	// "setTransform" resets to Identity. "transform" accumulates.
	this.setTransform(
		1,0,	// A B 0 //
		0,1,	// C D 0 //
		0,0		// E F 1 //
	);
	
	this.fillStyle = "rgb(40,80,30)";
	this.fillRect(0, 0, this.canvas.width, this.canvas.height);

	var HalfWidth = this.canvas.clientWidth>>1;
	var HalfHeight = this.canvas.clientHeight>>1;
	
	var Text = "gelSynth";
	var TextHeight = (HalfWidth/8);
	this.font = "bold " + TextHeight +"px Calibri";
	var TextWidth = this.measureText(Text).width;
	
	this.fillStyle = "#FFF";
	this.fillText(Text,HalfWidth-(TextWidth>>1),HalfHeight+(TextHeight>>1));
}
// - ----------------------------------------------------------------------------------------- - //
