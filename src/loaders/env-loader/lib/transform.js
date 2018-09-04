/**
 * Created by yuan on 2018/8/31.
 */
var esprima = require('esprima')
const path = require('path');
const loaderUtils = require('loader-utils')
const validate = require('schema-utils');
let downloadPath = path.resolve(process.cwd(), 'src')

function judgeType(node) {
    return (node.type === 'CallExpression')
        && (node.callee.name === 'envLoader')
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

    esprima.parseModule(source, {}, (node, meta)=> {
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
        callback(null, fetchVendor(entries[0], env, source))
    } else {
        callback(null, source)
    }
}

function fetchVendor(obj, env, source) {
    let extName = obj.val
    let transText = source.slice(obj.start, obj.end)
    if(env == 'prd'){
        const saveUrl = loaderUtils.urlToRequest(`${extName}`,downloadPath); // "path/to/module.js"
        //console.log(`${saveUrl}:ok`)
        var replaceText = `import "${saveUrl}"`
    }else{
        var replaceText = 'function envLoad(){}'
    }
    source = source.replace(transText, replaceText);
    return source
}


module.exports = transform