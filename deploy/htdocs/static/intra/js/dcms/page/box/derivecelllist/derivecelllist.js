/**
 * @author hongss
 * @userfor ����CELL�б�
 * @date 2011-12-24
 */

;(function($, D) {
    var readyFun = [
    /**
     * ��Ҫ�Ķ�
     */
    function() {
        $("#example").treeview();
    },
    /**
     * ɾ��
     */
    function() {
        $('.delete').click(function(e) {
            e.preventDefault();
            if(confirm('ȷ��ɾ��?')) {
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
