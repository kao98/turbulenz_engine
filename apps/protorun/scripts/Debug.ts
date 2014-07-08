class Debug {

    private fpsElement: any;
    private fps: number;
    private physics2dDebug: Physics2DDebugDraw;

    constructor(graphicsDevice: GraphicsDevice, width: number, height: number) {
        this.fpsElement = document.getElementById("fpscounter");
        this.fps = 0;

        this.physics2dDebug = Physics2DDebugDraw.create({
            graphicsDevice: graphicsDevice
        });

        this.physics2dDebug.setPhysics2DViewport([0, 0, width, height]);

    }

    public draw(draw2d: Draw2D, world: Physics2DWorld): Debug {

        this.physics2dDebug.setScreenViewport(draw2d.getScreenSpaceViewport());
        this.physics2dDebug.begin();
        this.physics2dDebug.drawWorld(world);
        this.physics2dDebug.end();

        return this;
    }

    public setFps(fps: number): Debug {

        fps = Math.round(fps);
        if (fps !== this.fps) {
            this.fpsElement.innerHTML = fps + " fps";
            this.fps = fps;
        }

        return this;
    }

}