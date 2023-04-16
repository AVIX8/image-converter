const Image = require('../src/Image.js');
const path = require('path')

const catPath = path.join(process.cwd(), 'images', 'cat.jpg');

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
})
