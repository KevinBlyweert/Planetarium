import { random } from "../utils/utils.js";

class Ball {
    constructor(x, y, velX, velY, color, size, name = "", appearance = "fill",speed = 0) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.name = name;
        this.appearance = appearance
        this.speed = speed
        this.angle = 0,
        this.distanceToSun = y
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        (this.appearance == "fill") ? ctx.fill() : ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = `${this.size} Arial`;
        ctx.fillText(this.name, this.x + 25, this.y + this.size);
    }
    update(width, height) {
        if (this.x + this.size >= width) {
            this.velX = -this.velX;
        }

        if (this.x - this.size <= 0) {
            this.velX = -this.velX;
        }

        if (this.y + this.size >= height) {
            this.velY = -this.velY;
        }

        if (this.y - this.size <= 0) {
            this.velY = -this.velY;
        }
        this.lastX = this.x;
        this.lastY = this.y;

        this.x += this.velX;
        this.y += this.velY;
        this.angle = (this.lastX - this.x !== 0) ? Math.round(Math.atan((this.lastY - this.y) / (this.lastX - this.x)) * 180 / Math.PI) : 90;
    }
    collisionDetect(balls) {
        for (let j = 0; j < balls.length; j++) {
            if (!(this === balls[j])) {
                const dx = this.x - balls[j].x;
                const dy = this.y - balls[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + balls[j].size) {
                    balls[j].color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
                    // balls[j].color = "rgb(255,255,255)";
                    this.velX = -this.velX
                    balls[j].velX = -balls[j].velX
                    this.velY = -this.velY
                    balls[j].velY = -balls[j].velY
                }
            }
        }
    }
    planetCourseUpdate(course) {
        this.x = course.x + Math.sin(this.angle) * course.size
        this.y = course.y + Math.cos(this.angle) * course.size
        this.angle += this.speed *.001
    }
}

export default Ball