/**
 * 封装业务逻辑
 * @author xuping.nie
 */
jQuery.namespace('FE.sys.webww');

(function ($) {
    var BIZ = {
        callbackInfos:{},
        // 产品摘要cache，减小与服务器交互
        _productSummaryCache:{},
        _userNames:{},
        /**
         * 产品url转产品图片等摘要信息
         */
        urlToSummary:function (msgContent, cid) {
            var self = this, msg = "";
            var timers = {};
            var getAnchor = function (pid) {
                return '<br/><div class="webatm-productId-' + pid + '"></div>';
            };
            var getSummaryLater = function (pid) {
                self._productSummaryCache[pid] = null;
                timers[pid] && clearTimeout(timers[pid]);
                timers[pid] = setTimeout(function () {//延迟加载摘要，等待消息已经显示再获取
                    var jsonName = "webwwoffer" + pid;
                    var url = "http://exodus.1688.com/offer/service/offerdetailInfo.htm?offerIds=" + pid + "&jsonName=" + jsonName;
                    $.getScript(url, function () {
                        data = eval(jsonName)[0];
                        //console.log("%x ", data);
                        if (!data['id'] || data['id'] != pid + "") {
                            return;
                        }
                        data['summPic'] = data['firstPicUrl'] && data['firstPicUrl'].replace(/.jpg$/, '.summ.jpg');
                        var tpl = Hogan.compile('<a href="{{offerDetailUrl}}" target="_blank"><img  src="http://img.china.alibaba.com/{{summPic}}" title="{{summary}}"><br/><b>{{subject}}</b></a>');
                        var html = tpl.render(data).replace(/^\s*/mg, '');
                        var replace = '<br/>' + html;
                        console.log("offer:" + pid + " result:" + replace);
                        FE.sys.webww.ui.chatwin.replaceMessage(cid, getAnchor(pid), replace);
                        self._productSummaryCache[pid] = replace;
                    });
                }, 100);
            };

            //根据接收到的消息中urls查找pid
            var pid = this._findPidFromMessage(msgContent);
            if (parseInt(pid) > 0) {
                //先占个位置，等产品信息获取时显示在此
                msg = getAnchor(pid);
                if (this._productSummaryCache[pid]) {
                    msg = this._productSummaryCache[pid]
                } else {
                    getSummaryLater(pid);
                }
            }
            return msg;
        },
        _findPidFromMessage:function (msg) {
            // http://detail.1688.com/buyer/offerdetail/843904654.html?tracelog=p4p
			// http://detail.1688.com/page/offerdetail_843904654.html?tracelog=p4p
			// http://detail.1688.com/offer/1160791423.html
			
			var pat = /(http:\/\/)detail.1688.com(:\d+)?\/offer\/(\d+).html/;
            var pid = 0;
			var p = 3;
            var match = msg.match(pat);
            if (match && match.length > p && parseInt(match[p]) > 0) {
                pid = match[p];
            }
			if(pid != 0)
				return pid;
				
			pat = /(http:\/\/)*(detail|detailp4p).china.alibaba.com(:\d+)?\/(buyer|page)\/offerdetail(\/|_)(\d+)/;
			p = 6;
            match = msg.match(pat);
            if (match && match.length > p && parseInt(match[p]) > 0) {
                pid = match[p];
            }
			if(pid != 0)
				return pid;
            return 0;
        },
        /**
         * 当拖动或粘贴文字到输入窗口时,判断如果包含产品连接就保留,
         * 否则所有的html标签都会自动被清理@see editor.js onPasteOrDrop
         * @param  {String} html 粘贴的html内容
         */
        beforePasteOrDrop:function(html){
            var pat =  /href=["\s]*((http:\/\/)*(detail|detailp4p).china.alibaba.com(:\d+)?\/(buyer|page)\/offerdetail(\/|_)(\d+))/;
            var match = html.match(pat);
            var productUrl = null;
            if (match && match.length > 1) {
                productUrl = match[1];
            }
            if(productUrl){
                html += " @" + productUrl;
            }
            return html;
        },
        showUserPanel:function (uid) {
            if (uid.substring(0, 8) === 'cnalichn') { // 如果是中国站用户
                var url = FE.sys.webww.server.alicn + '/ims/chat_card_60.htm?member_id=' + uid.substring(8) + '&cssName=default';
                // 如果相同不请求
                if ($("#webatm-info-company") && $("#webatm-info-company").src == url) {
                    return;
                }
                $('#webatm-info').html('<iframe id="webatm-info-company" frameborder="no" scrolling="no" src="' + url + '" ></iframe');
            } else {
                var html = [];
                html.push('<div class="big-ww-icon"><img src="http://i02.c.aliimg.com/images/im/webim/ifr-icon.png" /></div>');
                html.push('<ul>');
                html.push('<li class="user-name">' + uid.substring(8) + '</li>');
                html.push('<li class="come-from">来自' + this._whichSite(uid) + '</li>');
                html.push('</ul>');
                $('#webatm-info').html(html.join(''));
            }
        },
		showOfferPanel:function (uid) {
            if (uid && uid.substring(0, 8) === 'cnalichn') { // 如果是中国站用户
			    var offerid = FE.sys.webww.storage.getOfferId(FE.sys.webww.core.user.memberId,uid);
				if(offerid && offerid != "" && offerid != 'undefined' && offerid != "null"){
					var url = FE.sys.webww.server.alicn + '/ims/offer_card_60.htm?memberId=' + uid.substring(8) + '&offerId=' + offerid + '&listOffer=0&self=1';
					console.log("url:" + url);
					// 如果相同不请求
					if ($("#webatm-info-offer") && $("#webatm-info-offer").src == url) {
						return;
					}
					$('#webatm-offerInfo').show();
					$('#webatm-info').html('<iframe id="webatm-info-offer" height="307px" frameborder="no" scrolling="no" src="' + url + '" ></iframe');
				}
				else{
					var html = [];
					html.push('<div class="big-ww-icon"><img src="http://i02.c.aliimg.com/images/im/webim/ifr-icon.png" /></div>');
					html.push('<ul>');
					html.push('<li class="user-name">没有找到关注的产品信息</li>');
					html.push('</ul>');
					$('#webatm-info').html(html.join(''));
				}                
            } else {
                var html = [];
                html.push('<div class="big-ww-icon"><img src="http://i02.c.aliimg.com/images/im/webim/ifr-icon.png" /></div>');
                html.push('<ul>');
                html.push('<li class="user-name">无相关产品信息</li>');
                html.push('</ul>');
                $('#webatm-info').html(html.join(''));
            }
        },
        _whichSite:function (uid) {
            switch (uid.substring(0, 8)) {
                case 'cntaobao' :
                    return '淘宝网';
                default :
                    return '其他网站';
            }
        },
        /**
         *  调用此方法来获取 username
         */
        requestUname:function (uid,callback) {
            var self = this;
            var chatwin = FE.sys.webww.ui.chatwin;
            var core = FE.sys.webww.core;
            var uname = this._userNames[uid];
            if (uname) {
                callback && callback(uid,uname);
            } else {
                core.getMemberNamesByAliTalkIds([uid], function (data) {
                    if (data[0].uid === uid) {
                        uname = data[0].uname;
                        self._userNames[uid] = uname;
                        callback && callback(uid,uname);
                    }
                });
            }

        }
    };

    FE.sys.webww.biz = BIZ;

})(jQuery);