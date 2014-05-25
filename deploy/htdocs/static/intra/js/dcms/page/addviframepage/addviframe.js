/**
 * @package FD.app.cms.rule.create
 * @author: hongss
 * @Date: 2011-09-27
 */

 ;(function($, D){
    var addPageForm = $('#js-save-page'),
    hostNameInput = $('#js-get-hostname'), formValid,
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
         * 选择域名
         */
        function(){
            var hostNameSpan = $('#js-page-hostname'),
            hostName = hostNameInput.val();
            if (hostName){
                hostNameSpan.text('http://'+$(':selected', hostNameInput).text());
            }
            hostNameInput.change(function(){
                hostNameSpan.text('http://'+$(':selected', $(this)).text());
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
                            case 'userIsWrong' :
                                msg = '用户['+o.msg+']不存在或权限不够';
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
        },function(){
            $('#js-page-change').click(function(e){
		var isYes = confirm("确定将该VIFRAME页面转换为普通页面吗？");
		if(isYes==true) {
			$('#js-change-page-type').submit();
		}
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
    
    D.checkUserExist = function(config, handle){
        var self = this,
        userIds = $(this).val(),
        url = D.domain + '/page/check_user.html',
        opt = config['opt'],
        cfg = config['cfg'],
        data = {};
        data['users'] = userIds;
        data['permission'] = '';
        $.post(url, data, function(o){
            if (o!=='ok'){
                opt.msg = o;
                handle.call(self,'userIsWrong',opt);
            } else {
                cfg.isValid=true;
                handle.call(self,'pass',opt);
            }
        });
    }
 })(dcms, FE.dcms);
