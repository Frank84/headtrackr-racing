// Game Loop
		var vendors = ['webkit', 'moz'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		var canvas = document.getElementById('gameCanvas');

		// global variables 
		var carWidth         = 100;
		var carHeight        = 200; 
		var margin           = 300;
		var widthRoad        = canvas.width - (margin*2);
		var heightRoad       = canvas.height;
		var centerX          = canvas.width / 2;
		var centerY          = canvas.height / 2;
		var sectionX         = widthRoad / 20;
		var sectionY         = heightRoad / 20;
		var startX           = margin;
		var endX             = canvas.width - margin;
		var numEnemies       = 0;
		var colorArray       = ['','blue','red','orange'];
		var gameOver         = false;
		var highscore        = 0;
		var displayHighscore = 0;
		var playerSpeed      = 4;
		var enemySpeed       = 5;
		var roadImg 		 = 1;
		var delayRoadImg     = 

		$('#again').click(function() {
			resetGame();
		})

	    function randNum() {
	    	return Math.floor(Math.random() * 18) + 1;
	    }

	    function randColor() {
	    	return Math.floor(Math.random() * 3) + 1;
	    }

	    // enemy object
	    function Enemy(nmb, color) {
			this.posX  = nmb * sectionX;
			this.posY  = -100;
			this.color = colorArray[color];
	    }

	    // enemy object
	    var enemy = new Enemy(1,1);

	    // player object
		var Player   = new Object();
		Player.posX  = centerX;
		Player.posY  = centerY;
		Player.sizeX = 50;
		Player.sizeY = 100;

		function gameLoop() {
		    window.requestAnimationFrame(gameLoop);
		    if (!gameOver) {
			    checkCollision();
			    clearCanvas();
			    drawTrack();
			    drawScore();
				drawPlayer(); 
				updateEnemy();
				highscore = highscore + 0.01;
				enemySpeed = enemySpeed + 0.01;
				displayHighscore = Math.round( highscore * 10 ) / 10;
				if (roadImg>7) {
					roadImg = 1;
				}
				else {
					roadImg++;
				}
			}
			else {
				clearCanvas();
				drawTrack();
				endGame();
			}
		}

		if (typeof (canvas.getContext) !== undefined) {
		    context = canvas.getContext('2d');
		    gameLoop();
		}

		function drawTrack() {
			var img=document.getElementById("road"+roadImg.toString());
			context.drawImage(img,0,0);
		}

		function checkCollision() {
			if (Math.abs((enemy.posY+carHeight) - (Player['posY'])) <= 10) {
				if (Math.abs(enemy.posX - Player['posX']) <= (carWidth*0.76)) {
					gameOver = true;
				}
			}
			else if (Math.abs(enemy.posX - Player['posX']) <= (carWidth*0.76)) {
				// console.log((enemy.posY+carHeight) - (Player['posY']));
				if ((enemy.posY+carHeight) - (Player['posY']) >= 10 && (enemy.posY+carHeight) - (Player['posY']) <= carHeight*2) {
					gameOver = true;
				}
			}
		}

		function resetGame() {
			resetEnemy();
			gameOver = false;
			highscore = 0;
			enemySpeed = 5;
			$('#again').hide();
		}

		function endGame() {
			$('#again').show();
			context.textAlign = 'center';
      		context.fillStyle = 'red';
			context.font = "bold 32px sans-serif";
			context.fillText("YOU DIE AFTER "+displayHighscore+" MILES! :'(", centerX, centerY);
		}

		function drawScore() {
			context.textAlign = 'left';
      		context.fillStyle = 'white';
			context.font = "bold 48px sans-serif";
			context.fillText(displayHighscore, canvas.width-100, 70);
		}

		function updateEnemy() {
			if (numEnemies === 0) {
				createEnemy();
			}
			else {
				moveEnemy();
			}
		}

		function createEnemy() {
			enemy.posX = margin + (randNum() * sectionX); 
			enemy.color = colorArray[randColor()];
			drawEnemy();
			numEnemies = 1;
		}

		function resetEnemy() {
			numEnemies = 0;
			enemy.posY = -300;
		}

		function moveEnemy() {
			if (enemy.posY > canvas.height+300) {
				resetEnemy();
			}
			else {
				enemy.posY += enemySpeed;
				drawEnemy();
			}
		}

		function drawEnemy() {
			var img=document.getElementById("car-"+enemy.color);
			context.drawImage(img,enemy.posX,enemy.posY);
		}

		function drawPlayer() {
			var img=document.getElementById("car");
			context.drawImage(img,Player['posX'],Player['posY']);
	    }

	    function clearCanvas() {
	    	canvas.width = canvas.width;
	    }

		function getPositionHead(event) {
			var posHead = event.x;
			var newPos = centerX+(sectionX*(posHead*playerSpeed));
			if (newPos >= endX) {
				newPos = endX;
			}
			else if (newPos <= (startX-carWidth)) {
				newPos = startX-carWidth;
			}
			// console.log('Position: '+newPos);
			Player['posX'] = newPos;
		}

		function getPositionFace(event) {
			var posFace = event.y - 120;
			var newPos = Math.abs(posFace*sectionY);
			// Player['posY'] = newPos;
			// console.log(newPos);
			// console.log("Y position: "+event.y);
		}