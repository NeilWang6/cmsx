/** author honglun.menghl
*   date 2010-08-30
*   ȫ���Ƽ�ҳ���Ƽ���Դ
*/

//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(false);

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * ��������-����ϲ��
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.CateAllGuessYouLinkView = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.CateAllGuessYouLinkView.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
		this[callback]();
	};
	//�̳и���
	L.extend(S.CateAllGuessYouLinkView,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.CateAllGuessYouLinkView,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.CateAllGuessYouLinkView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('CateAllGuessYouLinkView');
			this._renderOfferTab();
			this._render();
		},
		onFailure:function(){
			this._onFailure();
		},
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('cate-all').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; width:710px;"><p style="margin-top:20px; margin-bottom:8px;">��ȡ��Ʒʧ��</p><p>��<a href="#" title="ˢ��" class="refresh-page" onclick="javascript:window.location.reload();">ˢ��</a>ҳ�����³���</p></li>';
		},
		
		_renderOfferTab:function(){
			var ArrayObj = this.result.data;
			var Arraylength = this.result.data.length;
			$('Ftab-title').style.display='none';
		},
		
		
		_render:function(){
			var offerIds = this.result.data.slice(0,40);
			var objAllHtml = this._renderOfferList(offerIds);
			$('cate-all').innerHTML = objAllHtml;
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
		},
		
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			for(var i=0,l = offerList.length;i<l;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			offerHtml.push('<li>');
			offerHtml.push('<dl class="cell-product-2nd">');
			offerHtml.push('<dt>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push('</dt>');
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</dl>');
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		
		_renderOfferTitle:function(offer){
            if(offer.eURL && offer.eURL !== ''){
                var detailUrl = offer.eURL;
            }else{
                var detailUrl  = offer.offerDetailUrl;
            }

			var _title = '<dd class="description"><a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,50,'...')+'</a></dd>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			if(offer.eURL && offer.eURL !== ''){
                var detailUrl = offer.eURL;
            }else{
                var detailUrl  = offer.offerDetailUrl;
            }
			var _photo = '<a class="a-img" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/150x150_1281929016314.png\'"/></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
            var currency,price;
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="cny">&yen;</span>';
				price = offer.rmbPrice;
			}else{
				if(offer.foreignCurrency !== ''){
					currency = '<span class="value">��Ҽ۸�</span>';
					price = offer.foreignCurrency;
				}else{
					currency = '';
					price = '';
				}
			}
            var iconhonest = offer.Credit !== false||'' ? '<a title="���ű��Ϸ����̼ҳ�ŵ�����ű��Ϲ�������" class="icon-honest" href="http://'+offer.domainID+'.cn.1688.com/athena/bizreflist/'+offer.domainID+'.html">����ͨ</a>' : '';
            var iconalipay = offer.useAlipay !==false||'' ? '<a title="����Ʒ����֧��֧����������ջ�ȷ�Ϻ����Ҳ����õ�Ǯ��������Ľ��װ�ȫ��" class="icon-alipay" href="http://view.1688.com/cms/safe/trust/zhifubao.html">֧����</a>' : '';
			if(currency == '<span class="value">��Ҽ۸�</span>'){
				var _ddPrice = '<dd class="price">' + currency  + iconalipay + iconhonest + '</dd>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<dd class="price">' + currency + '<em class="value">' + price.toFixed(2) +'/'+offer.unit+'</em>' + iconalipay + iconhonest + '</dd>';
				}else{
					var _ddPrice = '<dd class="price">' + iconalipay + iconhonest + '</dd>';
				}
			}
                return _ddPrice;
            },
		end:0
	},true);
})(window,FD.sys.fly);