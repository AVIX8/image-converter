const Image = require('../src/Image.js');
const path = require('path')
const fs = require('fs')

const catPath = path.join(process.cwd(), 'images', 'cat.jpg');
const outputDir = path.join(process.cwd(), 'out');

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
})
