
export class Model {
    private _shapes: any[];
    private _gravity: number;
    private _deltaGravity: number;
    private _shapesPerSecond: number;
    private _deltaShapesPerSecond: number;
    private _timeToSpawn: number;
    private _timeLeft: number;
    private _shapeTypes: any;
    private _spawnPositionY: any;
    private _diePositionY: any;

    constructor() {
        this._shapes = []
    }

    public initialize() {
        this._gravity = 10;
        this._deltaGravity = 10;
        this._shapesPerSecond = 2;
        this._deltaShapesPerSecond = 1;

        this.countTimeToSpawn();
        this._timeLeft = 0;
        this._shapeTypes = [
            { type: 'triangle', points: [[-30, -15], [0, 30], [30, -15]] },
            { type: 'rectangle', points: [[-30, -30], [-30, 30], [30, 30], [30, -30]] },
            { type: 'pectangle', points: [[-20, -29], [-32, 7], [0, 30], [32, 7], [20, -29]] },
            { type: 'sixtangle', points: [[-30, -16], [-30, 16], [0, 32], [30, 16], [30, -16], [0, -32]] },
            { type: 'circle', args: [0, 0, 30] },
            { type: 'ellipse', args: [0, 0, 40, 30] },


            { type: 'cloud', points: [
                [-25, 10, -15, 10],
                [-5, 25, 10, 15],
                [40, 15, 25, -2],
                [25, -15, 13, -10],
                [5, -22, -5, -12],
                [-15, -17, -20, -8],
                [-30, -8, -25, 0]] }
        ];
        this._spawnPositionY = -40;
        this._diePositionY = 620;
    }

    public update(deltaTime: number) {
        this.addShape(deltaTime);
        this.moveShapes(deltaTime);
    }

    public onClick(shapeIndex: number) {
        const changeType = this._shapes[shapeIndex].type;
        const newColor = this.getRandomColor();

        this._shapes.splice(shapeIndex, 1);
        this._shapes.forEach(({ type }, index) => {
            if (type === changeType) {
                this._shapes[index].color = newColor;
            }
        })
    }

    public increaseGravity() {
        this._gravity += this._deltaGravity;
    }

    public decreaseGravity() {
        if (this._gravity - this._deltaGravity < 0) {
            this._gravity = 0;
            return;
        }
        this._gravity -= this._deltaGravity;
    }

    public get gravity() {
        return this._gravity;
    }

    public increaseShapesPerSecond() {
        this._shapesPerSecond += this._deltaShapesPerSecond;
        this.countTimeToSpawn()
    }

    public decreaseShapesPerSecond() {
        if (this._shapesPerSecond - this._deltaShapesPerSecond < 1) {
            this._shapesPerSecond = 1;
            return;
        }
        this._shapesPerSecond -= this._deltaShapesPerSecond;
        this.countTimeToSpawn();
    }

    public get shapesPerSecond() {
        return this._shapesPerSecond;
    }

    public createShape(point: any) {
        const {type, points, args} = this._shapeTypes[Math.floor(Math.random() * this._shapeTypes.length)];
        const { x, y } = point;
        const color = this.getRandomColor();
        // const isAlive = true;

        this.shapes.push(
            {
                type,
                points,
                args,
                position : {x, y},
                color,
                speed: 0
            }
        );
    }

    public get shapes() {
        return this._shapes;
    }

    private moveShapes(deltaMs: number) { //todo use telta ms
        this._shapes.forEach(shape => {
            shape.speed += this._gravity * deltaMs / 1000;
            shape.position.y += shape.speed  * deltaMs / 1000;
        });

        this._shapes = this._shapes
            .filter(({ position: { y } }) => y < this._diePositionY && y >= this._spawnPositionY);
    }

    private getRandomColor() { //todo real random
        const colors = [1, 1, 1].map(() => Math.floor(Math.random() * 256));
        return PIXI.utils.rgb2hex(colors);
        // return [
        //     0x9b59b6,
        //     0x2c3e50,
        //     0x3498db,
        //     0xf1c40f,
        //     0x8a49c6,
        //     0x1c2e30,
        //     0x3738ab,
        //     0xd1243a,
        // ][Math.floor(Math.random()*9)];
    }

    private addShape(delta: number) {
        this._timeLeft -=delta;
        if (this._timeLeft > 0) {
            return;
        }

        const { type, points, args } = this._shapeTypes[Math.floor(Math.random() * this._shapeTypes.length)];
        const y = this._spawnPositionY;
        const x = Math.random() * 800; //todo magic number;
        const color = this.getRandomColor();

        this.shapes.push(
            {
                type,
                points,
                args,
                position : { x, y },
                color,
                speed: 0
            }
        );

        this._timeLeft = this._timeToSpawn;
    }

    private countTimeToSpawn() {
        this._timeToSpawn = 1000 / this.shapesPerSecond;
    }

}
