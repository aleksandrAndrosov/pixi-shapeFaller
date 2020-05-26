
export class ShapeView extends PIXI.Graphics {
    public draw(shape: any) {
        this.x = shape.position.x;
        this.y = shape.position.y;

        this.clear();
        this.beginFill(shape.color);
        this.drawer(shape);
        this.endFill();
    }

    private drawer(shape: any) {
        if (shape.points) {
            if (shape.points[0].length === 2){
                this.drawPoly(shape.points);
                return;
            }
            if (shape.points[0].length === 4){
                this.drawCloud(shape.points);
                return;
            }
        }
        if (shape.args) {
            if (shape.args.length === 3) {
                this.drawCircle(shape.args[0], shape.args[1], shape.args[2]);
                return;
            }
            if (shape.args.length === 4) {
                this.drawEllipse(shape.args[0], shape.args[1], shape.args[2], shape.args[3]);
                return;
            }
        }

        console.error('The shape is impossible to draw', shape)
    }

    private drawPoly(cords: any) {
        const points = cords.map((point: any) => new PIXI.Point(point[0], point[1]));
        const poly = new PIXI.Polygon(points);
        poly.close();
        this.drawPolygon(poly);
    }

    private drawCloud(points: any) {
        this.moveTo(points[0][2], points[0][3]);
        points.forEach((point: any, index: number) => {
            if (index === 0) return;
            this.quadraticCurveTo(point[0], point[1], point[2], point[3]);
        });
        this.quadraticCurveTo(points[0][0], points[0][1], points[0][2], points[0][3]);
    }

}
