/**
 * Created by yuan on 2018/8/31.
 */
var config = require('./config.js');
var esprima = require('esprima')
const path = require('path');
const loaderUtils = require('loader-utils')
const validate = require('schema-utils');
let downloadPath = path.resolve(process.cwd(), 'src')

function judgeType(node) {
    return (node.type === 'CallExpression')
        && (node.callee.name === 'transform')
        && (node.callee.type === 'Identifier')
}

let json = {
    "type": "object",
    "properties": {
        "content": {
            "type": "string"
        }
    }
}

async function transform(source) {
    this.cacheable();
    let callback = this.async();
    let options = loaderUtils.getOptions(this)
    validate(json, options, "env-loader");

    let env = options.env.trim()
    if (!env) {
        console.error("env-loader error: env required!")
        return;
    }
    let flag = false;

    const entries = [];

    esprima.parseModule(source, {}, async(node, meta)=> {
        /*console.log('node',node)
         console.log('meta',meta)*/
        if (judgeType(node)) {
            flag = true
            node.arguments.map(argument=>{
                entries.push({
                    val: argument.value,
                    start: meta.start.offset,
                    end: meta.end.offset
                });
            })

        }
    })

    if (entries.length) {

        callback(null, await fetchVendor(entries[0], env, source))
    } else {
        callback(null, source)
    }
}

async function fetchVendor(obj, env, source) {
    let extName = obj.val
    let transText = source.slice(obj.start, obj.end)
    if(env == 'prd'|| env =='boot' ){
        const saveUrl = loaderUtils.urlToRequest(`${extName}`,downloadPath); // "path/to/module.js"
        console.log(`${saveUrl}:ok`)
        var replaceText = `import "${saveUrl}"`
    }else{
        var replaceText = ''
    }
    source = source.replace(transText, replaceText);
    return source
}


module.exports = transform