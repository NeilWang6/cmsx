/**
* author honglun.menghl
* date 2010-08-27
* �����з�װ��ҵ pi ҳ��
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
	S.AliwwTab = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.AliwwTab.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
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
	L.extend(S.AliwwTab,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.AliwwTab,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//������װ
	L.augmentObject(S.AliwwTab.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('AliwwTab');
			this._render();
			//this.cancelLink('#tab-supply .c-f-tab-t a');
			//this._tab();
		},
		
		onFailure:function(){
			this._onFailure();
						
		},
		onTimeout:function(){
			this._onFailure();
		},
		onProgress:function(){
			this._onFailure();
		},
		_onFailure:function(){
			$('render-1').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">��ȡ��Ʒʧ��</p><p>��<a href="#" title="ˢ��" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">ˢ��</a>ҳ�����³���</p></li>';
		},
		_tab:function(){
            var tab = new FD.widget.Tab('tab-supply',{
			tabTitleClass:'c-f-tab-t',
			tabBoxClass:'c-f-tab-b'
			} );
        },
	cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },    	
		_render:function(){
			//console.dir(this.result.data);
			
			var Arrobj=[];
			for(var i=0, l=this.result.data.length; i<l; i++){
				Arrobj = Arrobj.concat(this.result.data[i].offerIds);
			}
			Arrobj = Arrobj.slice(0,4);
			
			var hotSupply = this._renderHotSupply(Arrobj);
			$('render-1').innerHTML = hotSupply;
			//this._exposure(Arrobj);
			FD.sys.fly.Utils.exposure(Arrobj,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			
		},
	
		_renderFtab1:function(o){
			var _html = [];
			_html.push(this._renderOfferList(o.slice(0,4)));
			return _html.join('');
		},
		
		_renderFtab2:function(o){
			var _html = [];
			_html.push(this._renderOfferList(o.slice(4,8)));
			return _html.join('');
		},
		
		_renderFtab3:function(o){
			var _html = [];
			_html.push(this._renderOfferList(o.slice(8,12)));
			return _html.join('');
		},
		_renderHotSupply:function(Arr){
			var _html = [];
			for(var i = 0, l = Arr.length; i < l; i++){
				if(i%2 == 0){
					_html.push('<ul class="box p-r4">');
				}else{
					_html.push('<ul class="box p-l0">');
				}
				_html.push(this._renderOfferPhoto(Arr[i]));
				_html.push(this._renderOfferPrice(Arr[i]));
				_html.push(this._renderOfferTitle(Arr[i]));
				_html.push('</ul>');
				if(i%2 == 1){
					_html.push('<br style="clear: both;">');
				}
			}
			_html.push('<p class="btn-line"><a target="_blank" href="http://small.1688.com/ipush/my_push.htm?ipush=aliwwpi_0_more&tracelog=re_iali_aliwwpi_fuzhuang01"><img alt="" src="http://i01.c.aliimg.com/images/info/wang/btn1.png"></a></p>');
			return _html.join('');
		},
		
		_renderOfferList:function(offerList){
			var offerListHtml = [];
			//�����ʾ5��
			var maxItemLength = parseInt(this.oFlyConfig.count)||5;
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
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
			var detailUrl  = getURL(offer);
			var _title = '<li class="p-name"><a class="blue" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,26,'...')+'</a></li>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<li class="top-img"><a target="_blank" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img onload="resizeImage(this,100,120);" src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/operation/yoyo/100x100_1282225415019.png\'"/></a></li>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
             var currency,price;
			 if(offer.rmbPrice !== 0||''){
				currency = '<span class="fd-cny">&yen;</span>';
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
			 if(currency == '<span class="value">��Ҽ۸�</span>'){
				var _ddPrice = '<li class="price">' + currency + '</li>';
			 }else{
				if(price < 10000 && price !== 0 && price !== ''){
				   var _ddPrice = '<li class="price">' + currency + '<em class="value">' + price.toFixed(2) +'</em></li>';
				}else{
				   var _ddPrice = '';
				}
			 }
					return _ddPrice;

            },
			
		_renderFoot:function(){
			return '';
		},
		end:0
	},true);
})(window,FD.sys.fly);