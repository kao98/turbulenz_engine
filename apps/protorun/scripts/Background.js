var BackgroundTile = (function () {
    function BackgroundTile(textureSrc, speed) {
        if (typeof speed === "undefined") { speed = 0; }
        this.speed = speed;
        this.textureSrc = textureSrc;
        this.sprite = null;
    }
    BackgroundTile.prototype.init = function () {
        this.sprite = Draw2DSprite.create({
            texture: null,
            x: 0,
            y: 0,
            width: 512,
            height: 512
        });

        return this;
    };

    BackgroundTile.prototype.load = function (application) {
        var _this = this;
        if (!this.sprite) {
            this.init();
        }

        application.loadTexture(this.textureSrc, function (texture) {
            if (texture) {
                _this.sprite.setWidth(texture.width * application.getWidthRatio());
                _this.sprite.setHeight(texture.height * application.getHeightRatio());
                _this.sprite.setTexture(texture);
                _this.sprite.setOrigin([0, 0]);
                _this.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
            }
        });

        return this;
    };

    BackgroundTile.prototype.update = function (time, gameSpeed) {
        this.sprite.x -= (this.speed * gameSpeed) / (time.tick * 1000);

        return this;
    };

    BackgroundTile.prototype.draw = function (drawer, width, height) {
        if (this.sprite.getTexture()) {
            var delta = this.sprite.x;

            this.sprite.y = 0;

            drawer.begin(drawer.blend.alpha);

            do {
                this.sprite.x = delta;
                do {
                    drawer.drawSprite(this.sprite);

                    this.sprite.x += this.sprite.getWidth();
                } while(this.sprite.x < width);

                this.sprite.y += this.sprite.getHeight();
            } while(this.sprite.y < height);

            drawer.end();

            this.sprite.x = delta;
        }

        return this;
    };
    return BackgroundTile;
})();

var Background = (function () {
    function Background() {
        this.initialized = false;
    }
    Background.prototype.init = function (application) {
        this.application = application;
        this.skyColor = [0.16470588, 0.176470588, 0.2, 1.0];

        var background = this.background = new Array();

        background.push(new BackgroundTile("assets/textures/background-s-1.png", 1 / 5));

        background.push(new BackgroundTile("assets/textures/background-d1-1.png", 1 / 4));

        for (var i = 0; i < background.length; i++) {
            background[i].init();
        }

        this.initialized = true;
        return this;
    };

    Background.prototype.load = function () {
        for (var i = 0; i < this.background.length; i++) {
            this.background[i].load(this.application);
        }

        return this;
    };

    Background.prototype.draw = function (drawer) {
        drawer.begin();

        drawer.draw({
            color: this.skyColor,
            destinationRectangle: [
                0,
                0,
                this.application.width,
                this.application.height
            ]
        });

        drawer.end();

        for (var i = 0; i < this.background.length; i++) {
            this.background[i].draw(drawer, this.application.width, this.application.height);
        }

        return this;
    };

    Background.prototype.update = function (time) {
        for (var i = 0; i < this.background.length; i++) {
            this.background[i].update(time, this.application.getSpeed());
        }

        return this;
    };

    Background.create = function () {
        var background = new Background();
        return background;
    };
    return Background;
})();
//# sourceMappingURL=Background.js.map
