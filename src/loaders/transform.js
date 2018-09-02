/**
 * Created by yuan on 2018/8/31.
 */
var config = require('./config.js');
var esprima = require('esprima')
const Promise = require("bluebird");
const path = require('path');
var fs = Promise.promisifyAll(require("fs"));
var request = Promise.promisify(require("request"));
let downloadPath = path.resolve(__dirname,'vendor')

function judgeType(node) {
    return (node.type === 'CallExpression')
        && (node.callee.name === 'transform')
        && (node.callee.type === 'Identifier')
}

async function transform(source,env,callback) {
    env=env.trim()
    if(!env){
        console.error("env-loader error: env required!")
        return;
    }
    let flag=false;

    const entries = [];

    esprima.parseModule(source, {}, async(node, meta)=>{
        /*console.log('node',node)
        console.log('meta',meta)*/
        if(judgeType(node)){
            flag = true
            entries.push({
                val:node.arguments[0].value,
                start: meta.start.offset,
                end: meta.end.offset
            });
        }
    })
    if(entries.length){
        const aaa = await fetchVendor(entries[0],env,source)
        callback(null,aaa)
    }else{
        callback(null,source)
    }
}

async function fetchVendor(obj,env,source) {
    const domain = config.environment[env].domain
    const protocol = env == 'prd'?'https:':'http:'
    let str = protocol + obj.val.replace(/\$\{env\}/,domain)
    let extName = str.split('/').pop()
    const async1 = await request(str).then(async(response) =>{
        const async2 = await fs.writeFileAsync(`${downloadPath}/${extName}`,response.body).then(function(data) {
            console.log(`${downloadPath}/${extName}:ok`)
            let transText = source.slice(obj.start,obj.end)
            var replaceText = `import $ from "./loaders/vendor/${extName}"`
            source = source.replace(transText,replaceText);
            return source
        });
        return async2
    });
    return async1
}


module.exports = transform