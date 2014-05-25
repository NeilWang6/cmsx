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

ImportJavscript.url('/static/intra/js/dcms/module/dcms.js');
ImportJavscript.url("/static/intra/js/dcms/module/page-title.js");
ImportJavscript.url('/static/intra/js/dcms/module/hd.js');
ImportJavscript.url('/static/intra/js/dcms/module/left-nav.js');
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/dialog-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/msg.js");
ImportJavscript.url("/static/intra/js/dcms/module/box/edit-page.js");
ImportJavscript.url("/static/intra/js/dcms/page/dynamic/checkedpage/checkedpage.js");