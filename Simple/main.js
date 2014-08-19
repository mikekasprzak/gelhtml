// - ----------------------------------------------------------------------------------------- - //
var Food;
var Bird;
var Jayson;

var Angle = 0;

var ctx;
var subcanvas;
// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Preload stuff //
	Food = gelLoadImage("Loot01.png");
	Bird = gelLoadImage("Chicken.png");
	
//	Jayson = gelLoadJSON("Fun.json");
//	Samson = gelLoadText("Fun.json");

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");
		
//		Log( Jayson.data );
//		Log( Samson.data );

		subcanvas = gelCanvasCreate( { width:160, height:100 } );
		gelCanvasSmoothing( subcanvas, false );
		
		ctx = gelSimpleSetup();		// Standard Full-Window/Full-Screen Setup //
		gelSimpleStart( ctx );
		gelCanvasSmoothing( ctx.canvas, false );
	});
}
// - ----------------------------------------------------------------------------------------- - //

// - ----------------------------------------------------------------------------------------- - //
function Step() {
	Angle++;
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	var c = subcanvas.ctx;
	var c_canvas = c.canvas;
	var out = ctx;
	var out_canvas = out.canvas;


	// "setTransform" resets to Identity. "transform" accumulates.
	c.setTransform(
		1,0,	// A B 0 //
		0,1,	// C D 0 //
		0,0		// E F 1 //
	);
	
//	c.clearRect(0, 0, c.canvas.width, c.canvas.height);
	c.fillStyle = "rgb(40,20,30)";
	c.fillRect(0, 0, c_canvas.width, c_canvas.height);

	c.setTransform(
		Math.abs(Math.sin(Angle*0.0125)*3)+1,0,
		0,Math.abs(Math.sin(Angle*0.0325)*3)+1,
		0,0	
	);

	c.drawImage(Food.data,0,0);

	c.setTransform(
		1,0,	// A B 0 //
		0,1,	// C D 0 //
		0,0		// E F 1 //
	);	
	var HalfWidth = c_canvas.width>>1;
	var HalfHeight = c_canvas.height>>1;
	var Radian = Angle*2*Math.PI/360;
	
	c.translate( HalfWidth + (Math.cos(Radian) * HalfWidth / 2), HalfHeight + (Math.sin(Radian) * HalfHeight / 2) );
	c.rotate((Angle*12) * Math.PI/360);
	
	c.drawImage(Bird.data,-Bird.data.width>>1,-Bird.data.height>>1);

	// *** //

	{
		out.setTransform(
			1,0,	// A B 0 //
			0,1,	// C D 0 //
			0,0		// E F 1 //
		);

//		out.clearRect(0, 0, out.canvas.width, out.canvas.height);
		out.fillStyle = "rgb(0,0,0)";
		out.fillRect(0, 0, out_canvas.width, out_canvas.height);

		var scaleW = out_canvas.width / c_canvas.width | 0;
		var scaleH = out_canvas.height / c_canvas.height | 0;
		var scalar = scaleW > scaleH ? scaleH : scaleW;
		
		var newW = c_canvas.width * scalar;
		var newH = c_canvas.height * scalar;
		
		out.drawImage(c_canvas,
			0,0,
			c_canvas.width,c_canvas.height,
			(out_canvas.width-newW)*0.5,(out_canvas.height-newH)*0.5,
			newW, newH);
	}
}
// - ----------------------------------------------------------------------------------------- - //
