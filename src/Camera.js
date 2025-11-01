/**
 * @file This file contains the Camera class for the Starship Simulation game.
 * @author Gemini
 */

import { MIN_ZOOM, MAX_ZOOM, ZOOM_SENSITIVITY } from './constants.js';

/**
 * Represents the camera of the game.
 */
export default class Camera {
    /**
     * Creates a new Camera object.
     * @param {p5} p - The p5.js instance.
     * @param {Vehicle} focusObject - The object that the camera is focused on.
     */
    constructor(p, focusObject) {
        this.p = p;
        this.focusObject = focusObject;
        this.zoom = 1.0;

        // Add a mouse wheel event listener to control the zoom
        this.p.mouseWheel = (event) => {
            let zoomAmount = 1.0 - event.delta * ZOOM_SENSITIVITY;
            this.zoom *= zoomAmount;
            this.zoom = this.p.constrain(this.zoom, MIN_ZOOM, MAX_ZOOM);
            return false; // Prevent the page from scrolling
        };
    }

    /**
     * Applies the camera transformations.
     */
    apply() {
        // Translate the canvas to the center of the screen
        this.p.translate(this.p.width / 2, this.p.height * 0.75);
        // Scale the canvas to the zoom level
        this.p.scale(this.zoom);
        // Translate the canvas to the focus object's position
        this.p.translate(-this.focusObject.pos.x, -this.focusObject.pos.y);
    }
}
