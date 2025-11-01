import Camera from './Camera.js';
import PhysicsEngine from './PhysicsEngine.js';
import Rocket from './Rocket.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        this.camera = new Camera(this);
        this.physicsEngine = new PhysicsEngine();

        // World coordinates: Y=0 is the ground, rocket starts slightly above.
        this.rocket = new Rocket(0, 100, 1000);

        this.keys = {};
        this.setupInput();

        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        this.gameLoop();
    }

    setupInput() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update(dt) {
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.rocket.thrust = 20000; // Apply thrust
        } else {
            this.rocket.thrust = 0;
        }

        this.physicsEngine.applyGravity(this.rocket, dt);
        this.physicsEngine.applyThrust(this.rocket, dt);
        this.rocket.update(dt);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        // Y-up coordinate system: translate to bottom-center of canvas
        this.ctx.translate(this.canvas.width / 2, this.canvas.height);
        this.ctx.scale(1, -1); // Flip the y-axis

        // Camera follows the rocket
        this.ctx.translate(-this.rocket.x, -this.rocket.y);

        // --- Render world objects in world coordinates ---

        // Draw sky
        this.ctx.fillStyle = '#000020'; // Dark blue space
        this.ctx.fillRect(-this.canvas.width*10, 0, this.canvas.width*20, 100000);

        // Draw ground
        this.ctx.fillStyle = '#228B22'; // Forest green
        this.ctx.fillRect(-this.canvas.width*10, -100, this.canvas.width*20, 100);

        // Draw launch tower
        this.ctx.fillStyle = '#808080'; // Gray
        this.ctx.fillRect(-25, 0, 50, 200);

        this.rocket.render(this.ctx);

        this.ctx.restore();
    }

    gameLoop(timestamp) {
        if (!this.lastTime) {
            this.lastTime = timestamp;
        }
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.gameLoop);
    }
}

new Game();