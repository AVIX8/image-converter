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
    imageData;
    normalizedImageData;

    constructor() { }

    async loadImage(src) {
        const image = await loadImage(src);
        this.width = image.width;
        this.height = image.height;
        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(image, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.normalizeImageData();
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

    normalizeImageData() {
        const { data } = this.imageData;
        this.normalizedImageData = data.map((w, i) =>
            i % 4 == 3 ? 255 : Math.floor((w * data[i + 3 - (i % 4)]) / 255)
        );
    }

    compare(image, maxDiff = 0.005) {
        const data1 = this.normalizedImageData;
        const data2 = image.normalizedImageData;

        if (data1.length !== data2.length) {
            return false;
        }
        const diff = data1.reduce((acc, x, i) => acc + Math.abs(x - data2[i]), 0);

        if (diff < maxDiff * this.width * this.height * 3 * 255) {
            return true;
        }

        return false;
    }
}

module.exports = Image;
