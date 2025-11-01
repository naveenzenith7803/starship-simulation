export default class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
    }

    // Apply the camera's transformation to the rendering context
    apply(ctx) {
        ctx.translate(-this.x, -this.y);
    }

    // Update the camera's position to follow a target
    follow(target) {
        // For now, we'll just center the camera on the target
        this.x = target.x - this.game.canvas.width / 2;
        this.y = target.y - this.game.canvas.height / 2;
    }
}