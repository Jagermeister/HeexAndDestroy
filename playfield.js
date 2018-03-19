'use script';

class Playfield {
    constructor(dimensions, rowCount, colCount) {
        this.x = dimensions.x;
        this.y = dimensions.y;
        this.size = dimensions.size;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.cellCount = rowCount * colCount;
        this.data = {};

        this.playerHexSight = new Set();

        this.settingIsAutoPlay = false;
        this.settingPlayerCount = 9;
        this.settingCellPercentageRemoved = 0.25;
        this.settingPopulationStartingValue = 4;
    }

    init() {
        this.ownershipSetup();
    }

    ownershipSetup() {
        this.dataLayerAdd("owner");
        // Remove some cells
        for (let i = 0, l = this.cellCount * this.settingCellPercentageRemoved; i < l; i++) {
            this.dataLayerValueUpdate("owner", Math.floor(Math.random() * this.cellCount), -1);
        }

        this.dataLayerAdd("population");
        // Place players
        for (let i = this.settingIsAutoPlay ? 1 : 0, l = this.settingPlayerCount; i < l; i++) {
            let index = Math.floor(Math.random() * this.cellCount);
            if (this.dataLayerValueGet("owner", index) !== 0) {
                i--;
                continue;
            }

            this.dataLayerValueUpdate("owner", index, i + 1)
            this.dataLayerValueUpdate("population", index, this.settingPopulationStartingValue)
        }
    }

    dataLayerAdd(name) {
        this.data[name] = new Array(this.cellCount).fill(0)
    }

    dataLayerValueUpdate(name, index, value) {
        this.data[name][index] = value;
    }

    dataLayerValueGet(name, index) {
        return this.data[name][index];
    }

    xyToIndex(x, y) {
        return y * this.colCount + x;
    }

    indexToXY(index) {
        return [index % this.colCount, Math.floor(index / this.colCount)];
    }

    neighborsAll(index) {
        let neighbors = [], x, y;
        [x, y] = this.indexToXY(index);
        let isYEven = !(y % 2);

        if (x > 0) neighbors.push([x - 1, y]);
        if (y > 0) {
            if (isYEven && x > 0) neighbors.push([x - 1, y - 1]);
            else if (!isYEven) neighbors.push([x, y - 1]);
        }
        if (y + 1 < this.rowCount) {
            if (isYEven && x > 0) neighbors.push([x - 1, y + 1]);
            else if (!isYEven) neighbors.push([x, y + 1]);
        }
        if (x + 1 < this.colCount) neighbors.push([x + 1, y]);
        if (y > 0) {
            if (!isYEven && x + 1 < this.colCount) neighbors.push([x + 1, y - 1])
            else if (isYEven) neighbors.push([x, y - 1])
        }
        if (y + 1 < this.rowCount) {
            if (!isYEven && x + 1 < this.colCount) neighbors.push([x + 1, y + 1]);
            else if (isYEven) neighbors.push([x, y + 1]);
        }

        return neighbors.map(xy => this.xyToIndex(...xy));
    }

    neighbors(index) {
        return this.neighborsAll(index).filter(i => this.dataLayerValueGet("owner", i) !== -1);
    }

    colToX(col, row) {
        let s = this.size;
        return this.x - (Math.sqrt(3) * s / 2) + Math.sqrt(3) * s * (col + (row % 2 == 1 ? 0.5 : 1));
    }
    rowToY(row) {
        let s = this.size;
        return this.y - s * 3 / 4 + (row + 1) * (s * 3 / 2);
    }

    yToRow(y) {
        let s = this.size;
        return Math.floor((y - this.y + s * 3 / 4) / (s * 3 / 2));
    }
    xToCol(x, row) {
        let s = this.size;
        return Math.floor((x - this.x + (Math.sqrt(3) * s / 2)) / (Math.sqrt(3) * s) - (row % 2 == 1 ? 0.5 : 0));
    }

    playerVisionUpdate() {
        this.playerHexSight = new Set();
        for (let i = 0; i < this.cellCount; i++) {
            let cellPlayer = this.dataLayerValueGet("owner", i);
            if (cellPlayer == 1) {
                this.playerHexSight = new Set([...this.playerHexSight, i, ...this.neighborsAll(i)]);
            }
        }
    }

    display(ctx, isMapShown) {
        let playerColors = utility.colors;
        ctx.strokeStyle = '#F0F8FF';
        let x = this.x,
            y = this.y,
            size = this.size;
        for (let hy = 0, yl = this.rowCount; hy < yl; hy++) {
            for (let hx = 0, xl = this.colCount; hx < xl; hx++) {
                let cellIndex = this.xyToIndex(hx, hy),
                    cellPlayer = this.dataLayerValueGet("owner", cellIndex);

                if (isMapShown || this.playerHexSight.has(cellIndex)) {
                    this.displayHex(ctx, x, y);
                    ctx.stroke();
                    ctx.fillStyle = cellPlayer == -1 ? 'rgb(224, 255, 255)' : playerColors[cellPlayer];
                    ctx.fill();
                    
                    let t = map.dataLayerValueGet("population", cellIndex);
                    if (t) {
                        ctx.fillStyle = 'white';
                        let w = ctx.measureText(t);
                        ctx.fillText(t, x - w.width / 2, y + fontSize / 3);
                    }
                }
                x += Math.sqrt(3) * size;
            }
            y += size * 1.5;
            x -= Math.sqrt(3) * size * (this.colCount + (hy % 2 == 0 ? -0.5 : 0.5));
        }
    }

    displayHex(ctx, xCenter, yCenter) {
        let polySides = 6,
            isPolyPointedTop = true,
            degreeOffset = 360 / polySides,
            polyDegreeOffset = isPolyPointedTop ? degreeOffset / 2 : 0

        ctx.beginPath();
        for (let i = 0; i < polySides; i++) {
            let angle_rad = (Math.PI / 180) * (degreeOffset * i + polyDegreeOffset);
            ctx.lineTo(xCenter + this.size * Math.cos(angle_rad), yCenter + this.size * Math.sin(angle_rad));
        }
        ctx.closePath();
    }
}