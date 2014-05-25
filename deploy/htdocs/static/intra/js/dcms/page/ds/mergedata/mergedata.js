 ;(function($, D){
    var readyFun = [
        /**
         * 设置初始化样式
         */
        function(){
            $('.readonly-field').attr("readonly",true);
        },
        /**
         * 设置当干预数据后，修改文本框的样式
         */
        function(){
            $('.edit-field').change(function(){
				$(this).addClass("merged-data");
			})
        },
        /**
         * 保存干预数据
         */
		function(){
			$("#btnSave").click(function(){
				// 获取所有数据
				var mergeDataList = FromTools.toListQuery("subTable");
				var _url =  FE.dcms + "/page/ds/mergedata.html?action=ds_tdp_tool_action&event_submit_do_merge_data=true";
				$.ajax(_url, {
					type:"POST",
					dataType: 'json',
					data : {
			                    mergeDataListValue : mergeDataList
			        },
					success: function(data){
						if(data) {
					        var _data = data;
							// 出错，则提示
							if ( _data.sucess == "false" ){
								alert(_data.message);
								return;
							}
							// 干预后，如果父亲页面存在finishMergeData则调用。
							if (window.opener.finishMergeData){
								window.opener.finishMergeData();
							}
							self.close();
						}
					}
				});


			})

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
