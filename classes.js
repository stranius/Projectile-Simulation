class Game {
    constructor() {
        this.fps = 50;
        this.singleFrameTime = 1 / this.fps
        this.gravity = 9.8 * 1
        this.run = false
        this.size = { x: 800, y: 500 }
        this.components = []
        this.projectile_starting_pos = {x: 30, y: this.size.y - 70}
        this.gridLine = new Image();
        this.gridLine.src = "assets/gridLine.png";
        this.gridOn = false;
    }

    init() {
        this.canvas = document.getElementById("simulationCanvas")
        this.context = this.canvas.getContext("2d");
        // this.ground = new Component(this.size.x, 20, "blue", 0, this.size.y - 20, true);
        // this.ground.name = "Ground";
        // this.ground.friction = .2;
        this.run = false;

        this.ground = new ComponentNew({x: this.size.x, y: 20}, {x: 0, y: this.size.y - 20}, true, this);
        this.ground.image = new Image();
        this.ground.image.src = "assets/grass.png";
        this.ground.image.addEventListener('load', () => {
            // execute drawImage statements here
            this.ground.draw();
        }, false);
        this.ground.patternDirection = "repeat-x";
        this.ground.name = "Ground";
        this.ground.friction = .3;

        this.slingshot = new ComponentNew({x: 60, y: 70}, {x: 40, y: this.size.y - 50}, true, this);
        this.slingshot.image = new Image();
        this.slingshot.image.src = "assets/slingshot_new.png";
        this.slingshot.image.addEventListener('load', () => {
            // execute drawImage statements here
            this.slingshot.draw();
        }, false);

        let projectile = new ComponentNew({x: 30, y: 30}, {x: 30, y: this.size.y - 60}, false, this);
        projectile.name = "Projectile";
        projectile.image = new Image();
        projectile.image.addEventListener('load', function () {
            // execute drawImage statements here
            projectile.draw();
        }, false);
        projectile.mass = .58;
        projectile.size = { x: 20, y: 20 };
        projectile.image.src = "assets/tennis.png";

        this.components.push(projectile);
        this.projectile = this.components[this.components.length - 1];

        this.draw();
        // console.log(this.singleFrameTime);
    }

    getForceInput() {
        let fInput = document.getElementById("force");
        let angleInput = document.getElementById("angle");
        let f = parseInt(fInput.value);
        // Multiply by 0.0174533 (pi / 180) to convery to radians for use in Math.cos and Math.sin
        let angle = parseInt(angleInput.value) * 0.0174533;

        let xF = Math.cos(angle) * f;
        let yF = Math.sin(angle) * f;
        if (isNaN(xF) || isNaN(yF)) {
            console.error("Force was computed as NaN")
        }
        return { x: xF, y: -yF, magnitude: f};
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start() {
        this.run = true;
        this.interval = setInterval(() => { this.update(); this.draw(); }, 20);
    }

    reset() {
        if (this.run) {
            clearInterval(this.interval);
            this.run = false;
        }
        // game.projectile.x = 30;
        // game.projectile.y = game.size.y - 60;
        this.projectile.position ={...this.projectile_starting_pos};
        this.projectile.velocity = { x: 0, y: 0 };
        this.projectile.acceleration = {x: 0, y: 0};
        this.draw();
    }

    applyGravity() {
        for (let x in this.Components) {
            let c = this.Components[x];
        }
    }

    // Checks for collision between two objects. Returns true if colliding
    checkCollision(a, b) {
        if (a.position.x <= b.position.x + b.size.x &&
            a.position.x + a.size.x >= b.position.x &&
            a.position.y <= b.position.y + b.size.y &&
            a.position.y + a.size.y >= b.position.y) {
            return true;
        }
        return false;
    }

    async update() {
        for(let i in this.components) {
            let obj = this.components[i];
            let gravity = {x: 0, y: this.gravity * obj.mass * this.singleFrameTime}
            let drag = { x: -.001 * (obj.velocity.x ** 2) * this.singleFrameTime, y: 0}

            await obj.applyForce(gravity)
            await obj.applyForce(drag)

            if (this.checkCollision(obj, this.ground)) {
                obj.velocity.y = .6 * -obj.velocity.y;
                if (Math.abs(obj.velocity.y) < .2) {
                    obj.velocity.y = 0;
                    obj.position.y = this.ground.position.y - obj.size.y;
                }
                let dir = (obj.velocity.x < 0) ? 1 : -1;
                if (obj.velocity.x != 0) {
                    obj.velocity.x += this.ground.friction * dir;
                    if (Math.abs(obj.velocity.x) < .1)
                        obj.velocity.x = 0;
                }
            }

            await obj.update();

            this.draw();
        }
    }

    draw() {
        if (!this.run)
            clearInterval(this.interval);
        this.clear();
        this.context.fillStyle = "#ace5fa";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.slingshot.draw();
        this.ground.draw();

        for (let i in this.components) {
            this.components[i].draw();
        }

        // Draw the grid if it is on
        let gridSize = 40;
        let cols = this.canvas.width / gridSize;
        let rows = this.canvas.height / gridSize
        // console.log(cols, rows)
        if(this.gridOn) {
            for(let i = 0; i < cols; i++) {
                for(let j = 0; j < rows; j++) {
                    this.context.drawImage(this.gridLine, i * gridSize, j * gridSize, gridSize, gridSize);
                }
            }
        }
    }
}
















class ComponentNew {
    constructor(size, pos, static_object, game) {
        if (game == undefined) {
            console.error("Component was initiated without reference to a game");
            return;
        }

        this.name = "No Name";
        this.size = size;
        this.position = pos;
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.mass = 10;
        this.game = game;
        this.static = static_object;

        this.context = game.context;
    }

    applyForce(force) {
        this.acceleration.x += force.x / this.mass;
        this.acceleration.y += force.y / this.mass;
    }

    update() {
        // console.log(this)
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        // console.log(this.velocity)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    draw() {
        if (this.image != undefined) {
            if (this.patternDirection != undefined) {
                let start = this.position.x;
                let step = 70;
                for (let i = 0; i < Math.ceil(this.size.x / 20); i++) {
                    this.context.drawImage(this.image, start, this.position.y - 45, step, this.size.y + 80);
                    start += step - 20;
                }
            } else {
                this.context.drawImage(this.image, this.position.x - this.size.x / 2, this.position.y - this.size.y / 2, this.size.x, this.size.y);
            }
        } else {
            this.context.fillStyle = color;
            this.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }
    }
}