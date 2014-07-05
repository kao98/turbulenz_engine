declare class Debug {
    private fpsElement;
    private fps;
    private physics2dDebug;
    constructor(graphicsDevice: GraphicsDevice, width: any, height: any);
    public draw(draw2d: Draw2D, world: Physics2DWorld): Debug;
    public setFps(fps: number): Debug;
}
