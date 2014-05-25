/**
 * @author jiankai.xujk
 * @usefor 报名工具-VIP规则管理页面
 * @date   2012.10.8
 */
;(function($, T) {
    var readyFun = [

		//废弃
		function(){
			$(".delete-rule").bind("click", function() {
				var _this = this;
				$.use('ui-dialog',function(){
					$('#enterButton').dialog({
						modal: true,
                        shim: true,
                        draggable: true,
                        center: true,
                        open: function(){
                        	$('#makeSureOut').click(function(){
								var topicId = $(_this).data('topicid');
								document.deleteRuleForm.topicId.value = topicId;
								document.deleteRuleForm.submit();	
                        	})
                        	$('#enterButton').find('button.btn-cancel,a.close').click(function(){
                        		$(this).parents('.dialog-basic').dialog('close');
                        	})

                        }

					})

				})
			});
		},
		
		
		//类目联动
        function(){
            var cateEl1 = $('.search .category-1st'),
                cateEl2 = $('.search .category-2nd'),
                cateEl3 = $('.search .category-3rd');
            
			var cateTreeVal = $.parseJSON($('#cate-tree').val());
			cateEl1.html(getCateHtml(cateTreeVal['0'], '<option value="">选项</option>'));
			cateEl2.html(getCateHtml(cateTreeVal[cateEl1.val()], '<option value="">选项</option>'));
			
			cateEl1.change(function(e){
				var val = $(this).val();
				cateEl2.html('<option value="">选项</option>').html(getCateHtml(cateTreeVal[val], '<option value="">选项</option>'));
				cateEl3.html('<option value="">选项</option>');
			});
			
			cateEl2.change(function(e){
				var val = $(this).val();
				cateEl3.html(getCateHtml(cateTreeVal[val], '<option value="">选项</option>'));
			});
			
			//初始化已有的类目值
			var cateEl = $('#cates'),
				cateVal = cateEl.val();
			if (cateEl.length>0 && cateVal){
				cateVal = cateVal.split(',');
				cateEl2.html(getCateHtml(cateTreeVal[cateVal[0]], '<option value="">选项</option>'));
				cateEl3.html(getCateHtml(cateTreeVal[cateVal[1]], '<option value="">选项</option>'));
				
				setTimeout(function(){
					cateEl1.val(cateVal[0]);
					cateEl2.val(cateVal[1]);
					cateEl3.val(cateVal[2]);
				}, 0);
			}
			
        }, 
		
		
		//搜索按钮监听
        function(){
			$(".js-search-button").bind("click", function() {
				document.formSearch.submit();
			});
		}
    ];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
	
	//拼装类目选择的HTML代码
    function getCateHtml(cateData, prefix){
        var html = prefix || '';
        if (!cateData){ return html; }
        for (var i=0, l=cateData.length; i<l; i++){
            html += '<option value="'+cateData[i]['id']+'">'+cateData[i]['name']+'</option>';
        }
        return html;
    }
})(jQuery, FE.tools);
