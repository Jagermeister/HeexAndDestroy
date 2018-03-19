'use strict';

var utility = {};
utility.canvasCreate = function(containerId, id, dimensions) {
    let container = document.getElementById(containerId);
    if (container) {
        let canvas = document.createElement('CANVAS');
        canvas.id = id;
        canvas.setAttribute('width', dimensions.width);
        canvas.setAttribute('height', dimensions.height);
        canvas.oncontextmenu = 'return false;';
        canvas.style.background = 'rgb(130, 187, 236)';
        container.appendChild(canvas);
        return canvas;
    }
};

utility.getParameterByName = function(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

utility.colors = ["gray", "#9467bd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

utility.strokeText = function(ctx, text, x, y, isAlignedRight) {
    if (isAlignedRight) x -= ctx.measureText(text).width;
    ctx.strokeText(text, x, y);
};