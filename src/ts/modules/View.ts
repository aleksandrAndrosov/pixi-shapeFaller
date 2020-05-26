
import { ShapeView } from './ShapeView'

export class View {
    private stage: any;
    public children: ShapeView[];

    constructor() {
        this.children = [];
    }

    public initialize(stage: any) {
        this.stage = stage;
        this.children = [];
    }

    public checkShape(point: any) {
        let childIndex = -1;
        this.children.forEach((child, index) => {
            if (child.containsPoint(point)) {
                childIndex = index;
            }
        });

        return childIndex;
    }

    public drawShapes(shapes: any[]) {
        this.clearChildren();

        if (shapes.length > this.children.length) {
            shapes
                .filter((shape, index) => index > (this.children.length - 1))
                .forEach(shape => {
                    const child = new ShapeView();
                    this.children.push(child);
                });
        }

        shapes.forEach((shape, index) => {
            this.children[index].draw(shape);
            this.stage.addChild(this.children[index]);
        })
    }

    public getSurfaceOccupied(){
        let occupied = 0;

        if (!this.children.length) {
            return occupied;
        }

        const surfaceArr = this.children.map(child => {
            let bounds = child.getBounds();
            let surface = {
                x0: bounds.x,
                x1: bounds.x + bounds.width,
                y0: bounds.y,
                y1: bounds.y + bounds.height};

            if (surface.x0 < 0) {
                surface.x0 = 0;
            }

            if (surface.y0 < 0) {
                surface.y0 = 0;
            }

            if (surface.x1 > 800) {
                surface.x1 = 800;
            }

            if (surface.y1 > 600) {
                surface.y1 = 600;
            }

            return surface;
        });

        //todo can count surface more correct
        surfaceArr.forEach(({ x0, x1, y0, y1 }) => occupied += (x1 - x0) * (y1 - y0));

        return occupied;
    }

    private clearChildren() {
        this.children.forEach(child => {
            child.clear();
        });
        this.stage.removeChildren();
    }

}
