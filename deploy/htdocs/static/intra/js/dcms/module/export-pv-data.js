/*
 @Author springyu
 ����PV����
 @Date 2011-11-16
 modify by springyu
 */
(function($, D) {
	$(document).ready(function() {
		$('#export-pv-data').bind("click", function() {
			var startTime = $("#start-time").val();
			var endTime = $("#end-time").val();
			// alert(startTime);
				var date = $.addMonth(startTime, 3, "yyyy-MM-dd");
				date = $.addDate(date, -1, "yyyy-MM-dd");
				var a = $.dateMinus(date, endTime);

				if (a < 0) {
					if (window.confirm("�������ڳ���3���£��Ƿ������")) {
						exportSubmit();
					}
				} else {
					exportSubmit();
				}
			});
		function exportSubmit() {
			var _pvType = "";
			var radioes = $('input:radio', '.chart-term-type');
			// console.log(radioes);
			radioes.each(function(i) {
				if (i == radioes.size() - 1) {
					_pvType += $(this).val() + ";" + $(this).next().html();
				} else {
					_pvType += $(this).val() + ";" + $(this).next().html()
							+ "--";
				}
			});

			$("#pv-type").val(encodeURIComponent(_pvType));
			$("#export-title").val(
					encodeURIComponent($("#export-excel-name").html()));
			$("#exportPvData").submit();
		}
	});
})(dcms, FE.dcms);
