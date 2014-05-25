/*merge start*/
;(function(){
	ImportJavscript = {
		url:function(url){
			document.write("<script type=\"text/javascript\" src=\""+url+'?'+(new Date).getTime()+"\"></scr"+"ipt>");
		}
	}
})();
/*merge end*/

ImportJavscript.url("/static/intra/js/dcms/module/dcms.js");
ImportJavscript.url("/static/intra/js/dcms/module/page-title.js");
ImportJavscript.url("/static/intra/js/dcms/module/hd.js");
ImportJavscript.url("/static/intra/js/dcms/module/left-nav.js");
ImportJavscript.url("/static/intra/js/dcms/module/element-templates.js");
ImportJavscript.url("/static/intra/js/dcms/module/trees.js");
ImportJavscript.url("/static/intra/js/dcms/page/catalog/done.js");