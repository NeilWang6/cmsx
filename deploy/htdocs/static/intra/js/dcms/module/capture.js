/**
 * @author zhaoyang
 * @userfor ��ͼ
 * @date  2013.1.4
 * ʵ�ֿؼ��������ģ��Ľ�ͼ
 */
(function($, D){
    var host=location.host;
    D.Capture = {};
    /**
     * �ύ��ͼ����
     */
    function doCapture(info, callback){
    	// �ύ����
    	var data = JSON.stringify(info),
    	 url = 'http://xbrowser.alibaba-inc.com/rpc/task/zoomBuildTask.jsonp';
    	//url ="http://10.16.194.6:8080/rpc/task/zoomBuildTask.jsonp";
    	data && $.ajax({
            url: url,
            timeout: 5000,
            data: {'data' : data},
            dataType: 'jsonp',
            success: function(o){
            	if(o && !o.hasError && o.content){
        			callback(o.content);
        		}
            },
            error: function(jqXHR, textStatus, errorThrown){
            	if (window.console){
            		console.log('��ͼʧ��!' + textStatus);
            	}
            	// ʧ��Ҳ�ص�
            	callback(null);
            }
        });      	
    }
    /**
     * ��¼��ͼ��־
     */
    function logCapture(taskId, data){
    	var str = JSON.stringify(data);
    	taskId && $.getJSON(D.domain + '/page/build_picture.htm', {'taskId' : taskId, 'data': str}, function(){
    		
    	}, 'text');
    }
	/**
	 * {'cell-1': {"url":'http://somepath', size:'widthxheight', 'id':'elm id','class':'elem class'...},'module-2': {"url":'http://somepath', size:'widthxheight','id':'elm id','class':'elem class',...}}
	 * @param task
	 */    
    D.Capture["start"] = function(task, callback){
            var hosts, info = $("#captureInfo").val();
            if(!task){
            	return;
            }
            for(var p in task){
            	if(!p.match(/^(cell|module|template|pl_template|pl_layout|pl_module|pl_cell)\-.*/g)){
            		return;
            	}
            }
            if(!info){
            	alert('�����ý�ͼ��Ϣ!');
            	return ;
            }
            info = $.parseJSON(info);
        	if (host != 'cms.cn.alibaba-inc.com'){
	        	var query = $.unparam(location.href, '&') || {};
	            if(query.captureHost){
	            	hosts = $.parseJSON(captureHost);
	            }	 
	            if (hosts) {
	            	info.host = hosts;
	            }
        	} else if(info.host) {        		
        		delete info.host;
        	}
        	info.tasks = task;     
        	info.halt = true;
        	//console.log(JSON.stringify(info));
        	// ��ͼ
        	 doCapture(info, function(captureOut){
        		 if(captureOut && captureOut.id){
        			 logCapture(captureOut.id, info);
        		 }
        		 callback(captureOut);
        	 })
    };
})(dcms,FE.dcms);