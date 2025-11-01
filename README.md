Project Plan: SpaceX Starship Simulation Game

This document outlines the complete development plan for a web-based, 2D Starship simulation game, following the AIDLC (Analysis, Ideation, Design, Low-Fidelity, Coding) development lifecycle.

A: Analysis (Requirement Gathering)

This phase defines what we are building.

1. Core User Requirements

Game Theme: SpaceX-inspired Starship launch and landing.

Play Area: Vertical 2D world from Earth's surface (launch tower) to "near space."

Key Entities:

Launch Tower (with background).

Two-Stage Rocket:

Booster (Stage 1)

Starship (Stage 2)

Core Mechanics:

Launch sequence.

Manual stage separation.

AI / Autopilot Features:

Booster: After separation, must automatically "go and land in launch tower" (Return To Launch Site - RTLS).

Starship: Must have an "autopilot" toggle that, when turned on, will "automatically go and land."

UI Features:

Minimap.

(Inferred) Heads-Up Display (HUD) for altitude, velocity, fuel.

2. Technical Stack

Platform: Web Browser

Language: HTML, CSS, JavaScript (ES6+)

Rendering: HTML5 Canvas API (for performance and control).

Physics: Custom-built, simplified 2D physics engine (Gravity, Thrust, Drag).

3. Key Challenges

Physics Engine: Creating a believable (not necessarily 100% accurate) physics model for thrust, gravity (decreasing with altitude), and atmospheric drag.

Autopilot AI: Developing robust state machines for both the Booster RTLS and the Starship auto-land. This involves pathfinding and precise thrust control (PID controller simulation).

World Management: Handling a large vertical world, including camera controls, coordinate systems, and minimap rendering.

State Management: Tracking the complex state of two independent rocket stages (Booster and Starship) post-separation.

I: Ideation (Brainstorming & Flow)

This phase explores how the user will experience the game.

1. Game Flow (User Experience)

Main Menu: (Simple) "Start Launch" button.

Pre-Launch: Rocket is on the launch tower. A "Launch" button is visible. HUD is active.

Ascent: User clicks "Launch." Rocket ascends under full thrust. User controls can be minimal at this stage (e.g., "Toggle Autopilot" which handles ascent).

Staging: At a specific altitude/velocity (or on user command), staging occurs.

The Rocket object splits into two new objects: Booster and Starship.

Split Scenario (Core Loop):

Booster: Immediately initiates its RTLS autopilot AI. The camera stops following the booster.

Starship: The camera starts following the Starship. The user is now in manual control (or can toggle Starship's autopilot).

Mission Phase:

Booster: Flies itself back to the launch tower and attempts landing. Its success/failure is tracked.

Starship: Continues to its objective (e.g., reach a target altitude) and then can be manually flown or auto-piloted back for a landing.

End State: Game ends when both stages have either landed or crashed. A summary screen shows the outcome for both.

2. Physics Concepts

Gravity: A constant downward force, g. We can simplify this to be constant, or have it decrease slightly with altitude for more realism (g = G * (M_earth / (radius_earth + altitude)^2)).

Thrust: A vector force applied by the engine. Controllable by the user/AI.

Drag: A force opposing velocity, proportional to velocity^2 and air density. Air density will decrease exponentially with altitude.

Fuel: A resource that depletes when thrust is applied. mass of the rocket decreases as fuel is used.

Rotation: Rockets can rotate. Thrust is applied relative to the rocket's angle. (Requires torque for rotation).

D: Design (Detailed Specification)

This phase creates the blueprint for the game.

1. Game World

Coordinates: 2D system. (0, 0) can be the center of the launch tower's base. Y+ is up, X+ is right.

World Size: Fixed width (e.g., 20,000 units) and large height (e.g., 1,000,000 units).

Camera: Follows the primary player object (full stack, then Starship).

Background: Multi-layered parallax background:

Layer 1: Ground, Launch Tower (static).

Layer 2: Clouds (slow scroll).

Layer 3: Blue sky, fading to black.

Layer 4: Space, stars (no scroll).

2. Class Architecture (JavaScript)

Game: Main class. Manages the game loop, canvas, state, and all game objects.

PhysicsEngine: Static class/module with methods like applyGravity(obj), applyThrust(obj), applyDrag(obj).

Camera: Manages the viewport (translation) based on a target object.

UI: Handles rendering the HUD (altitude, velocity, fuel, minimap).

Vehicle (Base Class):

Properties: x, y, vx, vy, angle, vAngle, mass, fuel, thrust.

Methods: update(dt), render(ctx).

Rocket (Extends Vehicle):

Represents the full stack (Booster + Starship).

Method: separate(): Destroys itself and returns a new Booster and Starship object.

Booster (Extends Vehicle):

Properties: aiState (e.g., RTLS_BOOSTBACK, RTLS_ENTRY, RTLS_LANDING).

Method: runAI(dt, targetX, targetY).

Starship (Extends Vehicle):

Properties: isAutopilotOn, aiState (e.g., ORBIT, LANDING).

Method: runAI(dt, targetX, targetY).

3. Autopilot AI (State Machine Logic)

Booster RTLS:

State: SEPARATION: Fired just after separation. Kill horizontal velocity. Pitch rocket body towards launch tower.

State: BOOSTBACK_BURN: Fire engine to gain horizontal velocity back towards the launch tower. Cut off when trajectory points to the tower.

State: COAST_FALL: Free-fall. Orient for re-entry (engine-first).

State: ENTRY_BURN (Simplified): At a certain altitude, fire engine to slow down (a "suicide burn" logic).

State: LANDING: Modulate thrust to achieve zero velocity at (target.x, target.y).

Starship Auto-Land:

A simplified version of the above. When toggled "On," it will:

State: ORIENT: Kill velocity. Orient for landing.

State: TRAVERSE: Apply thrust to move horizontally towards the landing zone.

State: LANDING: Modulate thrust for a soft landing.

4. UI Design

HUD (Bottom Corners):

Left: Altitude (m), Vertical Velocity (m/s), Horizontal Velocity (m/s).

Right: Fuel (Booster), Fuel (Starship).

Minimap (Top Right):

A tall, thin rectangle representing the full world height.

Shows: Launch Tower (icon), Booster (dot), Starship (dot).

L: Low-Fidelity (Prototyping Plan)

This phase validates core mechanics with simple code.

Prototype 1: Physics Sandbox

Goal: Test physics.

Build: A single Vehicle (a rectangle) on a canvas. Implement user controls (Arrow Keys) for thrust and rotation. Apply gravity and basic drag.

Test: Does it feel right? Can you lift off and "hover"?

Prototype 2: Staging

Goal: Test object separation.

Build: Start with Prototype 1. Add a "Separate" key (e.g., 'Spacebar'). On press, replace the single Vehicle with two new Vehicle objects at the same position, giving them a slight push apart.

Test: Does the separation work? Are both objects now independently physics-driven?

Prototype 3: Basic AI

Goal: Test autopilot logic.

Build: A single Vehicle. Define a target coordinate (e.g., (100, 100)).

Test: Write simple AI (if (obj.y < target.y) applyThrust()) to make the object fly to and hover at the target. This will form the basis of the landing AI.

C: Coding (Implementation Plan)

This is the step-by-step plan to build the final game.

Phase 1: World & Game Loop

Set up the HTML file (index.html) with a single <canvas> element.

Create the main JavaScript file (game.js).

Implement the Game class.

Create the main game loop (requestAnimationFrame) that calls game.update() and game.render().

Implement the Camera class.

Draw the background (sky, ground).

Draw the Launch Tower (a simple rectangle for now).

Phase 2: The Full-Stack Rocket

Create the Vehicle base class.

Create the Rocket class that extends Vehicle.

The Rocket.render() method should draw two rectangles (Booster + Starship) stacked.

Instantiate one Rocket object on the launch tower.

Implement user controls (e.g., 'W' for thrust, 'A'/'D' for rotation).

Implement the PhysicsEngine with basic applyGravity and applyThrust.

Call the physics methods in the Rocket.update() function.

Make the Camera follow the Rocket.

Phase 3: Staging & State Management

Add a "Stage" key (e.g., 'Spacebar').

Implement the Rocket.separate() method.

When "Stage" is pressed:

Call rocket.separate().

This method creates and returns new Booster(...) and new Starship(...) objects, initialized at the rocket's current position/velocity.

The Game class removes the Rocket from its object list and adds the new Booster and Starship.

Change the Camera to follow the Starship object post-separation.

Allow user controls to only affect the Starship.

Phase 4: Booster RTLS (The "Hard" AI)

In the Booster class, create the runAI(dt, target) method and a this.aiState property.

Define the target as the launch tower's coordinates.

Implement the state machine logic designed in the "Design" phase:

SEPARATION: Point rocket up, fire thrusters to cancel horizontal velocity. When vx is near 0, switch to BOOSTBACK_BURN.

BOOSTBACK_BURN: Calculate the angle to the target. Apply thrust at that angle. (This is complex; a simpler way is to just apply horizontal thrust towards the tower). Stop burning when the trajectory is predicted to land near the tower.

COAST_FALL: No thrust. Just fall. Point engine-down.

LANDING: Below a certain altitude, implement a "suicide burn." A simple PID controller is best:

error = targetVelocity - currentVelocity (targetVelocity is 0).

thrust = Kp * error (modulate thrust to fight gravity and slow down).

Add horizontal adjustments (mini-PID for vx) to stay over the pad.

Phase 5: Starship Autopilot

In the Starship class, add this.isAutopilotOn = false.

Add a key ('P') to toggle this boolean.

In Starship.update(), if isAutopilotOn is true, call this.runAI(dt, target). Otherwise, listen for user controls.

The Starship.runAI() will be a simpler version of the Booster's, as it just needs to land (not perform a boostback).

LANDING: Implement the same PID landing logic as the booster.

Phase 6: UI & Polish

Create the UI class.

In Game.render(), after drawing the world, call ui.render(ctx, player, booster).

HUD: Draw text on the canvas (using fillText) for Altitude, Velocity (from starship.y, starship.vy), and Fuel.

Minimap:

Draw a tall rectangle in the corner.

Map the world height (e.g., 1,000,000 units) to the minimap height (e.g., 300px).

Calculate dotY_starship = (starship.y / WORLD_HEIGHT) * MINIMAP_HEIGHT.

Draw dots for the Starship and Booster.

Add particle effects for engine thrust.

Add "crash" detection (if vy > MAX_LANDING_SPEED on collision with ground).

Add "success" detection (if vy < MAX_LANDING_SPEED on collision with landing pad).

Show a "Mission Success" or "Mission Failed" message.
