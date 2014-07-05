
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
        this.graphicsDevice     = TurbulenzEngine.createGraphicsDevice({});
        this.draw2d             = Draw2D.create({graphicsDevice: this.graphicsDevice});
        this.background         = new Background();
        this.physics2dDevice    = Physics2DDevice.create();
        this.inputDevice        = TurbulenzEngine.createInputDevice({});
        this.time               = new GameTime(TurbulenzEngine.time);

        this.draw2d.configure({
            viewportRectangle:  [0, 0, this.width, this.height],
            scaleMode:          'scale'
        });
                
        this.background.init(this).load();
        
        // Cache padCodes
        var padCodes = this.inputDevice.padCodes;

        this.inputDevice.addEventListener('padmove', (lX, lY, lZ, rX, rY, rZ) => {
            if (this.ship && this.ship.rigidBody) {
                this.ship.rigidBody.setVelocity([0, - 1500 * lY]);
            }
        });

        this.inputDevice.addEventListener('keydown', (keycode) => {
            if (this.ship && this.ship.rigidBody) {
                if (keycode == 202) {
                    this.ship.rigidBody.setVelocity([0, -1500]);
                } else if (keycode == 203) {
                    this.ship.rigidBody.setVelocity([0, 1500]);
                }
            }
        });

        this.inputDevice.addEventListener('keyup', (keycode) => {
            if (this.ship && this.ship.rigidBody) {
                if (keycode == 202 || keycode == 203) {
                    this.ship.rigidBody.setVelocity([0, 0]);
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

    private _initWorld() {

        this.world = this.physics2dDevice.createWorld({
            gravity: [0, 1]
        });

        this._initPlayer();

    }

    private _initPlayer(): Application {

        var ship = this.ship = {
            width:      100,
            height:     100,
            position:   [300, this.height / 2],
            rotation:   Math.PI / 2,
            shape:      null,
            rigidBody:  null,
            sprite:     null
        };

        ship.shape = this.physics2dDevice.createPolygonShape({
            vertices: [
                [ 0,                        -ship.height / 2 + 22   ],
                [-ship.width / 2 + 30,       ship.height / 2 - 30   ],
                [ ship.width / 2 - 30,       ship.height / 2 - 30   ],
                [ 0,                        -ship.height / 2 + 22   ]
            ]
        });

        ship.rigidBody = this.physics2dDevice.createRigidBody({
            type:       'kinematic',
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
        
        var texture = this.graphicsDevice.createTexture({
            src: "assets/textures/playerShip3_blue.png",
            //src: "assets/textures/playerShip3_blue_mipmapped.dds",
            mipmaps: true,
            onload: function onLoadFn(texture) {
                if (texture) {
                    ship.sprite.setTextureRectangle([0, 0, 128, 128]);
                    ship.sprite.setTexture(texture);
                }
            }
        });

        return this;
    }

    private _draw() {

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

    }

    private _clamp() {
        if (this.ship) {
            var shipPosition = this.ship.rigidBody.getPosition();
            shipPosition[1] = Math.min(Math.max(shipPosition[1], 22), this.height - 22);
            this.ship.rigidBody.setPosition(shipPosition);
        }
    }

    private _frame() {

        this.time.setTime(TurbulenzEngine.time);
        
        this.inputDevice.update();

        while (this.world.simulatedTime < this.time.time) {
            this.world.step(1 / this.desiredFps);
        }

        this.background.update(this.time);
        this._clamp();

        if (this.graphicsDevice.beginFrame()) {

            var width = this.graphicsDevice.width;
            var height = this.graphicsDevice.height;
                
            this.graphicsDevice.clear([0.0, 0.0, 0.0, 1.0], 1.0, 0.0);
            
            this.draw2d.clear();
            this._draw();

            this.debug.draw(this.draw2d, this.world);

            this.graphicsDevice.endFrame();

        }

        this.debug.setFps(this.graphicsDevice.fps);
        
    }

    public run(): Application {

        if (!this.initialized) {
            this.init();
        }

        this.intervalId = TurbulenzEngine.setInterval(
            () => this._frame()
            , 1000 / this.desiredFps
        );

        return this;
    }

    public shutdown(): Application {

        return this;
    }

    static create(): Application {
        var application = new Application();

        return application;
    }
}