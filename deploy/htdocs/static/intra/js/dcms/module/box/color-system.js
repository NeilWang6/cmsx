/**
 * @package FD.app.cms.box.color-system
 * @author qiheng.zhuqh
 * @date: 2012-01-14
 */
(function($, D) {
	var readyFun2 = [ function() {
		$('.list-color .item').click(function(e){
	  		 e.preventDefault();
			 var colorVal = $(this).find("a").text();
			 if($(this).hasClass('current')){
				 colorVal = '';
				 $(this).removeClass('current');
			 } else {
				 $('.list-color .item').removeClass('current');
				 $(this).addClass('current');
			 }
			 $('#hidden-tag-color').val(colorVal);	
		});
	}];

	$(function() {
		$.each(readyFun2,
				function(i, fn) {
					try {
						fn();
					} catch (e) {
						if ($.log) {
							$.log('Error at No.' + i + '; ' + e.name + ':'
									+ e.message);
						}
					}
				})
	});
})(dcms, FE.dcms);
