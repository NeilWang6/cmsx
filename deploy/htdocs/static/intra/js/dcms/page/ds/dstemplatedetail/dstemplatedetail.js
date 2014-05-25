/**
 * @package FD.app.cms.rule.create
 * @author: zhaoyang.maozy
 * @Date: 2012-01-09
 */

 ;(function($, D){
    var addPageForm = $('#js-save-page'),
    readyFun = [
        /**
         * ����֤
         */
        function(){
            var validEls = $('input', addPageForm),
            formValid = new FE.ui.Valid(validEls, {
                onValid: function(res, o){
                    var tip = $(this).nextAll('.dcms-validator-tip'), msg;
	                console.log(res === 'pass');
					if (res === 'pass') {
						tip.removeClass('dcms-validator-error');
					} else {
						switch (res) {
							case 'required':
								msg = '����д���ֶ�';
								break;
							case 'reg':
								msg = '����д����ĸ��ͷ��ֻ������ĸ�����ֵ�4-20λ���ȵ�ֵ';
								break;
							case 'fun':
								msg = o.msg;
								break;
						}
						tip.text(msg);
						tip.addClass('dcms-validator-error');
					}
                    
                }
            });
            addPageForm.submit(function(){
                return formValid.valid();
            });
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

 })(dcms, FE.dcms);
