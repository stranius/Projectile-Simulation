window.onload = () => {
    setUp();

    let start = document.getElementById("startBtn");
    let reset = document.getElementById("resetBtn");
    let objectSelect = document.getElementById("objectSelect");

    objectSelect.addEventListener("change", function() {
        let objectSelect = document.getElementById("objectSelect");
        projectile.image = new Image();
        projectile.image.addEventListener('load', function () {
            // execute drawImage statements here
            projectile.draw();
        }, false);
        switch (objectSelect.value) {
            case "Marshmellow":
                projectile.mass = .1;
                projectile.width = 10;
                projectile.height = 10;
                projectile.image.src = "assets/marshmallow.png";
                break;
            case "Tennis Ball":
                projectile.mass = 1;
                projectile.width = 20;
                projectile.height = 20;
                projectile.image.src = "assets/tennis.png";
                break;
            case "Basketball":
                projectile.mass = 10;
                projectile.width = 40;
                projectile.height = 40;
                projectile.image.src = "assets/basketball.png";
                break;
            case "Bowling Ball":
                projectile.mass = 40;
                projectile.width = 35;
                projectile.height = 35;
                projectile.image.src = "assets/bowling.png";
                break;
        }
        game.draw();
    })


    start.onclick = function() {
        if(game.run)
            return;
        let velInput = document.getElementById("velocity");
        let angleInput = document.getElementById("angle");
        let vel = parseInt(velInput.value);
        // Multiply by 0.0174533 (pi / 180) to convery to radians for use in Math.cos and Math.sin
        let angle = parseInt(angleInput.value) * 0.0174533;

        let xVel = Math.cos(angle) * vel;
        let yVel = Math.sin(angle) * vel;
        projectile.velocity = {x: xVel, y: -yVel};

        game.start();
    }

    reset.onclick = function() {
        setUp();
    }
}

function setUp() {
    game.init();
    projectile = new component(30, 30, "red", 30, game.size.y - 60, false);
    projectile.name = "Projectile";
    projectile.image = new Image();
    projectile.image.addEventListener('load', function () {
        // execute drawImage statements here
        projectile.draw();
    }, false);
    projectile.mass = 1;
    projectile.width = 20;
    projectile.height = 20;
    projectile.image.src = "assets/tennis.png";
    game.draw();
}

var game = {
    gravity: .2,
    size: {x: 800, y: 500},
    run: false,

    init: function() {
        this.canvas = document.getElementById("simulationCanvas")
        this.context = this.canvas.getContext("2d");
        this.ground = new component(game.size.x, 20, "blue", 0, game.size.y - 20, true);
        this.ground.name = "Ground";
        this.ground.friction = .2;
        this.run = false;
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    start: function() {
        this.run = true;
        this.interval = setInterval(this.draw, 20);
    },
    
    draw: function() {
        if(!this.run)
            clearInterval(this.interval);
        game.clear();
        game.ground.update();
        projectile.update();
    }
}

function component(width, height, color, x, y, static) {
    this.name = "No Name";
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.static = static;
    this.color = color;
    this.velocity = {x: 0, y: 0};
    this.mass = 10;
    this.image = undefined;

    ctx = game.context;

    this.draw = function() {
        ctx = game.context;
        if (this.image != undefined)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.update = function () {
        if(!this.static) {
            let maxVelocity = 10 * this.mass;
            console.log(maxVelocity)
            if (this.velocity.y < maxVelocity)
                this.velocity.y += game.gravity;
            else
                this.velocity.y = maxVelocity;
            
            if (this.velocity.x > maxVelocity)
                this.velocity.x = maxVelocity;

            if (!checkCollision(this, game.ground)) {
                this.y += this.velocity.y;
                this.x += this.velocity.x;
            } else {
                // this.velocity.y = 0;
                this.y = game.ground.y - this.height;
                let dir = (this.velocity.x < 0) ? 1 : -1;
                if(this.velocity.x != 0) {
                    this.velocity.x += game.ground.friction * dir;
                    if(Math.abs(this.velocity.x) < .1)
                        this.velocity.x = 0;
                }
                this.x += this.velocity.x;
            }
        }
    
        this.draw();
    }
}

function checkCollision(a, b) {
    if (a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.y + a.height >= b.y) {
        return true;
    }
    return false;
}