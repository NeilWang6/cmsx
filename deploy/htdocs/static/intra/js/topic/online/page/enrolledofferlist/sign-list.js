/**
* @title �������JS[wholesale activity]
* @version 20100415
* @description 
* @link file
#1.http://style.c.aliimg.com/css/alisearch/moon/sys/reset.css
#2.http://style.c.aliimg.com/js/fdevlib/core/fdev-min.js
#3.http://style.c.aliimg.com/js/fdevlib/core/yui/connection-min.js
#4.http://style.c.aliimg.com/js/yui/cookie.js
*/
/**
* @update:���¼�¼
*
*/

!function(){
/**
* @root ����ֲ�����
# _C:���ó���,һ�㲻��ͨ������ı�
# _F:����Ķ��㺯������
# _D:��������ݻ����ݵ���ط���
# _R:�������Ⱦ����
# _A:����Ľ�����Ϊ����
# _I:��ʼ������,�ú���ֻ����һ��

*/
YAHOO.namespace('signList');
YAHOO.signList={//��ȫ�ֶ���
    showBox:function(id){
		if($('refusalBox'+id).style.display == "none" || $('refusalBox'+id).style.display == ""){
			$D.setStyle($('refusalBox'+id), 'display', 'block');
		}
		else
			$D.setStyle($('refusalBox'+id), 'display', 'none');
	},
	ViewAnswer:0,
    end:0

};
var _C={
    apiURL:'http://.....',
    //getHasOfferAPI:'http://exodus.1688.com/misc/topic/json/myEnrolledOfferList.htm',//��Ա�ѱ���offer
    end:0
};
var _F={

    end:0
};
var _D={
    //tid:'5555',+'&t='+new Date().getTime()
    getHasOffer:function(t,tid){
		var getHasOfferDomain = FYG('getHasOfferAPI').value,
			getHasOfferAPI = getHasOfferDomain + '/topic/general/searchEnrollOfferInfo.json';
		 
        YAHOO.util.Connect.asyncRequest('get',getHasOfferAPI+'?'+'topicId='+tid+'&time='+new Date().getTime(),{
            success:function(res) {
                try{
                    res=eval('0,'+res.responseText);
                    _D.nowData=res.enrollOfferList;
                    _R.hasOffer(t, tid);
                    
                    //���ͼƬ����
                    _D.getImgCheckResult(tid, res.isNeedCheckImg);
                    
                }catch(e){
                   // alert(e.message);
                    return;
                }
                
            },
            failure:function(res){alert("failure")}
            
        });
    },
    //���������ȡͼƬ����� -- add by hongss on 2012.11.20 for ͼƬ���
    getImgCheckResult: function(tid, isNeedCheckImg){
        if (isNeedCheckImg===true){
            var imgInfos = this.getImgInfos(),
                len = imgInfos.length,
                total = Math.ceil(len/2),
                domain = $('getHasOfferAPI').value,
                requestUrl = domain+'/topic/general/check_offer_img.json',
                imgDetailUrl = domain+'/topic/general/imgcheck.htm';
            
            for (var i=0; i<len; i=i+2){
                var imgsUrl = [];
                imgsUrl.push(imgInfos[i]['img']+'*'+imgInfos[i]['id']);
                if (i+1<len){
                    imgsUrl.push(imgInfos[i+1]['img']+'*'+imgInfos[i+1]['id']);
                }
                var param = {};
                param['img'] = encodeURIComponent(imgsUrl.join('^'));
                var configs = {
                    onCallback: function(o){
                        var imgs = o.data;
                        for (var j=0, l=imgs.length; j<l; j++){
                            var img = imgs[j];
                            if (img['isSuccess']===true && img['isHigh']===false){
                                var warnEl = document.createElement('i'),
                                    txtEl = document.createElement('a'),
                                    reason = encodeURIComponent(img['result'].join('^')),
                                    errImgUrl = encodeURIComponent(img['url']);
                                
                                $D.addClass(warnEl, 'icon-warn');
                                $D.addClass(txtEl, 'txt');
                                txtEl.innerHTML = 'ͼƬ����';
                                txtEl.href = imgDetailUrl+'?tid='+tid+'&ids='+img['offerId']+'&reason='+reason+'&img='+errImgUrl;
                                txtEl.target = '_blank';
                                $('id-'+tid+'-'+img['offerId']).appendChild(warnEl);
                                $('id-'+tid+'-'+img['offerId']).appendChild(txtEl);
                            }
                        }
                    }
                },
                transaction=FD.common.request('jsonp',requestUrl,configs,param);
            }
        }
    },
    //�����img��offerid���� -- add by hongss on 2012.11.20 for ͼƬ���
    getImgInfos: function(){
        var imgInfos = [];
        for(var i=0,lg=_D.nowData.length;i<lg;i++){
            var item = _D.nowData[i];
            if (item['offerImageUrl'].indexOf('nopic.gif')===-1){
                var imgInfo = {};
                imgInfo['id'] = item['offerId'];
                imgInfo['img'] = item['offerImageUrl'].replace('.summ.jpg', '.jpg');
                imgInfos.push(imgInfo);
            }
        }
        return imgInfos;
    },
    end:0
};
var _R={
    tHead:function(){
        var H=''
            +'<table border="0" cellpadding="0" cellspacing="0" class="tb-02">'
			+'<thead>'
			+'<tr>'
			+'<th class="span-img">ͼƬ</th>'
			+'<th class="span-subject">�μӻ��Ʒ����</th>'
			+'<th class="span-price">��۸�</th>'
			+'<th class="span-total">���������</th>'
			+'<th class="span-status">����״̬</th>'
			+'</tr>'
			+'</thead><tbody>';
			
        return H;
    },
    tBody:function(idx, tid){
        var H='';
        for(var i=0,lg=_D.nowData.length;i<lg;i++){
            H+=_R.offerBox(i,idx, tid);
        }

        return H;
		
    },
    
    offerBox:function(item,idx, tid){
		var reason = '';
		var status = _D.nowData[item].status,
			passed = _D.nowData[item].passed;
		
		var reasonInfo = '';
		if (passed) {
			switch (status) {
				case "wait.offer":
					reasonInfo = "�����";
					break;
			   case "new":
					reasonInfo = "�����";
					break;
				case "approved":
					reasonInfo = "��ͨ��";
					break;
				case "reject":
					reasonInfo = "���δͨ��";
					break;
				case "stop":
					reasonInfo = "�ѽ���";
					break;
				case "tdb":
					reasonInfo = "������˲�ͨ��";
					break;
			}
			
			if (status == "reject") {
				YAHOO.signList.ViewAnswer++;
				var reason_msg = _D.nowData[item].reasons;
				
				if (reason_msg) {
					var message = reason_msg.split("|");
					var M = '';
					for (i = 0; i < message.length; i++) {
						M += message[i] + '<br/>';
					}
					
					reason += '<br/><a class="links" onclick="YAHOO.signList.showBox(' + YAHOO.signList.ViewAnswer + ');" href="javascript:void(0);">�鿴ԭ��</a><div id="refusalBox' + YAHOO.signList.ViewAnswer + '" class="refusal-box"><div><span class="refusal-arrow">&nbsp;</span>' + M + '</div></div>';
				}
				else 
					reason = '';
			}
		}
		else{
			YAHOO.signList.ViewAnswer++;
			reasonInfo = "������˲�ͨ��";
			reason = '<br/><a class="links" onclick="YAHOO.signList.showBox(' + YAHOO.signList.ViewAnswer + ');" href="javascript:void(0);">�鿴ԭ��</a><div id="refusalBox' + YAHOO.signList.ViewAnswer + '" class="refusal-box"><div><span class="refusal-arrow">&nbsp;</span>' + _D.nowData[item].certReasons + '</div></div>';
		}	
		if(_D.nowData[item].tradePrice && typeof _D.nowData[item].tradePrice != "undefined"){
			_Price_str = _D.nowData[item].tradePrice+'Ԫ';
			if(_D.nowData[item].tradeUnit && typeof _D.nowData[item].tradeUnit != "undefined"){
				_Unit = "/"+_D.nowData[item].tradeUnit;
			}
			else{
				_Unit = "";
			}
		}
		else{
			_Price_str = "";
			_Unit = "";
		}

		if(_D.nowData[item].amount && _D.nowData[item].amount != "undefined"){
			_Total = _D.nowData[item].amount;
		}
		else{
			_Total = "";
		}
		var offerStatus = _D.nowData[item].offerStatus,
			H='';
		if (offerStatus == 'deleted' || offerStatus == 'member deleted') {
		H+='<tr>'
		H+='<td colspan="5" style="width:748px; text-align:center">�����Ĳ�Ʒ��Ϣ��ɾ��</td>'
		H+='</tr>';
		}
		else {
        H+='<tr>'
		H+='<td class="span-img"><span class="offer-img" id="id-'+tid+'-'+_D.nowData[item].id+'"><a target="_blank" href="'+_D.nowData[item].offerDetailUrl+'"><img src="'+_D.nowData[item].offerImageUrl+'" /></a></span></td>'
		H+='<td class="span-subject"><a class="links" href="'+_D.nowData[item].offerDetailUrl+'">'+_D.nowData[item].subject+'</a></td>'
		H+='<td class="span-price">'+_Price_str+_Unit+'</td>'
		H+='<td class="span-total">'+_Total+'</td>'
		H+='<td class="span-status"><span class="red">'+reasonInfo+'</span>'+reason+'</td>'
		H+='</tr>';
		}
        return H;
    },
	tFooter:function(){
		
        var H='</tbody></table>';
        return H;
		
    },
    hasOffer:function(idx, tid){
        _R.Data(idx, tid);		
    },
    
    Data:function(idx, tid){
        var H = '' +
		_R.tHead() +
		_R.tBody(idx, tid) +
		_R.tFooter()
		var box_showprom = $D.getElementsByClassName("show-prom");
		box_showprom[idx].innerHTML=H;
		
    },
    end:0
};

var _A={
    offerList:function(){
		var view_offer = $$('.session-list span.op-session');
		var box_showprom = $D.getElementsByClassName("show-prom");
		for(i=0; i<view_offer.length;i++){
			$D.setStyle(box_showprom[i], 'display', 'none');
			$E.on(view_offer[i], 'click', function(e){
				stopDefault(e);
				var tidlink = this.getElementsByTagName("a");
				tid = tidlink[0].getAttribute("tid");
				t = view_offer.indexOf(this);
				if(box_showprom[t].style.display == "none"){
					$D.addClass(this, 'current');					
					$D.setStyle(box_showprom[t], 'display', 'block');
					var data = box_showprom[t].getElementsByTagName("div");
					if(data){
						_D.getHasOffer(t,tid);
					}
					
				}
				else{
					$D.removeClass(this, 'current');
					
					$D.setStyle(box_showprom[t], 'display', 'none');
					
				}
			});
		}
        
    },
	
		 
	stopDefault:function(e){
	    var e = window.event || e;
	    //��ֹĬ�����������(W3C)
	    if (e.preventDefault) {
	        e.preventDefault();        
	    }
	    //IE����ֹ������Ĭ�϶����ķ�ʽ
	    else 
	        e.returnValue = false;
	    return false;
	},
    
    //�������ͼƬ�Ľ��� -- add by hongss on 2012.11.21 for ͼƬ���
    showCheckInfo: function(){
        $E.delegate('mpSignUp_tab', 'mouseenter', function(e, matchedEl, container){
            $D.addClass(matchedEl, 'offer-current');
        }, '.offer-img');
        $E.delegate('mpSignUp_tab', 'mouseleave', function(e, matchedEl, container){
            $D.removeClass(matchedEl, 'offer-current');
        }, '.offer-img');
    },
    
    end:0
};
var _I={
    
    offerList:function(){
        _A.offerList();
    },
    showCheckInfo:function(){
        _A.showCheckInfo();
    },
    end:0
};



$E.onDOMReady(function(){
    _I.offerList();
    _I.showCheckInfo();
});

}();