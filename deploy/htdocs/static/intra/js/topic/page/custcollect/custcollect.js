/**
 * @author lusheng.linls
 * @usefor 普通专场自定义信息搜集页面
 * @date   2013.2.27
 */
 

;(function($,S){
	var readyFun = [
		function(){
            S.init({
                site : $('#site').val(),
                formId : '#formId',
                tid : $('#tid').val(),
                csrf : $('input[name="_csrf_token"]').val(),
                code : $('#code').val(),
                doneUrl : $('#doneUrl').val(),
                loginUrl : $('#loginUrl').val(),
                debug: false,
                ref : $('#ref').val(),
                viewonly : $('#viewonly').val(),
                imgServer : $('#imgServer').val()
            });
            S.render();
        }
    ];

    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery,FE.survey);
