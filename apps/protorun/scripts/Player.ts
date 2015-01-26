class Player {

    private score:   number = 0;
    private health:  number = 0.0;

    constructor() {
        
    }

    public init(): Player {

        this.score  = 0;
        this.health = 1.0;

        return this;
    }

    public getScore(): number {
        return this.score;
    }

    public getHealth(): number {
        return Math.floor(this.health * 100);
    }
}