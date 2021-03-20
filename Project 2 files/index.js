// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/emergencyFoodBackup.png";

// monster two image
var monsterTwoReady = false;
var monsterTwoImage = new Image();
monsterTwoImage.onload = function () {
    monsterTwoReady = true;
};
monsterTwoImage.src = "images/emergencyFoodBackup.png";


// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0, // where on the canvas are they?
    y: 0 // where on the canvas are they?
};
var monster = {
    // for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};

var monsterTwo = {
    // for this version, the monster does not move, so just and x and y
    x: 0,
    y: 0
};
var monstersCaught = 0;


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};

// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        console.log('here2');
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (monsterTwoReady) {
        ctx.drawImage(monsterTwoImage, monsterTwo.x, monsterTwo.y);
    }
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    if (monstersCaught >= 5) {
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = "90px Helvetica";
        ctx.fillText("You win!", canvas.width / 2, canvas.height / 2);
        heroReady = false;
        monsterReady = false;
        monsterTwoReady = false;
    } else {
        ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
    }

}


// Reset the game when the player catches a monster
var reset = function () {
    if (!monsterReady && !monsterTwoReady && monstersCaught < 5) {
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;
    
        monsterReady = true;
        monsterTwoReady = true;
        //Place the monster somewhere on the screen randomly
        // but not in the hedges, Article in wrong, the 64 needs to be 
        // hedge 32 + hedge 32 + char 32 = 96
        monster.x = 32 + (Math.random() * (canvas.width - 96));
        monster.y = 32 + (Math.random() * (canvas.height - 96));
    
        do {
            monsterTwo.x = 32 + (Math.random() * (canvas.width - 96));
            monsterTwo.y = 32 + (Math.random() * (canvas.height - 96));
        } while (monsterTwo.x == monster.x && monsterTwo.y == monster.y);
    }
};

// Update game objects
var update = function (modifier) {

    if (38 in keysDown && hero.y > 32 + 4) { //  holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 6)) { //  holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (32 + 4)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 6)) { // holding right key
        hero.x += hero.speed * modifier;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32) &&
            monster.x <= (hero.x + 32) &&
            hero.y <= (monster.y + 32) &&
            monster.y <= (hero.y + 32) && monsterReady
    ) {
        monsterReady = false;
        ++monstersCaught; // keep track of our “score”
        console.log(monstersCaught);
    }
    
    if (
        (hero.x <= (monsterTwo.x + 32) &&
            monsterTwo.x <= (hero.x + 32) &&
            hero.y <= (monsterTwo.y + 32) &&
            monsterTwo.y <= (hero.y + 32) && monsterTwoReady
        )
    ) {
        monsterTwoReady = false;
        ++monstersCaught; // keep track of our “score”
        console.log(monstersCaught);
    }

    reset(); // start a new cycle

};


// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

var then = Date.now();
reset();
main();