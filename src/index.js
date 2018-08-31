/**
 * Created by yuan on 2018/8/31.
 */
transform(
    '//oamapproval.${env}/public/moa/static/crossdomainpage.min.js'
)
/*transform([
    '/oamapproval.${env}.com/public/moa/static/crossdomainpage.min.js',
    '/baidu.${env}.com/',
])*/
document.getElementById('app').innerHTML = 'HELLO'