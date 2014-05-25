/**
 * 全站通用加入进货单组件
 * data-purchase='' 承载所需要的数据和配置
 * 必填项为offerId，其余可以按需配置
 * isAutoAdd 是否自动加入非SKU
 * isShowSuccess 是否展示成功界面
 * position 对话框相对于组件按钮的定位方式 left-top right-bottom right-top left-bottom center
 * <a href="#" data-purchase='{"offerId":"1455442","onSuccess":"callback","onShow":"showback","position":"left-top","isAutoAdd":"true"}'>加入进货单</a>
 */
;(function($,SYS){
	var sURL='/purchaselist/core-v1-min.js',
		cURL='/purchaselist/purchaselist-v1-min.css',
		clickURL='/trace/aliclick-min.js',
		switchStyleUrl=function(){
			var isStatic=/static/i.test($.styleDomain),
				hostUrl='http://'+$.styleDomain,
				jsPath='/sys/js',
				cssPath='/sys/css';
			if(isStatic){
				jsPath='/js/sys',
				cssPath='/css/sys';
			}
			sURL=hostUrl+jsPath+sURL;
			cURL=hostUrl+cssPath+cURL;
			clickURL=hostUrl+jsPath+clickURL;
		},
		isCssDownload=false,
		isJsDownload=false;
	//切换域名
	switchStyleUrl();
				
	$(document).ready(function(){
		$('body').delegate('[data-purchase]','click',function(e){
			e.preventDefault();
			var _self=this,
				$this=$(_self),
				TPP=SYS.purchaselist,
				config=$(this).data('purchase')||{offerId:''},
				doIt=function(){
					//新增onClick
					var Funs;
					TPP=SYS.purchaselist;
					Funs=TPP.Util;
					TPP.Util&&Funs.evalFunction(config,'onClick',_self,config,e);					
					nowOffer=TPP.Offer(config);
					TPP.Controller.init(nowOffer).getOfferInfo();
				},
				downloadCsss=function(url,callback){ 
					var poll=function(){
							if($this.css('min-height')==='1px'){
								$this.removeClass('sys-purchaselist-csstest');
								callback();
							}else{
								window.setTimeout(poll, 50);
							}
						};
					$this.addClass('sys-purchaselist-csstest');						
					$.loadCSS(cURL,{'id':'sys-purchaselist-css'});	 
					poll();
				},
				//记录打点信息
				doAliclick=function(){
					var _str='';
					if(config.tracelogStr){
						_str='_'+config.tracelogStr;
					}
					aliclick(null,'?tracelog=sys_purchaselist_initial'+_str);
				};
				
			if(!config.offerId){
				return;
			}
			//记录位置/尺寸
			config.elementPos=$this.position();
			config.elementSize={
				width:$this.width(),
				height:$this.height()
			};
			//设置默认展示成功对话框
			config.isShowSuccess='undefined'===typeof config.isShowSuccess?true:config.isShowSuccess;
			
			if(TPP){
				doIt();
			}else{
				downloadCsss(cURL,function(){
					isCssDownload=true;
					if(isJsDownload&&isCssDownload){
						doIt();
						isCssDownload=false; //执行完了就不给js机会了
					}
				});				
				$.getScript(sURL,function(){
					isJsDownload=true;
					if(isJsDownload&&isCssDownload){
						doIt();
						isJsDownload=false; //执行完了就不给css机会了防止并行
					}						
				});
			}
			
			//add for aliclick
			if(window.aliclick&&('function'===typeof window.aliclick)){
				doAliclick();
			}else{
				$.getScript(clickURL,function(){
					doAliclick();
				});
			}			
		});
		
	});	
})(jQuery,FE.sys);
