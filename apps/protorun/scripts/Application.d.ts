declare class GameTime {
    public tick: number;
    public time: number;
    public previousTime: number;
    constructor(time?: number);
    public setTime(time: number): void;
}
declare class Application {
    private intervalId;
    private graphicsDevice;
    private physics2dDevice;
    private inputDevice;
    private draw2d;
    private desiredFps;
    private world;
    private initialized;
    private ship;
    private background;
    private debug;
    private asteroid;
    public time: GameTime;
    public width: number;
    public height: number;
    constructor();
    public init(): Application;
    public loadTexture(src: string, callback: (texture: any) => void): void;
    public getWidthRatio(): number;
    public getHeightRatio(): number;
    private _initWorld();
    private _addAsteroid();
    private _initPlayer();
    private _draw();
    private _clamp();
    private _frame();
    public run(): Application;
    public shutdown(): Application;
    static create(): Application;
}
