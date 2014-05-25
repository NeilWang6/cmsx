/*merge start*/
;(function(){
	ImportJavscript = {
		url:function(url){
			document.write("<script type=\"text/javascript\" src=\""+url+'?'+(new Date).getTime()+"\"></scr"+"ipt>");
		}
	}
})();
/*merge end*/

ImportJavscript.url("/static/fdevlib/js/fdev-v4/widget/ui/dialog-min.js");
ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/oop.js");
ImportJavscript.url("/static/intra/js/dcms/module/tree.js");
ImportJavscript.url("/static/intra/js/dcms/page/poptree/poptree.js");