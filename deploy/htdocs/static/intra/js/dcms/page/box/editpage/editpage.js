
 ;(function($, D){
     var readyFun = [
	function(){
            $('#dcms-box-btn-unlock').click(function(){
				   var url = D.domain + '/page/box/unlock_resource.htm';
				    var pageId =$(this).data("page-id");
				    var extParam=$(this).data('param');
                                    var params = {type: 'page', resourceCode: pageId};
				    $.ajax({
				    	url: url,
				    	data: params,
				    	dataType: 'jsonp',
				    	success: function(o){
							if (o.success===true){
							    alert('解锁成功');
							    window.location = D.domain + '/page/box/edit_page.htm?newPageDesign=new&pageId=' + pageId+"&extParam="+extParam;
							} else {
						    	    alert('解锁失败');
							}
					}
				    });
            });
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

