/**
 * @file This file contains the Booster class for the Starship Simulation game.
 * @author Gemini
 */

import Vehicle from './Vehicle.js';
import * as constants from './constants.js';

/**
 * Represents the booster of the rocket.
 */
export default class Booster extends Vehicle {
    /**
     * Creates a new Booster object.
     * @param {p5} p - The p5.js instance.
     * @param {number} x - The initial x-position of the booster.
     * @param {number} y - The initial y-position of the booster.
     */
    constructor(p, x, y) {
        super(p, x, y, 0, constants.BOOSTER_START_FUEL, constants.BOOSTER_WIDTH, constants.BOOSTER_HEIGHT);
        this.attached = true;
        this.visible = true;
    }

    /**
     * Runs the AI for the booster.
     * The AI tries to land the booster on the landing pad.
     * @param {object} landingPad - The landing pad object.
     */
    runAI(landingPad) {
        // If the booster is out of fuel or has crashed, do nothing
        if (this.fuel <= 0 || this.crashed) {
            return;
        }

        // Reset the thrust and rotation
        this.isThrusting = false;

        // AI parameters
        let targetX = landingPad.x;
        let targetY_Ground = this.p.height - constants.GROUND_HEIGHT;
        let strictVerticalAngle = -this.p.PI / 2;

        // Calculate the altitude and horizontal error
        let altitude = Math.max(0, targetY_Ground - this.pos.y);
        let horizontalError = targetX - this.pos.x;

        // Calculate the angle error
        let angleErrorRaw = strictVerticalAngle - this.angle;
        let angleError = this.p.atan2(this.p.sin(angleErrorRaw), this.p.cos(angleErrorRaw));

        // Calculate the target angle
        let targetAngle = strictVerticalAngle;
        let desiredTilt = this.p.constrain(
            horizontalError * 0.01,
            -constants.AUTOPILOT_MAX_TILT,
            constants.AUTOPILOT_MAX_TILT
        );
        targetAngle += desiredTilt;

        // Calculate the rotation error
        let rotationTargetErrorRaw = targetAngle - this.angle;
        let rotationTargetError = this.p.atan2(this.p.sin(rotationTargetErrorRaw), this.p.cos(rotationTargetErrorRaw));

        // Rotate the booster if necessary
        if (Math.abs(rotationTargetError) > constants.AUTOPILOT_ANGLE_TOLERANCE && this.fuel > 0) {
            if (rotationTargetError < 0) {
                this.angle -= constants.BOOSTER_ROTATION_SPEED;
            } else {
                this.angle += constants.BOOSTER_ROTATION_SPEED;
            }
        }

        // Calculate the target vertical speed
        let targetVSpeed = -1;
        if (altitude < 200) {
            targetVSpeed = -0.5;
        }

        // Check if the booster needs to apply thrust
        let needsUpwardForce = false;
        if (this.vel.y > -targetVSpeed) {
            needsUpwardForce = true;
        }

        // Apply thrust if the angle is okay
        let isAngleOkayForThrust = Math.abs(angleError) < constants.AUTOPILOT_MAX_TILT * 1.15;
        if (needsUpwardForce && isAngleOkayForThrust && this.fuel > 0) {
            this.isThrusting = true;
        }
    }

    /**
     * Renders the booster.
     */
    render() {
        // If the booster is not visible, do nothing
        if (!this.visible) return;

        // Render the particles
        this.renderParticles();

        // Apply transformations
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.rotate(this.angle + this.p.PI / 2);

        // Render the RCS thrusters
        this.renderRCS();

        // Render the booster body
        this.p.fill(160, 160, 170);
        this.p.noStroke();
        this.p.rect(0, 0, this.width, this.height);

        // Render the top of the booster
        this.p.fill(175, 175, 185);
        this.p.rect(0, -this.height / 2 - 5, this.width * 0.9, 10);

        // If the booster has crashed, draw a semi-transparent overlay
        if (this.crashed) {
            this.p.fill(80, 80, 90, 150);
            this.p.rect(0, 0, this.width, this.height);
        }

        // Restore the p5.js state
        this.p.pop();
    }
}
