_FPS = 50;
_DRAG_COEF = .005;
_GRAVITY_SCALE = 1;


window.onload = () => {
    setUp();

    let start = document.getElementById("startBtn");
    let reset = document.getElementById("resetBtn");
    let objectSelect = document.getElementById("objectSelect");

    objectSelect.addEventListener("change", function() {
        let objectSelect = document.getElementById("objectSelect");
        game.projectile.image = new Image();
        game.projectile.image.addEventListener('load', function () {
            // execute drawImage statements here
            game.projectile.draw();
        }, false);
        switch (objectSelect.value) {
            case "Marshmallow":
                game.projectile.mass = .0007;
                game.projectile.size = {x: 15, y: 15};
                game.projectile.image.src = "assets/marshmallow.svg";
                break;
            case "Tennis Ball":
                game.projectile.mass = .0058;
                game.projectile.size = { x: 20, y: 20 };
                game.projectile.image.src = "assets/tennis.png";
                break;
            case "Basketball":
                game.projectile.mass = .625;
                game.projectile.size = { x: 40, y: 40 };
                game.projectile.image.src = "assets/basketball.png";
                break;
            case "Bowling Ball":
                game.projectile.mass = 5;
                game.projectile.size = { x: 35, y: 35 };
                game.projectile.image.src = "assets/bowling.png";
                break;
        }
        game.draw();
    })


    start.onclick = function() {
        if(game.run)
            return;

        game.projectile.applyForce(getForceInput());

        game.start();
    }

    reset.onclick = function() {
        game.reset();
    }
}



// Let's get to some of the actual simulation code


// Returns the force as an object {x, y} taken from the force and angle inputs
function getForceInput() {
    let fInput = document.getElementById("force");
    let angleInput = document.getElementById("angle");
    let f = parseFloat(fInput.value);
    console.log(f)
    // Multiply by 0.0174533 (pi / 180) to convery to radians for use in Math.cos and Math.sin
    let angle = parseFloat(angleInput.value) * 0.0174533;

    let xF = Math.cos(angle) * f;
    let yF = Math.sin(angle) * f;
    if(isNaN(xF) || isNaN(yF)) {
        console.error("Force was computed as NaN")
    }
    return { x: xF, y: -yF, magnitude: f};
}

// Sets up the game, called upon window loading
function setUp() {
    game = new Game();
    game.init();
    game.draw();
}