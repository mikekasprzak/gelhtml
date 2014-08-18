// - ----------------------------------------------------------------------------------------- - //
var SndTension;
var SndDeath;
var SndStart;
var SndVictory;
var SndGas;
// - ----------------------------------------------------------------------------------------- - //
var TensionRate;
var Pulse;
//var TensionWatch;
var GameState;
const StPlay = 1;
const StDeath = 2;
const StVictory = 3;
// - ----------------------------------------------------------------------------------------- - //
var ctx;
var subcanvas;
// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Preload stuff //
	SndTension = gelLoadAudio({
		urls:["Tension.wav"], 
		onend: function(){
			SndTension.setRate( 1.0 + (TensionRate>>3)/1000.0 );
			SndTension.play();
			Pulse = 32;
		}
	});
	
	SndStart = gelLoadAudio("Start.wav");
	SndDeath = gelLoadAudio("Mistakes.wav");

	SndVictory = gelLoadAudio("NoFuel.wav");
	SndGas = gelLoadAudio("Fuel.wav");

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");

		Init();

		subcanvas = gelCanvasCreate( { width:256, height:160 } );
		gelCanvasSmoothing( subcanvas, false );

		gelOnBlur(function(){
			SndTension.pause();
		});
		gelOnFocus(function(){
			SndTension.play();
		});
		
		ctx = gelSimpleSetup();		// Standard Full-Window/Full-Screen Setup //
		gelSimpleStart( ctx );
		gelCanvasSmoothing( ctx.canvas, false );
		gelOnPauseDraw( OnPause );
		
		SndStart.play();
	});
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function Init() {
	TensionRate = 0;
	Pulse = 32;
	GameState = StPlay;
}
// - ----------------------------------------------------------------------------------------- - //
function Step() {
	if ( GameState == StPlay ) {
		TensionRate++;
		if ( Pulse > 0 ) {
			Pulse--;
		}

	}
	else if ( GameState == StDeath ) {
		
	}
	else if ( GameState == StVictory ) {
		
	}
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	var c = subcanvas.ctx;
	var out = ctx;
	
	// *** //

	// Background //	
	var RedValue = 10+(TensionRate>>5);
	if ( RedValue > 190 )
		RedValue = 190;

	gelCanvasClear( c, RGB(RedValue,0,0) );


	// Cross //
	c.fillStyle = "rgb(255,255,255)";
	c.strokeStyle = "rgb(255,255,255)";
	c.lineWidth = 1;
	var PulseLen = 4+(((Pulse*0.25)*(Pulse*0.25))*0.25*(1+(TensionRate*0.00125)));
	c.fillRect(128-1,80-PulseLen, 2,PulseLen+PulseLen);
	c.fillRect(128-PulseLen,80-1, PulseLen+PulseLen,2);


	c.fillRect(20+2,20+2, 20-4,40-4);
	c.strokeRect(20+0.5,20+0.5, 20-1,40-1);

//	c.setTransform(
//		Math.abs(Math.sin(Angle*0.0125)*3)+1,0,
//		0,Math.abs(Math.sin(Angle*0.0325)*3)+1,
//		0,0	
//	);
//
//	c.drawImage(Food,0,0);
//
//	c.setTransform( 1,0, 0,1, 0,0 );	
//	var HalfWidth = c.canvas.width>>1;
//	var HalfHeight = c.canvas.height>>1;
//	var Radian = Angle*2*Math.PI/360;
	
//	c.translate( HalfWidth + (Math.cos(Radian) * HalfWidth / 2), HalfHeight + (Math.sin(Radian) * HalfHeight / 2) );
//	c.rotate((Angle*12) * Math.PI/360);
	
//	c.drawImage(Bird,-Bird.width>>1,-Bird.height>>1);

	// *** //

	{
		gelCanvasClear( out, RGB(RedValue-8,0,0) );

		out.setTransform( 1,0, 0,1, 0,0 );

		var scaleW = out.canvas.width / c.canvas.width | 0;
		var scaleH = out.canvas.height / c.canvas.height | 0;
		var scalar = scaleW > scaleH ? scaleH : scaleW;
		
		var newW = c.canvas.width * scalar;
		var newH = c.canvas.height * scalar;

		out.setTransform( 1,0, 0,1, 0,0 );
		
		out.drawImage(c.canvas,
			0,0,
			c.canvas.width,c.canvas.height,
			(out.canvas.width-newW)*0.5|0,(out.canvas.height-newH)*0.5|0,
			newW, newH);
	}
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function OnPause( ctx ) {
	if ( !gelHasFocus() ) {
		var Width = ctx.canvas.width;
		var Height = ctx.canvas.height;
		var HalfWidth = Width >> 1;
		var HalfHeight = Height >> 1;
		var SmallAxis = Width > Height ? Height : Width;
		
		ctx.setTransform(
			1,0,						// A B 0 //
			0,1,						// C D 0 //
			HalfWidth,HalfHeight		// E F 1 //
		);

		var OldStyle = ctx.fillStyle;

		ctx.fillStyle = "rgba(0,0,0,0.8)";
		ctx.fillRect(-HalfWidth, -HalfHeight, Width, Height);

		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillRect(-(SmallAxis>>4),-(SmallAxis>>2), SmallAxis>>3,SmallAxis>>1);
		ctx.fillRect(-(SmallAxis>>2),-(SmallAxis>>4), SmallAxis>>1,SmallAxis>>3);

		ctx.fillStyle = OldStyle;
	}
}
// - ----------------------------------------------------------------------------------------- - //
