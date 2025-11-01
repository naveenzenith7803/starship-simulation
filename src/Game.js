/**
 * @file This file contains the main game logic for the Starship Simulation game.
 * @author Gemini
 */

import * as constants from './constants.js';
import Camera from './Camera.js';
import UI from './UI.js';
import Rocket from './Rocket.js';
import Physics from './Physics.js';
import Controls from './Controls.js';

/**
 * The main p5.js sketch function.
 * @param {p5} p - The p5.js instance.
 */
const sketch = (p) => {
    // Game objects
    let camera;
    let ui;
    let rocket;
    let physics;
    let controls;

    // World objects
    let landingPad;
    let horizontalLimits;

    // Game state
    let gameState;
    let focusObject;

    /**
     * Resets the game to its initial state.
     */
    const resetGame = () => {
        // Create the landing pad
        landingPad = {
            x: p.width / 2,
            y: p.height - constants.GROUND_HEIGHT + constants.LANDING_PAD_HEIGHT / 2,
            w: constants.LANDING_PAD_WIDTH,
            h: constants.LANDING_PAD_HEIGHT
        };

        // Set the horizontal limits for the world
        horizontalLimits = {
            left: landingPad.x - p.width * constants.HORIZONTAL_LIMIT_FACTOR,
            right: landingPad.x + p.width * constants.HORIZONTAL_LIMIT_FACTOR
        };

        // Create the rocket
        rocket = new Rocket(p, landingPad.x, p.height - constants.GROUND_HEIGHT - constants.BOOSTER_HEIGHT / 2);

        // Set the initial game state
        gameState = 'PRE_LAUNCH';

        // Set the initial focus object for the camera
        focusObject = rocket.booster;
    };

    /**
     * The p5.js setup function. This function is called once when the program starts.
     */
    p.setup = () => {
        // Create the canvas
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('canvas-container');

        // Set p5.js modes
        p.angleMode(p.RADIANS);
        p.rectMode(p.CENTER);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);

        // Reset the game
        resetGame();

        // Create the game objects
        camera = new Camera(p, focusObject);
        ui = new UI(p, landingPad, horizontalLimits);
        physics = new Physics(p);
        controls = new Controls(p);
    };

    /**
     * The p5.js draw function. This function is called repeatedly and is used to draw the game.
     */
    p.draw = () => {
        // Set the background color
        p.background(10, 20, 40);

        // Update the game state
        if (gameState === 'PRE_LAUNCH') {
            // If the game is in the pre-launch state, wait for the spacebar to be pressed
            if (p.keyIsDown(32)) { // Spacebar
                gameState = 'IN_FLIGHT_STAGE1';
                rocket.booster.vel.y = constants.INITIAL_LAUNCH_KICK;
            }
        } else {
            // If the game is in flight, update the controls and physics
            if (rocket.starship.isAutopilotActive) {
                rocket.starship.runAutopilot(landingPad);
            } else {
                gameState = controls.update(rocket, rocket.booster, rocket.starship, gameState);
            }

            // If the booster is detached, run the booster AI
            if (!rocket.booster.attached) {
                rocket.booster.runAI(landingPad);
                focusObject = rocket.starship;
            }

            // Update the physics
            gameState = physics.update(rocket, rocket.booster, rocket.starship, gameState);
        }

        // Update the camera's focus object
        camera.focusObject = focusObject;

        // Apply the camera transformations
        p.push();
        camera.apply();

        // Draw the UI
        ui.draw(focusObject, rocket.booster, rocket.starship, gameState);

        // Draw the rocket
        rocket.render();

        // Restore the p5.js state
        p.pop();
    };

    /**
     * The p5.js windowResized function. This function is called whenever the window is resized.
     */
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        resetGame();
        ui.generateStars();
    };
};

// Create a new p5.js instance
new p5(sketch);
