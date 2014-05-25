/**
 * @package FD.app.cms.managesnapshots
 * @author: maozy
 * @Date: 2011-12-08
 */

 ;(function($, D){
	 var snapshotUrl = $('#snapshotUrl').val();
	 
     function get(params, callback) {
     	$.ajax(snapshotUrl, {
    		dataType : 'jsonp',
    		data: params,
    		success: callback	
    	})
     }
     
     function displaySnapshots(snapshots){
    	 if(snapshots){
			 var html='', SPLIT_LINE="-----------------------------------------------------------------------------------------";
    		 // with versionIds
    		 if(snapshots.length && typeof snapshots.length=='number'){
    			 for(var i = 0; i < snapshots.length; i++){
    				 var snapshot = snapshots[i], lastTime = snapshot.gmtModified ? new Date(snapshot.gmtModified).format("yyyy-MM-dd hh:mm:ss") : '';
    				 if(snapshot.dbContent){    				
	       				 html+= "versionId = " + snapshot.versionId + (snapshot.hot ? " hot = " + snapshot.hot : '') + (lastTime? ' updateTime = ' + lastTime : '') + "\n";
	    				 html+= 'hot:' + SPLIT_LINE + "\n";
	    				 html+= (snapshot.content||'') + "\n";
	    				 html+= 'db:' +SPLIT_LINE + "\n";
	    				 html+= snapshot.dbContent  + "\n";;
	    				 html+= SPLIT_LINE + "\n";
    				 } else {
    					 html+= "versionId " + snapshot.versionId + " no snapshot found!"
    				 }
    			 }
    		 // with positionCode
    		 } else {
    			 for(var ruleId in snapshots){ 
					 var snapshot = snapshots[ruleId].snapshot, 
					 gmtModified = snapshot ? snapshot.gmtModified : null, 
					 lastTime = gmtModified ? new Date(gmtModified).format("yyyy-MM-dd hh:mm:ss") : '';
					 var ruleInfo = "ruleId = " + ruleId + " ruleName = " + snapshots[ruleId].ruleName + "\n";
					 if(snapshot){
						 html += "versionId = " + snapshot.versionId + (snapshot.hot ? " hot = " + snapshot.hot : '') + (lastTime? ' updateTime = ' + lastTime : '') + "\n";
						 html+= ruleInfo;
						 html+= snapshot.content ? (SPLIT_LINE + "\n" +snapshot.content + "\n" + SPLIT_LINE + "\n") : '';
					 } else {
						 html+= ruleInfo;
					 }
    			 }
    		 }
    		 html = $("#console").val() + html + '\r\r';
			 $("#console").val(html)
    	 }		 
     }
     
     function isNumber(s){
    	 return s&&s.match(/[0-9]+|[0-9]+(,[0-9]+)*/)
     }
     
     $(function(){
    	 $("#btnGet").click(function(){
    		 var versionIds=$("#versionIds").val(), positionCode=$("#positionCode").val(), param={cmd:'getSnapshotsByPositionCode'};
    		 if(positionCode){
    			 param = {cmd:'getSnapshotsByPositionCode', positionCode:positionCode};
    		 } else if(versionIds){
    			 if(!isNumber(versionIds)){
    				 alert('请输入正确的版本Id');
    				 return 
    			 }
    			 param = {cmd:'getSnapshotsByVersionIds', versionIds:versionIds}
    		 } else {
    			 alert('请输入投放位代码或模板版本Id')
    		 }
			 get(param, function(re){
				 if(re){
					 displaySnapshots(re.snapshots);
				 }
			 });
    	 });
    	 
    	 $("#btnFresh").click(function(){
    		 var versionIds=$("#versionIds").val(), positionCode=$("#positionCode").val(), param={cmd:'freshSnapshot'},forceHot=$("#forceHot").attr('checked');
    		 if(positionCode){
    			 param.positionCode=positionCode;
    		 } else if(versionIds){
    			 if(!isNumber(versionIds)){
    				 alert('请输入正确的版本Id');
    				 return 
    			 }
    			 param.versionIds = versionIds;
    			 param.forceHot = forceHot?true:false;
    		 } else {
    			 alert('请输入投放位代码或模板版本Id')
    		 }
			 // 清空强制加入热点
			 $("#forceHot").attr('checked', false);
			 get(param, function(re){
				 if(re){
					 if(re.status){
						 alert('操作成功!')
					 }
				 }
			 });    		 
    	 });
    	 
    	 $('#btnClear').click(function(){
    		 $("#console").val('')
    	 })
     });
     

 })(dcms, FE.dcms);
