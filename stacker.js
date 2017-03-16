/*

Stacker
Author: Josh Moore
Last modified: March 9, 2017

Description: To win the game, simply create a stack of blocks to the top of
the board to win a prize

How it works: The stacker board is simply modelled as 2D matrix, which spawns
blocks on each row as the game is played. The board is refreshed 30 times per 
second.

Dimensions of the canvas are set to width: 280 and height: 480
the size of the block is 40x40, so this gives us a 7x12 grid

*/
var speed = 200; // ms
var height = 12;
var width = 7;
var remaining = 3;	// the number of blocks that will spawn - decrements when a block is missed
var blockHeight = 40;
var blockWidth = 40;

var reverse = false;
var currCol = 0;
var currRow = 0;
var togo = 2; 		// To count the blocks displayed when going into the rhs
var togoleft = 0;	// To count the blocks displayed when going into the lhs

var saved = new Array();
saved.length = 7*12;	// to initialize array to proper size

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
  	// update position
  	currRow++;
  	currCol=0;
  	togoleft=0;
  	// setTimeout(function, 500); // waits for half a second, to prevent spamming
  }
}, false);

// initializes our refresh rate and starts the game
function init() {
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
			console.log("Printing at "+i);
			if (canvas.getContext) {
				ctx.fillStyle = "rgb(0,120,255)";
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
		console.log("currCol="+currCol);
		// if we're in a column that is going to force us to fill all blocks
		if ( currCol<remaining-1 ) {
			for ( var i=0; i<=togoleft;i++) {
				saved[(currRow*width)+i] = 1;
			}
			togoleft++;
			currCol++;
		}
		// if we're in a middle column, where we just fill the previous remaining-1 blocks
		else if ( currCol<width-1) {
			for ( var i=0; i<remaining; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
			}
			currCol++;
		}
		// we're in the final column, and we need to consume the blocks until we only have 1 on the screen
		else {
			for ( var i=0; i<=togo; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
			}
			if ( togo==0 ) {
				reverse = true;
				//currCol--;
				console.log("Now reversing");
			}
			if ( togo!=0) {
				togo--;
			}
		}
	}
	// we're going backwards now, so we mirror the previous code exactly
	else {
		console.log("we're here");
		// if we're in the last column
		if ( currCol==width-1 && togo<remaining) {
			console.log("in the end, now printing back");
			// count back from togo
			for ( var i=0; i<togo; i++) {
				saved[(currRow*width)+currCol-i] = 1;
				saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
			}
			togo++;
			currCol--;
		}
		
	}
}

// This function sets the values of the 2D array "saved"
// This function is updated at the start of each execution of the main update function
function setArrayOriginal() {
	console.log(currCol);
	// check blocks remaining

	if ( !reverse) {
		// Check if we're at the beginning
		if ( currCol<remaining) {
			// We need to increment the togo blocks
			for (var i=0; i<=togoleft;i++) {
				console.log("Column "+currCol+" togoleft="+togoleft);
				saved[(currRow*width)+i] = 1;
			}
			togoleft++;
			currCol++;
		}
		// If we're in the middle, but not at the final column
		else if ( currCol<width-1 ) {
			if (currCol==1)
				console.log("NOW");
			for ( var i=0; i<remaining; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
			}
			currCol++;
		}
		// At the end, now reverse
		else {
			console.log("At the end");
			for ( var i=0; i<=togo; i++) {
				// Each time we have to update up to 3 blocks
				saved[(currRow*width)+currCol-i] = 1;
				saved[(currRow*width)+currCol-1-i] = 0; // draws empty over the previous placement
			}
			
			if ( togo==0 ) {
				reverse = true;
				togorev = remaining;
				//currCol--;
				console.log("Now reversing");
			}
			if ( togo!=0) {
				togo--;
			}
		}
	}
	else if ( reverse) {
		if ( currCol!=0 && currCol>remaining ) {
			// We have to check the far ends
			console.log("currCol="+currCol+" togo="+togo);
			if ( currCol==width-1 && togo!=2 ) {
				// At the right side here
				console.log("Now counting them back");
				togo++;
				for ( var i=togo; i>0; i-- ) {
					saved[(currRow*width)+currCol-i] = 1;
					saved[(currRow*width)+currCol+1-i] = 1;
				}
			}
			else {
				for ( var i=remaining; i>0; i--) {
					saved[(currRow*width)+currCol-i] = 1;
					saved[(currRow*width)+currCol+1-i] = 0;
				}
				currCol--;
			}
		}
		// At the beginning again
		else if ( currCol!=0 && currCol<=togoleft ) {
			console.log("currCol="+currCol+" printing in :");
			for (var i=0; i<=togoleft;i++) {
				console.log("Column "+currCol+" togoleft="+togoleft);
				saved[(currRow*width)+i] = 1;
			}
			togoleft--;
			currCol--;
		}
		else {
			console.log("currCol=0");
				// We're at the first column now
				reverse = false;
				//saved[(currRow*width)+currCol] = 1;
				//saved[(currRow*width)+currCol+1] = 0;
				currCol++;
		}
	}
}

function checkCollision() {
	// We have to check if the blocks just placed are on top of the previous row
	// Discard all blocks that are not on top of a block in the previous row
}

function updateGame() {
 	setArray();
	// Always draw our saved blocks first
	drawArray();
}
