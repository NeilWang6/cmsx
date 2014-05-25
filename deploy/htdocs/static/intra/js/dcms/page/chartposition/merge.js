/**
 * @package FD.app.cms.rule.merge
 * @version 1.0.110307
 * @author  yanlong.liuyl
 */

/*merge start*/
(function(){
	ImportJavscript = {
		url:function(url){
			document.write("<script type=\"text/javascript\" src=\""+url+"\"></scr"+"ipt>");
		}
	}
})();
/*merge end*/

ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/flash-min.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/flash-chart-min.js");
ImportJavscript.url('/static/fdevlib/js/fdev-v4/widget/util/date-min.js');
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/datepicker-min.js");
ImportJavscript.url('/static/intra/js/dcms/module/dcms.js');
ImportJavscript.url("/static/intra/js/dcms/module/page-title.js");
ImportJavscript.url('/static/intra/js/dcms/module/hd.js');
ImportJavscript.url('/static/intra/js/dcms/module/left-nav.js');
ImportJavscript.url("/static/intra/js/dcms/module/dateutils.js");
ImportJavscript.url("/static/intra/js/dcms/page/chartrule/aboutDate.js");
ImportJavscript.url("/static/intra/js/dcms/page/chartposition/chartposition.js");
ImportJavscript.url("/static/intra/js/dcms/module/detect_flash.js");
ImportJavscript.url("/static/intra/js/dcms/module/export-pv-data.js");