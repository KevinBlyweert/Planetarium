import Ball from "./ball.js";

export default class Course extends Ball {
    constructor(x, y, velX, velY, color, size, planetName) {
        super(x, y, velX, velY, color, size);
        this.planetName = planetName
        this.setLineDash = [5, 5];
        this.setLineWidth = 1;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.setLineWidth;
        ctx.setLineDash(this.setLineDash);
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    onHover(hover, ctx) {
        this.setLineDash = hover ? [] : [5, 5];
        this.setLineWidth = hover ? 4 : 1;
        this.draw(ctx);
    }
}