/**
 * @package FD.app.cms.searchtemplate
 * @author: arcthur.cheny
 * @Date: 2011-09-19
 */

;(function($, D){
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                
                var page = $(this).data('page');
                
                document.search_template.page.value = page;
                document.search_template.submit();
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
      /*µ¯³ö²ã*/
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