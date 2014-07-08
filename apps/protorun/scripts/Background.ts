interface IDrawer {
    begin(blending?: string)        : void;
    draw(what: Object)              : void;
    drawSprite(sprite: Draw2DSprite): void;
    end()                           : void;

    blend: {
        additive: string;
        alpha   : string;
        opaque  : string;
    };
}

class BackgroundTile {

    private speed       : number;

    public sprite       : Draw2DSprite;
    public textureSrc   : string;
    
    constructor(textureSrc: string, speed: number = 0) {
        this.speed      = speed;
        this.textureSrc = textureSrc;
        this.sprite     = null;
    }

    public init(): BackgroundTile {
        this.sprite = Draw2DSprite.create({
            texture : null,
            x       : 0,
            y       : 0,
            width   : 512,
            height  : 512
        });

        return this;
    }

    public load(application: Application): BackgroundTile {

        if (!this.sprite) {
            this.init();
        }

        application.loadTexture(
            this.textureSrc,
            (texture: Texture): void => {
                if (texture) {
                    this.sprite.setWidth            (texture.width * application.getWidthRatio());
                    this.sprite.setHeight           (texture.height * application.getHeightRatio());
                    this.sprite.setTexture          (texture);
                    this.sprite.setOrigin           ([0, 0]);
                    this.sprite.setTextureRectangle ([0, 0, texture.width, texture.height]);
                }
            }
        );

        return this;
    }

    public update(time: GameTime): BackgroundTile {

        this.sprite.x -= this.speed / (time.tick * 1000);

        return this;
    }

    public draw(drawer: IDrawer, width: number, height: number): BackgroundTile {

        if (this.sprite.getTexture()) {

            var delta: number = this.sprite.x;

            this.sprite.y = 0;

            drawer.begin(drawer.blend.alpha);

            do {
                this.sprite.x = delta;
                do {

                    drawer.drawSprite(this.sprite);

                    this.sprite.x += this.sprite.getWidth();

                } while (this.sprite.x < width);

                this.sprite.y += this.sprite.getHeight();

            } while (this.sprite.y < height);

            drawer.end();

            this.sprite.x = delta;
        }

        return this;
    }
}

class Background {

    private skyColor    : Array<number>;
    private initialized : boolean;
    private background  : Array<BackgroundTile>;
    private application : Application;
    
    constructor() {
        this.initialized = false;
    }

    public init(application: Application): Background {

        this.application = application;
        this.skyColor = [0.16470588, 0.176470588, 0.2, 1.0];
        
        var background: Array<BackgroundTile>
            = this.background
            = new Array<BackgroundTile>();

        background.push(
            new BackgroundTile("assets/textures/background-s-1.png", 1)
        );

        background.push(
            new BackgroundTile("assets/textures/background-d1-1.png", 2)
        );

        for (var i: number = 0; i < background.length; i++) {
            background[i].init();
        }

        this.initialized = true;
        return this;
    }

    public load(): Background {

        for (var i: number = 0; i < this.background.length; i++) {
            this.background[i].load(this.application);
        }

        return this;
    }

    public draw(drawer: IDrawer): Background {

        drawer.begin();

        drawer.draw({
            color:                  this.skyColor,
            destinationRectangle: [
                0,
                0,
                this.application.width,
                this.application.height
            ]
        });

        drawer.end();

        for (var i: number = 0; i < this.background.length; i++) {
            this.background[i].draw(
                drawer,
                this.application.width,
                this.application.height
            );
        }

        return this;

    }

    public update(time: GameTime): Background {

        for (var i: number = 0; i < this.background.length; i++) {
            this.background[i].update(time);
        }

        return this;
    }

    static create(): Background {
        var background: Background = new Background();
        return background;
    }
}