/**
 * Created by yuan on 2018/8/31.
 */
const loaderUtils = require('loader-utils')
const validate = require('schema-utils');
const transform = require('./transform')

let json = {
    "type": "object",
    "properties": {
        "content": {
            "type": "string"
        }
    }
}
module.exports = function (resource) {
    let callback = this.async();
    let options = loaderUtils.getOptions(this)
    validate(json,options,"env-loader");
    transform(resource,options.env,callback)
}