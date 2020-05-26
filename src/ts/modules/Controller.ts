
import * as PIXI from 'pixi.js';
import { View } from './View'
import { Model } from './Model'

export class Controller {
    private app: PIXI.Application;
    private model: Model;
    private view: View;
    private ticker: any;
    private handlers: any[];
    private stage: any;

    constructor() {
        this.model = new Model();
        this.view = new View();
        this.handlers = [];
    }

    public createApp() {
        this.app = new PIXI.Application(800, 600, { backgroundColor: 0x06ff00 });
        this.app.stage.interactive = true;
        this.app.stage.buttonMode = true;
        this.app.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);
        this.stage = this.app.stage;
        this.ticker = this.app.ticker;
        this.initialize();
        return this.app;
    }

    public addHandler(name: string, fn: any) {
        this.handlers.push({name, fn});
    }

    public increaseShapesPerSecond() {
        this.model.increaseShapesPerSecond();
    }

    public decreaseShapesPerSecond() {
        this.model.decreaseShapesPerSecond();
    }

    public increaseGravity() {
        this.model.increaseGravity();
    }

    public decreaseGravity() {
        this.model.decreaseGravity();
    }

    private mouseDown(e: any) {
        const shapeIndex = this.view.checkShape(e.data.global);

        if (shapeIndex >= 0) {
            this.model.onClick(shapeIndex);
            return;
        }

        this.model.createShape(e.data.global)
    }

    private initialize() {
        this.model.initialize();
        this.view.initialize(this.stage);

        this.stage.mousedown = (data: any) => this.mouseDown(data);

        this.ticker.add((delta: number): void => {
            this.update(this.ticker.elapsedMS);
        });
    }

    private update(elapsedMS: number) {
        this.model.update(elapsedMS);
        this.view.drawShapes(this.model.shapes);
        this.updateDOM();
    }

    private updateDOM(){
        this.handlers.forEach(({ name, fn }) => {
            switch (name){
                case 'gravity':
                    fn(this.model.gravity);
                    break;
                case 'shapesNumber':
                    fn(this.model.shapes.length);
                    break;
                case 'surfaceOccupied':
                    fn(Math.max(0, Math.floor(this.view.getSurfaceOccupied() / (800 * 600) * 100)));
                    break;
                case 'shapesPerSecond':
                    fn(this.model.shapesPerSecond);
                    break;
                default: break;
            }
        })
    }

}
