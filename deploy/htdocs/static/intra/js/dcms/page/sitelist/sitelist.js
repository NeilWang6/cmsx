;(function($,d){
	function switchtab(curtab, catid){
		$(".nav-tab li.current").removeClass("current");
		curtab.addClass("current");
		$(".tb-grid tbody tr").each(function(i,e){
			if(catid=="" || catid=="0"){
				$(e).show();
			}else{
				var sitecatid = $(e).data("catid");
				if(catid==sitecatid){
					$(e).show();
				}else{
					$(e).hide();
				}
			}
		});

	}
	var readyFun = [
	   function(){
		   $(".nav-tab li").each(
				 function(i, e){
					 $(e).bind("click",function(){
						 $this =$(this);
						 var catid = $this.data("catid");
						 switchtab($this, catid);

					 });
				 }
		   );
	   }

    ];

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});

})(jQuery, FE.dcms);