import Ball from "./ball.js";

export default class Planet extends Ball {
    constructor(x, y, velX, velY, color, size, name, speed, planetInfo) {
        super(x, y, velX, velY, color, size);
        this.distanceToSun = y;
        this.name = name;
        this.speed = speed;
        this.angle = 0;
        this.originColor = color;
        this.planetInfo = planetInfo;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = `${this.size * 4}px Arial`;
        ctx.fillText(this.name, this.x + 25, this.y >= this.size * 2.5 ? this.y + this.size : this.size * 3);
    }
    planetCourseUpdate(course, ctx) {
        this.x = course.x + Math.sin(this.angle) * course.size;
        this.y = course.y + Math.cos(this.angle) * course.size;
        this.angle += this.speed * .0000001;
        // this.angle += this.name != "Sun" && 2 * Math.PI / (2 * Math.PI * course.size);
        // this.angle += Math.tan((this.speed * 24) / course.size)*.001;
        this.draw(ctx);
    }
    onClick(click, ctx) {
        // this.color = click ? "blue" : this.originColor;
        this.draw(ctx);
        this.selected = click;
    }
}