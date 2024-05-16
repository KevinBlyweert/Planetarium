import Ball from "./class/ball.js";
import { random } from "./utils/utils.js";

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// let balls = [];

// while (balls.length < 20) {
//     let size = random(10, 20);
//     let ball = new Ball(
//         // ball position always drawn at least one ball width
//         // away from the edge of the canvas, to avoid drawing errors
//         random(0 + size, width - size),
//         random(0 + size, height - size),
//         random(-7, 7),
//         random(-7, 7),
//         "rgb(" +
//         random(0, 255) +
//         "," +
//         random(0, 255) +
//         "," +
//         random(0, 255) +
//         ")",
//         size,
//     );

//     balls.push(ball);
// }

// function loop() {
//     ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
//     ctx.fillRect(0, 0, width, height);

//     for (let i = 0; i < balls.length; i++) {
//         balls[i].draw(ctx);
//         balls[i].update(width, height);
//         balls[i].collisionDetect(balls);
//     }

//     requestAnimationFrame(loop);
// }

// loop();

const solarSytem = [];
let systemSize = 0;

async function createSystem() {
    fetch("./assets/js/utils/planetInfo.json")
        .then((res) => {
            if (!res.ok) { throw new Error("Not ok.") }
            return res.json()
        })
        .then((data) => {
            systemSize = data[data.length - 1].distanceToSun;
            data.forEach(item => {
                const planet = new Ball(width / 2, ((item.distanceToSun * (height - 100)) / systemSize) + 50, 0, 0, "yellow", (item.radius * (height - 20)) / systemSize * ((item.name) == "Sun" ? 30 : 1000), item.name, "fill", item.speed);
                // const planet = new Ball(width / 2, ((item.distanceToSun * height) / systemSize), 0, 0, "yellow", 20, item.name);
                solarSytem.push(planet)
            })
        })
}

createSystem()

function animateSystem() {
    ctx.fillStyle = "#1D1135";
    ctx.fillRect(0, 0, width, height);

    solarSytem.forEach((planet => {
        if (planet.name !== "Sun") {
            const course = new Ball(width / 2, 50, 0, 0, "#ccc", planet.distanceToSun, "", "stroke");
            course.draw(ctx);
            planet.planetCourseUpdate(course);
        }
        planet.draw(ctx);
    }))
    requestAnimationFrame(animateSystem)
}

animateSystem()
window.addEventListener("resize", (e) => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
    console.log(solarSytem);
})