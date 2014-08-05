
class GameTime {
    public tick             : number = 0;
    public time             : number = 0;
    public previousTime     : number = 0;

    constructor(time?: number) {
        this.setTime(time || 0);
    }

    public setTime(time: number): void {

        this.previousTime   = this.time;
        this.time           = time;
        this.tick           = time - this.previousTime;

    }
}

class Application {
    
    private intervalId      : any;
    private graphicsDevice  : GraphicsDevice;
    private physics2dDevice : Physics2DDevice;
    private inputDevice     : InputDevice;
    private draw2d          : Draw2D;
    private desiredFps      : number;
    private world           : Physics2DWorld;
    private initialized     : boolean;
    private ship            : any;
    private background      : Background;
    private debug           : Debug;
    private asteroid        : any;
    private speed           : number;
    private movingShip      : number;

    public time     : GameTime;
    public width    : number;
    public height   : number;

    constructor() {
        this.initialized = false;
    }
    
    public init(): Application {

        this.intervalId         = null;
        this.graphicsDevice     = null;
        this.desiredFps         = 60;
        this.width              = 1920;
        this.height             = 1080;
        this.ship               = null;
        this.asteroid           = null;
        this.graphicsDevice     = TurbulenzEngine.createGraphicsDevice({/*vsyn: true, multisample: 16*/});
        this.draw2d             = Draw2D.create({graphicsDevice: this.graphicsDevice});
        this.background         = new Background();
        this.physics2dDevice    = Physics2DDevice.create();
        this.inputDevice        = TurbulenzEngine.createInputDevice({});
        this.time               = new GameTime(TurbulenzEngine.time);
        this.speed              = 1;
        this.movingShip         = 0;

        this.draw2d.configure({
            viewportRectangle:  [0, 0, this.width, this.height],
            scaleMode:          "scale"
        });
                
        this.background.init(this).load();
        
        // cache padCodes
        // var padCodes = this.inputDevice.padCodes;

        this.inputDevice.addEventListener(
            "padmove",
            (
                lX: number,
                lY: number,
                lZ: number,
                rX: number,
                rY: number,
                rZ: number
            ): void => {
                if (this.ship && this.ship.rigidBody) {
                    this.ship.rigidBody.setVelocity([0, - 1500 * lY]);
                }
            }
        );

        this.inputDevice.addEventListener("keydown", (keycode: number): void => {
            if (this.ship && this.ship.rigidBody) {
                if (keycode === 202) {
                    this.movingShip = -1;
                } else if (keycode === 203) {
                    this.movingShip = 1;
                }
            }
        });

        this.inputDevice.addEventListener("keyup", (keycode: number): void => {
            if (this.ship && this.ship.rigidBody) {
                if (keycode === 202 || keycode === 203) {
                    this.movingShip = 0;
                }
            }
        });

        this._initWorld();

        this.debug = new Debug(this.graphicsDevice, this.width, this.height);

        this.initialized = true;
        return this;
    }

    public loadTexture(src: string, callback: (texture: any) => void): void {
        this.graphicsDevice.createTexture({
            src: src,
            mipmaps: true,
            onload: callback
        });
    }

    public getWidthRatio(): number {
        if (this.draw2d) {
            return this.width / this.draw2d.scissorWidth;
        }
        return 0;
    }

    public getHeightRatio(): number {
        if (this.draw2d) {
            return this.height / this.draw2d.scissorHeight;
        }
        return 0;
    }

    public getSpeed(): number {
        return this.speed;
    }

    private _initWorld(): Application {

        this.world = this.physics2dDevice.createWorld({
            gravity: [-10, 0]
        });

        this
            ._initPlayer()
            ._addAsteroid();

        return this;
    }

    private _addAsteroid(): Application {

        var asteroid = this.asteroid = {
            width: 128,
            height: 128,
            position: [this.width + 100, -5 + this.height / 2],
            shape: null,
            rigidBody: null,
            sprite: null
        };

        asteroid.shape = this.physics2dDevice.createPolygonShape({
            material: this.physics2dDevice.createMaterial({ density: 5, staticFriction: 0.0000001, dynamicFriction: 0.000001, rollingFriction: 0.000001 }),
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

        this.loadTexture(
            "assets/textures/meteorBrown_big3.png",
            (texture: Texture): void => {
                if (texture) {
                    asteroid.sprite.setTextureRectangle([0, 0, 128, 128]);
                    asteroid.sprite.setTexture(texture);
                }
            }
        );

        asteroid.rigidBody.setVelocity([-120 - (this.getSpeed() / 5), 2]);
        asteroid.rigidBody.setAngularVelocity(0.25);

        return this;
    }

    private _initPlayer(): Application {

        var ship = this.ship = {
            width:      128,
            height:     128,
            position:   [300, this.height / 2],
            rotation:   Math.PI / 2,
            shape:      null,
            rigidBody:  null,
            sprite:     null
        };

        ship.shape = this.physics2dDevice.createPolygonShape({
            vertices: [
                [ 0,  -38   ],
                [ 28,  22   ],
                [ 15,  35   ],
                [-15,  36   ],
                [-28,  22   ],
                [ 0,  -38   ]
            ]
        });

        ship.rigidBody = this.physics2dDevice.createRigidBody({
            type:       "kinematic",
            shapes:     [ship.shape],
            position:   ship.position,
            rotation:   ship.rotation
        });

        this.world.addRigidBody(ship.rigidBody);

        ship.sprite = Draw2DSprite.create({
            texture:    null,
            position:   [ship.position[0] - ship.width / 2, ship.position[1] - ship.height / 2],
            width:      ship.width,
            height:     ship.height
        });
        
        this.graphicsDevice.createTexture({
            src: "assets/textures/playerShip3_blue.png",
            // src: "assets/textures/playerShip3_blue_mipmapped.dds",
            mipmaps: true,
            onload: function onLoadFn(texture: Texture): void {
                if (texture) {
                    ship.sprite.setTextureRectangle([0, 0, 128, 128]);
                    ship.sprite.setTexture(texture);
                }
            }
        });

        return this;
    }

    private _draw(): void {

        this.background.draw(this.draw2d);

        if (this.ship.rigidBody) {
            this.ship.rigidBody.getPosition(this.ship.position);
            
            if (this.ship.sprite) {

                this.ship.sprite.x          = this.ship.position[0];
                this.ship.sprite.y          = this.ship.position[1];
                this.ship.sprite.rotation   = this.ship.rigidBody.getRotation();

                this.draw2d.begin(this.draw2d.blend.alpha);
                this.draw2d.drawSprite(this.ship.sprite);
                this.draw2d.end();
            }
        }

        if (this.asteroid.rigidBody) {
            this.asteroid.rigidBody.getPosition(this.asteroid.position);

            if (this.asteroid.position[0] < -this.asteroid.width) {
                this.world.removeRigidBody(this.asteroid.rigidBody);
                this.asteroid.rigidBody = null;
                this.asteroid.sprite = null;
            }

            if (this.asteroid.sprite) {

                this.asteroid.sprite.x = this.asteroid.position[0];
                this.asteroid.sprite.y = this.asteroid.position[1];
                this.asteroid.sprite.rotation = this.asteroid.rigidBody.getRotation();

                this.draw2d.begin(this.draw2d.blend.alpha);
                this.draw2d.drawSprite(this.asteroid.sprite);
                this.draw2d.end();

            }
        }

    }

    private _clamp(): void {
        if (this.ship) {
            var shipPosition = this.ship.rigidBody.getPosition();

            if (this.ship.rigidBody.getVelocity()[1] < 0 && this.movingShip <= 0 && shipPosition[1] <= 62) {
                this.ship.rigidBody.setVelocity([
                    0,
                    Math.max(
                        this.ship.rigidBody.getVelocity()[1],
                        this.ship.rigidBody.getVelocity()[1] * ((shipPosition[1] - 22) / 40)
                    )
                ]);
            }

            if (this.ship.rigidBody.getVelocity()[1] > 0 && this.movingShip >= 0 && this.height - shipPosition[1] <= 62) {
                this.ship.rigidBody.setVelocity([
                    0,
                    Math.min(
                        this.ship.rigidBody.getVelocity()[1],
                        this.ship.rigidBody.getVelocity()[1] * ((this.height - shipPosition[1] - 22) / 40)
                    )
                ]);
            }

            shipPosition[1] = Math.min(Math.max(shipPosition[1], 22), this.height - 22);

            if (shipPosition[1] <= 22 || shipPosition[1] >= this.height - 22) {
                this.ship.rigidBody.setVelocity([0, 0]);
            }

            this.ship.rigidBody.setPosition(shipPosition);
        }
    }

    private _frame(): void {

        this.time.setTime(TurbulenzEngine.time);
        
        this.inputDevice.update();

        if (this.movingShip) {
            this.ship.rigidBody.setVelocity([0, this.ship.rigidBody.getVelocity()[1] + (this.movingShip * (1000 * this.time.tick))]);
        }

        while (this.world.simulatedTime < this.time.time) {
            this.world.step(1 / this.desiredFps);
        }

        this.background.update(this.time);
        this._clamp();

        if (this.graphicsDevice.beginFrame()) {
    
            this.graphicsDevice.clear([0.0, 0.0, 0.0, 1.0], 1.0, 0.0);
            
            this.draw2d.clear();
            this._draw();

            this.debug.draw(this.draw2d, this.world);

            this.graphicsDevice.endFrame();

        }

        this.speed = 1 / (1 + Math.exp(0.01 * -this.time.time + 3)) * 100;
        
        this.debug.setFps(this.graphicsDevice.fps);
        this.debug.setSpeed(this.getSpeed());
        this.debug.setTime(this.time.time);
        
    }

    public run(): Application {

        if (!this.initialized) {
            this.init();
        }

        this.intervalId = TurbulenzEngine.setInterval(
            (): void => this._frame()
            , 1000 / this.desiredFps
        );

        return this;
    }

    public shutdown(): Application {

        return this;
    }

    static create(): Application {
        var application: Application = new Application();

        return application;
    }
}