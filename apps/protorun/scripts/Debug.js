var Debug = (function () {
    function Debug(graphicsDevice, width, height) {
        this.fpsElement = document.getElementById("fpscounter");
        this.fps = 0;

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
        var fps = Math.round(fps);
        if (fps != this.fps) {
            this.fpsElement.innerHTML = fps + " fps";
            this.fps = fps;
        }

        return this;
    };
    return Debug;
})();
//# sourceMappingURL=Debug.js.map
