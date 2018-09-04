import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: path.resolve(__dirname, '../src/loaders/env-loader'),
                    options: {
                        env: process.env.NODE_ENV
                    }
                }
            }]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) reject(err);

            resolve(stats);
        });
    });
};