/**
 * @file This file contains the constants for the Starship Simulation game.
 * @author Gemini
 */

// Physics constants
export const GRAVITY = 0.05;
export const INITIAL_LAUNCH_KICK = -1.5;

// Starship constants
export const STARSHIP_THRUST_FORCE = 0.18;
export const STARSHIP_ROTATION_SPEED = 0.0011;
export const STARSHIP_FUEL_CONSUMPTION_MAIN = 0.08;
export const STARSHIP_FUEL_CONSUMPTION_RCS = 0.02;
export const STARSHIP_WIDTH = 20;
export const STARSHIP_HEIGHT = 60;
export const STARSHIP_START_FUEL = 800;

// Booster constants
export const BOOSTER_THRUST_FORCE = 0.25;
export const BOOSTER_ROTATION_SPEED = 0.0008;
export const BOOSTER_FUEL_CONSUMPTION_MAIN = 0.15;
export const BOOSTER_FUEL_CONSUMPTION_RCS = 0.03;
export const BOOSTER_WIDTH = 28;
export const BOOSTER_HEIGHT = 90;
export const BOOSTER_START_FUEL = 1500;

// Landing constants
export const MAX_LANDING_SPEED_V = 2.0;
export const MAX_LANDING_SPEED_H = 1.0;
export const MAX_LANDING_ANGLE = 0.1;

// World constants
export const GROUND_HEIGHT = 50;
export const LANDING_PAD_WIDTH = 80;
export const LANDING_PAD_HEIGHT = 10;
export const EXTENDED_WORLD_FACTOR = 50;
export const NUM_STARS = 400;
export const HORIZONTAL_LIMIT_FACTOR = 2.5;

// UI constants
export const MINIMAP_WIDTH_USER = 120;
export const MINIMAP_HEIGHT_USER = 100;
export const MINIMAP_Y_POS = 10;
export const RCS_THRUSTER_LENGTH = 10;
export const RCS_THRUSTER_WIDTH = 5;

// Autopilot constants
export const AUTOPILOT_ANGLE_TOLERANCE = 0.001;
export const AUTOPILOT_POS_TOLERANCE = 5;
export const AUTOPILOT_ROTATION_P_GAIN = 1.9;
export const AUTOPILOT_HORIZONTAL_P_GAIN = 0.2;
export const AUTOPILOT_HORIZONTAL_D_GAIN = 0.3;
export const AUTOPILOT_MAX_TILT = 0.35;
export const AUTOPILOT_VERTICAL_BRAKE_ALTITUDE = 550;
export const AUTOPILOT_VERTICAL_SLOWDOWN_ALTITUDE = 170;
export const AUTOPILOT_VERTICAL_TARGET_SPEED_HIGH = -9;
export const AUTOPILOT_VERTICAL_TARGET_SPEED_LOW = -MAX_LANDING_SPEED_V * 0.80;
export const AUTOPILOT_VERTICAL_P_GAIN = 0.1;
export const AUTOPILOT_VERTICAL_D_GAIN = 0.01;
export const AUTOPILOT_FINAL_APPROACH_ALTITUDE = 65;
export const AUTOPILOT_FINAL_APPROACH_MAX_TILT = 0.07;
export const AUTOPILOT_FINAL_APPROACH_ANGLE_TOLERANCE = 0.0005;
export const AUTOPILOT_FINAL_APPROACH_ROTATION_GAIN = 2.4;
export const AUTOPILOT_NOSE_DOWN_CORRECTION_ANGLE = 0.4;
export const AUTOPILOT_NOSE_DOWN_CORRECTION_VEL_Y = -0.5;

// Game variables
export const AUTOPILOT_MESSAGE_DURATION = 5500;
export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2.5;
export const ZOOM_SENSITIVITY = 0.001;
