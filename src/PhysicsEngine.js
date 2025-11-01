export default class PhysicsEngine {
    constructor() {
        // Y+ is up, so gravity is a downward (negative) acceleration.
        this.gravity = 9.81; // m/s^2
    }

    applyGravity(vehicle, dt) {
        // Decrease vy due to gravity
        vehicle.vy -= this.gravity * dt;
    }

    applyThrust(vehicle, dt) {
        // Increase vy due to thrust. F = ma => a = F/m
        const acceleration = vehicle.thrust / vehicle.mass;
        vehicle.vx += Math.sin(vehicle.angle) * acceleration * dt;
        vehicle.vy += Math.cos(vehicle.angle) * acceleration * dt;
    }
}