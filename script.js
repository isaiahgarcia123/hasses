const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let obstacles;
let gravity = 0.6;
let gameSpeed;
let spawnRate;
let frame = 0;
let running = false;

class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.x = 150;
        this.y = canvas.height - this.height;
        this.velocity = 0;
    }

    update() {
        this.velocity += gravity;
        this.y += this.velocity;

        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
    }

    jump() {
        if (this.y >= canvas.height - this.height) {
            this.velocity = -12;
        }
    }

    draw() {
        ctx.fillStyle = "#00c3ff";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Obstacle {
    constructor() {
        this.width = 50;
        this.height = Math.random() * 200 + 100;
        this.x = canvas.width;
        this.y = canvas.height - this.height;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw() {
        ctx.fillStyle = "#ff4d4d";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function startGame(level) {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    player = new Player();
    obstacles = [];
    frame = 0;
    running = true;

    // Level difficulty
    gameSpeed = 5 + level * 2;
    spawnRate = 120 - level * 20;

    requestAnimationFrame(update);
}

function update() {
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();
    player.draw();

    frame++;

    if (frame % spawnRate === 0) {
        obstacles.push(new Obstacle());
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        obstacle.draw();

        // Collision
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            running = false;
            alert("Game Over!");
            location.reload();
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.jump();
    }
});

window.addEventListener("click", () => {
    player.jump();
});
