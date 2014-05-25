/**
 * @package FD.app.cms.visualmanager
 * @author: hongss
 * @Date: 2011-09-01
 */

 ;(function($, D){
    var readyFun = [
        function(){
            var success = $('#dcms-page-save-success').val(),
            errors = $('.dcms-save-error'),
            length = errors.length;
            //if (success!=='true'){
            if ( errors.length>0 ){
                var msg,
                arrMsg = [];
                errors.each(function(){
                    var error = $(this);
                    arrMsg.push('<li>'+error.attr('id')+': '+error.val()+'</li>');
                });
                msg = '<ul>'+arrMsg.join('')+'</ul>';
                parent.FE.dcms.saveErrorMsg(msg);
                //}
            } else {
		var templateElms=$('.dcms-template-id'), templateIds;
		if(templateElms && templateElms.length){
		    templateIds=[];
		    templateElms.each(function(){
		    	templateIds.push({'code':$(this).attr('name'), 'id':$(this).val()})
		    });
		}
                parent.FE.dcms.reLoadPage(templateIds);
            }
        }
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
