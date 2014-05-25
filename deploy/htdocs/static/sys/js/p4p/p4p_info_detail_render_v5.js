/**
 * @create sam.songj
 * @modified arcthur.cheny  updated 2011-06-21
 * @modified jiali.shijl at 2012-01-13 将fdev3的方法改为fdev4,去除底部广告投放
 */

var Render7= function(id,num){
	this.root = document.getElementById(id); //offer插入的位置标识
	this.maxOfferCount = num || 5;   //p4p广告位最多显示为5条
	
	//拼装p4p广告位的头部
	this.doRenderHeader7=function(){
		return '<div class="p4p_info_6"><div class="title"><div class="left">今日热门报价</div><div class="right"><a href="'+p4pConfig.entrance+'" target="_blank">我也要出现在这里</a></div></div><span class="w1"><strong>产品名称</strong></span><span class="w2"><strong>单价(不含运费)</strong></span><span class="w3"><strong>查看</strong></span><table cellpadding="0" cellspacing="0">';
	};
	
	//拼装p4p广告位底部渲染
	this.doRenderFooter7=function(){
		return '</table></div></div>';
	};
	//拼装标题元件
	this.doRenderTitle7=function(title, url,key, item){
		return '<td class="t1"><a href="' + url + '"  onmousedown=\"p4ptag_Click(\''+item.RESOURCEID+'\',\''+item.REDKEY+'\',\'819009_1008\')\" title="'+ doReplace(title) + '" target="_blank">' + doRed(doSubstring(doReplace(title),17,1),key) + '</a></td>';
	};
	//拼装价格元件
	this.doRenderPrice7=function(price,item){
		if(price==" "||price=="0"){return '<td class="t2">价格面议</td>';}
		else{return '<td class="t2">'+ doSubstring(doReplace(price),12,2) +'&nbsp;</td>';}
	}
	//拼装查看更多元件
	this.doRenderMore7=function(memberid,url,item,idx){
	return '<td class="t3"><a href="'+ url +'" target="_blank">查看更多</a><a class="wwa" data-alitalk="{id:\''+ item.MEMBERID +'\'}" href="javascript:void(0)" onmousedown=\"p4pClick(\''+item.EURL+'\',true);\" target="_blank"></a></td>';
	};
	//拼装一条p4p广告信息
	this.doRenderItem7=function(item, idx){
		if(item.DESC){}else{item.DESC = '';}
		if(item.OFFERPRICE){}else{item.OFFERPRICE = '';}
		var output = '';
		output += '<tr onmouseout=this.className="tbg2" onmouseover=this.className="tbg1">';
		output += this.doRenderTitle7(item.TITLE,item.EURL,item.REDKEY,item);
		//output += this.doRenderPlace7(item.address,item.EURL,item.REDKEY,item);
		output += this.doRenderPrice7(item.OFFERPRICE,item);
		output += this.doRenderMore7(item.MEMBERID,item.EURL,item,idx);
		output += '</tr>';
		this.renderCount++;
		return output;

	};
	//拼装p4p广告的主体部分
	this.doRenderBody7=function(rets){
		var output=[];
		output[0]='';
		if (rets && rets.length > 0) {
			for (var i = 0; i < rets.length&&i<this.maxOfferCount; ++i) {
				var item = rets[i];
				output[output.length]=this.doRenderItem7(item,i);
			}
		}
		output[output.length]='';
		return output.join('');
	};
	
	//拼装整个p4p广告
	this.doRender7=function(rets){
		//rets = doFitlerData(rets);
		var html = [];
		html[html.length] = this.doRenderHeader7();
		html[html.length] = this.doRenderBody7(rets);
		html[html.length] = this.doRenderFooter7();
		this.root.innerHTML = html.join('');
	};
};

function p4pFormatPrice(price){
	var m = price.match(/\d+(\.\d+)?/);
	if(m[0])
		return '￥'+ m[0];
	else
		return '';
};

function onP4pSuccess(o,b){
	os = doFitlerData(o);
	p4p_coaseStr(os);
    try {
  		c_num = os.length;
  		if (c_num!=null && c_num > 0) {
  			var c_str1 = [],c_str2 = [],c_str3 = [],c_str4 = [];
  			if(c_num <= 0){ return; }
			
            if(c_num >= 4) {
                var defaultRender7 = new Render7("p4p_adv_info_2", 4);
                //c_str1 = os.slice(8);
                defaultRender7.doRender7(os);
            }
        }
		$.use('web-alitalk', function() {
			FE.util.alitalk($('a[data-alitalk]',''));
		});                   
     }catch(e){} 
          
}                       
function onP4pFailure(){}
function success1(o){   
	os = doFitlerData(o); 
	p4p_coaseStr(os);     
	try{                  
	  c_num = os.length;    
	  if (c_num!=null && c_num > 0) {
		var defaultRender8 = new Render8("Layer2_in",5);
		defaultRender8.doRender8(os);                 
		document.getElementById("Layer2").style.display = "block";
		}
	}catch(e){}
}
function failure1(){document.getElementById("Layer2").style.display = "none";}

// added by arcthur.cheny at 2011.6.21
// modified by jiali.shijl at 2012.01.13 去掉一个广告位，修改fdev3的方法为fdev4
;(function($){
    $(document).ready(function(){
        var pageId = (typeof window.dmtrack_pageid === 'undefined') ? (new Date() - 0 + '' + Math.floor((Math.random() * 1000))) : window.dmtrack_pageid;
        $('#p4p_adv_info_7').html('<div class="p4p_box_v_b tube">'
                                      + '<div class="head1" ><a href="' + p4pConfig.entrance + '" class="btn_ishow" target="_blank">我也要出现在这里</a><span><b style="font-size:14px;color:#777;">最热商机</b></span></div>'
                                      + '<div id="p4p-box7"></div>'
                                      + '<p class="more"><a href="http://page.1688.com/html/p4p/landingpage.html?keywords='+p4ptag+'" title="更多热门推荐" target="_blank">更多热门推荐</a></p>'
                                      + '</div>');
        
        /*$('#p4p_adv_info_6').html('<div class="p4p_box_h_b tube">'
                                      + '<div class="head1" ><a href="' + p4pConfig.entrance + '" class="btn_ishow" target="_blank">我也要出现在这里</a><span><b style="font-size:14px;color:#777;">最热商机</b></span></div>'
                                      + '<div id="p4p-box6"></div>'
                                      + '<p class="more"><a href="http://page.1688.com/html/p4p/landingpage.html?keywords='+p4ptag+'" title="更多热门推荐" target="_blank"></a></p>'
                                      + '</div>');*/
        
        ZQ.init({
            prodid:'65',
            container:'p4p-box7',
            tag:p4ptag,
            pageid:pageId,
            width:310,
            height:440
        });
        /*
        ZQ.init({
            prodid:'67',
            container:'p4p-box6',
            tag:p4ptag,
            pageid:pageId,
            width:948,
            height:208
        });*/
    });
})(jQuery);