/**
 * @file This file contains the Starship class for the Starship Simulation game.
 * @author Gemini
 */

import Vehicle from './Vehicle.js';
import * as constants from './constants.js';

/**
 * Represents the starship of the rocket.
 */
export default class Starship extends Vehicle {
    /**
     * Creates a new Starship object.
     * @param {p5} p - The p5.js instance.
     * @param {number} x - The initial x-position of the starship.
     * @param {number} y - The initial y-position of the starship.
     */
    constructor(p, x, y) {
        super(p, x, y, 0, constants.STARSHIP_START_FUEL, constants.STARSHIP_WIDTH, constants.STARSHIP_HEIGHT);
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.isAutopilotActive = false;
    }

    /**
     * Runs the autopilot for the starship.
     * The autopilot tries to land the starship on the landing pad.
     * @param {object} landingPad - The landing pad object.
     */
    runAutopilot(landingPad) {
        // If the starship is out of fuel or has crashed, do nothing
        if (this.fuel <= 0 || this.crashed) {
            this.isAutopilotActive = false;
            return;
        }

        // Reset the thrust and rotation
        this.isThrusting = false;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;

        // Autopilot parameters
        let targetX = landingPad.x;
        let targetY_Ground = this.p.height - constants.GROUND_HEIGHT;
        let strictVerticalAngle = -this.p.PI / 2;

        // Calculate the altitude and check if it is in the final approach phase
        let altitude = Math.max(0, targetY_Ground - this.pos.y);
        let isFinalApproach = altitude < constants.AUTOPILOT_FINAL_APPROACH_ALTITUDE;

        // Calculate the horizontal error and velocity error
        let horizontalError = targetX - this.pos.x;
        let horizontalVelError = 0 - this.vel.x;

        // Calculate the angle error
        let angleErrorRaw = strictVerticalAngle - this.angle;
        let angleError = this.p.atan2(this.p.sin(angleErrorRaw), this.p.cos(angleErrorRaw));

        // Calculate the target angle
        let targetAngle;
        let currentRotationGain = constants.AUTOPILOT_ROTATION_P_GAIN;
        let maxTiltAllowed = constants.AUTOPILOT_MAX_TILT;

        if (isFinalApproach) {
            // Final approach logic
            targetAngle = strictVerticalAngle;
            let dampingTilt = this.p.constrain(
                horizontalVelError * constants.AUTOPILOT_HORIZONTAL_D_GAIN * 0.8,
                -constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT,
                constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT
            );
            targetAngle += dampingTilt;

            if (Math.abs(horizontalError) > constants.AUTOPILOT_POS_TOLERANCE * 1.5 && Math.abs(angleError) < constants.AUTOPILOT_MAX_TILT * 0.6) {
                let smallPositionalTilt = this.p.constrain(
                    horizontalError * constants.AUTOPILOT_HORIZONTAL_P_GAIN * 0.05,
                    -constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT * 1.2,
                    constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT * 1.2
                );
                targetAngle += smallPositionalTilt;
            }

            targetAngle = this.p.constrain(targetAngle, strictVerticalAngle - constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT, strictVerticalAngle + constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT);
            currentRotationGain = constants.AUTOPILOT_FINAL_APPROACH_ROTATION_GAIN;
            maxTiltAllowed = constants.AUTOPILOT_FINAL_APPROACH_MAX_TILT;
        } else {
            // Normal flight logic
            let desiredTilt = this.p.constrain(
                horizontalError * constants.AUTOPILOT_HORIZONTAL_P_GAIN + horizontalVelError * constants.AUTOPILOT_HORIZONTAL_D_GAIN,
                -constants.AUTOPILOT_MAX_TILT,
                constants.AUTOPILOT_MAX_TILT
            );
            targetAngle = strictVerticalAngle + desiredTilt;
        }

        // Calculate the rotation error
        let rotationTargetErrorRaw = targetAngle - this.angle;
        let rotationTargetError = this.p.atan2(this.p.sin(rotationTargetErrorRaw), this.p.cos(rotationTargetErrorRaw));

        // Rotate the starship if necessary
        if (Math.abs(rotationTargetError) > (isFinalApproach ? constants.AUTOPILOT_FINAL_APPROACH_ANGLE_TOLERANCE : constants.AUTOPILOT_ANGLE_TOLERANCE) && this.fuel > 0) {
            if (rotationTargetError * currentRotationGain < 0) {
                this.isRotatingLeft = true;
            } else if (rotationTargetError * currentRotationGain > 0) {
                this.isRotatingRight = true;
            }
        }

        // Calculate the target vertical speed
        let targetVSpeed;
        if (altitude > constants.AUTOPILOT_VERTICAL_BRAKE_ALTITUDE) {
            targetVSpeed = constants.AUTOPILOT_VERTICAL_TARGET_SPEED_HIGH;
        } else if (altitude > 50) {
            targetVSpeed = this.p.map(altitude, 50, constants.AUTOPILOT_VERTICAL_BRAKE_ALTITUDE, -0.5, constants.AUTOPILOT_VERTICAL_TARGET_SPEED_HIGH);
        } else {
            targetVSpeed = -0.5;
        }

        // Check if the starship needs to apply thrust
        let needsUpwardForce = false;
        if (this.vel.y > -targetVSpeed + 0.1) {
            needsUpwardForce = true;
        }
        if (altitude < 50 && this.vel.y > constants.MAX_LANDING_SPEED_V * 1.0) {
            needsUpwardForce = true;
        }
        if (altitude < constants.AUTOPILOT_FINAL_APPROACH_ALTITUDE && this.vel.y > -targetVSpeed + 0.05) {
            needsUpwardForce = true;
        }
        if (this.vel.y < -targetVSpeed - 0.5) {
            needsUpwardForce = false;
        }

        // Correct for nose-down attitude
        let isPointingDown = this.angle > (strictVerticalAngle + constants.AUTOPILOT_NOSE_DOWN_CORRECTION_ANGLE);
        let isMovingUp = this.vel.y < constants.AUTOPILOT_NOSE_DOWN_CORRECTION_VEL_Y;
        if (isPointingDown && isMovingUp && this.fuel > 0) {
            needsUpwardForce = true;
        }

        // Apply thrust if the angle is okay
        let isAngleOkayForThrust = Math.abs(angleError) < maxTiltAllowed * 1.15;
        if (needsUpwardForce && isAngleOkayForThrust && this.fuel > 0) {
            this.isThrusting = true;
        }
    }

    /**
     * Renders the starship.
     */
    render() {
        // Render the particles
        this.renderParticles();

        // Apply transformations
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.rotate(this.angle + this.p.PI / 2);

        // Render the RCS thrusters
        this.renderRCS();

        // Render the starship body
        this.p.fill(200, 200, 210);
        this.p.noStroke();
        this.p.rect(0, 0, this.width, this.height);

        // Render the nose cone
        this.p.fill(220, 220, 230);
        this.p.triangle(
            -this.width / 2, -this.height / 2,
            this.width / 2, -this.height / 2,
            0, -this.height / 2 - this.width * 0.8
        );

        // Render the fins
        this.p.fill(180, 180, 190);
        if (this.boosterAttached) {
            this.p.rect(0, this.height / 2, this.width * 1.1, 5);
        } else {
            let finBaseY = this.height * 0.3;
            let finTipY = this.height / 2 + 5;
            let finOuterX = this.width * 1.2;
            this.p.triangle(-this.width / 2, finBaseY, -this.width / 2, this.height / 2, -finOuterX, finTipY);
            this.p.triangle(this.width / 2, finBaseY, this.width / 2, this.height / 2, finOuterX, finTipY);
        }

        // If the starship has crashed, draw a semi-transparent overlay
        if (this.crashed) {
            this.p.fill(80, 80, 90, 150);
            this.p.rect(0, 0, this.width, this.height);
            this.p.triangle(
                -this.width / 2, -this.height / 2,
                this.width / 2, -this.height / 2,
                0, -this.height / 2 - this.width * 0.8
            );
        }

        // Restore the p5.js state
        this.p.pop();
    }
}
