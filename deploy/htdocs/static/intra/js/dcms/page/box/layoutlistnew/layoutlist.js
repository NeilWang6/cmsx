/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D){
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html';
    ;
    
    readyFun = [    /**
     * ɾ��
     */
    function(){
        $('.oper-bar .btn-delete').click(function(e){
            e.preventDefault();
            if (confirm("ȷ��Ҫɾ��?")) {
                var _this = $(this), layoutId = _this.data('layout-id');
                
                
                $.ajax({
                    url: D.domain + "/page/box/delete_layout.html?layoutId=" + layoutId,
                    type: "POST",
                    async: false
                }).done(function(o){
                }).fail(function(){
                    alert('ϵͳ��������ϵ����Ա');
                });
                
                form.submit();
                
                
                
            }
            
        });
    }
    
];
    
    $(function(){
        $.each(readyFun, function(i, fn){
            try {
                fn();
            } 
            catch (e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });
    
})(dcms, FE.dcms);
