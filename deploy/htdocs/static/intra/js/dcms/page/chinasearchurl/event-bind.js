/**
 * @author springyu
 */
;(function($, D) {
    var readyFun = [
    function() {
       
        $('#btnPage').bind('click', function() {
               var oMigrate = $('#migratePage');
               var data = oMigrate.serialize();
               console.log(data);
            $('#result').val('');
            $.ajax({
                url : oMigrate.attr('action'),
                type : 'post',
                async : false,
                data:data,
                success : function(o) {
                    var retJson = $.parseJSON(o);
                    //callback.call(this, retJson);
                    if (retJson){
                        if (retJson.status==='success'){
                            $('#result').val(o);
                        } else {
                              $('#result').val('');
                        }
                    }
                    
                   alert(retJson.status);
                    return;
                }
            });
        });
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
        });
    });

})(dcms, FE.dcms);
