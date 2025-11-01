/**
 * @file This file contains the Rocket class for the Starship Simulation game.
 * @author Gemini
 */

import Booster from './Booster.js';
import Starship from './Starship.js';
import * as constants from './constants.js';

/**
 * Represents the entire rocket, including the booster and the starship.
 */
export default class Rocket {
    /**
     * Creates a new Rocket object.
     * @param {p5} p - The p5.js instance.
     * @param {number} x - The initial x-position of the rocket.
     * @param {number} y - The initial y-position of the rocket.
     */
    constructor(p, x, y) {
        this.p = p;
        this.booster = new Booster(p, x, y);
        this.starship = new Starship(p, x, y - this.booster.height / 2 - constants.STARSHIP_HEIGHT / 2);
    }

    /**
     * Renders the rocket.
     */
    render() {
        this.booster.render();
        this.starship.render();
    }

    /**
     * Separates the starship from the booster.
     * @returns {{booster: Booster, starship: Starship}} - The booster and starship objects.
     */
    separate() {
        this.booster.attached = false;
        return { booster: this.booster, starship: this.starship };
    }
}
