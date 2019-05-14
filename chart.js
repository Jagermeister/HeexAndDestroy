'use strict';

class Chart {
    constructor(dimensions, title) {
        this.x = dimensions.x;
        this.y = dimensions.y;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.title = title;

        this.xDomainEnd = 0;
        this.yDomainEnd = 0;
        this.data = {};
    }

    xRange(domain) {
        return this.x + this.width * (domain / this.xDomainEnd);
    }
    yRange(domain) {
        return this.y + this.height * (1 - domain / this.yDomainEnd);
    }

    display(ctx) {
        if (this.data && this.data[1] && this.data[1].length > 1) {
            let keys = Object.keys(this.data),
                x = this.x,
                y = this.y;
            this.yDomainEnd = keys
                .map(k => this.data[k].reduce((p, c) => Math.max(p, c)))
                .reduce((p, c) => Math.max(p, c));
            this.xDomainEnd = this.data[1].length;
            for (let p = 0; p < keys.length; p++) {
                let data = this.data[p].slice();
                ctx.strokeStyle = utility.colors[p + 1];
                ctx.beginPath();
                ctx.moveTo(this.xRange(0), this.yRange(data.shift()));
                for (let a = 0, l = data.length; a < l; a++) {
                    ctx.lineTo(this.xRange(a + 1), this.yRange(data[a]));
                }
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            utility.strokeText(ctx, this.title, x + 50, y);
            utility.strokeText(ctx, this.yDomainEnd, x - 2, y + fontSize / 2, true);
            utility.strokeLines(ctx, [[x, y], [x, y + this.height], [x + this.width, y + this.height]]);
        }
    }
}