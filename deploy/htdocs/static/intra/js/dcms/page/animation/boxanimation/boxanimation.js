;(function($, D) {
var pageElm = $('#js-page-num'), 
	formValid,
	htmlStr,
	htmlConfirm,
	readyFun = [
	function() {//启动函数1
		FE.dcms.doPage();
	}, function(){//启动函数2
		//$(".table-sub .tr-data:odd").addClass("background-gray");
		//$.post("http://cms-test.cn.alibaba-inc.com:14100/page/ajax_show.html?action=box_animation_action&event_submit_do_get_box_animation_json_content=true&box_animation_id=107",{
		//	
		//},function(data){
		//	alert(data.hasError);
		//	alert(data.content);
		//},"json");
	}];//启动函数数组
	
	D.aaa = function(){
		console.log('aa');
		return true; //success
		//return 'message'; //fail
	};
	
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});
})(dcms, FE.dcms);