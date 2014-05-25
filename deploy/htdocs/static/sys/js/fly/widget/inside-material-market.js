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
	S.InsideMMaket = function(callback,data,oFlyConfig,oMergedFlyConfig){
		//ʵ��������
		S.InsideMMaket.superclass.constructor.call(this, data,oFlyConfig,oMergedFlyConfig,true);
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
	L.extend(S.InsideMMaket,S.AbstractFlyView);
	//�ӿ�ʵ����
	L.augment(S.InsideMMaket,S.InterfaceFlyView);
	
	//������װ
	L.augmentObject(S.InsideMMaket.prototype,{
		onSuccess:function(){
			FD.sys.fly.Utils.log('InsideMMaket');
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
			$('material-market').innerHTML = '<li style="height:200px; text-align:center; font-size:14px; font-weight:bold; color:#000;"><p style="margin-top:20px; margin-bottom:8px;">��ȡ����ʧ��</p><p>��<a href="#" target="_self" class="refresh-page" onclick="javascript:window.location.reload();" style="color: rgb(31, 97, 192);">ˢ��</a>,���³���</p></li>';
		},
		_render:function(){
			var items = $$('#material-market .f-tab-t'),
			contentBox = $$('#material-market .f-tab-b'),
			offerIds = [],
			m=0;
			for (var i=0; i<this.result.data.length; i++) {
				if (this.result.data[i].brief.length<2) {
					continue;
				}
				
				if (items[m]) {
					items[m].innerHTML = FD.sys.fly.Utils.doSubstring(this.result.data[i].categoryDesc,12,'');
				}
				
				var strHTML = '<a class="material-market-more more-font" href="http://s.1688.com/selloffer/c-'
							+ this.result.data[i].categoryId+'_n-y.html?tracelog=ycl_tm_offer">����&gt;&gt;</a>'
							+ '<table cellpadding="0" cellspacing="0"><tbody><tr class="singular title"><th width="24%">Ʒ��</th>',
				data = this.result.data[i].offerIds;
				if (this.result.data[i].brief[0]==='Ʒ��') {
					strHTML = '<a class="material-market-more more-font" href="http://s.1688.com/selloffer/c-'
							+ this.result.data[i].categoryId+'_n-y.html?tracelog=ycl_tm_offer">����&gt;&gt;</a>'
							+ '<table cellpadding="0" cellspacing="0"><tbody><tr class="singular title">';
				}
				
				for (var n=0; n<3 && n<this.result.data[i].brief.length; n++) {
					strHTML += '<th width="19%">'+this.result.data[i].brief[n]+'</th>';
				}
				strHTML += '<th width="19%">�۸�</th></tr>';
				offerIds = offerIds.concat(data);
				for (var j=0; j<data.length; j++) {
					var strPrice = (data[j].rmbPrice==='') ? '��Ҽ۸�': data[j].rmbPrice,
					strUrl = (data[j].eURL=='') ? data[j].offerDetailUrl : data[j].eURL,
					strTr = (j%2 !== 0) ? '<tr class="singular">' : '<tr>',
					strBrief = '';
					
					if (this.result.data[i].brief[0] === 'Ʒ��') {
						for (var n=0; n<3 && n<data[j].brief.length; n++) {
							if (this.result.data[i].brief[n] == data[j].brief[n].name) {
								var strValue = (data[j].brief[n].value=='' || data[j].brief[n].value==null) ? '-' : FD.sys.fly.Utils.doSubstring(data[j].brief[n].value,10,'');
								
								strBrief += '<td title="'+data[j].brief[n].value+'"><a href=\"'+strUrl
							 			 + '?tracelog=ycl_tm_offer\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 			 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
								 		 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+strValue+'<\/a><\/td>';
							} else {
								strBrief += '<td>-</td>';
							}
						}
						
						strHTML += strTr +strBrief + '<td class="price">'+data[j].rmbPrice+'</td></tr>';
					} else {
						for (var n=0; n<3 && n<data[j].brief.length; n++) {
							if (this.result.data[i].brief[n] == data[j].brief[n].name) {
								var strValue = (data[j].brief[n].value=='' || data[j].brief[n].value==null) ? '-' : FD.sys.fly.Utils.doSubstring(data[j].brief[n].value,10,'');
								strBrief += '<td title="'+data[j].brief[n].value+'"><a href=\"'+strUrl
							 			 + '?tracelog=ycl_tm_offer\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 			 + data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
								 		 + '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})">'+strValue+'<\/a><\/td>';
							} else {
								strBrief += '<td>-</td>';
							}
						}
					
						strHTML += strTr+'<td><a href=\"'+strUrl
							 	+ '?tracelog=ycl_tm_offer\" onmousedown="FD.sys.fly.Utils.iClick({\'page\':'+this.oFlyConfig.coaseType+',\'objectId\':\''
							 	+ data[j].offerId+'\',\'recId\':\''+this.oFlyConfig.recid+'\',\'alg\':\''+data[j].alg
								+ '\',\'objectType\':\'offer\',\'pid\':\''+this.oFlyConfig.pid+'\'})" title=\"'+this.result.data[i].categoryDesc+'\">'
							 	+ FD.sys.fly.Utils.doSubstring(this.result.data[i].categoryDesc,12,'')+'</a></td>'+strBrief
							 	+ '<td class="price">'+data[j].rmbPrice+'</td></tr>';
					}
					
					
				}
				strHTML += '</tbody></table>';
				if (contentBox[m]) {
					contentBox[m].innerHTML = strHTML;
				}
				m++;
			}
			FD.sys.fly.Utils.exposure(offerIds,{'ctr_type':this.oFlyConfig.coaseType,'page_area':this.oFlyConfig.recid,'object_type':'offer'});
			
			if (m<items.length) {
				if (m===0) {
					$D.setStyle($$('#material-market .f-t-static')[0], 'display', 'block');
					$D.setStyle($$('#material-market .f-b-static')[0], 'display', 'block');
				}
				while (m<items.length) {
					//$D.setStyle(items[m], 'display', 'none');
					//$D.setStyle(contentBox[m], 'display', 'none');
					items[m].parentNode.removeChild(items[m]);
					contentBox[m].parentNode.removeChild(contentBox[m]);
					m++;
				}
			}
			var tab = new FD.widget.Tab('material-market');  
		},

		end:0
	},true);
})(window,FD.sys.fly);