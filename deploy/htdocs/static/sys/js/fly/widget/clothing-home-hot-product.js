/**
 * @version 1.0
 * @author  hongss
 * Date     Sept 19, 2010
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
	S.RankTophot = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.RankTophot.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
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
	L.extend(S.RankTophot,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.RankTophot,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.RankTophot.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('RankTophot');
			this._render();
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
			$('js-marquee').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">��ȡ��Ʒʧ��</p><p>��<a href="#" title="ˢ��" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">ˢ��</a>ҳ�����³���</p></li>';
		},
		_render:function(){
			var offerIds = [];
			for (var i=0; i<this.result.data.length; i++) {
				var strHTML = '<ul class="list-txt">',
				data = this.result.data[i].offerIds;
				offerIds = offerIds.concat(data);
				for (var j=0; j<data.length; j++) {
					var strPrice = (data[j].rmbPrice==='') ? '��Ҽ۸�' : '<span class="fd-cny">&yen;</span><em class="value">'+data[j].rmbPrice+'</em>',
                    detailUrl =  ( data[j].eURL !== '' ) ? data[j].eURL : data[j].offerDetailUrl;
					
					strHTML += '<li><dl><dt class="description"><a href=\"'+detailUrl
							 + '\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
							 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" title=\"'+data[j].subject+'\" >'
							 + FD.sys.fly.Utils.doSubstring(data[j].subject,30,'...')+'</a></dt><dd class="price">'+strPrice
							 + '</dd></dl></li>';
							 //+ '</dd><dd class="sale-total">�ɽ�<em>'+data[j].offerSaleCnt+'</em>��</dd></dl></li>';
				}
				strHTML += '</ul>';
			}
			$('js-marquee').innerHTML = strHTML;
			
			var marquee = new FD.widget.Marquee('js-marquee',{direction: 'up', liLength:44});
			$E.on('js-marquee-up', 'click', function(e){
				$E.preventDefault(e);
				marquee.getPre();
			});
			$E.on('js-marquee-dn', 'click', function(e){
				$E.preventDefault(e);
				marquee.getNext();
			});
			
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
		},
		
		end:0
	},true);
})(window,FD.sys.fly);