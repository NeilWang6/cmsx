/**
* author hang.yangh <br>
* ���õ��������񣬲��Ի��������ϻ�����Ҫ�޸ĳ���Ӧֵ
*/
jQuery.namespace('FE.sys.webww');
('server' in FE.sys.webww) || (function($) {
	var server = {
        // im-server�ĵ�ַ
		"webww" : 'http://webww.1688.com/',
		//"webww" : 'http://webww-dev.china.alibaba.com:7001/',
		//"webww" : 'http://webww-test.china.alibaba.com:51100/',

        "alicn" : "http://exodus.1688.com",

        // 2012-03-30 garcia.wul ����webim.swf������·����bg-layer.png��·��
        // webim.swf��·��
        "webimSwfUrl": "http://img.china.alibaba.com/swfapp/webww/webim-1.swf",
        //"webimSwfUrl": "http://10.20.174.14/swfapp/webww/webim.swf",

        // bg_layer.png��·��
        "bgLayerImageUrl": "http://img.china.alibaba.com/cms/upload/2012/701/913/319107_412880957.png"
	};
	FE.sys.webww.server = server;
})(jQuery);
