const Image = require("../src/Image.js");
const path = require("path");
const fs = require("fs");

const inputDir = path.join(process.cwd(), "images");
const outputDir = path.join(process.cwd(), "out");
if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir)

const catPath = path.join(inputDir, "cat.jpg");
const lambaPath = path.join(inputDir, "lamba.png");
const trillionsPath = path.join(inputDir, "4trillions.jpg");

const png16 = path.join(inputDir, "16x16.png");
const png16corrupted = path.join(inputDir, "16x16-2.png");
const jpg16 = path.join(inputDir, "16x16.jpg");

describe("Image", () => {
    let image1, image2;
    beforeEach(() => {
        image1 = new Image();
        image2 = new Image();
    });
    afterEach(() => {
        image1 = undefined;
        image2 = undefined;
    });

    it("Открытие картинки из файла", async () => {
        await image1.loadImage(catPath);

        expect(image1).toHaveProperty("width");
        expect(image1).toHaveProperty("height");
        expect(image1).toHaveProperty("canvas");
        expect(image1).toHaveProperty("ctx");

        expect(image1.width).toBe(990);
        expect(image1.height).toBe(922);
    });

    it("Сохранение изображения", async () => {
        await image1.loadImage(catPath);
        const newPath = path.join(outputDir, "newCat.jpg");
        await image1.save(newPath);
        expect(fs.existsSync(newPath)).toBe(true);
    });

    describe("Сравнение изображений", () => {
        it("Одинаковые изображения одного формата", async () => {
            await image1.loadImage(png16);
            await image2.loadImage(png16);
            expect(image1.compare(image2)).toBe(true);
        });

        it("Одинаковые изображения разных форматов", async () => {
            await image1.loadImage(png16);
            await image2.loadImage(jpg16);
            expect(image1.compare(image2)).toBe(true);
        });

        it("Разные изображения одного размера", async () => {
            await image1.loadImage(png16);
            await image2.loadImage(png16corrupted);
            expect(image1.compare(image2)).toBe(false);
        });

        it("Разные изображения разного размера", async () => {
            await image1.loadImage(png16);
            await image2.loadImage(catPath);
            expect(image1.compare(image2)).toBe(false);
        });
    });

    describe("Конвертация изображений", () => {
        it("png в jpg", async () => {
            await image1.loadImage(png16);
            const newPath = path.join(outputDir, "jpg16.jpg");
            image1.save(newPath);
            await image2.loadImage(newPath);
            expect(image1.compare(image2)).toBe(true);
        });

        it("jpg в png", async () => {
            await image1.loadImage(jpg16);
            const newPath = path.join(outputDir, "png16.png");
            image1.save(newPath);
            await image2.loadImage(newPath);
            expect(image1.compare(image2)).toBe(true);
        });

        it("Крупное изображение (png в jpg)", async () => {
            await image1.loadImage(lambaPath);
            const newPath = path.join(outputDir, "lamba.jpg");
            image1.save(newPath);
            await image2.loadImage(newPath);
            expect(image1.compare(image2)).toBe(true);
        });

        it("Крупное изображение (jpg в png)", async () => {
            await image1.loadImage(trillionsPath);
            const newPath = path.join(outputDir, "4trillions.png");
            image1.save(newPath);
            await image2.loadImage(newPath);
            expect(image1.compare(image2)).toBe(true);
        });
    });

    describe("Изменение размеров изображений", () => {
        it("сжать в 2.5 раза по ширине", async () => {
            await image1.loadImage(lambaPath);
            const {width, height} = image1;
            image1.resize(width/2.5, height);

            const newPath = path.join(outputDir, "lamba_w040.png");
            image1.save(newPath);

            await image2.loadImage(newPath)
            expect(image2.width).toBe(Math.floor(width/2.5));
            expect(image2.height).toBe(height);
        });

        it("растянуть в 1.5 раза по ширине", async () => {
            await image1.loadImage(lambaPath);
            const {width, height} = image1;
            image1.resize(width*1.5, height);

            const newPath = path.join(outputDir, "lamba_w150.png");
            image1.save(newPath);

            await image2.loadImage(newPath)
            expect(image2.width).toBe(Math.floor(width*1.5));
            expect(image2.height).toBe(height);
        });

        it("сжать в 1.5 раза по высоте", async () => {
            await image1.loadImage(lambaPath);
            const {width, height} = image1;
            image1.resize(width, height/1.5);

            const newPath = path.join(outputDir, "lamba_h066.png");
            image1.save(newPath);

            await image2.loadImage(newPath)
            expect(image2.width).toBe(width);
            expect(image2.height).toBe(Math.floor(height/1.5));
        });

        it("растянуть в 2.5 раза по высоте", async () => {
            await image1.loadImage(lambaPath);
            const {width, height} = image1;
            image1.resize(width, height*2.5);

            const newPath = path.join(outputDir, "lamba_h250.png");
            image1.save(newPath);

            await image2.loadImage(newPath)
            expect(image2.width).toBe(width);
            expect(image2.height).toBe(Math.floor(height*2.5));
        });
       
    });
});
