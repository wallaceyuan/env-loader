/**
 * Created by yuan on 2018/8/31.
 */
var config = require('./config.js');
var esprima = require('esprima')

function judgeType(node) {
    return (node.type === 'CallExpression')
        && (node.callee.name === 'transform')
        && (node.callee.type === 'Identifier')
}

function transform(source,env) {
    env=env.trim()
    if(!env){
        console.error("env-loader error: env required!")
        return;
    }
    let flag=false;

    esprima.parseModule(source, {}, function (node, meta) {
        if(judgeType(node)){
            flag = true
            //console.log('node',node)
            console.log('meta',meta)
            const domain = config.environment[env].domain
            const protocol = env == 'prd'?'https:':'http:'
            let str = protocol + node.arguments[0].value.replace(/\$\{env\}/,domain)
            let tra = source.slice(meta.start.offset,meta.end.offset)
            //var re = new RegExp("^\\" + tra + "$","gim"); // re为/^\d+bl$/gim
            var aaaa = source.replace(tra,'')
            console.log('aaaaaaaaaaaaaaaa',aaaa)
            return source
        }
    })

    return flag?(function transform() {})+source:source

}

module.exports = transform