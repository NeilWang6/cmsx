;(function($, D){
    var searchPageForm = $('#js-search-page'),
    pageNum = $('#js-page-num');
    var readyFun = [
        function() {
            $('.dcms-page-btn').click(function(e) {
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },function(){
            $('#js-jumpto-page').click(function(e){
                var n = $('#js-jump-page').val();
                setPageNum(n);
            });
        },function(){
            $('#dcms-batch-post').click(function(e){
	       var pageIds = "";
               $(".page-check").each(function() {
			if($(this).attr("checked")) {
				pageIds = pageIds + $(this).data("page-id") + ",";
			}
		});
		if("" == pageIds) {
			alert("�빴ѡ��Ҫ����������ҳ��");
			return;
		}
		$('#batch-post-pageid').val(pageIds);
		$('#batch-post-templates').val($('#templateCode').val());
		
		var isYes = confirm("ȷ������������");
		if(isYes==true) {
			$('#batch-post-form').submit();
		}
            });
        },function(){
            $('#dcms-onekey-post').click(function(e){
	       var templateCode = $('#templateCode').val();
	       var templateParam = $('#templateParam').val();
	       if("" == templateCode && "" == templateParam) {
			alert("�����������Ĺؼ��ʣ������������һ������");
			return;
	       }
		$('#template-code-id').val($('#templateCode').val());
		$('#template-param-id').val($('#templateParam').val());
		var isYes = confirm("ȷ��һ��������\n ���ҳ��϶࣬����ʱ����Ҫ�ȽϾã�");
		if(isYes==true) {
			$('#all-post-form').submit();
		}
		
            });
        },function() {
		$('#checkAll').click(function(e) {
			var isChecked = $('#checkAll').attr("checked");
			$(".page-check").each(function() {
				if(isChecked) {
					$(this).attr("checked", true);
				} else {
					$(this).attr("checked", false);
				}
			});
		});
	}
    ];
    
    $(function(){
        for (var i = 0, l = readyFun.length; i<l; i++) {
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
   function setPageNum(n){
        pageNum.val(n);
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);
