﻿var GameTime = (function () {
    function GameTime(time) {
        this.tick = 0;
        this.time = 0;
        this.previousTime = 0;
        this.setTime(time || 0);
    }
    GameTime.prototype.setTime = function (time) {
        this.previousTime = this.time;
        this.time = time;
        this.tick = time - this.previousTime;
    };
    return GameTime;
})();

var Application = (function () {
    function Application() {
        this.initialized = false;
    }
    Application.prototype.init = function () {
        var _this = this;
        this.intervalId = null;
        this.graphicsDevice = null;
        this.desiredFps = 60;
        this.width = 1920;
        this.height = 1080;
        this.ship = null;
        this.asteroid = null;
        this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
        this.draw2d = Draw2D.create({ graphicsDevice: this.graphicsDevice });
        this.background = new Background();
        this.physics2dDevice = Physics2DDevice.create();
        this.inputDevice = TurbulenzEngine.createInputDevice({});
        this.time = new GameTime(TurbulenzEngine.time);

        this.draw2d.configure({
            viewportRectangle: [0, 0, this.width, this.height],
            scaleMode: "scale"
        });

        this.background.init(this).load();

        // cache padCodes
        // var padCodes = this.inputDevice.padCodes;
        this.inputDevice.addEventListener("padmove", function (lX, lY, lZ, rX, rY, rZ) {
            if (_this.ship && _this.ship.rigidBody) {
                _this.ship.rigidBody.setVelocity([0, -1500 * lY]);
            }
        });

        this.inputDevice.addEventListener("keydown", function (keycode) {
            if (_this.ship && _this.ship.rigidBody) {
                if (keycode === 202) {
                    _this.ship.rigidBody.setVelocity([0, -600]);
                } else if (keycode === 203) {
                    _this.ship.rigidBody.setVelocity([0, 600]);
                }
            }
        });

        this.inputDevice.addEventListener("keyup", function (keycode) {
            if (_this.ship && _this.ship.rigidBody) {
                if (keycode === 202 || keycode === 203) {
                    _this.ship.rigidBody.setVelocity([0, 0]);
                }
            }
        });

        this._initWorld();

        this.debug = new Debug(this.graphicsDevice, this.width, this.height);

        this.initialized = true;
        return this;
    };

    Application.prototype.loadTexture = function (src, callback) {
        this.graphicsDevice.createTexture({
            src: src,
            mipmaps: true,
            onload: callback
        });
    };

    Application.prototype.getWidthRatio = function () {
        if (this.draw2d) {
            return this.width / this.draw2d.scissorWidth;
        }
        return 0;
    };

    Application.prototype.getHeightRatio = function () {
        if (this.draw2d) {
            return this.height / this.draw2d.scissorHeight;
        }
        return 0;
    };

    Application.prototype._initWorld = function () {
        this.world = this.physics2dDevice.createWorld({
            gravity: [-30, 0]
        });

        this._initPlayer()._addAsteroid();

        return this;
    };

    Application.prototype._addAsteroid = function () {
        var asteroid = this.asteroid = {
            width: 128,
            height: 128,
            position: [this.width / 2, -5 + this.height / 2],
            shape: null,
            rigidBody: null,
            sprite: null
        };

        asteroid.shape = this.physics2dDevice.createPolygonShape({
            material: this.physics2dDevice.createMaterial({ density: 2.3 }),
            vertices: [
                [-10, -40],
                [25, -30],
                [42, 0],
                [22, 40],
                [-27, 34],
                [-40, 16],
                [-45, -18],
                [-10, -40]
            ]
        });

        asteroid.rigidBody = this.physics2dDevice.createRigidBody({
            type: "dynamic",
            shapes: [asteroid.shape],
            position: asteroid.position
        });

        this.world.addRigidBody(asteroid.rigidBody);

        asteroid.sprite = Draw2DSprite.create({
            texture: null,
            position: [asteroid.position[0] - asteroid.width / 2, asteroid.position[1] - asteroid.height / 2],
            width: asteroid.width,
            height: asteroid.height
        });

        this.loadTexture("assets/textures/meteorBrown_big3.png", function (texture) {
            if (texture) {
                asteroid.sprite.setTextureRectangle([0, 0, 128, 128]);
                asteroid.sprite.setTexture(texture);
            }
        });

        asteroid.rigidBody.setVelocity([-150, 2]);
        asteroid.rigidBody.setAngularVelocity(0.25);

        return this;
    };

    Application.prototype._initPlayer = function () {
        var ship = this.ship = {
            width: 128,
            height: 128,
            position: [300, this.height / 2],
            rotation: Math.PI / 2,
            shape: null,
            rigidBody: null,
            sprite: null
        };

        ship.shape = this.physics2dDevice.createPolygonShape({
            vertices: [
                [0, -38],
                [28, 22],
                [15, 35],
                [-15, 36],
                [-28, 22],
                [0, -38]
            ]
        });

        ship.rigidBody = this.physics2dDevice.createRigidBody({
            type: "kinematic",
            shapes: [ship.shape],
            position: ship.position,
            rotation: ship.rotation
        });

        this.world.addRigidBody(ship.rigidBody);

        ship.sprite = Draw2DSprite.create({
            texture: null,
            position: [ship.position[0] - ship.width / 2, ship.position[1] - ship.height / 2],
            width: ship.width,
            height: ship.height
        });

        this.graphicsDevice.createTexture({
            src: "assets/textures/playerShip3_blue.png",
            // src: "assets/textures/playerShip3_blue_mipmapped.dds",
            mipmaps: true,
            onload: function onLoadFn(texture) {
                if (texture) {
                    ship.sprite.setTextureRectangle([0, 0, 128, 128]);
                    ship.sprite.setTexture(texture);
                }
            }
        });

        return this;
    };

    Application.prototype._draw = function () {
        this.background.draw(this.draw2d);

        if (this.ship.rigidBody) {
            this.ship.rigidBody.getPosition(this.ship.position);

            if (this.ship.sprite) {
                this.ship.sprite.x = this.ship.position[0];
                this.ship.sprite.y = this.ship.position[1];
                this.ship.sprite.rotation = this.ship.rigidBody.getRotation();

                this.draw2d.begin(this.draw2d.blend.alpha);
                this.draw2d.drawSprite(this.ship.sprite);
                this.draw2d.end();
            }
        }

        if (this.asteroid.rigidBody) {
            this.asteroid.rigidBody.getPosition(this.asteroid.position);

            if (this.asteroid.sprite) {
                this.asteroid.sprite.x = this.asteroid.position[0];
                this.asteroid.sprite.y = this.asteroid.position[1];
                this.asteroid.sprite.rotation = this.asteroid.rigidBody.getRotation();

                this.draw2d.begin(this.draw2d.blend.alpha);
                this.draw2d.drawSprite(this.asteroid.sprite);
                this.draw2d.end();
            }
        }
    };

    Application.prototype._clamp = function () {
        if (this.ship) {
            var shipPosition = this.ship.rigidBody.getPosition();
            shipPosition[1] = Math.min(Math.max(shipPosition[1], 22), this.height - 22);
            this.ship.rigidBody.setPosition(shipPosition);
        }
    };

    Application.prototype._frame = function () {
        this.time.setTime(TurbulenzEngine.time);

        this.inputDevice.update();

        while (this.world.simulatedTime < this.time.time) {
            this.world.step(1 / this.desiredFps);
        }

        this.background.update(this.time);
        this._clamp();

        if (this.graphicsDevice.beginFrame()) {
            this.graphicsDevice.clear([0.0, 0.0, 0.0, 1.0], 1.0, 0.0);

            this.draw2d.clear();
            this._draw();

            //this.debug.draw(this.draw2d, this.world);
            this.graphicsDevice.endFrame();
        }

        this.debug.setFps(this.graphicsDevice.fps);
    };

    Application.prototype.run = function () {
        var _this = this;
        if (!this.initialized) {
            this.init();
        }

        this.intervalId = TurbulenzEngine.setInterval(function () {
            return _this._frame();
        }, 1000 / this.desiredFps);

        return this;
    };

    Application.prototype.shutdown = function () {
        return this;
    };

    Application.create = function () {
        var application = new Application();

        return application;
    };
    return Application;
})();
//# sourceMappingURL=Application.js.map
