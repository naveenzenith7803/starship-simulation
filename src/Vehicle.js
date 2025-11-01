/**
 * @file This file contains the base Vehicle class for the Starship Simulation game.
 * @author Gemini
 */

import Particle from './Particle.js';
import * as constants from './constants.js';

/**
 * Represents a vehicle in the game.
 * This is a base class that is extended by the Booster and Starship classes.
 */
export default class Vehicle {
    /**
     * Creates a new Vehicle object.
     * @param {p5} p - The p5.js instance.
     * @param {number} x - The initial x-position of the vehicle.
     * @param {number} y - The initial y-position of the vehicle.
     * @param {number} mass - The mass of the vehicle.
     * @param {number} fuel - The initial amount of fuel.
     * @param {number} width - The width of the vehicle.
     * @param {number} height - The height of the vehicle.
     */
    constructor(p, x, y, mass, fuel, width, height) {
        this.p = p;
        this.pos = p.createVector(x, y);
        this.vel = p.createVector(0, 0);
        this.acc = p.createVector(0, 0);
        this.mass = mass;
        this.fuel = fuel;
        this.width = width;
        this.height = height;
        this.angle = -p.PI / 2; // Pointing up
        this.isThrusting = false;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.crashed = false;
        this.particles = [];
    }

    /**
     * Applies a force to the vehicle.
     * @param {p5.Vector} force - The force to apply.
     */
    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    /**
     * Updates the vehicle's position and velocity.
     * Also creates particles if the vehicle is thrusting.
     */
    update() {
        // Update velocity and position
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Create particles if thrusting
        if (this.isThrusting) {
            for (let i = 0; i < 5; i++) {
                let p = new Particle(
                    this.p,
                    this.pos.x,
                    this.pos.y + this.height / 2,
                    this.p.random(-5, 5),
                    this.p.random(5, 10),
                    this.p.random(2, 8),
                    1
                );
                this.particles.push(p);
            }
        }

        // Update and remove dead particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].lifetime <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Renders the particles.
     */
    renderParticles() {
        for (let particle of this.particles) {
            particle.render();
        }
    }

    /**
     * Renders the RCS thrusters.
     */
    renderRCS() {
        if (this.isRotatingLeft) {
            this.p.fill(255, 165, 0);
            this.p.noStroke();
            this.p.rect(this.width / 2, -this.height / 4, constants.RCS_THRUSTER_LENGTH, constants.RCS_THRUSTER_WIDTH);
            this.p.rect(-this.width / 2, this.height / 4, -constants.RCS_THRUSTER_LENGTH, -constants.RCS_THRUSTER_WIDTH);
        }
        if (this.isRotatingRight) {
            this.p.fill(255, 165, 0);
            this.p.noStroke();
            this.p.rect(-this.width / 2, -this.height / 4, -constants.RCS_THRUSTER_LENGTH, constants.RCS_THRUSTER_WIDTH);
            this.p.rect(this.width / 2, this.height / 4, constants.RCS_THRUSTER_LENGTH, -constants.RCS_THRUSTER_WIDTH);
        }
    }

    /**
     * Renders the vehicle.
     * This method is intended to be overridden by subclasses.
     */
    render() {
        // To be implemented by subclasses
    }
}
