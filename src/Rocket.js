import Vehicle from './Vehicle.js';

export default class Rocket extends Vehicle {
    constructor(x, y, mass) {
        super(x, y, mass);
    }

    render(ctx) {
        // Draw the booster
        ctx.fillStyle = '#D3D3D3'; // Light gray
        ctx.fillRect(this.x - 10, this.y - 40, 20, 50);

        // Draw the starship
        ctx.fillStyle = '#A9A9A9'; // Dark gray
        ctx.fillRect(this.x - 10, this.y - 80, 20, 40);
    }
}