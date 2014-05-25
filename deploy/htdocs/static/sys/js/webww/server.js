/**
* author hang.yangh <br>
* 配置的域名服务，测试环境和线上环境需要修改成相应值
*/
jQuery.namespace('FE.sys.webww');
('server' in FE.sys.webww) || (function($) {
	var server = {
        // im-server的地址
		"webww" : 'http://webww.1688.com/',
		//"webww" : 'http://webww-dev.china.alibaba.com:7001/',
		//"webww" : 'http://webww-test.china.alibaba.com:51100/',

        "alicn" : "http://exodus.1688.com",

        // 2012-03-30 garcia.wul 增加webim.swf的配置路径和bg-layer.png的路径
        // webim.swf的路径
        "webimSwfUrl": "http://img.china.alibaba.com/swfapp/webww/webim-1.swf",
        //"webimSwfUrl": "http://10.20.174.14/swfapp/webww/webim.swf",

        // bg_layer.png的路径
        "bgLayerImageUrl": "http://img.china.alibaba.com/cms/upload/2012/701/913/319107_412880957.png"
	};
	FE.sys.webww.server = server;
})(jQuery);
