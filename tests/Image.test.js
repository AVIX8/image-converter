const Image = require('../src/Image.js');
const path = require('path')
const fs = require('fs')

const inputDir = path.join(process.cwd(), 'images')
const outputDir = path.join(process.cwd(), 'out');

const catPath = path.join(inputDir, 'cat.jpg');

const png16 = path.join(inputDir, '16x16.png');
const png16corrupted = path.join(inputDir, '16x16-2.png');
const jpg16 = path.join(inputDir, '16x16.jpg');

describe('Image', () => {
    it('Открытие картинки из файла', async () => {
        const image = new Image();
        await image.loadImage(catPath)

        expect(image).toHaveProperty('width')
        expect(image).toHaveProperty('height')
        expect(image).toHaveProperty('canvas')
        expect(image).toHaveProperty('ctx')

        expect(image.width).toBe(990)
        expect(image.height).toBe(922)
    })

    it('Сохранение изображения', async () => {
        const image = new Image();
        await image.loadImage(catPath)
        const newPath = path.join(outputDir, 'newCat.jpg');
        await image.save(newPath)
        expect(fs.existsSync(newPath)).toBe(true)
    })

    describe('Сравнение изображений', () => {
        it('Одинаковые изображения одного формата', async () => {
            const image1 = new Image();
            const image2 = new Image();
            await image1.loadImage(png16);
            await image2.loadImage(png16);
            expect(image1.compare(image2)).toBe(true)
        })

        it('Одинаковые изображения разных форматов', async () => {
            const image1 = new Image();
            const image2 = new Image();
            await image1.loadImage(png16);
            await image2.loadImage(jpg16);
            expect(image1.compare(image2)).toBe(true)
        })

        it('Разные изображения одного размера', async () => {
            const image1 = new Image();
            const image2 = new Image();
            await image1.loadImage(png16);
            await image2.loadImage(png16corrupted);
            expect(image1.compare(image2)).toBe(false)
        })

        it('Разные изображения разного размера', async () => {
            const image1 = new Image();
            const image2 = new Image();
            await image1.loadImage(png16);
            await image2.loadImage(catPath);
            expect(image1.compare(image2)).toBe(false)
        })
    })
})
