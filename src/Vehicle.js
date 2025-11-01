export default class Vehicle {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.mass = mass;
        this.thrust = 0;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    render(ctx) {
        // Placeholder rendering
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 20, 50);
    }
}