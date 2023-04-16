const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const formats = {
    png: "png",
    jpg: "jpeg",
    jpeg: "jpeg",
};

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

    getFormat(filePath) {
        const ext = path.extname(filePath).slice(1);
        if (!(ext in formats)) {
            throw new Error("Invalid format");
        }
        return `image/${formats[ext]}`;
    }

    async save(outputPath) {
        const format = this.getFormat(outputPath)
        const buffer = this.canvas.toBuffer(format);
        fs.writeFileSync(outputPath, buffer);
    }
}

module.exports = Image;
