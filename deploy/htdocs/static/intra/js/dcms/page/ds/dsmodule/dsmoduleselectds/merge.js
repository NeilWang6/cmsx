/**
 * @package FD.app.cms.searchpage.merge
 * @version 1.0.110926
 * @author  hongss
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
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/web/valid.js");
ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/dialog-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/hd.js");
ImportJavscript.url("/static/intra/js/dcms/module/message.js");

ImportJavscript.url("/static/intra/js/dcms/page/ds/dsmodule/dsmoduleselectds/dsmoduleselectds.js");
ImportJavscript.url("/static/intra/js/dcms/page/ds/validator.js");
ImportJavscript.url("/static/intra/js/dcms/page/ds/formtools.js");
