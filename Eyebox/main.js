//"use strict"
// - ----------------------------------------------------------------------------------------- - //
var Eye;

var Angle = 0;
var BlinkPos = 0;
var BlinkTarget = 60*3;
var BlinkSpeed = 20;
// - ----------------------------------------------------------------------------------------- - //
var ctx;
// - ----------------------------------------------------------------------------------------- - //
function Setup() {
	Log("Hello from Setup!");

	// Preload stuff //
	Eye = gelLoadImage("eyesheet.svg");

	// Once Loaded //
	gelOnLoad(function(){
		Log("Hello from OnLoad!");

		ctx = gelSimpleSetup();		// Standard Full-Window/Full-Screen Setup //
		gelSimpleStart( ctx );
	});
}
// - ----------------------------------------------------------------------------------------- - //

function gelDrawSprite( ctx, asset, idx, _x, _y, scalex, scaley ) {
	var cellsWide = 4;
	var cellsTall = 2;
		
	var cellWidth = asset.data.width / cellsWide;
	var cellHeight = asset.data.height / cellsTall;
	
	if ( typeof scalex !== "number" ) scalex = 1;
	if ( typeof scaley !== "number" ) scaley = 1;
	
	if ( scalex === 0 ) return;
	if ( scaley === 0 ) return;
	
	ctx.save();
	ctx.translate(_x,_y);
	ctx.scale(scalex,scaley);
	ctx.translate(-cellWidth*0.5,-cellHeight*0.65);		// Anchor Point! //
	
	ctx.drawImage(
		asset.data,
		// SRC //
		Math.floor(idx % cellsWide)*cellWidth, Math.floor(idx / cellsWide)*cellHeight,
		cellWidth,cellHeight,
		
		// DEST //
		0,0,//_x,_y,
		cellWidth,cellHeight
	);
	
	ctx.restore();
}

// - ----------------------------------------------------------------------------------------- - //
function Step() {
	Angle++;
	BlinkPos++;
	if ( BlinkPos > BlinkTarget ) {
		BlinkSpeed = 15 + Math.round(15*Math.random());
		BlinkTarget = Math.floor(BlinkSpeed+(60*3*Math.random()));
		BlinkPos = 0;
//		Log(BlinkPos,BlinkTarget,BlinkSpeed);
	}
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	gelCanvasClear(ctx,RGB(0,0,0));
	gelCanvasCenter(ctx);
	
	var MinorAxis = ctx.canvas.width > ctx.canvas.height ? ctx.canvas.height : ctx.canvas.width;
	var PreScale = (MinorAxis/3);
	var Scale = PreScale*(1/256);
	
	var x = 0;
	var y = 0;
	
	var Blink = 1;
	if ( BlinkPos < BlinkSpeed ) {
		Blink = (Math.cos(BlinkPos*Math.PI*2/BlinkSpeed)+1)*0.5;
		Blink *= 1.6;
		Blink -= 0.6;
		if ( Blink <= 0 ) {
			Blink = 0;
		}
	}
	
	var ex = x;
	var ey = y;
	
	var ex = x + (Math.sin((Angle+0)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	var ey = y + (Math.sin((Angle+0)*0.035)*((ctx.canvas.height*0.1)));	
	gelDrawSprite( ctx, Eye,4, ex,ey, Scale,Scale );
	var ex = x + (Math.sin((Angle+2)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	var ey = y + (Math.sin((Angle+2)*0.035)*((ctx.canvas.height*0.1)));	
	gelDrawSprite( ctx, Eye,5, ex,ey, Scale,Scale );
	var ex = x + (Math.sin((Angle+4)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	var ey = y + (Math.sin((Angle+4)*0.035)*((ctx.canvas.height*0.1)));	
	gelDrawSprite( ctx, Eye,6, ex,ey, Scale,Blink*Scale );
	var ex = x + (Math.sin((Angle+7)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	var ey = y + (Math.sin((Angle+9)*0.035)*((ctx.canvas.height*0.1)));	
	gelDrawSprite( ctx, Eye,7, ex,ey, Scale,Scale );
}
// - ----------------------------------------------------------------------------------------- - //
