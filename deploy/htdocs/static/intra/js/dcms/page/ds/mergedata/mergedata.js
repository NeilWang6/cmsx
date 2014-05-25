 ;(function($, D){
    var readyFun = [
        /**
         * ���ó�ʼ����ʽ
         */
        function(){
            $('.readonly-field').attr("readonly",true);
        },
        /**
         * ���õ���Ԥ���ݺ��޸��ı������ʽ
         */
        function(){
            $('.edit-field').change(function(){
				$(this).addClass("merged-data");
			})
        },
        /**
         * �����Ԥ����
         */
		function(){
			$("#btnSave").click(function(){
				// ��ȡ��������
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
							// ��������ʾ
							if ( _data.sucess == "false" ){
								alert(_data.message);
								return;
							}
							// ��Ԥ���������ҳ�����finishMergeData����á�
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
