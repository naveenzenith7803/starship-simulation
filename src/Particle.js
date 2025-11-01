/**
 * @file This file contains the Particle class for the Starship Simulation game.
 * @author Gemini
 */

/**
 * Represents a particle in the game.
 * Particles are used to create the fire and smoke effects.
 */
export default class Particle {
    /**
     * Creates a new Particle object.
     * @param {p5} p - The p5.js instance.
     * @param {number} x - The initial x-position of the particle.
     * @param {number} y - The initial y-position of the particle.
     * @param {number} vx - The initial x-velocity of the particle.
     * @param {number} vy - The initial y-velocity of the particle.
     * @param {number} size - The size of the particle.
     * @param {number} lifetime - The lifetime of the particle.
     */
    constructor(p, x, y, vx, vy, size, lifetime) {
        this.p = p;
        this.pos = p.createVector(x, y);
        this.vel = p.createVector(vx, vy);
        this.size = size;
        this.lifetime = lifetime;
        this.color = p.color(255, this.p.random(100, 200), 0, 190);
    }

    /**
     * Updates the particle's position and lifetime.
     */
    update() {
        this.pos.add(this.vel);
        this.lifetime -= 0.05;
    }

    /**
     * Renders the particle.
     */
    render() {
        this.p.noStroke();
        this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifetime * 255);
        this.p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
}
