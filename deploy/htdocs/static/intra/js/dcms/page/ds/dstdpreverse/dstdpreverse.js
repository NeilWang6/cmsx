 ;(function($, D){
    var readyFun = [
        /**
         * 表单验证
         */
        function(){
            $('#btnTdpReverseMerge').click(function(){
				// 老的tdp
				var _tdpCodeOld = $('#tdpCodeOld').val();
				if ("" ==_tdpCodeOld){
					alert("TDP代码不能为空");
					$('#tdpCodeOld').focus();
					return ;
				}
					var _url =  FE.dcms.domain + "/page/ds/mergeData.htm?action=ds_tdp_tool_action&event_submit_do_parse_tdp_to_merge=true";
					var _param ="&tdpCodeOld="+encodeURIComponent(encodeURIComponent(_tdpCodeOld));
					openDialog(_url + _param,1000,450);
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
	
	// 子窗口会调用生成tdp
	finishMergeData = function(){
				var _url =  FE.dcms + "/page/ds/mergedata.html?action=ds_tdp_tool_action&event_submit_do_generate_tdp_by_reverse=true";
				$.ajax(_url, {
					type:"POST",
					dataType: 'json',
					success: function(data){
						if(data) {
					        var _data = data;	
							$('#tdpCodeNew').val(_data.tdpMethod);
							$('#tdpCodeNew').select();
						}
					}
				});



	}
 })(dcms, FE.dcms);




