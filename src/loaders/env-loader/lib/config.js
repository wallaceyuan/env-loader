'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    file: {
        dest: '../build',
        cdnDest: '../dist',
        scss: './src/**/*.scss',
        js: './src/*/*.js',
        src: './src',
        html: './src/index.html'
    },
    environment: {
        dev: {
            domain: 'dev.rs.com',
        },
        uat1: {
            domain: 'uat1.rs.com',
        },
        prd: {
            domain: 'mmall.com',
        }
    },
    cdnMapping: {
        js: {
            cdn: 'static1',
            name: 'js'
        },
        css: {
            cdn: 'static2',
            name: 'css'
        },
        image: {
            cdn: 'static3',
            name: 'image'
        },
        png: {
            cdn: 'static3',
            name: 'png'
        },
        jpg: {
            cdn: 'static3',
            name: 'jpg'
        },
        gif: {
            cdn: 'static3',
            name: 'gif'
        },
        bmp: {
            cdn: 'static3',
            name: 'bmp'
        },
        others: {
            cdn: 'static4',
            name: 'others'
        }
    }
};
module.exports = exports['default'];