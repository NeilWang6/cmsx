/**
 * @package FD.app.cms.myfavorite
 * @author: arcthur.cheny
 * @Date: 2011-09-19
 */

;(function($, D){
    var form = $('#favoriteForm'),
        pageHidden = $('#favoritePage');
    
    var readyFun = [
        // select
        function() {
            var select = $('#favority-catalogid'),
                currentCat = $('#current-category');
            
            select.change(function(){
                pageHidden.val(1);
                form.submit();
            });
        },
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var page = $(this).data('page');
                pageHidden.val(page);
                form.submit();
            });
        },
        function(){
            //"导入"盒子类型页面
            $('.custom-page .import, .unchecked-custom-page .import').click(function(e){
        		 e.preventDefault();
                 var _this = $(this),
                 //templateId = $('#templateId').val(),
                 //pageId = $('#pageId').val(),
                 fromPage = _this.data('page-id');
                 //console.log(fromPage);
                 D.EditPage.importPage(null, null, fromPage);
        	});
        },
        function(){
            //"改"盒子类型页面
            $('.custom-page .modification, .unchecked-custom-page .modification').click(function(e){
        		 e.preventDefault();
                 var _this = $(this),
                 pageId = _this.data('page-id');
        		 $.getJSON(D.domain + '/page/box/can_edit_page.htm', {'pageId' : pageId}, D.EditPage.edit, 'text');   
        	});
        },
        function(){
            //排期
            $('.dcms-content .arrange-block').click(function(e){
                 var _this = $(this),
                 pageId = _this.data('page-id');
				 pageType = _this.data('page-type');
				 if( pageType =="VIFRAME" ||  pageType =="XML"){
				 	alert("不支持此类型页面");
				 	return;
				 } 
				 document.location.href = D.domain + '/page/arrange/arrange_block.htm?action=arrange_action&event_submit_do_query_arrange_block=true&&pageEnterFlag=true&pageId='+pageId;   
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