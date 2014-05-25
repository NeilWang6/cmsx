;(function($, T) {
	var domain=$('#v2012Module').val();
	//这里开始新的分页
    	var data = {
            curPage: $('input#curpage').val(),
            page: $('input#page_num').val(),//几页
            titlelist: $('input#titlelist').val(),//多少条
            leftContent: '<div class="list-operation">\
							<input type="checkbox" class="beControllId control-button">\
							<a id="add-page" href="#" class="oper-link">添加</a>\
							<a id="delete-page" href="#" class="oper-link-right">删除</a>\
						</div>',
            rightContent: '',
            limit: 3,
            width: '1008px',
            left: '210px',
            curPageInput: $('input#curpage'),
            form: $('form#listForm'),
            param: $('#page'),
            noneShow:true
        }
        // $('.fix-bottom-optbar').remove()
        // $('#profile').remove()
        var pagelistall = new T.pagelistall(data);
        pagelistall.init(data);


	$("#add-page").live("click",function(e){
		e.preventDefault();
		$("#search_str").val("");
		$.use('ui-dialog', function(){
                    //如有多个浮出层，请另加ID或class
                    var dialog = $('.js-dialog').dialog({
                        center: true,
                        fixed:true
                    });
                    $('.js-dialog .btn-cancel, .js-dialog .close').click(function(){
                        dialog.dialog('close');
						window.location.reload();
                    });
                });
	});
	
			$("#list-page a").bind("click", function() {
				var page = $(this).data('page');
				document.search_condition.page.value = page;
				$('#auditForm,.js-msg-warning,.js-fixed-bottom').addClass('display-none');
                $('.loading').removeClass('display-none');
				document.search_condition.submit();
			});
			
			$("#jump-page").bind("click", function() {
				var page = $(".pnum").val();
				document.search_condition.page.value = page;
				$('#auditForm,.js-msg-warning,.js-fixed-bottom').addClass('display-none');
                $('.loading').removeClass('display-none');
				document.search_condition.submit();
			});
			
			$("#delete-page").live("click",function(e){
				e.preventDefault();
				var arrValues = [],objValue = {};;
				$("input[name='beControllId']:checkbox").each(function () {
					if ($(this).attr("checked")) { 
						arrValues.push($(this).val());
					} 
				});
				objValue['value'] = arrValues;
				$('#delete-ids').val(JSON.stringify(objValue));
				if($('#delete-ids').val()!='{"value":[]}'){
					if(confirm('你确定要删除吗？') == true){
						var data = $.param({deleteIds:$("#delete-ids").val()});
						$.post(domain+"/delete_list.json",data,function(){
							window.location.reload();
						});
					}
				}else{
					alert("请至少选择一个！");
				}
			});
			
			$(".control-button").live("click",function(){
				if($(this).attr("checked")){
					$(".beControllId").attr("checked", true);
				}else{
					$(".beControllId").attr("checked", false);
				}				
			});
			
			$(".add-control-button").bind("click",function(){
				if($(this).attr("checked")){
					$(".add-controll-id").not(":disabled").attr("checked", true);
				}else{
					$(".add-controll-id").not(":disabled").attr("checked", false);
				}				
			});
			
			$("#btn-add").bind("click",function(){
				var arrValues = [],objValue = {};;
				$("input[name='add-controll-id']:checkbox").not(":disabled").each(function () {
					if ($(this).attr("checked")) { 
						arrValues.push($(this).val());
					} 
				});
				objValue['value'] = arrValues;	
				$('#add-ids').val(JSON.stringify(objValue));
				if($('#add-ids').val()!='{"value":[]}'){
					var data = $.param({addIds:$("#add-ids").val()});
					$.post(domain+"/add_list.json",data,function(result){
						alert("添加成功！");
						if($("#search_str").val()!=""){
					var search_str = encodeURIComponent($("#search_str").val());
					var data = $.param({searchStr:search_str});
					$.post(domain+"/search_list.json",data,function(result){
						var users = result.data;
						var result_detail="";
						$.each(users,function(index,user){  
							result_detail+="<tr><td class='for-checkbox'><input type='checkbox' class='add-controll-id' value='"+user.emailPrefix+"' name='add-controll-id'"
							if(user.exist=='n'){
								result_detail+="/></td><td class='num-checkbox'>"+user.empId+"</td><td class='name-checkbox'>"+user.lastName+"</td><td class='org-checkbox'>"+user.depDesc+"</td><td class='email-checkbox'>"+user.emailAddr+"</td></tr>";
							}else{
								result_detail+="disabled='true' checked='checked'/></td><td class='num-checkbox'>"+user.empId+"</td><td class='name-checkbox'>"+user.lastName+"</td><td class='org-checkbox'>"+user.depDesc+"</td><td class='email-checkbox'>"+user.emailAddr+"</td></tr>";
							}
							
						});
						$("#result-detail").html('').append(result_detail);
					});
				}
					});
				}
			});
			
			$("#btn-search").bind("click", function() {
				if($("#search_str").val()!=""){
					var search_str = encodeURIComponent($("#search_str").val());
					var data = $.param({searchStr:search_str});
					$.post(domain+"/search_list.json",data,function(result){
						var users = result.data;
						if(result.success == true){
							var result_detail="";
							$.each(users,function(index,user){  
								result_detail+="<tr><td class='for-checkbox'><input type='checkbox' class='add-controll-id' value='"+user.emailPrefix+"' name='add-controll-id'"
								if(user.exist=='n'){
									result_detail+="/></td><td class='num-checkbox'>"+user.empId+"</td><td class='name-checkbox'>"+user.lastName+"</td><td class='org-checkbox'>"+user.depDesc+"</td><td class='email-checkbox'>"+user.emailAddr+"</td></tr>";
								}else{
									result_detail+="disabled='true' checked='checked'/></td><td class='num-checkbox'>"+user.empId+"</td><td class='name-checkbox'>"+user.lastName+"</td><td class='org-checkbox'>"+user.depDesc+"</td><td class='email-checkbox'>"+user.emailAddr+"</td></tr>";
								}
								
							});
							$("#result-detail").html('').append(result_detail);
						}
					});
				}
			});
})(jQuery, FE.tools);