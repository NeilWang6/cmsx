/**
 * @package FD.app.cms.copytemplate
 * @author: arcthur.cheny
 * @Date: 2011-09-21
 */

;(function($, D){
    var myValid = new FE.ui.Valid($('.dcms-form .need-verify'), {
        onValid: function (res, o) {
            var tip = $(this).nextAll('.dcms-validator-tip'),
                msg;
            if (res === 'pass') {
                tip.removeClass('dcms-validator-error');
            } else {
                switch (res) {
                case 'required':
                    msg = o.key + '±ÿ–ËÃÓ–¥';
                    break;
                }
                tip.html(msg);
                tip.addClass('dcms-validator-error');
            }
        }
    });

    var readyFun = [
        function() {
            $('#new-template').click(function(e){
                e.preventDefault();
                $('#templateForm').submit();
            });
            
            $('#templateForm').submit(function(){
                return myValid.valid();
            });
        }, 
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
            var popTree = new D.PopTree(),
            categoryIdEl = $('#selCategoryId'),
            categoryEl = $('#selcategoryName');
            
            popTree.show(categoryEl, categoryEl, categoryIdEl, false);
            categoryEl.click(function(){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
            });
        }
    ];
    
    $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
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