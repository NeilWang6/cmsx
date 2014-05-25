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
         * ��ʼ����Ŀ����
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
         * �л�����Nҳ
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * ��һҳ����һҳ
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * �����ڼ�ҳ
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
				            content = "�Ѿ���Ԥ�������·�ͬ��ָ�����ȼ����ӿɰ�Ԥ������Ԥ��";
				        } else if ( data.success == false ) {
				            content = "ϵͳ��������ϵ����Ա";
				        }
				        D.Message.confirm(confirmEl, {
				            msg: content,
				            title: '����ͬ��ģ��'
				        });
				    }
				})
				.fail(function() {
				    D.Message.confirm(confirmEl, {
				        msg: '��Ԥ�������·�ͬ��ָ��ʧ��',
				        title: '����ͬ��ģ��'
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
            // �ָ����������
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
    	              text = "ҳ��";
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
                            content = text + "�ָ��ɹ�";
                            var _parent = _object.parent();
                            _parent.text('�ѻָ�');
                        } else if ( data.requestStatus === "error" ) {
                            content = "ϵͳ��������ϵ����Ա";
                            if (data.error_code == "2"){
                            	  content = "�˼�¼������ָ�";
                            }
                        }
                        
                        D.Message.confirm(confirmEl, {
                            msg: content,
                            title: '��ʷҳ�����'
                        });
                    }
                })
                .fail(function() {
                    D.Message.confirm(confirmEl, {
                        msg: text + '�ָ�ʧ��',
                        title: '��ʷҳ�����'
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
