/**
 * @file This file contains the Physics class for the Starship Simulation game.
 * @author Gemini
 */

import * as constants from './constants.js';

/**
 * Represents the physics engine of the game.
 */
export default class Physics {
    /**
     * Creates a new Physics object.
     * @param {p5} p - The p5.js instance.
     */
    constructor(p) {
        this.p = p;
    }

    /**
     * Updates the physics of the game.
     * @param {Rocket} rocket - The rocket object.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     * @param {string} gameState - The current game state.
     */
    update(rocket, booster, starship, gameState) {
        switch (gameState) {
            case 'IN_FLIGHT_STAGE1':
                this.updateStackPhysics(rocket, booster, starship);
                break;
            case 'IN_FLIGHT_STAGE2':
                this.updateStarshipPhysics(starship);
                this.updateBoosterPhysics(booster);
                gameState = this.checkStarshipCollisionsAndState(starship, gameState);
                this.checkBoosterCrash(booster);
                break;
            case 'OUT_OF_FUEL_S1':
                this.updateStackPhysics(rocket, booster, starship);
                break;
            case 'OUT_OF_FUEL_S2':
                this.updateStarshipPhysics(starship);
                this.updateBoosterPhysics(booster);
                gameState = this.checkStarshipCollisionsAndState(starship, gameState);
                this.checkBoosterCrash(booster);
                break;
        }
        return gameState;
    }

    /**
     * Updates the physics of the rocket stack (booster and starship attached).
     * @param {Rocket} rocket - The rocket object.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     */
    updateStackPhysics(rocket, booster, starship) {
        if (!booster.attached) return;

        // Apply gravity
        booster.acc.set(0, constants.GRAVITY);

        // Apply thrust if the booster is thrusting and has fuel
        if (booster.isThrusting && booster.fuel > 0) {
            let thrustVector = this.p.constructor.Vector.fromAngle(booster.angle).mult(constants.BOOSTER_THRUST_FORCE);
            booster.acc.add(thrustVector);
        }

        // Update the booster's position and velocity
        booster.update();

        // Update the starship's position and velocity to match the booster
        starship.pos.set(booster.pos.x, booster.pos.y - booster.height / 2 - starship.height / 2);
        starship.vel.set(booster.vel);
        starship.acc.set(booster.acc);
        starship.angle = booster.angle;
    }

    /**
     * Updates the physics of the starship after separation.
     * @param {Starship} starship - The starship object.
     */
    updateStarshipPhysics(starship) {
        // Apply gravity
        starship.acc.set(0, constants.GRAVITY);

        // Apply thrust if the starship is thrusting and has fuel
        if (starship.isThrusting && starship.fuel > 0) {
            let thrustVector = this.p.constructor.Vector.fromAngle(starship.angle).mult(constants.STARSHIP_THRUST_FORCE);
            starship.acc.add(thrustVector);
        }

        // Update the starship's position and velocity
        starship.update();
    }

    /**
     * Updates the physics of the booster after separation.
     * @param {Booster} booster - The booster object.
     */
    updateBoosterPhysics(booster) {
        if (booster.attached || !booster.visible || booster.crashed) return;

        // Apply gravity
        booster.acc.set(0, constants.GRAVITY);

        // Update the booster's position and velocity
        booster.update();
    }

    /**
     * Checks for collisions between the starship and the ground.
     * @param {Starship} starship - The starship object.
     * @param {string} gameState - The current game state.
     * @returns {string} The new game state.
     */
    checkStarshipCollisionsAndState(starship, gameState) {
        if (starship.pos.y > this.p.height - constants.GROUND_HEIGHT) {
            // Check for crash conditions
            if (starship.vel.y > constants.MAX_LANDING_SPEED_V || Math.abs(starship.vel.x) > constants.MAX_LANDING_SPEED_H || Math.abs(starship.angle + this.p.PI / 2) > constants.MAX_LANDING_ANGLE) {
                starship.crashed = true;
                return 'CRASHED';
            } else {
                // Landed safely
                starship.vel.mult(0);
                starship.acc.mult(0);
                return 'LANDED';
            }
        }
        return gameState;
    }

    /**
     * Checks if the booster has crashed.
     * @param {Booster} booster - The booster object.
     */
    checkBoosterCrash(booster) {
        if (booster.pos.y > this.p.height - constants.GROUND_HEIGHT) {
            booster.crashed = true;
        }
    }
}
