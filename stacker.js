/*

Stacker
Author: Josh Moore
Last modified: January 2, 2017

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
var blocks = 0;

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
// This function initializes our refresh rate and starts the game
function init() {
 	// 200ms or 5 fps
 	refresh = setInterval(updateGame, speed);
}

function drawArray() {
	// Get the saved blocks from our matrix
	var canvas = document.getElementById("stacker");

	// Run through each element in our array
	for (var i = 0; i < saved.length; i++) {
		if (saved[i]==1) {
			console.log("Printing at "+i);

			if (canvas.getContext) {
				// We will add blocks to the board
				var ctx = canvas.getContext("2d");
				// We clear the canvas each time we draw since we are just redrawing the saved array
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				ctx.fillStyle = "rgb(200,0,0)";
				// x position from left, y position from top, width, height
				var x = (i%width) * blockWidth;
				var y = (height*blockHeight)-blockHeight - (Math.floor(i/width) * blockHeight); // Distance from top - [ row * block height ]
				ctx.fillRect (x, y, blockWidth, blockHeight);
				ctx.strokeRect(x, y, blockWidth, blockHeight);
			}
		}
	}
}
// This function sets the values of the 2D array "saved"
// This function is updated at the start of each execution of the main update function
function setArray() {
	// Updates our direction value
	//updateDir();
	// Checking our direction
	console.log(currCol);
	if ( !reverse) {
		// Make sure we're not at the end already
		if ( currCol!=width) {
			saved[currCol] = 1;
			saved[currCol-1] = 0;
			currCol++;
		}
		// Since we have to reverse now, we'll set our values to currCol-1
		else {
			console.log("Stuck here");
			currCol--;
			reverse = true;
			saved[currCol] = 0;
			saved[currCol-1] = 1;
		}
	}
	else if ( reverse) {
		if ( currCol!=0) {
			saved[currCol] = 1;
			saved[currCol+1] = 0;
			currCol--;
		}
		else {
			reverse = false;
			saved[currCol] = 1;
			saved[currCol+1] = 0;
			currCol++;
		}
	}
}

function updateGame() {
 	setArray();
	// Always draw our saved blocks first
	drawArray();
}