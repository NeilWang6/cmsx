/*
@Author hongss
@Date 2011-05-24
*/
(function($, D){
	$(function(){
        window.setTimeout(function(){
            window.location.href = $('#dcms-point-url').attr('href');
        }, 3*1000);
    });
})(dcms,FE.dcms);
