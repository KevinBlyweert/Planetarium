import Ball from "./ball.js";

export default class Highlight extends Ball {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);
        this.setLineDash = [];
        this.setLineWidth = 2;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.setLineWidth;
        ctx.setLineDash(this.setLineDash);
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
}