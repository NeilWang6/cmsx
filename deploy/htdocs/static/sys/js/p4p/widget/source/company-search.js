//�Ƿ�Ҫ����fly debug
FD.sys.p4p.Utils.debug(false);
(function(win,S){
	var L = YAHOO.lang,D = YAHOO.util.Dom, E = YAHOO.util.Event;
	S.P4POfferRecommendedView = function(callback,data,oP4PConfig,oMergedP4PConfig){
		//ʵ��������
		data = FD.sys.p4p.Utils.doFitlerData(data);
		S.P4POfferRecommendedView.superclass.constructor.call(this, data,oP4PConfig,oMergedP4PConfig);
		this.result = data;
		this.oP4PConfig = oP4PConfig;
		this.oMergedP4PConfig = oMergedP4PConfig;
		/*���ݷ��ص�״̬�����ò��õĺ���,��ȻҲ�����ֶ�����*/
		this[callback]();
		FD.sys.p4p.Utils.log(data);
		FD.sys.p4p.Utils.log(oP4PConfig);
	};
	//�̳и���
	L.extend(S.P4POfferRecommendedView,S.AbstractP4PView);
	//������װ
	L.augmentObject(S.P4POfferRecommendedView.prototype,{
		onSuccess:function(){
			FD.sys.p4p.Utils.log('Success:P4POfferRecommendedView');
			new S.P4POfferRecommendedRender(this.result,'p4poffer',6);
		},
		onFailure:function(){
			FD.sys.p4p.Utils.log('Failure:P4POfferRecommendedView');
		},
		onTimeout:function(){
			//do nothing
		},
		end:0
	},true);
	
	S.P4POfferRecommendedRender=function(data,id,num){
		this.maxOfferNum = num || 6; //p4p���λ�����ʾΪ6��
		this.data = data;
		this.root = document.getElementById(id); //offer�����λ�ñ�ʶ
		if(typeof this.root=='undefined')return;
		this.searchtrace = 'company_search_p4phot_offer';
	    this.searchtrace_more = 'company_search_p4phot_more';
		this.searchtrace_p4phere = 'company_search_p4phere';
		if(typeof window.iPageConfig=='object'&&window.iPageConfig.keywords==""){
			this.searchtrace = 'company_list_p4phot_offer';
			this.searchtrace_more = 'company_list_p4phot_more';
		}
		this.morePost=[];//�����������
		if(typeof window.p4pObject=='object'){
		    if(p4pObject.dcatid){
		        this.morePost.push('dcatid='+p4pObject.dcatid);
		    }
		    if(p4pObject.keyword){
		        this.morePost.push('keywords='+p4pObject.keyword);
		    }
		    if(this.morePost.length){
		        this.morePost='?'+this.morePost.join('&');
		    }else{
		        this.morePost='';
		    }
		}else{
			this.morePost='';
		}
		this.doRender();
	};
	L.augmentObject(S.P4POfferRecommendedRender.prototype,{
		//ƴװp4p���λ��ͷ��
		_doRenderHeader:function(){
			return '<div class="p4p-header"><h3>�����Ƽ�</h3><a href="http://view.1688.com/cms/video/zhindex.html?tracelog=p4p_exhibition" target="_blank" class="p4p-m p4p-expo">����չ���Ƽ�</a><a onmousedown="SS.aliclick(this,\'?searchtrace='+this.searchtrace_more+'\')" href="'+S.API_CONFIG.entrance+'" target="_blank" title="��ҲҪ����������">��ҲҪ����������</a></div>';
		},
		//ƴװp4p���λ�ײ�
		_doRenderFooter:function(){
			return '';
		},
		//ƴװͼƬԪ��
		_doRenderImage:function(item,idx){
			var _imgurl="";
			if(item.OFFERIMGURL&&item.OFFERIMGURL!= ""){
				_imgurl=item.OFFERIMGURL;
			}else {
				_imgurl = S.API_CONFIG.noimg.x100;
			}
			return '<div class="p4p-pic"><a href="'+item.EURL+'" title="'+FD.sys.p4p.Utils.doReplace(item.TITLE)+'" target="_blank" onmousedown="FD.sys.p4p.Utils.p4pTagClick(\''+item.RESOURCEID+'\',\''+item.REDKEY+'\',\'819002_1008\');SS.aliclick(this,\'?searchtrace='+this.searchtrace+'\')"><img src="'+_imgurl+'"/></a></div>';
		},
		//ƴװ����Ԫ��
		_doRenderTitle:function(item){
			var U = FD.sys.p4p.Utils;
			return '<h3><a title="'+U.doReplace(item.TITLE)+'" href="' + item.EURL + '" onmousedown="FD.sys.p4p.Utils.p4pTagClick(\''+item.RESOURCEID+'\',\''+item.REDKEY+'\',\'819002_1008\');SS.aliclick(this,\'?searchtrace='+this.searchtrace+'\')" target="_blank" >' + U.doRed(U.doSubstringAo(U.doReplace(item.TITLE),26),item.REDKEY) + '</a></h3>';
		},
		//ƴװ��˾����Ԫ��
		_doRenderCompanyName:function(item,idx){
			return '';
		},
		//ƴװ�۸�Ԫ��
		_doRenderPrice:function(item){
			if(item.OFFERPRICE==" "){
				return '<p class="p4p-c6">�۸�����</p>';
			}
			return '<p><em><b>&yen;</b>'+ FD.sys.p4p.Utils.doSubstringAo(item.OFFERPRICE,18) +'</em></p>';
		},
		_doRenderWangWang:function(item,idx){
			return '<div class="p4p-ww"><a href="#" alitalk="{id:\''+item.MEMBERID+'\'}" onclick="FD.sys.p4p.Utils.p4pClick(\''+item.EURL+'\')" onmousedown="FD.sys.p4p.Utils.p4pTraceEnquiryClick({toId:\''+item.MEMBERID+'\',offerId:\''+item.RESOURCEID+'\',source:\'1\'});SS.aliclick(this,\'?searchtrace='+this.searchtrace+'\')" target="_self" class="iconAlitalk"></a></div>';
		},
		//ƴװһ��p4p�����Ϣ
		_doRenderItem:function(item, idx){
			var itemHTML = [],className = '';
			if(idx==this.maxOfferNum-1){
				className = 'p4p-item-fixed';
			}
			/*���������������³���ģʽ�´���*/
			if(typeof window['iPageConfig']=='object'&&window['iPageConfig'].showStyle=='shopwindow'){
				if(idx==3){
					className = 'p4p-item-fixed';
				}
			}
			itemHTML.push('<li class="'+className+'">');
			itemHTML.push(this._doRenderImage(item,idx));
			itemHTML.push(this._doRenderTitle(item,idx));
			itemHTML.push(this._doRenderPrice(item,idx));
			itemHTML.push(this._doRenderWangWang(item,idx));
			itemHTML.push('</li>');
			return itemHTML.join('');
		},
		//ƴװp4p�������岿��
		_doRenderContent:function(items){
			var output=[];
			output.push('<ul class="p4p-content">');
			for (var i = 0; i < items.length&&i<this.maxOfferNum;i++) {
				output.push(this._doRenderItem(items[i],i));
			}
			output.push('</ul>');
			return output.join('');
		},
		//ƴװ����p4p���
		doRender:function(){
			var d = document.createElement('div');
			d.id='J_p4pTop';
			d.className = 'p4p-search-img';
			/*���������������³���ģʽ�´���*/
			if(typeof window['iPageConfig']=='object'&&window['iPageConfig'].showStyle=='shopwindow'){
				d.className = 'p4p-search-window';
			}
			var html = [];
			html[html.length] = this._doRenderHeader();
			html[html.length] = this._doRenderContent(this.data);
			html[html.length] = this._doRenderFooter();
			d.innerHTML = html.join('');
			this.root.appendChild(d);
			new FD.widget.Alitalk(FYS('a[alitalk]','J_p4pTop'),{  
				onRemote: function() {  
					 //thisָ��a  
					 switch(this.opt.online) {  
						case 0:  
						case 2:  
						case 6:  
						default: //������  
							this.innerHTML='��������';  
							this.title='��������';  
							break;  
						case 1: //����  
							this.innerHTML='������ϵ';  
							this.title='������ϵ';  
							break;  
						case 4:  
						case 5: //�ֻ�����  
							this.innerHTML='���Ҷ���';  
							this.title='���Ҷ���';  
							break;  
					}  
				},
				webWW: function() {  
					window.open('http://alitalk.1688.com/','_blank');  
				}  			
			 });  
		}
	});
	S.getP4POfferRecommended = function(){
		FD.sys.p4p.Ao(window.p4pObject).use(FD.sys.p4p.P4POfferRecommendedView);
	};
	
})(window,FD.sys.p4p);
