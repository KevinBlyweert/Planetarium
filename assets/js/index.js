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
const closeUp = [];
let systemSize = 0;
let closeUpSystemSize = 0;

async function createSystem() {
    fetch("./assets/js/utils/planetInfo.json")
        .then((res) => {
            if (!res.ok) { throw new Error("Not ok.") }
            return res.json();
        })
        .then((data) => {
            systemSize = data[data.length - 1].distanceToSun;
            closeUpSystemSize = data[4].distanceToSun
            data.forEach(item => {
                const planet = new Ball(width / 2, ((item.distanceToSun * (height - 100)) / systemSize), 0, 0, "yellow", (item.radius * (height - 100)) / systemSize * ((item.name) == "Sun" ? 50 : 1500), item.name, "fill", item.speed);
                solarSytem.push(planet);
                if (closeUp.length != 5) {
                    const closePlanet = new Ball(height / 4, (((height / 4) * item.distanceToSun) / closeUpSystemSize), 0, 0, "white", (item.radius * (height / 4)) / closeUpSystemSize * ((item.name) == "Sun" ? 40 : 1000), item.name, "fill", item.speed)
                    closeUp.push(closePlanet);
                }
            })
            animateSystem();
        })
}

createSystem()

function animateSystem() {
    if (solarSytem.length != 0) {
        ctx.fillStyle = "#000100";
        ctx.fillRect(0, 0, width, height);

        solarSytem.forEach((planet => {
            const course = new Ball(width / 2, 50, 0, 0, "#8B9BC1", planet.distanceToSun, "", "stroke");
            course.draw(ctx);
            planet.planetCourseUpdate(course);
            planet.draw(ctx);
        }));

        // Four first planets close up
        ctx.fillStyle = "#000100";
        ctx.fillRect(0, height - (height / 2), (height / 2), (height / 2));
        ctx.strokeStyle = "#8B9BC1";
        ctx.strokeRect(0, height - (height / 2), (height / 2), (height / 2));
        closeUp.forEach(closePlanet => {
            const course = new Ball(height / 4, (height / 2) + (height / 4), 0, 0, "#8B9BC1", closePlanet.distanceToSun, "", "stroke");
            course.draw(ctx);
            closePlanet.planetCourseUpdate(course);
            closePlanet.draw(ctx);
        })
        // for (let index = 0; index < 5; index++) {
        //     const planet = closeUp[index];
        //     const course = new Ball(height / 4, (height / 2) + (height /4), 0, 0, "#8B9BC1", planet.distanceToSun, "", "stroke");
        //     course.draw(ctx);
        //     // planet.planetCourseUpdate(course);
        //     planet.draw(ctx);
        // }
    }
    requestAnimationFrame(animateSystem);
}

window.addEventListener("resize", (e) => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
})