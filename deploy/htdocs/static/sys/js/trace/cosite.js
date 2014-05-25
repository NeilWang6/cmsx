/*
 * cosite.js
 * 跟踪从合作站点过来的
 * update by Edgar 110413
 * */

(function(){
    var params = window.location.search,
        cookieName = 'track_cookie',
        cookieValue,
		is1688 = /\b1688\.com$/.test(window.location.hostname);
	if ( params.indexOf("cosite=") >= 0) {
		if(is1688){
			cookieValue = cookieName + "=y&" + params.substring(1) +("; path=/") + ("; domain=.1688.com");
		}else{
			cookieValue = cookieName + "=y&" + params.substring(1) +("; path=/") + ("; domain=.alibaba.com");
		}
		document.cookie = cookieValue;
	}
})();
