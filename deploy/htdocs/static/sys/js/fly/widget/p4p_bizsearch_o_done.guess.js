//是否要开启fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * P4P独立搜索-猜你喜欢
	 * @param {String} callback 		返回的状态 onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			返回的数据
	 * @param {Object} oFlyConfig 		初始化的配置参数
	 * @param {Object} oMergedFlyConfig	经过mergeed后的配置参数,它跟oFlyConfig不同在于,这个参数就是真正向接口发起请求的所带的参数
	 */
	
	//滚动
	var initGuess = function (){
		FD.widget.Marquee.decorate("guess-offer",{preItem:4,isAutoPlay:false});
		var o = $("guess-offer").getElementsByTagName("li");
		$E.on(o, "mouseover", function(){
			$D.addClass(this, "on");
		});
		$E.on(o, 'mouseout', function(){
			$D.removeClass(this, "on");
		});
	}		
	
	S.P4PBizSearchOGuessView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//实例化父类
		S.P4PBizSearchOGuessView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*根据返回的状态，调用不用的函数,当然也可以手动调用*/
		this[callback]();
		//FD.sys.fly.Utils.log(data);
		//FD.sys.fly.Utils.log(oFlyConfig);
		//FD.sys.fly.Utils.log(oMergedFlyConfig);
	};
	//继承父类
	L.extend(S.P4PBizSearchOGuessView,S.AbstractFlyView);
	//接口实例化
	L.augment(S.P4PBizSearchOGuessView,S.InterfaceFlyView);
	
	//方法封装
	L.augmentObject(S.P4PBizSearchOGuessView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('P4PBizSearchOGuessView');
			this._render();
		},
		onFailure:function(){
			//do nothing	
		},
		onTimeout:function(){
			//do nothing
		},
		onProgress:function(){
			//do nothing
		},
			
		_render:function(){
			var html = [];
			html.push(this._renderHead());
			html.push(this._renderBody());
			html.push(this._renderFoot());
			if($(this.oFlyConfig.flyWidgetId)){
				$(this.oFlyConfig.flyWidgetId).innerHTML = html.join('');
				$D.addClass(this.oFlyConfig.flyWidgetId, 'module');
				initGuess();
			}
		},
		_renderHead:function(){
			return '<h2>猜你喜欢</h2>\n';
		},
		_renderBody:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data));
			return _html.join('');
		},
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			//最多显示16个
			var maxItemLength = parseInt(this.oFlyConfig.count)||16;
			offerListHtml.push('<div id="guess-bg">\n');
			offerListHtml.push('<div class="marquee-btn" id="marquee-next"><a href="javascript:;" id="button-next"></a></div>\n');
			offerListHtml.push('<div class="marquee-btn" id="marquee-prev"><a href="javascript:;" id="button-pre"></a></div>\n');
			offerListHtml.push('<div id="guess-offer" class="black">\n');
			offerListHtml.push('<ul>\n');
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			offerListHtml.push('</ul>\n');
			offerListHtml.push('</div>\n');
			offerListHtml.push('</div>\n');
			return offerListHtml.join('');
		},
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			if(idx<2){
				offerHtml.push('<li class="noline">\n');
			}else{
				offerHtml.push('<li>\n');
			}
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</li>\n');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _title = '<h3><a href="' + detailUrl + '" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" target="_blank">' + FD.sys.fly.Utils.doSubstring(offer.subject,40,true) + '</a></h3>';
			return _title;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _photo = '<div class="p4p-pic"><a href="' + detailUrl + '" title="' + offer.subject + '" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" target="_blank"><img src="' + FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1) + '" alt="" /></a></div>';
			return _photo;
		},
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);