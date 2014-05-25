/**
 * @package FD.app.cms.rule.create
 * @author: hongss
 * @Date: 2011-09-27
 */

 ;(function($, D){
    var addPageForm = $('#js-save-page'),
    appInput = $('#js-get-app'), formValid,
    readyFun = [
        /**
         * 初始化类目数据
         */
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
            var categoryIdEl = $('#selCategoryId'),
				categoryEl = $('#selcategoryName'),
				popTree = new D.PopTree({
					modify: function(){
						formValid.valid(categoryEl);
					}
				});
            
            popTree.show(categoryEl, categoryEl, categoryIdEl, false);
            categoryEl.click(function(){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
            });
        },
        /**
         * 表单验证
         */
        function(){
            var validEls = $('[vg=1]', addPageForm);
            formValid = new FE.ui.Valid(validEls, {
                onValid: function(res, o){
                    var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                    if (tip.length>1){
                        for (var i=0, l=tip.length-1; i<l; i++){
                            tip.eq(i).remove();
                        }
                    }
                    if (res==='pass') {
                        tip.removeClass('dcms-validator-error');
                    } else {
                        switch (res){
                            case 'required':
                                msg = o.key+' 不能为空';
                                break;
                            default:
                                msg = '请填写正确的内容';
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
