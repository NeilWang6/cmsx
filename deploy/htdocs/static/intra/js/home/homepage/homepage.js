(function($, D){
    var readyFun = [
    ];
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
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
    
})(dcms, FE.dcms);
