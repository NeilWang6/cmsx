/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-02-21
 */

 ;(function($, D){
    var confirmEl = $('#dcms-message-confirm');
    var searchPageForm = $('#js-search-page'),
    pageNum = $('#js-page-num'),
    readyFun = [
        /**
         * 初始化类目数据
         * modify by hongss on 2011.12.05
         */
        function(){
            //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
             var popTree = new D.PopTree(),
            categoryIdEl = $('#selCategoryId'),
            categoryEl = $('#selcategoryName');
            
            categoryEl.click(function(){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
            });
        },
        /**
         * 切换到第N页
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * 上一页、下一页
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * 跳到第几页
         */
        function(){
            $('#js-jumpto-page').click(function(e){
                var n = $('#js-jump-page').val();
                setPageNum(n);
            });
        },
	/***/
	function(){
            $('.sync-template').live('click', function(e){
 				e.preventDefault();
				var _this = $(this);
				var param = _this.data('param');
				$.ajax({
				    url: D.domain + "/page/appCommand.html?" + param,
				    type: "GET"
				})
				.done(function(o) {
				    if (!!o) {
				        var data = $.parseJSON(o);
				        var content = '';
				        if ( data.success == true ) {
				            content = "已经向预发布机下发同步指定，等几分钟可绑定预发布机预览";
				        } else if ( data.success == false ) {
				            content = "系统错误，请联系管理员";
				        }
				        D.Message.confirm(confirmEl, {
				            msg: content,
				            title: '立即同步模板'
				        });
				    }
				})
				.fail(function() {
				    D.Message.confirm(confirmEl, {
				        msg: '向预发布机下发同步指定失败',
				        title: '立即同步模板'
				    });
				});
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
    
    function setPageNum(n){
        pageNum.val(n);
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);
 

(function($, D){
    var confirmEl = $('#dcms-message-confirm');

    var readyFun = [
        function() {
            var restoreMade = $('.on-made'),
                restoreMade2 = $('.off-made');
            
            restoreMade.live('click', function(e) {
                e.preventDefault();
                var _this = $(this),
                customId = _this.data('custom-id');
                var _url = D.domain + "/page/search_his_page.html?action=HisPageManager&event_submit_do_restorePage=true";
                doRestore(_url,customId,_this);
            });
            // 恢复并入白名单
            restoreMade2.live('click', function(e) {
                e.preventDefault();
                var _this = $(this),
                customId = _this.data('custom-id');
                var _url = D.domain + "/page/search_his_page.html?action=HisPageManager&event_submit_do_restorePage=true&addWhiteListFlag=true";
                doRestore(_url,customId,_this);
            });
            
            

        }
    ];
    
    var doRestore = function(_url,customId,_object){
    	              text = "页面";
    	          $.ajax({
                    url: _url,
                    data: {
                        "pageId" : customId
                    },
                    type: "POST",
                    timeout:100000
                })
                .done(function(o) {
                    if (!!o) {
                        var data = $.parseJSON(o),
                            content = '';
                        
                        if ( data.requestStatus === "success" ) {
                            content = text + "恢复成功";
                            var _parent = _object.parent();
                            _parent.text('已恢复');
                        } else if ( data.requestStatus === "error" ) {
                            content = "系统错误，请联系管理员";
                            if (data.error_code == "2"){
                            	  content = "此记录不允许恢复";
                            }
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '历史页面管理'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + '恢复失败',
                        title: '历史页面管理'
                    });
                });
    }
    
    $(function(){
         for (var i = 0, l = readyFun.length; i < l; i++) {
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
