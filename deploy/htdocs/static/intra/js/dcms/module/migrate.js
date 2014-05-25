;(function($, D) {
    $(function() {
        $('#btnPage').bind('click', function() {
            var oMigrate = $('#migratePage');
            var id = $('#pageId');
            var data = 'id=' + id.val();
            var back = $('#back');
            if(back.checked) {
                data += '&back=back';
            }
           // console.log(oMigrate.action);
            $.ajax({
                url : oMigrate.attr('action'),
                type:'post',
                async : false,
                data : data,
                success : function(o) {
                    //var retJson = $.parseJSON(o);
                    //callback.call(this, retJson);
                    alert(o);
                    return;
                }
            });
        });
    });
})(dcms, FE.dcms);
