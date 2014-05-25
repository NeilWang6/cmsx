/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-01-10
 */

;(function($, D) {
    var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [
    function() {
        $("#example").treeview();
    },

    function() {
        //$('#js-search-page').submit();
        FE.dcms.doPage();
    },

    /**
     * и╬ЁЩ
     */
    function() {
        $('.delete').click(function(e) {
            e.preventDefault();
            if(confirm('х╥хои╬ЁЩ?')) {
                var _this = $(this), cellId = _this.data('cell-id');
                $("#event_submit_do_searchCell").remove();
                var content = '<input type="hidden" name="event_submit_do_deleteCell" id="event_submit_do_searchCell" value="true"/>'
                searchForm.append(content);
                var content = '<input type="hidden" name="cellId" id="cellId" value="' + cellId + '">'
                searchForm.append(content);

                searchForm.submit();
            }

        });
    },function(){
        $('#cellOrderby').bind('change',function(e){
          searchForm.submit();
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
