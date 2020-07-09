const path = require('../settings/paths'),
    del = require('del');

function cleanCss() {
    return del(path.to.dist.css)
}

function cleanJs() {
    return del(path.to.dist.js)
}

function cleanDist() {
    return del([path.to.dist.root + '/**', '!' + path.to.dist.root])
}


exports.cleanCss = cleanCss;
exports.cleanJs = cleanJs;
exports.cleanDist = cleanDist;