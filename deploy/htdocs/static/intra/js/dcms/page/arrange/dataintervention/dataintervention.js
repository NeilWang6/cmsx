/**
 * @author springyu
 */
;(function($, D) {
    var readyFun = [
    function() {
        var controller = new D.DataInterController();
         /**
         * 加载上传图片功能
         */
       controller.upload();
         
        /**
         * 初始化页面
         */
        controller.load();
       
    } ];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);
