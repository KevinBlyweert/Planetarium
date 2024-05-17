import { Ball, Star, Planet, Course } from "./class/index.js";
import { random } from "./utils/utils.js";

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
let numberOfStars = 150;
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

const solarSytem = [], closeUp = [], fullSysCourses = [], closeUpCourses = [], stars = [];
let inCloseUp = false, closeUpVisible = false;;

async function createSystem() {
    fetch("./assets/js/utils/planetInfo.json")
        .then((res) => {
            if (!res.ok) { throw new Error("Not ok.") }
            return res.json();
        })
        .then((data) => {
            const systemSize = data[data.length - 1].distanceToSun;
            const closeUpSystemSize = data[4].distanceToSun
            data.forEach(item => {
                const planet = new Planet(0, ((item.distanceToSun * (height - 100)) / systemSize), 0, 0, "yellow", (item.radius * (height - 100)) / systemSize * ((item.name) == "Sun" ? 50 : 1500), item.name, item.speed, item);
                solarSytem.push(planet);

                const course = new Course(width / 2, 50, 0, 0, "#8B9BC1", planet.distanceToSun, planet.name);
                fullSysCourses.push(course);

                if (closeUp.length != 5) {
                    const closePlanet = new Planet(0, (((height / 4) * item.distanceToSun) / closeUpSystemSize), 0, 0, "white", (item.radius * (height / 4)) / closeUpSystemSize * ((item.name) == "Sun" ? 40 : 1000), item.name, item.speed, item)
                    closeUp.push(closePlanet);

                    const course = new Course(height / 4, (height / 2) + (height / 4), 0, 0, "#8B9BC1", closePlanet.distanceToSun, closePlanet.name);
                    closeUpCourses.push(course);
                }
            })
            for (let index = 0; index < numberOfStars; index++) {
                const star = new Star(random(-width / 2, width * 1.5), random(0, height), 0, 0, "#000", random(1, 3));
                stars.push(star);
                setTimeout(() => {
                    star.toShine();
                }, random(0, 3000));
                setInterval(() => {
                    star.toShine();
                }, random(41000, 50000));
            }

            addListeners();
            animateSystem();
        })
}

function animateSystem() {

    ctx.fillStyle = "#000100";
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.draw(ctx);
    });

    solarSytem.forEach((planet => {
        const course = fullSysCourses.find(course => course.planetName == planet.name)
        course.x = width / 2;
        course.draw(ctx);
        planet.planetCourseUpdate(course, ctx);
    }));

    // Four first planets close up automatically drawn if sufficient place or requested
    if (width >= height) {
        closeUpVisible = true;
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.fillStyle = "#000100";
        ctx.fillRect(0, height - (height / 2), (height / 2), (height / 2));
        ctx.strokeStyle = "#8B9BC1";
        ctx.strokeRect(0, height - (height / 2), (height / 2), (height / 2));
        closeUp.forEach(closePlanet => {
            const course = closeUpCourses.find(course => course.planetName == closePlanet.name);
            course.x = height / 4;
            course.draw(ctx);
            closePlanet.planetCourseUpdate(course, ctx);
        })
    }
    requestAnimationFrame(animateSystem);
}

function clickPlanet(planet, x, y, systemToSearch) {
    const click = (Math.pow((x - planet.x), 2) + Math.pow((y - planet.y), 2)) <= Math.pow(planet.size, 2) ? true : false;
    planet.onClick(click, ctx);
    var closeUpPlanet = systemToSearch.find(closePlanet => planet.name == closePlanet.name);
    closeUpPlanet && closeUpPlanet.onClick(click, ctx);
}

function hoverCourse(course, x, y, coursesToSearch) {
    const hover = (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) >= Math.pow(course.size - 5, 2) && (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) <= Math.pow(course.size + 5, 2) ? true : false;
    course.onHover(hover, ctx);
    var otherCourse = coursesToSearch.find(findCourse => findCourse.planetName === course.planetName)
    otherCourse && otherCourse.onHover(hover, ctx);
}

function selectPlanetWithCourse(course,x,y,system,otherSystem) {
    if ((Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) >= Math.pow(course.size - 5, 2) && (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) <= Math.pow(course.size + 5, 2)) {
        const foundPlanet = system.find(item => item.name == course.planetName);
        foundPlanet.onClick(true,ctx);
        var otherPlanet = otherSystem.find(closePlanet => foundPlanet.name == closePlanet.name);
        otherPlanet && otherPlanet.onClick(true, ctx);
    }
}

function addListeners() {
    window.addEventListener("resize", (e) => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });
    canvas.addEventListener("click", (e) => {
        var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (closeUpVisible) {
            inCloseUp = (x > 0 && x < height / 2 && y > height / 2 && y < height);
        }
        if (!inCloseUp) {
            solarSytem.forEach(planet => {
                clickPlanet(planet, x, y, closeUp);
            });
            fullSysCourses.forEach(course => {
                selectPlanetWithCourse(course,x,y,solarSytem,closeUp);
            });
        } else {
            closeUp.forEach(planet => {
                clickPlanet(planet, x, y, solarSytem);
            });
            closeUpCourses.forEach(course => {
                selectPlanetWithCourse(course,x,y,closeUp,solarSytem);
            });
        }
    });
    canvas.addEventListener("mousemove", (e) => {
        var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (closeUpVisible) {
            inCloseUp = (x > 0 && x < height / 2 && y > height / 2 && y < height);
        }
        if (!inCloseUp) {
            fullSysCourses.forEach(course => {
                hoverCourse(course, x, y, closeUpCourses);
            });
        } else {
            closeUpCourses.forEach(course => {
                hoverCourse(course, x, y, fullSysCourses);
            });
        }
    })
}

createSystem()