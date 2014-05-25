/**
 * 添加模板参数
 * @author: qingguo.yanqg
 * @createTime: 2011-10-10
 * @lastModified: 2011-10-10
 */
(function ($, D) {
    var cmsdomain = D.domain;
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                var page = $(this).data('page');
                $('#page-index').val(page);
		$('#listTemplateParam').submit();
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

   $('#dcms-add-param').click(function(e) {
                e.preventDefault();
                window.location.href = D.domain + '/page/add_template_param.html';
    });


})(dcms, FE.dcms);
