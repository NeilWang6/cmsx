 
/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */
 
 (function($, D){

	
    readyFun = [
        /**
         *  
         */
        function(){
        	$('#btn-sub').click(function(e){
                $('#addForm').submit();
        	});
        } 
        	,
         
        /**
         * 二级联动
         */
        function(){
        	$('#firstSelect').click(function(e){
        		e.preventDefault();
                var selectId = $('#firstSelect').val();
                // alert('saf' + selectId);
                var nameStr = $('#sel-name-'+selectId).val();
                var idStr = $('#sel-id-'+selectId).val(); 
                 var cataIdArray = idStr.split(";");
             	var cataNameArray = nameStr.split(";");
             	var shtml = "";
                 for(var i=0;i<cataIdArray.length;i++)
                {
                	if(cataIdArray[i]!='')
                	shtml = shtml + "<option value='" + cataIdArray[i] + "'>" + cataNameArray[i] + "</option>";
                }
                 $('#secondSelect').html(shtml);
         	});
        } 
    ]; 
    $(function(){
    	$.each(readyFun, function(i, fn){
            try {
            	fn();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }   		
    	})
    });    

 })(dcms, FE.dcms);
