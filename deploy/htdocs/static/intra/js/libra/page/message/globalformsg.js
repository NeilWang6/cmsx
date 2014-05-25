/**
 * 消息定制行为
 * @author: lusheng.linls
 * @Date: 2012-10-18
 */

;(function($, T) {
	 var readyFun = [
	 	//confirm
		function() {
 		var scopeEl=$('#message');
			scopeEl.delegate('.libra-msg-confirm', 'click', function(e) {
                e.preventDefault();
                var el = $(this);
                var confData=el.data('conf');
                confData.params._csrf_token=$('input[name=_csrf_token]').val();
                if(confirm("确定要执行？")) {
                    $.ajax({
                        url : confData.url,
                        dataType: 'jsonp',
                        data : confData.params,
                        error : function(jqXHR, textStatus, errorThrown) {
                            var msg = '执行失败';
                            if(jqXHR.status === 0) {
                                msg = '没权限！'
                            }
                            alert(msg);
                            return;
                        },
                        success : function(rs, textStatus, jqXHR) {
                            if(!rs.success) {
                                var msg = "执行失败";
                                if(rs.data) {
                                    msg = rs.data;
                                }
                                alert(msg);
                                return;
                            }
                            alert("执行成功");
                        }
                    });
                }
             });
		}
		
		
		];
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
})(jQuery, FE.tools);
