import Ball from "./ball.js";

export default class Star extends Ball {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY, color, size);
    }
    toShine() {
        setTimeout(() => {
            this.color = "rgba(255,255,255,0)";
        }, 1000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.2)";
        }, 6000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.6)";
        }, 11000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.8)";
        }, 16000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,1)";
        }, 21000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.8)";
        }, 26000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.6)";
        }, 31000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,.2)";
        }, 36000);
        setTimeout(() => {
            this.color = "rgba(255,255,255,0)";
        }, 41000);
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}