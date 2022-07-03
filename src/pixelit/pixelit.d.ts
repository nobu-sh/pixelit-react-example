export declare type RGB = [number, number, number];
export declare const rgb: (r: number, g: number, b: number) => RGB;
export interface PixelitConfig {
    to?: HTMLCanvasElement;
    from?: HTMLImageElement;
    scale?: number;
    palette?: RGB[];
    maxHeight?: number;
    maxWidth?: number;
}
/**
 * Pixelit - convert an image to Pixel Art, with/out grayscale and based on a color palette.
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/
declare class Pixelit {
    protected drawTo: HTMLCanvasElement | undefined;
    protected drawFrom: HTMLImageElement | undefined;
    protected scale: number;
    protected palette: RGB[];
    protected maxHeight: number;
    protected maxWidth: number;
    protected ctx: CanvasRenderingContext2D;
    constructor(config?: PixelitConfig);
    /**
     * Verifys the sources are what they need to be.
     */
    protected verifySources(): void;
    /**
     * Hides image used to generate pixel art from.
     */
    protected hideFromImg(): this;
    /**
     * Change the src of the drawFrom image element.
     * @param src New src to set in image to draw from.
     */
    setFromImgSource(src: string): this;
    /**
     * Sets the drawFrom element.
     * @param elm HTML image element to draw from.
     */
    setDrawFrom(elm: HTMLImageElement): this;
    /**
     * Sets drawTo element.
     * @param elm HTML canvas element to draw to.
     */
    setDrawTo(elm: HTMLCanvasElement): this;
    /**
     * Sets new palette to use in pixelit conversion.
     * @param arr Array of RGB values.
     */
    setPalette(arr: RGB[]): this;
    /**
     * Sets the max allowed width of the output.
     * @param w Width to set.
     */
    setMaxWidth(w: number): this;
    /**
     * Sets the max allowed height of the output.
     * @param h Height to set.
     */
    setMaxHeight(h: number): this;
    /**
     * Set the pixel scale resolution of the output image.
     * @param scale Pixel resolution [0..50]
     */
    setScale(scale: number): this;
    /**
     * Gets the current palette RGB array.
     */
    getPalette(): RGB[];
    /**
     * Evaulates the simularity between two rgb values. The lower the results the more similar the two values are.
     * @param color First RGB color.
     * @param compare Second RGB color.
     * @returns [0..441.6729559300637]
     */
    colorSim(color: RGB, compare: RGB): number;
    /**
     * Compares a color against all colors in the palette and returns the most aproximated color.
     * @param color RGB color.
     */
    similarColor(color: RGB): RGB;
    /**
     * pixelate based on @author rogeriopvl <https://github.com/rogeriopvl/8bit>
     * Draws a pixelated version of an image in a given canvas.
     */
    pixelate(): this;
    /**
     * Converts image to greyscale.
     */
    convertGreyscale(): this;
    /**
     * Updates image to new palette if palette changed.
     * @returns
     */
    convertPalette(): this;
    /**
     * Resizes image proportionally according to a max width or max height
     * height takes precedence if defined.
     */
    resizeImage(): this;
    /**
     * Draw to canvas from image source and resize.
     */
    draw(): this;
    /**
     * Save image from canvas.
     */
    saveImage(): this | undefined;
}
export default Pixelit;
