declare class Debug {
    private fpsElement;
    private speedElement;
    private timeElement;
    private fps;
    private speed;
    private time;
    private physics2dDebug;
    constructor(graphicsDevice: GraphicsDevice, width: number, height: number);
    public draw(draw2d: Draw2D, world: Physics2DWorld): Debug;
    public setFps(fps: number): Debug;
    public setSpeed(speed: number): Debug;
    public setTime(time: number): Debug;
}
