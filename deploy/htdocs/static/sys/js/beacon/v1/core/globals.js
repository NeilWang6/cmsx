/**
 * 公共变量管理
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-09
 */
(function(){
    var isConflicted = true;
    if(window['MAGNETO'] === undefined){
        MAGNETO = {};
        isConflicted = false;
    }
    MAGNETO.globals = {
        win : window,
        doc : document,
        opener : opener,
        pageId : null,
        //js文件根目录
        jsUrlRoot : 'http://style.c.aliimg.com/sys/js/beacon/v1/',
        //各js文件相对路径配置
        /* jsUrlHash : {
            flash : 'plugins/client/flash.js',
            html5 : 'plugins/client/html5.js',
            spm: 'plugins/spm/spm-min.js'
        }, */
        customize : window['WolfSmoke'] || {},
        protocol : document.location.protocol,
        isConflicted : isConflicted,
        version : '44'
    };
})();