// - ----------------------------------------------------------------------------------------- - //
var Angle;
var Music;

var ctx;
var subcanvas;
// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Preload stuff //
	Music = gelLoadAudio({ 
		urls: ["Garth-Knight-Cage.ogg", "Garth-Knight-Cage.mp3"], 
		loop:true,
		onend:function(){
			Angle = 0;
		}
	});

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");

		Init();
		gelOnBlur(function(){Music.pause();});
		gelOnFocus(function(){Music.play();});

		subcanvas = gelCanvasCreate( { width:320, height:200 } );
		gelCanvasSmoothing( subcanvas, false );
		
		ctx = gelSimpleSetup();		// Standard Full-Window/Full-Screen Setup //
		gelSimpleStart( ctx );
		gelCanvasSmoothing( ctx.canvas, false );
	});
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function Init() {
	Angle = 0;
}
// - ----------------------------------------------------------------------------------------- - //
function Step() {
	Angle++;
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	var c = subcanvas.ctx;
	var out = ctx;
	
	// *** //

	// Background //	
	gelCanvasClear( c );//, RGB(32,32,32) );
	gelCanvasIdentity( c );

	var Width = c.canvas.width >> 3;
	var Height = c.canvas.height >> 3;

	for ( var y = 0+5; y < Height-5; y++ ) {
		for ( var x = 0+5; x < Width-5; x++ ) {
			c.fillStyle = RGB(
				128.0+(Math.cos((Angle+x)*Math.PI/20)*127.0) & 255,
				128.0+(Math.sin((Angle+y)*Math.PI/32)*127.0) & 255,
				128.0+(Math.cos((Angle+y)*Math.PI/15)*127.0) & 255
			);
			var Ang = (y+(Angle*0.25))*Math.PI;
			var Ang2 = (x+(Angle*0.25))*Math.PI;
			c.fillRect(
				Math.round( (x<<3)+(Math.sin(Ang/16)*(1+(Angle*Angle/240000))) ),
				Math.round( (y<<3)+(Math.cos(Ang2/22)*(1+(Angle*Angle/240000))) ), 
				((6+((Math.sin(Ang2/16))*4))*(0.5+(Angle)/3000))|0,
				((6+((Math.cos(Ang/22))*4))*(0.5+(Angle)/3000))|0
			);

//			c.fillRect(
//				(x<<3),
//				(y<<3),
//				7,7
//			);
		}
	}	


	// *** //

	{
		out.globalAlpha = 0.6;
		gelCanvasClear( out, RGB(64,64,64) );
		gelCanvasIdentity( out );

		var scaleW = out.canvas.width / c.canvas.width | 0;
		var scaleH = out.canvas.height / c.canvas.height | 0;
		var scalar = scaleW > scaleH ? scaleH : scaleW;
		
		var newW = c.canvas.width * scalar;
		var newH = c.canvas.height * scalar;

		out.setTransform( 1,0, 0,1, 0,0 );
		
		out.globalAlpha = 1;
		out.drawImage(c.canvas,
			0,0,
			c.canvas.width,c.canvas.height,
			(out.canvas.width-newW)*0.5|0,(out.canvas.height-newH)*0.5|0,
			newW, newH);
		out.globalAlpha = 1;
	}
}
// - ----------------------------------------------------------------------------------------- - //
