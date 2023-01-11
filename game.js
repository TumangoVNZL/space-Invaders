//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//player
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
	x: shipX,
	y: shipY,
	width: shipWidth,
	height: shipHeight
}

let shipImg;
let shipVelocityX = tileSize;

//enemies
let alienArray = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet speed, it's negative because the bullet itself is ascending in the canvas

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //starting number of aliens
let alienVelocityX = 1;


window.onload = function() {
	board = document.getElementById("board");
	board.width = boardWidth;
	board.height = boardHeight;
	context = board.getContext("2d");


//initial ship

//context.fillStyle = "green";
//context.fillRect(ship.x, ship.y, ship.width, ship.height); ---> there's an image


//images
shipImg = new Image();
shipImg.src = "./ship.png";
shipImg.onload = function() {
   context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
   }


alienImg = new Image ();
alienImg.src = "./alien.png";
CreateAliens();


   requestAnimationFrame(update);
   document.addEventListener("keydown", moveShip);
   document.addEventListener("keyup", shoot);
}


function update () {
	requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);


	//ship
	context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

	//enemy
	for (let i = 0; i < alienArray.length; i++) {
		let alien = alienArray[i];
		if (alien.alive) {
			alien.x += alienVelocityX;
            
            //when aliens touch the edges
           if (alien.x + alienWidth >= boardWidth || alien.x <= 0){
           	 alienVelocityX *= -1;
             alien.x += alienVelocityX*2; //this resolves the problem of alien desync


           	 //so aliens can move one row
           	 for (let j = 0; j < alienArray.length; j++) {
           	 	alienArray[j].y += alienHeight;
           	 }
           }
           context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

		}
	}

	//bullets
	for (let i = 0; i < bulletArray.length; i++) {
		let bullet = bulletArray[i];
		bullet.y += bulletVelocityY;
		context.fillStyle = "white";
		context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

		//bullet collision
		for (let j = 0; j < alienArray.length; j++) {
			let alien = alienArray[j];
			if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
				bullet.used = true;
				alien.alive = false;
				alienCount--;
			}
		}
	}

	//clear bullets so the array doesn't increase ad infinitum
	while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
		bulletArray.shift (); // eliminates the bullet
	}
}

function moveShip(e) {
	if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
		ship.x -= shipVelocityX; //move left 1 tile
	}
	else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidth <= boardWidth) {
		ship.x += shipVelocityX; // move right 1 tile
	}
}

function CreateAliens () {
	for (let i = 0; i < alienColumns; i++) {
		for (let j = 0; j < alienRows; j++){
			let alien = {
				img: alienImg,
				x: alienX + i*alienWidth,
				y: alienY + j*alienHeight,
				width: alienWidth,
				height: alienHeight,
				alive: true
			}
			alienArray.push(alien)
		}
	}
	alienCount = alienArray.length;
}



function shoot(e) {
    if (e.code == "Space") {
  	    let bullet = {
		    x: ship.x + shipWidth*15/32,
		    y: ship.y,
		    width: tileSize/8,
		    height: tileSize/2,
		    used: false
	    }
	    bulletArray.push(bullet);
    }	
	
}


function detectCollision (a, b) {
	return a.x < b.x + b.width &&
	       a.x + a.width > b.x &&
	       a.y < b.y + b.height &&
	       a.y + a.height > b.y;
}