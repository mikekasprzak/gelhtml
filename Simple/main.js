// - ----------------------------------------------------------------------------------------- - //
var Food;
var Bird;

var Angle = 0;

var ctx;
var subcanvas;
// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Preload stuff //
	Food = gelLoadImage("Loot01.png");
	Bird = gelLoadImage("Chicken.png");

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");

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
	var out = ctx;


	// "setTransform" resets to Identity. "transform" accumulates.
	c.setTransform(
		1,0,	// A B 0 //
		0,1,	// C D 0 //
		0,0		// E F 1 //
	);
	
//	c.clearRect(0, 0, c.canvas.width, c.canvas.height);
	c.fillStyle = "rgb(40,20,30)";
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);

	c.setTransform(
		Math.abs(Math.sin(Angle*0.0125)*3)+1,0,
		0,Math.abs(Math.sin(Angle*0.0325)*3)+1,
		0,0	
	);

	c.drawImage(Food,0,0);

	c.setTransform(
		1,0,	// A B 0 //
		0,1,	// C D 0 //
		0,0		// E F 1 //
	);	
	var HalfWidth = c.canvas.width>>1;
	var HalfHeight = c.canvas.height>>1;
	var Radian = Angle*2*Math.PI/360;
	
	c.translate( HalfWidth + (Math.cos(Radian) * HalfWidth / 2), HalfHeight + (Math.sin(Radian) * HalfHeight / 2) );
	c.rotate((Angle*12) * Math.PI/360);
	
	c.drawImage(Bird,-Bird.width>>1,-Bird.height>>1);

	// *** //

	{
		out.setTransform(
			1,0,	// A B 0 //
			0,1,	// C D 0 //
			0,0		// E F 1 //
		);

//		out.clearRect(0, 0, out.canvas.width, out.canvas.height);
		out.fillStyle = "rgb(0,0,0)";
		out.fillRect(0, 0, out.canvas.width, out.canvas.height);

		var scaleW = out.canvas.width / c.canvas.width | 0;
		var scaleH = out.canvas.height / c.canvas.height | 0;
		var scalar = scaleW > scaleH ? scaleH : scaleW;
		
		var newW = c.canvas.width * scalar;
		var newH = c.canvas.height * scalar;
		
		out.drawImage(c.canvas,
			0,0,
			c.canvas.width,c.canvas.height,
			(out.canvas.width-newW)*0.5,(out.canvas.height-newH)*0.5,
			newW, newH);
	}
}
// - ----------------------------------------------------------------------------------------- - //
