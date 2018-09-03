/**
 * Created by yuan on 2018/8/31.
 */
var config = require('./config.js');
var esprima = require('esprima')
const Promise = require("bluebird");
const path = require('path');
var fs = Promise.promisifyAll(require("fs"));
var request = Promise.promisify(require("request"));
const loaderUtils = require('loader-utils')
const validate = require('schema-utils');
let downloadPath = path.resolve(__dirname, 'vendor')

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
        const val = await fetchVendor(entries[0], env, source)
        callback(null, val.source)
        /*this.resolve(this.context, val.saveUrl, function (err, res) {
            console.log('err, reserr, reserr, res',err, res)
            callback(null, val.source)
        })*/
    } else {
        callback(null, source)
    }
}

async function fetchVendor(obj, env, source) {
    const domain = config.environment[env].domain
    const protocol = env == 'prd'||'boot' ? 'https:' : 'http:'
    let str = protocol + obj.val.replace(/\$\{env\}/, domain)
    let extName = str.split('/').pop()
    const response = await request(str)
    const saveUrl = loaderUtils.urlToRequest(`/${extName}`,downloadPath); // "path/to/module.js"
    await fs.writeFileAsync(saveUrl, response.body)
    console.log(`${saveUrl}:ok`)
    let transText = source.slice(obj.start, obj.end)
    var replaceText = `import "${saveUrl}"`
    source = source.replace(transText, replaceText);
    return {source, saveUrl}
}


module.exports = transform