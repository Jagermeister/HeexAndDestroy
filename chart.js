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
            let keys = Object.keys(this.data);
            this.yDomainEnd = keys
                .map(k => this.data[k].reduce((p, c) => Math.max(p, c)))
                .reduce((p, c) => Math.max(p, c));
            this.xDomainEnd = this.data[1].length;
            for (let i = 0; i < keys.length; i++) {
                let data = this.data[i].slice();
                ctx.strokeStyle = utility.colors[i + 1];
                ctx.beginPath();
                ctx.moveTo(this.xRange(0), this.yRange(data.shift()));
                for (let a = 0, l = data.length; a < l; a++) {
                    ctx.lineTo(this.xRange(a + 1), this.yRange(data[a]));
                }
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            utility.strokeText(ctx, this.title, this.x + 50, this.y);
            utility.strokeText(ctx, this.yDomainEnd, this.x - 2, this.y + fontSize / 2, true);
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.stroke();
        }
    }
}