/**
 * @file This file contains the UI class for the Starship Simulation game.
 * @author Gemini
 */

import * as constants from './constants.js';

/**
 * Represents the UI of the game.
 */
export default class UI {
    /**
     * Creates a new UI object.
     * @param {p5} p - The p5.js instance.
     * @param {object} landingPad - The landing pad object.
     * @param {object} horizontalLimits - The horizontal limits of the world.
     */
    constructor(p, landingPad, horizontalLimits) {
        this.p = p;
        this.landingPad = landingPad;
        this.horizontalLimits = horizontalLimits;
        this.stars = [];
        this.generateStars();
    }

    /**
     * Generates the stars in the background.
     */
    generateStars() {
        this.stars = [];
        for (let i = 0; i < constants.NUM_STARS; i++) {
            this.stars.push({
                x: this.p.random(-this.p.width * 5, this.p.width * 6),
                y: this.p.random(-this.p.height * constants.EXTENDED_WORLD_FACTOR, this.p.height * 0.8),
                size: this.p.random(1, 3.5),
                brightness: this.p.random(100, 255)
            });
        }
    }

    /**
     * Draws the stars in the background.
     */
    drawStars() {
        this.p.noStroke();
        for (let star of this.stars) {
            this.p.fill(255, 255, 255, star.brightness);
            this.p.ellipse(star.x, star.y, star.size, star.size);
        }
    }

    /**
     * Draws the ground.
     */
    drawGround() {
        this.p.noStroke();
        this.p.fill(100, 80, 50);
        let groundWidth = (this.horizontalLimits.right - this.horizontalLimits.left) * 1.1;
        let groundCenterX = this.p.width / 2;
        this.p.rect(groundCenterX, this.p.height - constants.GROUND_HEIGHT / 2, groundWidth, constants.GROUND_HEIGHT);
    }

    /**
     * Draws the landing pad.
     */
    drawLandingPad() {
        this.p.noStroke();
        this.p.fill(150, 150, 160);
        this.p.rect(this.landingPad.x, this.landingPad.y, this.landingPad.w, this.landingPad.h);
        this.p.fill(200, 200, 0);
        this.p.rect(this.landingPad.x, this.landingPad.y, this.landingPad.w - 10, 2);
        this.p.rect(this.landingPad.x, this.landingPad.y, 2, this.landingPad.h - 10);
    }

    /**
     * Draws the UI text.
     * @param {Vehicle} focusObject - The object that the UI is focused on.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     * @param {string} gameState - The current game state.
     */
    drawUI(focusObject, booster, starship, gameState) {
        this.p.fill(255);
        this.p.noStroke();
        this.p.textSize(14);
        this.p.textAlign(this.p.LEFT, this.p.TOP);

        let focusName = booster.attached ? "Booster/Stack" : "Starship";

        let uiX = 10;
        let yPos = constants.MINIMAP_Y_POS + constants.MINIMAP_HEIGHT_USER + 15;
        let spacing = 18;

        let altitude = 0;
        let groundY = this.p.height - constants.GROUND_HEIGHT;
        if (focusObject) {
            altitude = Math.max(0, groundY - focusObject.pos.y);
        }

        let vSpeed = focusObject.vel.y;
        let hSpeed = focusObject.vel.x;
        let displayAngle = this.p.degrees(focusObject.angle + this.p.PI / 2);
        while (displayAngle <= -180) displayAngle += 360;
        while (displayAngle > 180) displayAngle -= 360;

        this.p.text(`${focusName} Telemetry:`, uiX, yPos); yPos += spacing;
        this.p.text(`Altitude: ${altitude.toFixed(1)} m`, uiX, yPos); yPos += spacing;
        this.p.text(`V Speed: ${vSpeed.toFixed(2)} m/s`, uiX, yPos); yPos += spacing;
        this.p.text(`H Speed: ${hSpeed.toFixed(2)} m/s`, uiX, yPos); yPos += spacing;
        this.p.text(`Angle: ${displayAngle.toFixed(1)} deg`, uiX, yPos); yPos += spacing;

        if (booster.attached) {
            this.p.text(`Booster Fuel: ${booster.fuel.toFixed(1)}`, uiX, yPos); yPos += spacing;
        } else {
            this.p.text(`Starship Fuel: ${starship.fuel.toFixed(1)}`, uiX, yPos); yPos += spacing;
            if (booster.visible && !booster.crashed) {
                this.p.text(`Booster Fuel: ${booster.fuel.toFixed(1)} (Falling)`, uiX, yPos); yPos += spacing;
            } else if (booster.crashed) {
                this.p.text(`Booster: CRASHED`, uiX, yPos); yPos += spacing;
            } else if (!booster.visible) {
                this.p.text(`Booster: Lost Signal`, uiX, yPos); yPos += spacing;
            }
        }

        this.p.text(`State: ${gameState}`, uiX, yPos); yPos += spacing;

        if (!booster.attached) {
            let autopilotStatus = starship.isAutopilotActive ? "ACTIVE" : "INACTIVE";
            let autopilotColor = starship.isAutopilotActive ? this.p.color(0, 255, 0) : this.p.color(255, 180, 0);
            this.p.fill(autopilotColor);
            this.p.text(`Autopilot: ${autopilotStatus}`, uiX, yPos); yPos += spacing; this.p.fill(255);
            if ((gameState === 'IN_FLIGHT_STAGE2') && starship.fuel > 0) {
                this.p.text("Press [A] to Toggle Autopilot", uiX, yPos); yPos += spacing;
            } else if (starship.fuel <= 0 && gameState !== 'LANDED' && gameState !== 'CRASHED') {
                this.p.fill(255, 100, 100);
                this.p.text("(No Fuel for Autopilot!)", uiX, yPos); yPos += spacing; this.p.fill(255);
            }
        }

        if (booster.attached && (gameState === 'IN_FLIGHT_STAGE1' || gameState === 'OUT_OF_FUEL_S1')) {
            this.p.text("Press [S] to Separate", uiX, yPos); yPos += spacing;
        }

        this.p.fill(180); this.p.textAlign(this.p.LEFT, this.p.BOTTOM); this.p.textSize(12);
        let controlsText = "Manual: [↑/W] Thrust | [←/A][→/D] Rot | [SPACE] Launch | [S] Sep | [R] Reset";
        if (!booster.attached) {
            controlsText += " | [A] Autopilot";
        }
        this.p.text(controlsText, 10, this.p.height - 10);
        this.p.textAlign(this.p.LEFT, this.p.TOP); this.p.textSize(14); this.p.fill(255);
    }

    /**
     * Draws the minimap.
     * @param {Vehicle} focusObject - The object that the minimap is focused on.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     */
    drawMinimap(focusObject, booster, starship) {
        let miniMapX = this.p.width / 2 - constants.MINIMAP_WIDTH_USER / 2;
        let miniMapY = constants.MINIMAP_Y_POS;
        let miniMapW = constants.MINIMAP_WIDTH_USER;
        let miniMapH = constants.MINIMAP_HEIGHT_USER;

        this.p.push();
        this.p.stroke(255); this.p.strokeWeight(1);
        this.p.fill(0, 0, 50, 180);
        this.p.rectMode(this.p.CORNER);
        this.p.rect(miniMapX, miniMapY, miniMapW, miniMapH);
        this.p.rectMode(this.p.CENTER);

        let worldMinX = this.horizontalLimits.left - this.p.width * 0.2;
        let worldMaxX = this.horizontalLimits.right + this.p.width * 0.2;
        let worldMinY = this.p.height - constants.GROUND_HEIGHT - this.p.height * constants.EXTENDED_WORLD_FACTOR * 0.3;
        let worldMaxY = this.p.height + 100;

        const mapX = (worldX) => {
            return this.p.map(worldX, worldMinX, worldMaxX, miniMapX, miniMapX + miniMapW);
        };
        const mapY = (worldY) => {
            return this.p.map(worldY, worldMinY, worldMaxY, miniMapY, miniMapY + miniMapH);
        };

        let groundMappedY = this.p.constrain(mapY(this.p.height - constants.GROUND_HEIGHT), miniMapY, miniMapY + miniMapH);
        this.p.stroke(100, 80, 50); this.p.strokeWeight(2);
        this.p.line(miniMapX, groundMappedY, miniMapX + miniMapW, groundMappedY);

        let padMappedX = this.p.constrain(mapX(this.landingPad.x), miniMapX, miniMapX + miniMapW);
        let padMappedWidth = Math.max(2, miniMapW * (this.landingPad.w / (worldMaxX - worldMinX)));
        this.p.noStroke(); this.p.fill(150, 150, 160);
        this.p.rect(padMappedX, groundMappedY - 1, padMappedWidth, 3);

        let focusMappedX = this.p.constrain(mapX(focusObject.pos.x), miniMapX, miniMapX + miniMapW);
        let focusMappedY = this.p.constrain(mapY(focusObject.pos.y), miniMapY, miniMapY + miniMapH);
        this.p.fill(255, 0, 0);
        this.p.noStroke();
        this.p.ellipse(focusMappedX, focusMappedY, 5, 5);

        if (!booster.attached) {
            let boosterMappedX = this.p.constrain(mapX(booster.pos.x), miniMapX, miniMapX + miniMapW);
            let boosterMappedY = this.p.constrain(mapY(booster.pos.y), miniMapY, miniMapY + miniMapH);
            if (booster.crashed) {
                this.p.fill(80, 80, 90);
                this.p.ellipse(boosterMappedX, boosterMappedY, 4, 4);
            } else if (booster.visible) {
                this.p.fill(255, 165, 0);
                this.p.ellipse(boosterMappedX, boosterMappedY, 4, 4);
            }
        }

        this.p.pop();
    }

    /**
     * Displays an instructional message.
     * @param {string} message - The message to display.
     */
    displayInstructions(message) {
        this.p.push();
        this.p.fill(255, 255, 0);
        this.p.textSize(24);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(message, this.p.width / 2, this.p.height / 4);
        this.p.pop();
    }

    /**
     * Displays an end message.
     * @param {string} message - The message to display.
     * @param {p5.Color} messageColor - The color of the message.
     */
    displayEndMessage(message, messageColor) {
        this.p.push();
        this.p.fill(messageColor);
        this.p.stroke(0); this.p.strokeWeight(2);
        this.p.textSize(48);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.text(message, this.p.width / 2, this.p.height / 3);
        this.p.fill(220);
        this.p.noStroke();
        this.p.textSize(20);
        this.p.text("Press 'R' to Reset", this.p.width / 2, this.p.height / 3 + 60);
        this.p.pop();
    }

    /**
     * Draws the entire UI.
     * @param {Vehicle} focusObject - The object that the UI is focused on.
     * @param {Booster} booster - The booster object.
     * @param {Starship} starship - The starship object.
     * @param {string} gameState - The current game state.
     */
    draw(focusObject, booster, starship, gameState) {
        this.drawStars();
        this.drawGround();
        this.drawLandingPad();
        this.drawUI(focusObject, booster, starship, gameState);
        this.drawMinimap(focusObject, booster, starship);

        switch (gameState) {
            case 'PRE_LAUNCH':
                this.displayInstructions("Press SPACEBAR to Launch!");
                break;
            case 'OUT_OF_FUEL_S1':
                this.displayInstructions("Booster Empty! Press 'S' to Separate!");
                break;
            case 'OUT_OF_FUEL_S2':
                this.displayInstructions("Starship Fuel Empty!");
                break;
            case 'LANDED':
                this.displayEndMessage("STARSHIP LANDED SAFELY!", this.p.color(0, 255, 0));
                break;
            case 'CRASHED':
                this.displayEndMessage("STARSHIP CRASHED!", this.p.color(255, 0, 0));
                break;
        }
    }
}
