/**
 * @author hongss
 * @userfor 派生CELL列表
 * @date 2011-12-24
 */

;(function($, D) {
    var readyFun = [
    /**
     * 需要改动
     */
    function() {
        $("#example").treeview();
    },
    /**
     * 删除
     */
    function() {
        $('.delete').click(function(e) {
            e.preventDefault();
            if(confirm('确认删除?')) {
                var cellId = $(this).data('cell-id');
                $("#eventType").attr('name', 'event_submit_do_deleteCell');
                $("#cellId").val(cellId);
                $('#eventForm').submit();
            }

        });
    }    
    ];
    
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);
