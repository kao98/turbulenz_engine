var Debug = (function () {
    function Debug(graphicsDevice, width, height) {
        this.fpsElement = document.getElementById("fpscounter");
        this.speedElement = document.getElementById("gameSpeed");
        this.timeElement = document.getElementById("time");
        this.fps = 0;
        this.speed = 0;
        this.time = 0;

        this.physics2dDebug = Physics2DDebugDraw.create({
            graphicsDevice: graphicsDevice
        });

        this.physics2dDebug.setPhysics2DViewport([0, 0, width, height]);
    }
    Debug.prototype.draw = function (draw2d, world) {
        this.physics2dDebug.setScreenViewport(draw2d.getScreenSpaceViewport());
        this.physics2dDebug.begin();
        this.physics2dDebug.drawWorld(world);
        this.physics2dDebug.end();

        return this;
    };

    Debug.prototype.setFps = function (fps) {
        fps = Math.round(fps);
        if (fps !== this.fps) {
            this.fpsElement.innerHTML = fps;
            this.fps = fps;
        }

        return this;
    };

    Debug.prototype.setSpeed = function (speed) {
        speed = Math.round(speed * 100) / 100;
        if (speed !== this.speed) {
            this.speedElement.innerHTML = speed;
            this.speed = speed;
        }

        return this;
    };

    Debug.prototype.setTime = function (time) {
        time = Math.round(time);
        if (time !== this.time) {
            this.timeElement.innerHTML = time;
            this.time = time;
        }

        return this;
    };
    return Debug;
})();
//# sourceMappingURL=Debug.js.map
