"use strict"
// - ----------------------------------------------------------------------------------------- - //
var Eye;

var Angle = 0;
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
	
	ctx.drawImage(
		asset.data,
		// SRC //
		Math.floor(idx % cellsWide)*cellWidth, Math.floor(idx / cellsWide)*cellHeight,
		cellWidth,cellHeight,
		
		// DEST //
		_x,_y,
		cellWidth*scalex,cellHeight*scaley
	);
}

// - ----------------------------------------------------------------------------------------- - //
function Step() {
	Angle++;
}
// - ----------------------------------------------------------------------------------------- - //
function Draw() {
	gelCanvasClear(ctx,RGB(0,0,0));
	gelCanvasCenter(ctx);
	
	var MinorAxis = ctx.canvas.width > ctx.canvas.height ? ctx.canvas.height : ctx.canvas.width;
	var PreScale = (MinorAxis/3);
	var Scale = PreScale*(1/256);
	
	var x = -PreScale*0.5;
	var y = -PreScale*0.5;
	
	var ex = x + (Math.sin((Angle+0)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	gelDrawSprite( ctx, Eye,4, ex,y, Scale,Scale );
	var ex = x + (Math.sin((Angle+2)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	gelDrawSprite( ctx, Eye,5, ex,y, Scale,Scale );
	var ex = x + (Math.sin((Angle+4)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	gelDrawSprite( ctx, Eye,6, ex,y, Scale,Scale );
	var ex = x + (Math.sin((Angle+7)*0.0125)*((ctx.canvas.width*0.5)-(PreScale*0.5)));	
	gelDrawSprite( ctx, Eye,7, ex,y, Scale,Scale );
}
// - ----------------------------------------------------------------------------------------- - //
