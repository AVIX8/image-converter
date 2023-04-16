const { createCanvas, loadImage } = require("canvas");

class Image {
    width = 0;
    height = 0;
    canvas;
    ctx;

    constructor() { }

    async loadImage(src) {
        const image = await loadImage(src);
        this.width = image.width;
        this.height = image.height;
        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(image, 0, 0);
    }
}

module.exports = Image;
