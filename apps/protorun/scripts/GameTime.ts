class GameTime {

    public tick:            number = 0;
    public time:            number = 0;
    public previousTime:    number = 0;

    constructor(time?: number) {
        this.setTime(time || 0);
    }

    public setTime(time: number): void {

        this.previousTime   = this.time;
        this.time           = time;
        this.tick           = time - this.previousTime;

    }
}