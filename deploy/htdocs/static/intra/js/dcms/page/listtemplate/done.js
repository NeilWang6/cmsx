/**
 * @package FD.app.cms.listTemplate
 * @author: arcthur.cheny
 * @Date: 2011-09-19
 */

;(function($, D){
    var readyFun = [
        function() {
            var catalogId = $('#catalog-id').val();
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var page = $(this).data('page');
                
                window.location.href = D.domain + '/page/list_template.html?catalogId=' + catalogId + '&page=' + page;
            });
        },
        function(){
            //快速通道
            $('#dcms-search-category').click(function(e){
                e.preventDefault();
                var catalogId = $('#selCategoryId').val();
                $('#catalog-id').val(catalogId);
                console.log($('#catalog-id'));
                window.location.href = D.domain + '/page/list_template.html?catalogId=' + catalogId;
            });
        },
        function(){
            var categoryIdEl = $('#selCategoryId'),
				categoryEl = $('#selcategoryName'),
				popTree = new D.PopTree();
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
        $('#mydivClose').click(function(){
        var bg_node = document.getElementById('bg');
	    var id = bg_node.relative;
	    bg_node.relative = null;
	    bg_node.style.display='none';
	    document.getElementById(id).style.display='none';
                });     
        /*弹出层*/
	showDiv = function(tid){
	   var id='popDiv2';
        var bg_node = document.getElementById('bg');
        document.getElementById('templateId').value=tid;
		document.getElementById(id).style.display='block';
		bg_node.style.display='block';
		bg_node.relative = id;
		var obj = $("#"+id);
	    var t = 100;
	    var left = (document.body.scrollWidth  -obj.width())/2 + "px";
	    obj.css({"position":"absolute","top":"100px","left":left});

	}	    
	 associate=function() {
	var form1 = document.getElementById("inlineForm");//ZD.get("inlineForm");
	form1.submit();
}        
 })(dcms, FE.dcms);
 


