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
			new S.P4POfferRecommendedRender(this.result,'topRecommended',6);
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
		this.maxOfferNum = Math.min(num,data.length); //p4p���λ�����ʾΪ4��
		this.data = data;
		this.root = document.getElementById(id); //offer�����λ�ñ�ʶ
	    this.searchtrace = 'bizlist_search_p4phot_offer';
	    this.searchtrace_more = 'bizlist_search_p4phot_more';
		this.searchtrace_p4phere = 'bizlist_p4phere';
	    this.morePost=[];//�����������
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
	    if(typeof window.businessPageConfig!='undefined'&&window.businessPageConfig.keywordsGbk==''){
	        this.searchtrace = 'bizlist_list_p4phot_offer';
	        this.searchtrace_more = 'bizlist_list_p4phot_more';
	    }
		if(typeof this.root=='undefined')return;
		this.doRender();
	};
	L.augmentObject(S.P4POfferRecommendedRender.prototype,{
		//ƴװp4p���λ��ͷ��
	_doRenderHeader:function(){
		return '<div class="title_v1"><h3>�����Ƽ�</h3><a target="_blank"  href="'+S.API_CONFIG.entrance+'" onmousedown="BB.aliclick(this,\'?searchtrace='+this.searchtrace_p4phere+'\')">��ҲҪ����������</a></div>';
	},
	//ƴװp4p���λ�ײ�
	_doRenderFooter:function(){
		return '<div class="more"><a href="http://page.1688.com/html/p4p/landingpage.html'+this.morePost+'" target="_blank" onmousedown="BB.aliclick(this,\'?searchtrace='+this.searchtrace_more+'\')">���������Ƽ�&gt;&gt;</a></div>';
	},
	//ƴװһ��p4p�����Ϣ
	_doRenderItem:function(item, idx){
		var U = FD.sys.p4p.Utils;
        var itemHTML=''
            +'<li class="img_offer" '+(idx+1==this.maxOfferNum?'style="margin-right:0;"':'')+'>'
            +'<div class="imgbox_v1">'
            +'<a onmousedown="FD.sys.p4p.Utils.p4pTagClick(\''+item.RESOURCEID+'\',\''+item.REDKEY+'\',\'819032_1008\');BB.aliclick(this,\'?searchtrace='+this.searchtrace+'\')" href="'+item.EURL+'" target="_blank"><img src="'+item.OFFERIMGURL.replace('.summ','.220x220')+'" onload="if(this.width>this.height){this.width=150}else{this.height=150}"/></a>'
            +'</div>'   
            +'<h3 class="summary"><a onmousedown="FD.sys.p4p.Utils.p4pTagClick(\''+item.RESOURCEID+'\',\''+item.REDKEY+'\',\'819032_1008\');BB.aliclick(this,\'?searchtrace='+this.searchtrace+'\')" href="'+item.EURL+'" target="_blank">'+(function(){
				var lg=item.TITLE.lenB();
				if(lg>52){
					return U.doRed(U.doSubstringAo(U.doReplace(item.TITLE), 48, 2),item.REDKEY);
				}else{
					return U.doRed(item.TITLE,item.REDKEY);
				}
			})()+'</a></h3>'
            +'<p class="price">'+this._doRenderPrice(item)+this._doRenderQuantityBegin(item)
            +this._doRenderWangWang(item, idx)
			+'</p>'
            +'</li>'
		return itemHTML;
	},
	_doRenderQuantityBegin:function(item){
		var U = FD.sys.p4p.Utils;
		if(item.OFFERPRICE==" "){
			return '';
		}else{
			if(item.QUANTITYBEGIN.length>4){
				return '<b title="'+item.QUANTITYBEGIN+'">'+U.doSubstringAo(item.QUANTITYBEGIN,2) +'...'+item.PRICEUNIT+'����</b>';
			}else{
				return '<b>'+item.QUANTITYBEGIN+item.PRICEUNIT+"����"+'</b>';
				
			}
		}
	},
    _doRenderPrice:function(item){
		var U = FD.sys.p4p.Utils;
		if(item.OFFERPRICE==" "){
			return '<em>�۸�����</em>';
		}
		var price=item.OFFERPRICE.split('/')[0].split('.'),
			p1=price[0];
		if(price.length==1){
			return '<em title="'+p1+'">&yen;'+U.doSubstringAo(p1,7)+'...</em>';
		}else{
			var p2=price[1].substr(0,2);
			if(p1.length==5){
				return '<em title="'+price.join('.')+'">&yen;'+p1+'.'+p2.substr(0,1)+'</em>';
			}else if(p1.length>5){
				return '<em title="'+price.join('.')+'">&yen;'+p1.substr(0,5)+'...</em>';
			}else{
				return '<em title="'+price.join('.')+'">&yen;'+p1+'.'+p2+'</em>';
			}
		
		}
	},
    _doRenderWangWang:function(item,idx){
		return '<span class="p4p-ww"><a class="iconAlitalk" alitalk="{id:\''+item.MEMBERID+'\'}" href="#" onclick="FD.sys.p4p.Utils.p4pClick(\''+item.EURL+'\')" onmousedown="FD.sys.p4p.Utils.p4pTraceEnquiryClick({toId:\''+item.MEMBERID+'\',offerId:\''+item.RESOURCEID+'\',source:\'1\'});BB.aliclick(this,\'?searchtrace='+this.searchtrace+'\')" target="_self">&nbsp;</a></span>';
	},
	//ƴװp4p�������岿��
	_doRenderContent:function(items){
        
        var output=''
            +'<ul class="content_v1" id="J_p4p_items">'
            +(function(t){
                var itemsHTML='';
                for(var i=0;i<t.maxOfferNum;i++){
                    itemsHTML+=t._doRenderItem(items[i],i);
                }
                return itemsHTML;
            })(this)
            +'</ul>';
		return output;
	},
	//ƴװ����p4p���
	doRender:function(){
		this.root.innerHTML=''
            +this._doRenderHeader()
            +this._doRenderContent(this.data)
            +this._doRenderFooter();
			new FD.widget.Alitalk(FYS('a[alitalk]','J_p4p_items'),{  
				onRemote: function() {  
                    switch(this.opt.online) {  
                        case 0:  
                        case 2:
                        case 6:  
                        default: //������  
                            this.innerHTML='';  
                            this.title='';  
                        break;  
                        case 1: //����  
                            this.innerHTML='';  
                            this.title='';  
                        break;  
                        case 4:  
                        case 5: //�ֻ�����  
                            this.innerHTML='';  
                            this.title='';  
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
