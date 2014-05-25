//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * P4P��������-����ϲ��
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.P4PSearchGuessView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.P4PSearchGuessView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
		this[callback]();
		//FD.sys.fly.Utils.log(data);
		//FD.sys.fly.Utils.log(oFlyConfig);
		//FD.sys.fly.Utils.log(oMergedFlyConfig);
	};
	//�̳и���
	L.extend(S.P4PSearchGuessView,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.P4PSearchGuessView,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.P4PSearchGuessView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('P4PSearchGuessView');
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
			}
		},
		_renderHead:function(){
			return '<h2>����Ҳϲ������</h2>\n<ul>\n';
		},
		_renderBody:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data));
			return _html.join('');
		},
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			//�����ʾ6��
			var maxItemLength = parseInt(this.oFlyConfig.count)||6;
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
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
			return '</ul><div class="clear">\n</div>\n';
		},
		end:0
	},true);
})(window,FD.sys.fly);