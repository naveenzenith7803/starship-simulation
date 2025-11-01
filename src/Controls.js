/**
 * @file This file contains the Controls class for the Starship Simulation game.
 * @author Gemini
 */

import * as constants from './constants.js';

/**
 * Represents the controls of the game.
 */
export default class Controls {
    /**
     * Creates a new Controls object.
     * @param {p5} p - The p5.js instance.
     */
    constructor(p) {
        this.p = p;
    }

    /**
     * Updates the controls of the game.
     * @param {Rocket} rocket - The rocket object.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     * @param {string} gameState - The current game state.
     * @returns {string} The new game state.
     */
    update(rocket, booster, starship, gameState) {
        // Reset the thrust and rotation flags
        booster.isThrusting = false;
        starship.isThrusting = false;
        starship.isRotatingLeft = false;
        starship.isRotatingRight = false;

        // Separate the stages if the 'S' key is pressed
        if (this.p.keyIsDown(83) && booster.attached && (gameState === 'IN_FLIGHT_STAGE1' || gameState === 'OUT_OF_FUEL_S1')) {
            rocket.separate();
            return 'IN_FLIGHT_STAGE2';
        }

        // Toggle the autopilot if the 'P' key is pressed
        if (this.p.keyIsDown(80) && !booster.attached && (gameState === 'IN_FLIGHT_STAGE2' || gameState === 'OUT_OF_FUEL_S2')) {
            starship.isAutopilotActive = !starship.isAutopilotActive;
        }

        // Control the booster if it is attached
        if (booster.attached && (gameState === 'IN_FLIGHT_STAGE1')) {
            if (booster.fuel > 0) {
                if (this.p.keyIsDown(this.p.UP_ARROW) || this.p.keyIsDown(87)) {
                    booster.isThrusting = true;
                    booster.fuel -= constants.BOOSTER_FUEL_CONSUMPTION_MAIN;
                }
                if (this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65)) {
                    booster.angle -= constants.BOOSTER_ROTATION_SPEED;
                    booster.fuel -= constants.BOOSTER_FUEL_CONSUMPTION_RCS;
                }
                if (this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68)) {
                    booster.angle += constants.BOOSTER_ROTATION_SPEED;
                    booster.fuel -= constants.BOOSTER_FUEL_CONSUMPTION_RCS;
                }
            }
        } else if (!booster.attached && (gameState === 'IN_FLIGHT_STAGE2') && !starship.isAutopilotActive) {
            // Control the starship if the booster is detached and the autopilot is not active
            if (starship.fuel > 0) {
                if (this.p.keyIsDown(this.p.UP_ARROW) || this.p.keyIsDown(87)) {
                    starship.isThrusting = true;
                    starship.fuel -= constants.STARSHIP_FUEL_CONSUMPTION_MAIN;
                }
                if (this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65)) {
                    starship.isRotatingLeft = true;
                    starship.angle -= constants.STARSHIP_ROTATION_SPEED;
                    starship.fuel -= constants.STARSHIP_FUEL_CONSUMPTION_RCS;
                }
                if (this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68)) {
                    starship.isRotatingRight = true;
                    starship.angle += constants.STARSHIP_ROTATION_SPEED;
                    starship.fuel -= constants.STARSHIP_FUEL_CONSUMPTION_RCS;
                }
            }
        }

        return gameState;
    }
}
