class Debug {

    private fpsElement: any;
    private speedElement: any;
    private timeElement: any;
    private scoreElement: any;
    private healthElement: any;
    private fps: number;
    private speed: number;
    private time: number;
    private score: number;
    private health: number;
    private physics2dDebug: Physics2DDebugDraw;

    constructor(graphicsDevice: GraphicsDevice, width: number, height: number) {
        this.fpsElement = document.getElementById("fpscounter");
        this.speedElement = document.getElementById("gameSpeed");
        this.timeElement = document.getElementById("time");
        this.scoreElement = document.getElementById("score");
        this.healthElement = document.getElementById("health");
        this.fps = 0;
        this.speed = 0;
        this.time = 0;
        this.score = 0;
        this.health = 0;

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
            this.fpsElement.innerHTML = fps;
            this.fps = fps;
        }

        return this;
    }

    public setSpeed(speed: number): Debug {

        speed = Math.round(speed * 100) / 100;
        if (speed !== this.speed) {
            this.speedElement.innerHTML = speed;
            this.speed = speed;
        }

        return this;
    }

    public setTime(time: number): Debug {

        time = Math.round(time);
        if (time !== this.time) {
            this.timeElement.innerHTML = time;
            this.time = time;
        }

        return this;
    }

    public setPlayerInfo(player: Player): Debug {

        if (this.score != player.getScore()) {
            this.score = player.getScore();
            this.scoreElement.innerHTML = this.score;
        }

        if (this.health != player.getHealth()) {
            this.health = player.getHealth();
            this.healthElement.innerHTML = this.health + '%';
        }

        return this;
    }

}