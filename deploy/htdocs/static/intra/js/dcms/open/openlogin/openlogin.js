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
					//TODO ת��ͨ�ô���ҳ��
					alert("��¼����ʧ�ܣ�");
				}
			}else{
				//TODO ת��ͨ�ô���ҳ��
				alert("��¼����ʧ�ܣ�");
			}
		},
		error : function() {
			alert('��¼����ʧ�ܣ����Ժ����Ի���ϵ����')
		}
	});
})(jQuery);