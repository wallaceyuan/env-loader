import compiler from './compiler.js';

test('envLoader to import', async () => {
    const stats = await compiler('example.js');
    const output = stats.toJson().modules[0].source;
    if(process.env.NODE_ENV == 'prd'){
        expect(output).toBe('import "/Users/yuan/Documents/yuanyuan/Project/env-loader/src/vendor/lodash.min.js"');
    }else{
        expect(output).toBe('function envLoad(){}');
    }
});