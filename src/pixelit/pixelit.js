// TODO Save latest converted colors
export const rgb = (r, g, b) => [r, g, b];
/**
 * Pixelit - convert an image to Pixel Art, with/out grayscale and based on a color palette.
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/
class Pixelit {
    constructor(config = {}) {
        var _a, _b, _c, _d, _e, _f, _g;
        // -> Get default elements
        const defaultTo = (_a = document.getElementById("pixelcanvas")) !== null && _a !== void 0 ? _a : undefined;
        const defaultFrom = (_b = document.getElementById("pixelimage")) !== null && _b !== void 0 ? _b : undefined;
        // -> Declare properties
        this.drawTo = (_c = config.to) !== null && _c !== void 0 ? _c : defaultTo;
        this.drawFrom = (_d = config.from) !== null && _d !== void 0 ? _d : defaultFrom;
        // -> Hide fromImage
        this.hideFromImg();
        // -> Finish declaring properties
        this.scale = config.scale && config.scale > 0 && config.scale <= 50
            ? config.scale * 0.01
            : 8 * 0.01;
        this.palette = (_e = config.palette) !== null && _e !== void 0 ? _e : [
            rgb(140, 143, 174),
            rgb(88, 69, 99),
            rgb(62, 33, 55),
            rgb(154, 99, 72),
            rgb(215, 155, 125),
            rgb(245, 237, 186),
            rgb(192, 199, 65),
            rgb(100, 125, 52),
            rgb(228, 148, 58),
            rgb(157, 48, 59),
            rgb(210, 100, 113),
            rgb(112, 55, 127),
            rgb(126, 196, 193),
            rgb(52, 133, 157),
            rgb(23, 67, 75),
            rgb(31, 14, 28),
        ];
        this.maxHeight = (_f = config.maxHeight) !== null && _f !== void 0 ? _f : 0;
        this.maxWidth = (_g = config.maxWidth) !== null && _g !== void 0 ? _g : 0;
        this.ctx = this.drawTo.getContext("2d");
    }
    /**
     * Verifys the sources are what they need to be.
     */
    verifySources() {
        if (!(this.drawTo instanceof HTMLCanvasElement))
            throw new Error('[Pixelit]: Provided drawTo element must be an HTMLCanvasElement!');
        // -> Verify drawFrom type
        if (!(this.drawFrom instanceof HTMLImageElement))
            throw new Error('[Pixelit]: Provided drawFrom element must be an HTMLImageElement!');
    }
    /**
     * Hides image used to generate pixel art from.
     */
    hideFromImg() {
        // -> Allows for functional use.
        if (!this.drawFrom)
            return this;
        this.drawFrom.style.visibility = "hidden";
        this.drawFrom.style.position = "fixed";
        this.drawFrom.style.top = "0";
        this.drawFrom.style.left = "0";
        return this;
    }
    /**
     * Change the src of the drawFrom image element.
     * @param src New src to set in image to draw from.
     */
    setFromImgSource(src) {
        // -> Allows for functional use.
        if (!this.drawFrom)
            return this;
        this.drawFrom.src = src;
        return this;
    }
    /**
     * Sets the drawFrom element.
     * @param elm HTML image element to draw from.
     */
    setDrawFrom(elm) {
        this.drawFrom = elm;
        this.verifySources();
        this.hideFromImg();
        return this;
    }
    /**
     * Sets drawTo element.
     * @param elm HTML canvas element to draw to.
     */
    setDrawTo(elm) {
        this.drawTo = elm;
        this.verifySources();
        return this;
    }
    /**
     * Sets new palette to use in pixelit conversion.
     * @param arr Array of RGB values.
     */
    setPalette(arr) {
        this.palette = arr;
        return this;
    }
    /**
     * Sets the max allowed width of the output.
     * @param w Width to set.
     */
    setMaxWidth(w) {
        this.maxWidth = w;
        return this;
    }
    /**
     * Sets the max allowed height of the output.
     * @param h Height to set.
     */
    setMaxHeight(h) {
        this.maxHeight = h;
        return this;
    }
    /**
     * Set the pixel scale resolution of the output image.
     * @param scale Pixel resolution [0..50]
     */
    setScale(scale) {
        this.scale = scale > 0 && scale <= 50 ? scale * 0.01 : 8 * 0.01;
        return this;
    }
    /**
     * Gets the current palette RGB array.
     */
    getPalette() {
        return this.palette;
    }
    /**
     * Evaulates the simularity between two rgb values. The lower the results the more similar the two values are.
     * @param color First RGB color.
     * @param compare Second RGB color.
     * @returns [0..441.6729559300637]
     */
    colorSim(color, compare) {
        let d = 0;
        for (let i = 0; i < color.length; i++) {
            d += (color[i] - compare[i]) * (color[i] - compare[i]);
        }
        return Math.sqrt(d);
    }
    /**
     * Compares a color against all colors in the palette and returns the most aproximated color.
     * @param color RGB color.
     */
    similarColor(color) {
        let selectedColor = this.palette[0];
        let currentSim = this.colorSim(color, this.palette[0]);
        let nextColor;
        for (const _color of this.palette) {
            nextColor = this.colorSim(color, _color);
            if (nextColor <= currentSim) {
                selectedColor = _color;
                currentSim = nextColor;
            }
        }
        return selectedColor;
    }
    /**
     * pixelate based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
     * Draws a pixelated version of an image in a given canvas.
     */
    pixelate() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        // -> Set final canvas to images original height and width.
        this.drawTo.width = this.drawFrom.naturalWidth;
        this.drawTo.height = this.drawFrom.naturalHeight;
        // -> Calculate the scaled width to generate pixelated verison.
        let scaledW = this.drawTo.width * this.scale;
        let scaledH = this.drawTo.height * this.scale;
        // -> Make temporary canvas to make new scaled copy.
        const tempCanvas = document.createElement("canvas");
        // -> Set temp canvas width/height & hide (fixes higher scaled cutting off image bottom).
        tempCanvas.width = this.drawTo.width;
        tempCanvas.height = this.drawTo.height;
        tempCanvas.style.visibility = "hidden";
        tempCanvas.style.position = "fixed";
        tempCanvas.style.top = "0";
        tempCanvas.style.left = "0";
        // -> Corner case of bigger images, increase the temporary canvas size to fit everything.
        if (this.drawTo.width > 900 || this.drawTo.height > 900) {
            // -> Fix scale to pixelate bigger images.
            this.scale *= 0.5;
            scaledW = this.drawTo.width * this.scale;
            scaledH = this.drawTo.height * this.scale;
            // -> Make it big enough to fit.
            tempCanvas.width = Math.max(scaledW, scaledH) + 50;
            tempCanvas.height = Math.max(scaledW, scaledH) + 50;
        }
        // -> Get temp context.
        const tempContext = tempCanvas.getContext("2d");
        // -> Draw the image into the canvas.
        tempContext.drawImage(this.drawFrom, 0, 0, scaledW, scaledH);
        document.body.appendChild(tempCanvas);
        // -> Configure to pixelate.
        // @ts-ignore This is expected to not be typed
        this.ctx.mozImageSmoothingEnabled = false;
        // @ts-ignore This is expected to not be typed
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        // -> Calculations to remove extra border
        let finalWidth = this.drawFrom.naturalWidth;
        if (this.drawFrom.naturalWidth > 300) {
            finalWidth +=
                this.drawFrom.naturalWidth > this.drawFrom.naturalHeight
                    ? Math.floor(this.drawFrom.naturalWidth / (this.drawFrom.naturalWidth * this.scale)) / 1.5
                    : Math.floor(this.drawFrom.naturalWidth / (this.drawFrom.naturalWidth * this.scale));
        }
        let finalHeight = this.drawFrom.naturalHeight;
        if (this.drawFrom.naturalHeight > 300) {
            finalHeight +=
                this.drawFrom.naturalHeight > this.drawFrom.naturalWidth
                    ? Math.floor(this.drawFrom.naturalHeight / (this.drawFrom.naturalHeight * this.scale)) / 1.5
                    : Math.floor(this.drawFrom.naturalHeight / (this.drawFrom.naturalHeight * this.scale));
        }
        // -> Draw to final canvas
        //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        this.ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH, 0, 0, finalWidth, finalHeight);
        // -> Remove temp element
        tempCanvas.remove();
        return this;
    }
    /**
     * Converts image to greyscale.
     */
    convertGreyscale() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        // -> Math
        const w = this.drawTo.width;
        const h = this.drawTo.height;
        const imgPixels = this.ctx.getImageData(0, 0, w, h);
        for (let y = 0; y < imgPixels.height; y++) {
            for (let x = 0; x < imgPixels.width; x++) {
                const i = y * 4 * imgPixels.width + x * 4;
                const avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg;
                imgPixels.data[i + 1] = avg;
                imgPixels.data[i + 2] = avg;
            }
        }
        this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        return this;
    }
    /**
     * Updates image to new palette if palette changed.
     * @returns
     */
    convertPalette() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        // -> Math.
        const w = this.drawTo.width;
        const h = this.drawTo.height;
        const imgPixels = this.ctx.getImageData(0, 0, w, h);
        for (let y = 0; y < imgPixels.height; y++) {
            for (let x = 0; x < imgPixels.width; x++) {
                const i = y * 4 * imgPixels.width + x * 4;
                const finalcolor = this.similarColor([
                    imgPixels.data[i],
                    imgPixels.data[i + 1],
                    imgPixels.data[i + 2],
                ]);
                imgPixels.data[i] = finalcolor[0];
                imgPixels.data[i + 1] = finalcolor[1];
                imgPixels.data[i + 2] = finalcolor[2];
            }
        }
        this.ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        return this;
    }
    /**
     * Resizes image proportionally according to a max width or max height
     * height takes precedence if defined.
     */
    resizeImage() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        const canvasCopy = document.createElement("canvas");
        const copyContext = canvasCopy.getContext("2d");
        let ratio = 1.0;
        if (!this.maxWidth && !this.maxHeight) {
            return this;
        }
        if (this.maxWidth && this.drawTo.width > this.maxWidth) {
            ratio = this.maxWidth / this.drawTo.width;
        }
        if (this.maxHeight && this.drawTo.height > this.maxHeight) {
            ratio = this.maxHeight / this.drawTo.height;
        }
        canvasCopy.width = this.drawTo.width;
        canvasCopy.height = this.drawTo.height;
        copyContext.drawImage(this.drawTo, 0, 0);
        this.drawTo.width = this.drawTo.width * ratio;
        this.drawTo.height = this.drawTo.height * ratio;
        this.ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, this.drawTo.width, this.drawTo.height);
        return this;
    }
    /**
     * Draw to canvas from image source and resize.
     */
    draw() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        this.drawTo.width = this.drawFrom.width;
        this.drawTo.height = this.drawFrom.height;
        this.ctx.drawImage(this.drawFrom, 0, 0);
        this.resizeImage();
        return this;
    }
    /**
     * Save image from canvas.
     */
    saveImage() {
        // -> Verify sources are valid.
        this.verifySources();
        if (!this.drawTo || !this.drawFrom)
            return this;
        const link = document.createElement("a");
        link.download = "pixelated.png";
        link.href = this.drawTo
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        document.querySelector("body").appendChild(link);
        link.click();
        document.querySelector("body").removeChild(link);
    }
}
export default Pixelit;
