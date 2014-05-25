/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-01-10
 */

;
(function($, D) {
    var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [
    function() {
        $("#example").treeview();

    },
    function() {
        //$('#js-search-page').submit();
        FE.dcms.doPage();
    },
    /**
     * 删除
     */
    function() {
        $('.js-delete').bind('click', function(e) {
            e.preventDefault();           
            var _this = $(this), materialLibId = _this.data('material-lib-id');
         
            $.post(D.domain + '/page/box/delete_material_lib.html', {
                "materialLibId" : materialLibId
            }, function(text) {
                var json = $.parseJSON(text);
                if(json && json.status && json.status === 'success') {
                    alert('成功删除');
                    window.location.href = "material_lab_list.html";
                } else {
                    alert('删除失败,请检查该素材库下面所有素材都已经删除!');
                }
            });

        })
       
    }];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(dcms, FE.dcms);
