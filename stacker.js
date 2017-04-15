/*

Stacker
Author: Josh Moore
Last modified: March 20, 2017

Description: To win the game, create a stack of blocks to the top of
the board to win a prize

How it works: The stacker board is modelled as 2D matrix, which spawns
blocks on each row as the game is played. The board is refreshed 30 times per 
second.

Dimensions of the canvas are set to width: 280 and height: 480
the size of the block is 40x40, so this gives us a 7x12 grid

*/
var win = false;
var gameOver = false;

var speed = 100; // ms
var height = 12;
var width = 7;
var remaining = 3;	// the number of blocks that will spawn - decrements when a block is missed
var blockHeight = 40;
var blockWidth = 40;

var reverse = false;
var currCol = 0;
var currRow = 0;
var togo = 0; 		// To count the blocks displayed
var temp = 0;

var check = false;

var saved = new Array();
saved.length = width*height;	// to initialize array to proper size

// Some simple test values for saved

/*
saved[0] = 1;
saved[2] = 1;
saved[4] = 1;
saved[8] = 1;
saved[23] = 1;
saved[83] = 1;
*/
document.addEventListener('keydown', (event) => {
  const keyName = event.which;

  // Save the game if it was pressed
  if (keyName == 32) {
  	console.log("Saving game!");
  	
  	checkSides();

  	// check and remove blocks necessary
  	checkHit();

  	// reset variables for the new column and move the current row to +1
  	if (remaining>0) {
  		currRow++;
  		currCol=0;
  		togo=0;
  	}
  	else {
  		console.log("no blocks remaining");
  	}
  	// setTimeout(function, 500); // waits for half a second, to prevent spamming
  }
}, false);

// initializes our refresh rate and starts the game
function init() {
	// set the array to empty
	for (var i=0; i<saved.length;i++) {
		saved[i]=0;
	}
 	// 200ms or 5 fps
 	refresh = setInterval(updateGame, speed);
}

// clear the canvas and draw the saved array to the board
function drawArray() {
	var canvas = document.getElementById("stacker");
	var ctx = canvas.getContext("2d");

	// Clear canvas before we draw our saved one
	if (canvas.getContext) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	// Run through each element in our array
	for (var i = 0; i < saved.length; i++) {
		if (saved[i]==1) {
			//console.log("Printing at "+i);
			if (canvas.getContext) {
				ctx.fillStyle = "rgb(0,120,255)";
				// x position from left, y position from top, width, height
				var x = (i%width) * blockWidth;
				var y = (height*blockHeight)-blockHeight - (Math.floor(i/width) * blockHeight); // Distance from top - [ row * block height ]
				ctx.fillRect (x, y, blockWidth, blockHeight);
				ctx.strokeRect(x, y, blockWidth, blockHeight);
			}
		}
		else {
			if (canvas.getContext) {
				ctx.fillStyle = "rgb(31,59,115)";
				// x position from left, y position from top, width, height
				var x = (i%width) * blockWidth;
				var y = (height*blockHeight)-blockHeight - (Math.floor(i/width) * blockHeight); // Distance from top - [ row * block height ]
				ctx.fillRect (x, y, blockWidth, blockHeight);
				ctx.strokeRect(x, y, blockWidth, blockHeight);
			}
		}
	}
}

function setArray() {
	if ( !reverse ) {
		//console.log("currCol="+currCol);
		// if we're in a column that is going to force us to fill all blocks
		if ( currCol<remaining-1 ) {
			for ( var i=0; i<=togo;i++) {
				saved[(currRow*width)+i] = 1;
			}
			togo++;
			currCol++;
		}
		// if we're in a middle column, where we just fill the previous remaining-1 blocks
		else if ( currCol<width-1) {
			for ( var i=0; i<remaining; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				if ( (currRow*width)+currCol-1-i >= (currRow*width) ) {
					saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
				}
			}
			currCol++;
		}
		// we're in the final column, and we need to consume the blocks until we only have 1 on the screen
		else {
			for ( var i=0; i<=togo; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				if ( (currRow*width)+currCol-1-i >= (currRow*width) ) {
					saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
				}
			}
			if ( togo==0 ) {
				reverse = true;
				
				currCol--; // This will put us back 1 column, so we don't print twice at the final row (will look smoother)
				//saved[(currRow*width)+width-1] = 0;
				//console.log("Now reversing");
			}
			if ( togo!=0) {
				togo--;
			}
		}
	}
	// we're going backwards now and will start at width-2 (prevents looking like we're stopping at the end)
	else {
		//console.log("Reversing now, togo="+togo);
		//console.log("we're here");
		// if we're in column where we need to fill all blocks on the rhs
		if ( currCol==width-2 ) {
			//console.log("in the end, now printing back");
			// loop through the remaining blocks
			for ( var i=0; i<remaining; i++) {
				// start printing blocks at currCol and then go currCol++ as long as they don't go into the next row
				if ( ((currRow*width)+currCol+i)<= ((currRow*width)+width-1) ) {
					saved[(currRow*width)+currCol+i] = 1;
					// before we set any values to 0, make sure they are in the current row only
					if ( (currRow*width)+currCol+1+i <= ((currRow*width)+width-1) ) {
						saved[(currRow*width)+currCol+1+i] = 0; // draws empty over the previous placement
					}
				}
			}
			currCol--;
			//console.log("--> currCol="+currCol);
			togo = remaining-1;
		}
		// We're in a middle section
		else if ( currCol < (width-2) && currCol!=0 ) {			
			//console.log("this is a middle section");

			for ( var i=0; i<remaining; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol+i] = 1;
				if ( (currRow*width)+currCol+1+i <= ((currRow*width)+width-1) ) {
					saved[(currRow*width)+currCol+1+i] = 0; // draws empty over the previous placement
				}
			}
			currCol--;
			if (currCol==0) {
				togo++;
			}
		}
		// we're in the first column
		else {
			//console.log("IN FIRST ROW-TOGO="+togo);
			//console.log("**ELSE**");

			for ( var i=0; i<togo; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol+i] = 1;
				if ( (currRow*width)+currCol+1+i <= ((currRow*width)+width-1) ) {
					saved[(currRow*width)+currCol+1+i] = 0; // draws empty over the previous placement
				}
			}

			if ( togo>0) {
				togo--;
			}
			// We'll check how many we have to draw
			if ( togo==0) {
				reverse = false; // we can reverse now
				
				// this will put us into column 1, so that we don't delay while in column 0
				if (remaining>1) {

					togo++;
				}
				currCol++;
			}
		}
	}
}

/*
this just loops through the current row, finding all indices==1 and then comparing it with the one
directly below it (i-width) and determining whether we need to remove a block
*/
function checkHit() {
	// make sure this isn't the first row
	if (currRow!=0) {
		for (var i = (currRow*width); i < ((currRow*width)+width); i++) {
			console.log("At pos="+i);
			console.log("saved[i]="+saved[i]+"saved[i-width]="+saved[i-width]);

			// if the indice is 1 and there is no block underneath it, set it to 0
			if ( saved[i]==1 && saved[i-width]==0) {
				saved[i]=0;
				remaining--;

				if ( remaining==0 ) {
					console.log("GAME OVER");
				}
			}
		}
	}
}

// the blocks will go into the sides and have to be accounted for if they are stopped while in there
function checkSides() {
	if (currRow==0) {
  		for ( var i=0; i<width; i++ ) {
  			if ( saved[i]==1 ) {
  				temp++;
  			}
  		}
  		remaining = temp;
  		temp = 0;
  	}
  	else if ( currRow > 0) {
  		for ( var i=(currRow*width); i<(currRow*width)+width; i++ ) {
  			if ( saved[i]==1 ) {
  				temp++;
  			}
  		}
  		remaining = temp;
  		temp = 0;
  	}
}

function checkWin() {
	if (currRow==height-1) {
		console.log("You win!");
	}
}

function updateGame() {
	if ( remaining > 0 && currRow < height ) {
		// set blocks first and then print them
		setArray();
		drawArray();
		checkWin();
	}
	else {
		console.log("the game is now over");
	}
}
