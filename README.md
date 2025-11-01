# Starship Simulation

This is a 2D starship simulation game built with p5.js.

## Project Overview

This project is a complete rewrite of a previous starship simulation game. The goal of this project is to create a more robust and well-documented game with a clean and modular code structure.

The game simulates the launch and landing of a two-stage rocket, with a booster and a starship. The player can control the rocket manually or use the autopilot to land the starship.

## Project Status

**All phases of the project are complete.**

-   **Phase 1: Project Setup:** Completed
-   **Phase 2: The World:** Completed
-   **Phase 3: The Rocket:** Completed
-   **Phase 4: Physics and Controls:** Completed
-   **Phase 5: Staging and AI:** Completed
-   **Phase 6: UI and Polish:** Completed

## Features

-   **Realistic Physics:** The game simulates gravity and thrust, allowing for realistic orbital mechanics.
-   **Two-Stage Rocket:** The rocket consists of a booster and a starship, which can be separated.
-   **Manual Control:** The player can control the rocket manually with the keyboard.
-   **Autopilot:** The starship has an autopilot that can land it safely on the landing pad.
-   **Booster AI:** The booster has an AI that attempts to land it back on the launch pad after separation.
-   **Telemetry:** The UI displays telemetry data, including altitude, velocity, fuel, and angle.
-   **Minimap:** The minimap shows the position of the rocket, booster, and landing pad.
-   **Particle Effects:** The game features particle effects for the rocket's thrust.
-   **Collision Detection:** The game detects collisions between the rocket and the ground.
-   **Game States:** The game has multiple states, including pre-launch, in-flight, and landed/crashed.

## How to Run

To run the project, you need a local web server. You can use any web server, but we recommend using `http-server`, which can be installed via npm:

```bash
npm install -g http-server
```

Once you have `http-server` installed, you can run the following command in the root of the project directory:

```bash
http-server
```

This will start a web server on port 8080. You can then open your browser and navigate to `http://localhost:8080` to play the game.

## File Structure

- `index.html`: The main HTML file.
- `main.css`: The main CSS file.
- `src/`: The source code directory.
    - `Game.js`: The main game class, responsible for the game loop, state management, and coordinating the other modules.
    - `Vehicle.js`: A base class for the rocket, booster, and starship.
    - `Rocket.js`: The class for the full-stack rocket.
    - `Booster.js`: The class for the booster.
    - `Starship.js`: The class for the starship.
    - `Physics.js`: A module for the physics engine.
    - `UI.js`: A class for the UI, including the HUD and minimap.
    - `Camera.js`: A class for the camera, including zooming and following the target.
    - `Particle.js`: A class for the particles.
    - `Controls.js`: A module for handling user input.
    - `constants.js`: A file for all the game constants.

## Controls

- **[↑/W]**: Thrust
- **[←/A]**: Rotate Left
- **[→/D]**: Rotate Right
- **[SPACE]**: Launch
- **[S]**: Separate
- **[A]**: Toggle Autopilot
- **[R]**: Reset

## Game States

- **PRE_LAUNCH**: The rocket is on the launch pad. Press **SPACE** to launch.
- **IN_FLIGHT_STAGE1**: The rocket is in the air with the booster attached. Control the rocket with the arrow keys.
- **OUT_OF_FUEL_S1**: The booster is out of fuel. Press **S** to separate.
- **IN_FLIGHT_STAGE2**: The booster and starship have separated. Control the starship with the arrow keys. The booster will try to land on the landing pad automatically.
- **OUT_OF_FUEL_S2**: The starship is out of fuel.
- **LANDED**: The starship has landed safely.
- **CRASHED**: The starship has crashed.

## Classes

### `Game`

The `Game` class is the main class of the game. It is responsible for:

-   Initializing the game objects.
-   The main game loop.
-   Game state management.
-   Coordinating the other modules.

#### Methods

-   `constructor(p)`: Creates a new Game object.
-   `resetGame()`: Resets the game to its initial state.
-   `setup()`: The p5.js setup function.
-   `draw()`: The p5.js draw function.
-   `windowResized()`: The p5.js windowResized function.

### `Vehicle`

The `Vehicle` class is a base class for the `Booster` and `Starship` classes. It contains the common properties and methods for all vehicles.

#### Properties

-   `p`: The p5.js instance.
-   `pos`: The position of the vehicle.
-   `vel`: The velocity of the vehicle.
-   `acc`: The acceleration of the vehicle.
-   `mass`: The mass of the vehicle.
-   `fuel`: The amount of fuel.
-   `width`: The width of the vehicle.
-   `height`: The height of the vehicle.
-   `angle`: The angle of the vehicle.
-   `isThrusting`: A boolean indicating whether the vehicle is thrusting.
-   `isRotatingLeft`: A boolean indicating whether the vehicle is rotating left.
-   `isRotatingRight`: A boolean indicating whether the vehicle is rotating right.
-   `crashed`: A boolean indicating whether the vehicle has crashed.
-   `particles`: An array of particles for the thrust effect.

#### Methods

-   `constructor(p, x, y, mass, fuel, width, height)`: Creates a new Vehicle object.
-   `applyForce(force)`: Applies a force to the vehicle.
-   `update()`: Updates the vehicle's position and velocity.
-   `renderParticles()`: Renders the particles.
-   `renderRCS()`: Renders the RCS thrusters.
-   `render()`: Renders the vehicle.

### `Booster`

The `Booster` class extends the `Vehicle` class and represents the booster of the rocket.

#### Properties

-   `attached`: A boolean indicating whether the booster is attached to the starship.
-   `visible`: A boolean indicating whether the booster is visible.

#### Methods

-   `constructor(p, x, y)`: Creates a new Booster object.
-   `runAI(landingPad)`: Runs the AI for the booster.
-   `render()`: Renders the booster.

### `Starship`

The `Starship` class extends the `Vehicle` class and represents the starship of the rocket.

#### Properties

-   `isAutopilotActive`: A boolean indicating whether the autopilot is active.

#### Methods

-   `constructor(p, x, y)`: Creates a new Starship object.
-   `runAutopilot(landingPad)`: Runs the autopilot for the starship.
-   `render()`: Renders the starship.

### `Rocket`

The `Rocket` class represents the entire rocket, including the booster and the starship.

#### Properties

-   `p`: The p5.js instance.
-   `booster`: The booster object.
-   `starship`: The starship object.

#### Methods

-   `constructor(p, x, y)`: Creates a new Rocket object.
-   `render()`: Renders the rocket.
-   `separate()`: Separates the starship from the booster.

### `Physics`

The `Physics` class is responsible for the physics engine of the game.

#### Methods

-   `constructor(p)`: Creates a new Physics object.
-   `update(rocket, booster, starship, gameState)`: Updates the physics of the game.
-   `updateStackPhysics(rocket, booster, starship)`: Updates the physics of the rocket stack.
-   `updateStarshipPhysics(starship)`: Updates the physics of the starship.
-   `updateBoosterPhysics(booster)`: Updates the physics of the booster.
-   `checkStarshipCollisionsAndState(starship, gameState)`: Checks for collisions between the starship and the ground.
-   `checkBoosterCrash(booster)`: Checks if the booster has crashed.

### `Controls`

The `Controls` class is responsible for handling user input.

#### Methods

-   `constructor(p)`: Creates a new Controls object.
-   `update(rocket, booster, starship, gameState)`: Updates the controls of the game.

### `UI`

The `UI` class is responsible for the UI of the game, including the HUD and minimap.

#### Methods

-   `constructor(p, landingPad, horizontalLimits)`: Creates a new UI object.
-   `generateStars()`: Generates the stars in the background.
-   `drawStars()`: Draws the stars in the background.
-   `drawGround()`: Draws the ground.
-   `drawLandingPad()`: Draws the landing pad.
-   `drawUI(focusObject, booster, starship, gameState)`: Draws the UI text.
-   `drawMinimap(focusObject, booster, starship)`: Draws the minimap.
-   `displayInstructions(message)`: Displays an instructional message.
-   `displayEndMessage(message, messageColor)`: Displays an end message.
-   `draw(focusObject, booster, starship, gameState)`: Draws the entire UI.

### `Camera`

The `Camera` class is responsible for the camera of the game, including zooming and following the target.

#### Methods

-   `constructor(p, focusObject)`: Creates a new Camera object.
-   `apply()`: Applies the camera transformations.

### `Particle`

The `Particle` class represents a particle in the game. Particles are used to create the fire and smoke effects.

#### Methods

-   `constructor(p, x, y, vx, vy, size, lifetime)`: Creates a new Particle object.
-   `update()`: Updates the particle's position and lifetime.
-   `render()`: Renders the particle.

## Constants

The `constants.js` file contains all the constants for the game. These constants can be tweaked to change the game's physics and behavior.