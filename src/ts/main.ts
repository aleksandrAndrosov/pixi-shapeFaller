
import { Controller } from './modules/Controller'

export class Game {
    private app: PIXI.Application;
    private controller: Controller;

    constructor() {
        this.createController();
        this.addHandlers();
    }

    private addHandlers() {
        document.getElementById('iGravity').onclick = () => this.controller.increaseGravity();
        document.getElementById('dGravity').onclick = () => this.controller.decreaseGravity();
        document.getElementById('iShapes').onclick = () => this.controller.increaseShapesPerSecond();
        document.getElementById('dShapes').onclick = () => this.controller.decreaseShapesPerSecond();
        this.controller.addHandler('gravity', (data: number) => {
            document.getElementById('gravity').innerHTML = data.toLocaleString();
        });
        this.controller.addHandler('shapesNumber', (data: number) => {
            document.getElementById('shapesNumber').innerHTML = 'Shapes on the screen: ' + data.toLocaleString();
        });
        this.controller.addHandler('surfaceOccupied', (data: number) => {
            document.getElementById('surfaceOccupied').innerHTML = 'Percent of surface occupied: ' + data.toLocaleString() + '%';
        });
        this.controller.addHandler('shapesPerSecond', (data: number) => {
            document.getElementById('shapesPerSecond').innerHTML = data.toLocaleString();
        })
    }

    private createApp() {
        this.app = this.controller.createApp();
        document.getElementById('pixi').appendChild(this.app.view);
    }

    private createController() {
        this.controller = new Controller();
        this.createApp();
    }

    public shiftCallback(data: any) {
        console.log(data);
    }
}

new Game();
