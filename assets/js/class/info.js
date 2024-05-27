export default class Info {
    constructor(width, height) {
        this.width = 300;
        this.height = 160;
        this.posX = width / 2 - 300 / 2;
        this.posY = height / 2 - 160 / 2;
    }
    draw(ctx, planet) {
        ctx.beginPath();
        ctx.roundRect(this.posX, this.posY, this.width, this.height, 10);
        ctx.fillStyle = "#101720";
        ctx.strokeStyle = "#8B9BC1";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 40px Arial"
        ctx.fillText(planet.name, this.posX + 40, this.posY + 50);
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.font = "15px Arial"
        ctx.fillText("Radius: \t\t\t\t" + planet.planetInfo.radius + " km", this.posX + 20, this.posY + 80);
        if (planet.name != "Sun") {
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.font = "15px Arial"
            ctx.fillText("Distance to Sun: \t\t\t\t" + planet.planetInfo.distanceToSun / 1e6 + " millions km", this.posX + 20, this.posY + 100);
            ctx.beginPath();
            ctx.fillStyle = "#FFF";
            ctx.font = "15px Arial"
            ctx.fillText("Relative speed: \t\t\t\t" + planet.planetInfo.revolutionSpeed + " km/h", this.posX + 20, this.posY + 120);
            const daysToRevolve = (Math.PI * 2 * planet.planetInfo.distanceToSun) / (planet.planetInfo.revolutionSpeed * 24);
            ctx.fillText("(" + Math.round(daysToRevolve * 1e2) / 1e2 + " Earth days for a full revolution)", this.posX + 20, this.posY + 140);
        }
    }
}