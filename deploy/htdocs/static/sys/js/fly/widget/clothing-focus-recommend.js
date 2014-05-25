/**
* author honglun.menghl
* date: 2010-08-25
* ��װ��ҵ����foucsҳ��
*/


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
	S.clothingRecommend = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.clothingRecommend.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
		this.result = data;
		this.oFlyConfig = oFlyConfig;
		this.oMergedFlyConfig = oMergedFlyConfig;
		/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
		this[callback]();
	};
	//�̳и���
	L.extend(S.clothingRecommend,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.clothingRecommend,S.InterfaceFlyView);
	
	// getURL , the p4p pay url is the eURL 
	function getURL(offer){
		if(offer.eURL && offer.eURL !== ''){
			return offer.eURL;
		}else{
			return offer.offerDetailUrl;
		}
	}
	
	//������װ
	L.augmentObject(S.clothingRecommend.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('clothingRecommend');
			this._render();
		},
		
        addOver: function( node, over , now){
			var removeNode = $$('#'+node+' li');
		 	over = over || 'over';
				    $E.delegate($(node),'mouseenter', function(e) {
						$D.removeClass(removeNode,over);
						var currentEl = this;
						$D.addClass(currentEl,over);
					},  'li'); 
        }, 
	   cancelLink: function( node ){
            var a = $$( node );
            $E.addListener( a, 'click', function(e){
                $E.preventDefault(e);
            });
        },    	
		onFailure:function(){this._onFailure();},		
		onTimeout:function(){this._onFailure();},		
		//onProgress:toFakePage,
		_onFailure:function(){
			$('clothing-suggest').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; width:252px;"><p style="margin-top:20px; margin-bottom:8px;">��ȡ��Ʒʧ��</p><p>��<a href="#" title="ˢ��" class="refresh-page" onclick="javascript:window.location.reload();" style="display:inline; width:30px; height:17px; line-height:17px;">ˢ��</a>ҳ�����³���</p></li>';
		},
		

		_renderMain:function(){
			var offerIds = [];
			for(var i = 0, l = this.result.data.length; i < l; i++){
				offerIds = offerIds.concat(this.result.data[i].offerIds);
			}
			offerIds = offerIds.slice(0,18);
			if(offerIds.length%3 !=0 ){
				var len = offerIds.length - offerIds.length%3;
				offerIds = offerIds.slice(0,len);
			}
			this._exposureMarquee(offerIds);
			//this._exposure(offerIds);
			//FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			return this._renderOfferList(offerIds);
			//return _html.join('');
			
		},
		_exposureMarquee : function(offerIds){ // ������ع⣬��ʾ���û�����ع�
			var offersGroups = [], counter = 0, exRecord = [], left = $('cu-marquee-lt'), right = $('cu-marquee-rt'), _that =  this;
			for(var i = 0, l = (offerIds.length)/3; i < l; i++){
				offersGroups.push(offerIds.slice(i*3,(i+1)*3));
			}
			var n = offersGroups.length;
			exRecord[0]=1;
			FD.sys.fly.Utils.exposure(offersGroups[counter],{'ctr_type':_that.oFlyConfig.coaseType,'page_area':_that.oFlyConfig.recid,'object_type':'offer'});
			$E.addListener(left,'click',function(){
				counter = (counter-1)%n;
				if(counter<0){
					counter +=n;
				}
				if(!exRecord[counter]){
					exRecord[counter] = 1;
					FD.sys.fly.Utils.exposure(offersGroups[counter],{'ctr_type':_that.oFlyConfig.coaseType,'page_area':_that.oFlyConfig.recid,'object_type':'offer'});
				}
			});
			$E.addListener(right,'click',function(){
				counter = (counter+1)%n;
				if(!exRecord[counter]){
					exRecord[counter] = 1;
					FD.sys.fly.Utils.exposure(offersGroups[counter],{'ctr_type':_that.oFlyConfig.coaseType,'page_area':_that.oFlyConfig.recid,'object_type':'offer'});
				}
			});
			
		},
		_exposure : function(offerIds){ //�ع�
			var exposureStr = '';
			for(var i = 0, l = offerIds.length; i < l; i++){
				exposureStr+=offerIds[i].offerId+','+offerIds[i].alg+';';
			}
			
			exposureStr = exposureStr.slice(0,-1);
			YAHOO.util.Get.script('http://ctr.1688.com/ctr.html?ctr_type='+this.oFlyConfig.coaseType+'&page_area='+this.oFlyConfig.recid+'&object_type=offer&object_ids='+exposureStr+'&time='+(+new Date()),{});
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
			offerHtml.push(this._renderOfferPhoto(offer));
			offerHtml.push(this._renderOfferTitle(offer));
			offerHtml.push(this._renderOfferPrice(offer));
			offerHtml.push('</li>');
			return offerHtml.join('');
		},
		
	     _renderOfferTitle:function(offer){
			var detailUrl  = getURL(offer);
			var _title = '<a href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+FD.sys.fly.Utils.doSubstring(offer.subject,18,true)+'</a>';
			return _title;
		},
		
		_renderOfferPhoto:function(offer){
			var detailUrl  = getURL(offer);
			var _photo = '<a class="showImg" href="'+detailUrl+'" target="_blank" title="'+offer.subject+'" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''+offer.offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+offer.alg+'\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})"><img src="'+FD.sys.fly.Utils.getOfferImageURL(offer.offerImageUrl,1)+'" onerror="javascript:this.src=\'http://img.china.alibaba.com/news/upload/0/150x150_1281929016314.png\'" width="80" onload="resizeImage(this,80,80);" /></a>';
			return _photo;
		},
			
	     _renderOfferPrice:function(offer){
            var currency = offer.rmbPrice !== 0||'' ? '&yen;' : offer.foreignCurrency,
            price = offer.rmbPrice !== 0||'' ? offer.rmbPrice : offer.foreignPrice;
           //  var iconhonest = offer.Credit !== false||'' ? '<a title="���ű��Ϸ����̼ҳ�ŵ�����ű��Ϲ�������" class="icon-honest" href="http://'+offer.memberId+'.cn.1688.com/athena/bizreflist/'+offer.memberId+'.html">����ͨ</a>' : '';
             //var iconalipay = offer.useAlipay !==false||'' ? '<a title="����Ʒ����֧��֧����������ջ�ȷ�Ϻ����Ҳ����õ�Ǯ��������Ľ��װ�ȫ��" class="icon-alipay" href="http://view.1688.com/cms/safe/trust/zhifubao.html">֧����</a>' : '';
        	var _ddPrice = '<span>' + currency + '<em>' + price.toFixed(2) +'</em></div>';
                return _ddPrice;
            },
	    
		_render:function(){
		var mainContent = this._renderMain();
		$('clothing-suggest').innerHTML = mainContent;
		FYE.onDOMReady(function() {
			switchTabs('hasHistory', 'historyTitle1', 'historyTitle2', 'clothes-mod-tab1', 'clothes-mod-tab2', 'bottom-icon1', 'bottom-icon2');
			if (FYD.get('returnImgs')) {
				FD.widget.Marquee.decorate('returnImgs', {
					isAutoPlay: false,
					liWidth: 98,
					timeDelay: 10,
					preButton: 'cu-marquee-lt',
					nextButton: 'cu-marquee-rt',
					preItem: 3
				});
			}
		});
		
		},
		end:0
	},true);
})(window,FD.sys.fly);

function toFakePage(){
	window.location = 'http://view.1688.com/cms/xsppf/wwinsider.html';
}