interface Drawer {
    begin(blending?: string): void;
    draw(what: Object): void;
    drawSprite(sprite: Draw2DSprite): void;
    end(): void;
    blend: {
        additive: string;
        alpha: string;
        opaque: string;
    };
}
declare class BackgroundTile {
    private speed;
    public sprite: Draw2DSprite;
    public textureSrc: string;
    constructor(textureSrc: string, speed?: number);
    public init(): BackgroundTile;
    public load(application: Application): BackgroundTile;
    public update(time: GameTime): BackgroundTile;
    public draw(drawer: Drawer, width: number, height: number): BackgroundTile;
}
declare class Background {
    private skyColor;
    private initialized;
    private background;
    private application;
    constructor();
    public init(application: Application): Background;
    public load(): Background;
    public draw(drawer: Drawer): Background;
    public update(time: GameTime): Background;
    static create(): Background;
}
