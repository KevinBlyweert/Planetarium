import { Star, Planet, Course, Info, Highlight } from "./class/index.js";
import { random } from "./utils/utils.js";

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth), height = (canvas.height = window.innerHeight), closeUpSideLength = (width >= height / 2) ? height / 2 : width;
let numberOfStars = 150;
const dark_blue = "#101017", red = "#F00", light_blue = "#8B9BC1", white = "#FFE";
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
let inCloseUp = false, closeUpVisible = false, planetPopUp = undefined;

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
                const planet = new Planet(0, ((item.distanceToSun * (height - 200)) / systemSize), 0, 0, white, (item.radius * (height - 200)) / systemSize * ((item.name) == "Sun" ? 50 : 1500), item.name, item.revolutionSpeed, item);
                solarSytem.push(planet);

                const course = new Course(width / 2, 50, 0, 0, light_blue, planet.distanceToSun, planet.name);
                fullSysCourses.push(course);

                if (closeUp.length != 5) {
                    const closePlanet = new Planet(0, (((width / 2) * item.distanceToSun) / closeUpSystemSize), 0, 0, white, (item.radius * (closeUpSideLength / 2)) / closeUpSystemSize * ((item.name) == "Sun" ? 40 : 1000), item.name, item.revolutionSpeed, item)
                    closeUp.push(closePlanet);
                    const course = new Course(width / 2, height - (closeUpSideLength / 2), 0, 0, light_blue, closePlanet.distanceToSun, closePlanet.name);
                    closeUpCourses.push(course);
                }
            })
            for (let index = 0; index < numberOfStars; index++) {
                const star = new Star(random(-width / 2, width * 1.5), random(0, height), 0, 0, dark_blue, random(1, 3));
                stars.push(star);
                setTimeout(() => {
                    star.toShine();
                }, random(1, 3000));
                setInterval(() => {
                    star.toShine();
                }, random(35000, 45000));
            }
            planetPopUp = new Info(width, height);
            addListeners();
            animateSystem();
        })
}

function animateSystem() {

    ctx.fillStyle = dark_blue;
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

    if (closeUpVisible) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.strokeStyle = red;
        ctx.strokeRect(width / 2 - 50, 0, 100, 100);
    }

    // Four first planets close up automatically drawn if sufficient place or requested
    if (width >= height || closeUpVisible) {
        closeUpVisible = true;
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.fillStyle = dark_blue;
        ctx.fillRect(0, height - closeUpSideLength, closeUpSideLength, closeUpSideLength);
        ctx.beginPath();
        ctx.strokeStyle = red;
        ctx.strokeRect(0, height - closeUpSideLength, closeUpSideLength, closeUpSideLength);
        closeUp.forEach(closePlanet => {
            const course = closeUpCourses.find(course => course.planetName == closePlanet.name);
            course.x = closeUpSideLength / 2;
            course.y = height - closeUpSideLength / 2;
            course.size = (closePlanet.distanceToSun * closeUpSideLength / 2) / closeUp[closeUp.length - 1].distanceToSun;
            course.draw(ctx);
            closePlanet.planetCourseUpdate(course, ctx);
        })
    };

    solarSytem.forEach(planet => {
        if (planet.selected) {
            const planetHighlight = new Highlight(planet.x, planet.y, 0, 0, "blue", planet.size * 1.2);
            planetHighlight.draw(ctx);
            const closePlanet = closeUp.find(item => item.name == planet.name);
            if (closePlanet) {
                const closePlanetHighlight = new Highlight(closePlanet.x, closePlanet.y, 0, 0, "blue", closePlanet.size * 1.2);
                closePlanetHighlight.draw(ctx);
            }
            showPlanetInfo(planet);
        }
    });
    requestAnimationFrame(animateSystem);
}

function clickPlanet(planet, x, y, systemToSearch) {
    const click = (Math.pow((x - planet.x), 2) + Math.pow((y - planet.y), 2)) <= Math.pow(planet.size, 2) ? true : false;
    planet.onClick(click, ctx);
    var closeUpPlanet = systemToSearch.find(closePlanet => planet.name == closePlanet.name);
    closeUpPlanet && closeUpPlanet.onClick(click, ctx);

}

function hoverCourse(course, x, y, coursesToSearch) {
    const hover = (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) >= Math.pow(course.size - 3, 2) && (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) <= Math.pow(course.size + 3, 2) ? true : false;
    course.onHover(hover, ctx);
    var otherCourse = coursesToSearch.find(findCourse => findCourse.planetName === course.planetName)
    otherCourse && otherCourse.onHover(hover, ctx);
}

function selectPlanetWithCourse(course, x, y, system, otherSystem) {
    if ((Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) >= Math.pow(course.size - 3, 2) && (Math.pow((x - course.x), 2) + Math.pow((y - course.y), 2)) <= Math.pow(course.size + 3, 2)) {
        const foundPlanet = system.find(item => item.name == course.planetName);
        foundPlanet.onClick(true, ctx);
        var otherPlanet = otherSystem.find(closePlanet => foundPlanet.name == closePlanet.name);
        otherPlanet && otherPlanet.onClick(true, ctx);
    }
}

function showPlanetInfo(planet) {
    planetPopUp.draw(ctx, planet);
}

function addListeners() {
    window.addEventListener("resize", (e) => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
        closeUpSideLength = (width >= height / 2) ? height / 2 : width;
        closeUpVisible = (width > height) ? true : false;
        planetPopUp.posX = width / 2 - 300 / 2;
        planetPopUp.posY = height / 2 - 160 / 2;
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
                selectPlanetWithCourse(course, x, y, solarSytem, closeUp);
            });
        } else {
            closeUp.forEach(planet => {
                clickPlanet(planet, x, y, solarSytem);
            });
            closeUpCourses.forEach(course => {
                selectPlanetWithCourse(course, x, y, closeUp, solarSytem);
            });
            closeUpVisible = true;
        }
    });
    canvas.addEventListener("mousemove", (e) => {
        var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (closeUpVisible) {
            inCloseUp = (x > 0 && x < height / 2 && y > height / 2 && y < height);
        }
        closeUpVisible = (width <= height) ? (x >= width / 2 - 50 && x <= width / 2 + 50 && y >= 0 && y <= 100) : true;

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

createSystem();