/**
 * @version 1.0
 * @author  xuewei.youxw
 * @page http://magma-test.china.alibaba.com:15200/ipush/commodity.html
 * Date     Aug 27, 2010
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
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//������װ
	L.augmentObject(S.CateAllGuessYouLinkView.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('CateAllGuessYouLinkView');
			this._renderOfferTab();
			this._render();
			this.cancelLink('#js-tab-1st .f-tab-t a');
            this.cancelLink('#js-tab-2nd .tab-t a');
		},
		
		onFailure:function(){
			this._onFailure();
		},
		
		onTimeout:function(){
			this._onFailure();
		},
		
		_onFailure:function(){
			$('Ftab-title').style.display = 'none';
			$('cate-all').innerHTML = '<p style="height:100px;margin:50px auto 50px auto;text-align:center;font-size:14px; font-weight:bold;">��ȡ�Ƽ���Ʒʧ��<br />��<a href="#" target="_self" style="color:#1f61c0">ˢ��</a>ҳ�����³���</p>';
		},

		_renderOfferTab:function(){
			var ArrayObj = this.result.data;
			var Arraylength = this.result.data.length;
			if(Arraylength == 1){
				$('Ftab-title').style.display='none';
			}else if(Arraylength == 2){
				$('Ftab2').innerHTML = '<a href="#" title="'+ArrayObj[0].categoryDesc+'">'+ArrayObj[0].categoryDesc+'</a>';
				$('Ftab3').innerHTML = '<a href="#" title="'+ArrayObj[1].categoryDesc+'">'+ArrayObj[1].categoryDesc+'</a>';
			}else if(Arraylength == 3){
				$('Ftab2').innerHTML = '<a href="#" title="'+ArrayObj[0].categoryDesc+'">'+ArrayObj[0].categoryDesc+'</a>';
				$('Ftab3').innerHTML = '<a href="#" title="'+ArrayObj[1].categoryDesc+'">'+ArrayObj[1].categoryDesc+'</a>';
				$('Ftab4').innerHTML = '<a href="#" title="'+ArrayObj[2].categoryDesc+'">'+ArrayObj[2].categoryDesc+'</a>';
			}
		},
		
		/**
	         * cancel a tag default action
	         * @method  cancelLink
	         * @param   over className
	         */
        cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },
		
		/**
	         * ����ҳ��������Ⱦ
	         * @method  _render
	         */
		_render:function(){
			var Arraylength = this.result.data.length;
			if(Arraylength == 1){
				$('Ftab1').style.display='none';
				$('Ftab2').style.display='none';
				$('Ftab3').style.display='none';
				$('Ftab4').style.display='none';
				var FcatO = this._renderFtab1();
				$('cate-all').innerHTML = FcatO;
			}else if(Arraylength == 2){
				$('Ftab4').style.display='none';
				var FcatO = this._renderFtab1();
				var FcatTw = this._renderFtab2();
				$('cate-gift').innerHTML = FcatO;
				$('cate-toy').innerHTML = FcatTw;
				this._renderAll();
			}else if(Arraylength == 3){
				var FcatO = this._renderFtab1();
				var FcatTw = this._renderFtab2();
				var FcatTr = this._renderFtab3();
				$('cate-gift').innerHTML = FcatO;
				$('cate-toy').innerHTML = FcatTw;
				$('cate-stationary').innerHTML = FcatTr;
				this._renderAll();
			}
		},
		
		/**
	         * ����������Ŀ����
	         * @method  _renderAll
	         */
		_renderAll:function(){
			var Arraylength = this.result.data.length;
			var arrHtmlO = flyResult.data[0].offerIds;
			var arrHtmlTw = flyResult.data[1].offerIds;
			var _html = [];
			//�ĳɱ����ķ�ʽ
			if(Arraylength == 2){  // OMG, what's this? This method is so bad! But I don't have time to change it . comment by allenm
				var arrobj = arrHtmlO.concat(arrHtmlTw).slice(0,40).sort(function(){return Math.random()>0.5?-1:1;});
				_html.push(this._renderOfferList(arrobj));
				var objAllHtml = this._renderOfferList(arrobj)
				$('cate-all').innerHTML = objAllHtml;
			}else if(Arraylength == 3){
				var arrHtmlTr = flyResult.data[2].offerIds;
				var arrobj = arrHtmlO.concat(arrHtmlTw,arrHtmlTr).slice(0,40).sort(function(){return Math.random()>0.5?-1:1;});
				var objAllHtml = this._renderOfferList(arrobj)
				$('cate-all').innerHTML = objAllHtml;
			}
			var offerIds=[];
			for(var i = 0, l = this.result.data.length; i < l; i++){
				offerIds = offerIds.concat(this.result.data[i].offerIds);
			}
			offerIds = offerIds.slice(0,40);
			
			//this._exposure(offerIds);
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			
		},
		
		_renderFtab1:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[0].offerIds.slice(0,40)));
			return _html.join('');
		},
		
		_renderFtab2:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[1].offerIds));
			return _html.join('');
		},
		
		_renderFtab3:function(){
			var _html = [];
			_html.push(this._renderOfferList(this.result.data[2].offerIds));
			return _html.join('');
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
		
		//�Ƿ��ôʱ�
		_stripBadWord:function(str){
			var re = />|<|'|"/gi;
			return str.replace(re,function(word){
				return word.replace(/./g,"")
			});
		},
		
		_renderOfferTitle:function(offer){
			//var detailUrl  = offer.offerDetailUrl;
			var detailUrl  = getURL(offer);
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _title = '<dd class="description"><a href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(detailSubject,50,'...')+'</a></dd>'; 
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			//var detailUrl  = offer.offerDetailUrl;
			var detailUrl  = getURL(offer);
			var detailSubject = this._stripBadWord(FD.common.stripTags(offer.subject));
			var _photo = '<a class="a-img" href="'+detailUrl+'" target="_blank" title="'+detailSubject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/150x150_1281929016314.png\'"/></a>';
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