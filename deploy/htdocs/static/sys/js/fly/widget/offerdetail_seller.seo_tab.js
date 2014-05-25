//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(true);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * ��������-����ϲ��
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.SeoTabView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.SeoTabView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.SeoTabView,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.SeoTabView,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.SeoTabView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('offerdetail-sell-seo-tab');
			this._render();
		},
		onFailure:function(){
			this._render();		
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
			}

			var setGalleryImgMarginLeft = function(){	//����ͼƬ���
				var galleryWidth = $D.get('detail-toolbar').offsetWidth - 259; //259Ϊ�����Ĺ̶����
				var galleryImgMarginLeft = Math.floor((galleryWidth - (6 * 60)) / 7);
				var gallery_img_li = $D.get('dt-gallery').getElementsByTagName('li');
				for(var i=0;i<gallery_img_li.length;i++){
	                gallery_img_li[i].style.marginLeft = galleryImgMarginLeft + 'px';
				}
			}
			setGalleryImgMarginLeft();
			
			var dt_img = $D.getElementsByClassName('dt-img-wrap');
			var dt_div = $D.getElementsByClassName('dt-tip');
            for (var i = 0; i < dt_img.length; i++) {
                 $E.on(dt_img[i], 'mouseover', function(){
                	$D.getElementsByClassName('dt-tip','div',this)[0].style.left = $D.getX(this) - 34 + 'px';
                	$D.getElementsByClassName('dt-tip','div',this)[0].style.display =  "block";
                	});
                $E.on(dt_img[i], 'mouseout', function(){
                	$D.getElementsByClassName('dt-tip','div',this)[0].style.display =  "none"
                	$D.getElementsByClassName('dt-tip','div',this)[0].style.left = $D.getX(this) - 34 + 'px';
                	});
            }
		},
		_renderHead:function(){
			return '';
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
			offerHtml.push('<li>');
			//offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferBig(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _title = '<p><a href="'+detailUrl+'"  onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  target="_blank" class="red"><span>'+FD.sys.fly.Utils.doSubstring(offer.subject,16,true)+'</span></a></p>';
			FD.sys.fly.Utils.log(_title);
			return _title;
		},
		_renderOfferBig:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _biginfo = '<div class="dt-img-wrap"><a href="'+detailUrl+'" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  target="_blank"><img class="dt-gallery-img" width="48px" height="48px" alt="" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a>';
			_biginfo += '<div class="dt-tip"><p><a href="'+offer.contact+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});FD.sys.fly.Utils.flyClick(\''+offer.eURL+'\')"  target="_blank">'+FD.sys.fly.Utils.doSubstring(offer.company,24,true)+'</a>';
			//alert(_biginfo);
			if(offer.trustType !='16') {
					_biginfo += '<span class="dt-gray">[�Ѻ�ʵ]</span>';
				}
			_biginfo += '</p>';	
			if(offer.trustType =='1') {			
					_biginfo += '<p><a href="'+FD.sys.fly.Utils.getBizrefURL(offer.domainID,offer.memberId)+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});FD.sys.fly.Utils.flyClick(\''+offer.eURL+'\')"  target="_blank"><img src="http://img.china.alibaba.com/images/common/icon_v01/4000712.gif" alt="����ͨ��Ա" align="absmiddle"/></a>';			
					_biginfo += ' <a class="dt-cxt-index" href="'+FD.sys.fly.Utils.getBizrefURL(offer.domainID,offer.memberId)+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});FD.sys.fly.Utils.flyClick(\''+offer.eURL+'\')"  target="_blank">'+offer.trustScore+'</a></p>';
				}
			if(offer.trustType =='2') {			
					_biginfo += '<p><a href="'+FD.sys.fly.Utils.getBizrefURL(offer.domainID,offer.memberId)+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});FD.sys.fly.Utils.flyClick(\''+offer.eURL+'\','+offer.type+')"  target="_blank"><img src="http://img.china.alibaba.com/images/common/icon_v01/4000812.gif" alt="����ͨ��Ա" align="absmiddle"/></a>';			
					_biginfo += ' <a class="dt-cxt-index" href="'+FD.sys.fly.Utils.getBizrefURL(offer.domainID,offer.memberId)+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'});FD.sys.fly.Utils.flyClick(\''+offer.eURL+'\')"  target="_blank">'+offer.trustScore+'</a></p>';
				}
				// �������ȥ�Ŵ��ͼƬ�ͱ������� 
				_biginfo += '<div class="tip-img-wrap"><a href="'+detailUrl+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  target="_blank"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'" width="100px" height="100px" alt="" class="dt-gallery-img"  onerror="javascript:this.src=\'http://img.china.alibaba.com/images/cn/p4p/nopic_100x100.gif\'"/></a></div>';
				_biginfo += '<p class="tip-description"><a href="'+detailUrl+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"  target="_blank" class="red"><span>'+FD.sys.fly.Utils.doSubstring(offer.subject,16,true)+'</span></a></p>';
				_biginfo += '</div></div>';
				
				//alert(_biginfo);
			return _biginfo;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _photo = '<div class="dt-img-wrap"><a href="'+detailUrl+'" target="_blank" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img class="dt-gallery-img" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"></a></div>';
			return _photo;
		},
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);