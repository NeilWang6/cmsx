//�Ƿ�Ҫ����fly debug
FD.sys.fly.Utils.debug(false);

(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	/**
	 * workplace-Ϊ���Ƽ�
	 * @param {String} callback 		���ص�״̬ onSuccess|onFailure|onTimeout|onProgress
	 * @param {Object} data 			���ص�����
	 * @param {Object} oFlyConfig 		��ʼ�������ò���
	 * @param {Object} oMergedFlyConfig	����mergeed������ò���,����oFlyConfig��ͬ����,�����������������ӿڷ�������������Ĳ���
	 */
	S.WorkplaceRecommend = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.WorkplaceRecommend.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig);
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
	L.extend(S.WorkplaceRecommend,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.WorkplaceRecommend,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.WorkplaceRecommend.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('WorkplaceRecommend');
			this._render();
		},
		onFailure:function(){
/*
			var str = '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/421720919.html" title="�˶�������"><img src="http://img.china.alibaba.com/img/offer/42/17/20/91/9/421720919.310x310.jpg" alt="�˶�������" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/421720919.html" title="�˶�������"><span>�˶�������</span></a></dt></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/395062075.html" title="��Ƥ�����"><img src="http://img.china.alibaba.com/img/offer/39/50/62/07/5/395062075.310x310.jpg" alt="��Ƥ�����" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/395062075.html" title="��Ƥ�����"><span>��Ƥ�����</span></a></dt><dd class="product-a-icon"><span class="icon-pi">��</span><span class="cny">&yen;</span><span class="price-num b">20.00</span></dd></dl>';
				str += '<dl class="nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/594913961.html" title="�������棨��ɫ��"><img src="http://img.china.alibaba.com/img/offer2/2009/913/961/594913961_72b793a181ce4d2b0d70641ac65f33df.310x310.jpg" alt="�������棨��ɫ��" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/594913961.html" title="�������棨��ɫ��"><span>�������棨��</span></a></dt><dd class="product-a-icon"><span class="icon-pi">��</span><span class="cny">&yen;</span><span class="price-num b">141.00</span></dd></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/543065546.html" title="Ҭ���ֱ�"><img src="http://img.china.alibaba.com/img/offer/54/30/65/54/6/543065546.310x310.jpg" alt="Ҭ���ֱ�" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/543065546.html" title="Ҭ���ֱ�"><span>Ҭ���ֱ�</span></a></dt></dl>';
				str += '<dl class="borr-1 nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/74101727.html" title="�������"><img src="http://img.china.alibaba.com/img/offer/74/10/17/27/74101727.310x310.jpg" alt="�������" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/74101727.html" title="�������"><span>�������</span></a></dt></dl>';
				str += '<dl class="nomargin"><dt><a class="img-box" target="_blank" href="http://detail.1688.com/buyer/offerdetail/609262869.html" title="ʱ�и�����������"><img src="http://img.china.alibaba.com/news/upload/00000000000/tj-6_1265175159668.png" alt="ʱ�и�����������" onload="FD.sys.fly.Utils.resizeImage(this,80,80)"  onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a><a target="_blank" href="http://detail.1688.com/buyer/offerdetail/609262869.html" title="ʱ�и�����������"><span>ʱ�и���������</span></a></dt></dl>';
			
*/
			var str ='<div class="recommend-noinfo">��ȡ�Ƽ���Ϣʧ�ܣ���<a href="#" id="btn-refresh">ˢ��</a>ҳ�����³���</div>';
			$('recommend-box').innerHTML = str;
			this.refreshData();
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
			//�����ʾ5��
			var maxItemLength = 8;
			//parseInt(this.oFlyConfig.count)||5
			for(var i=0,l = offerList.length;i<l&&i<maxItemLength;i++){
				offerListHtml.push(this._renderOfferItem(offerList[i],i));
			}
			return offerListHtml.join('');
		},
		_renderOfferItem:function(offer,idx){
			var offerHtml = [];
			if((idx+1)%3 != 0){
				offerHtml.push('<dl class="borr-1 nomargin">');
			}
			else{
				offerHtml.push('<dl class="nomargin">');
			}
			offerHtml.push('<dt>');
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push('</a>');
			offerHtml.push('</dt>');
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</dl>');
			return offerHtml.join('');
		},
		_renderOfferTitle:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _title = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'"><span>'+FD.sys.fly.Utils.doSubstring(offer.subject,12,false)+'</span></a>';
			return _title;
		},
		_renderOfferPhoto:function(offer){
			var detailUrl  = offer.offerDetailUrl;
			if(offer.type!=0){
				detailUrl = offer.eURL;
			}
			var _photo = '<a class="img-box" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,0)+'"  width=\'80\' height=\'80\'  onload="FD.sys.fly.Utils.resizeImage(this,80,80)" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/5002027/48x48_1276134613200.gif\'"/></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
		 	var currency,price;
			var iconpi = '<span class="icon-pi">��</span>';
			if(offer.rmbPrice !== 0||''){
				currency = '<span class="cny">&yen;</span>';
				price = offer.rmbPrice;
			}else{
				if(offer.foreignCurrency !== ''){
					currency = '<span>��Ҽ۸�</span>';
					price = offer.foreignCurrency;
				}else{
					currency = '';
					price = '';
				}
			}
			if(currency == '<span>��Ҽ۸�</span>'){
				var _ddPrice = '<dd class="product-a-icon">' + currency + '</dd>';
			}else{
				if(price < 10000 && price !== 0 && price !== ''){
					var _ddPrice = '<dd class="product-a-icon">' + iconpi + currency + '<span class="price-num b">' + price.toFixed(2) + '</span></dd>';
				}else{
					var _ddPrice = '';
				}
			}
			return _ddPrice;
			
            },
		_renderFoot:function(){
			return '';
		},
		refreshData:function(){
			//this.stopDefault(e);
			var stopDefault = function(e){
		        var e = window.event || e;
		        //��ֹĬ�����������(W3C)
		        if (e.preventDefault) {
		            e.preventDefault();
		            
		        }
		        //IE����ֹ������Ĭ�϶����ķ�ʽ
		        else 
		            e.returnValue = false;
		        return false;
		    };
			FYE.on('btn-refresh','click',function(e){
				stopDefault(e);
				memberId = FDEV.util.Cookie.get('__last_loginid__');
				$('recommend-box').innerHTML = '<div class="recommend-noinfo"><img src="http://img.china.alibaba.com/images/myalibaba/trade/100524/loading.gif"  align="absmiddle" />����ˢ�£����Ե�...</div>';
		        setTimeout(function (){
					new FD.sys.fly.Ao({
						'flyWidgetId': 'recommend-box',
						'count': 6,
						'pid': '819092_1008',
						'recid': '1010',
						'coaseType': '30',
						'uid': memberId
					}).use(FD.sys.fly.WorkplaceRecommend);
				},2000);
				
			});
			
		},
		end:0
	},true);
})(window,FD.sys.fly);