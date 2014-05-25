;(function($) {
	$.ajax({
		url : $("#loginUrl").val(),
		data : {
			"sesskey":$("#sesskey").val(),
			"pr":$("#pr").val()
		},
		dataType : 'jsonp',
		success : function(o) {
			if(o.content){
				var res = o.content;
				if (res.result && res.result+""=="true") {
					$("#loginfrm").submit();
				}else if(res.failurl){
					window.location.href=res.failurl;
				}else{
					//TODO 转到通用错误页面
					alert("登录请求失败！");
				}
			}else{
				//TODO 转到通用错误页面
				alert("登录处理失败！");
			}
		},
		error : function() {
			alert('登录请求失败！请稍后重试或联系我们')
		}
	});
})(jQuery);