/**
 * ȫվͨ�ü�����������
 * data-purchase='' ��������Ҫ�����ݺ�����
 * ������ΪofferId��������԰�������
 * isAutoAdd �Ƿ��Զ������SKU
 * isShowSuccess �Ƿ�չʾ�ɹ�����
 * position �Ի�������������ť�Ķ�λ��ʽ left-top right-bottom right-top left-bottom center
 * <a href="#" data-purchase='{"offerId":"1455442","onSuccess":"callback","onShow":"showback","position":"left-top","isAutoAdd":"true"}'>���������</a>
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
	//�л�����
	switchStyleUrl();
				
	$(document).ready(function(){
		$('body').delegate('[data-purchase]','click',function(e){
			e.preventDefault();
			var _self=this,
				$this=$(_self),
				TPP=SYS.purchaselist,
				config=$(this).data('purchase')||{offerId:''},
				doIt=function(){
					//����onClick
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
				//��¼�����Ϣ
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
			//��¼λ��/�ߴ�
			config.elementPos=$this.position();
			config.elementSize={
				width:$this.width(),
				height:$this.height()
			};
			//����Ĭ��չʾ�ɹ��Ի���
			config.isShowSuccess='undefined'===typeof config.isShowSuccess?true:config.isShowSuccess;
			
			if(TPP){
				doIt();
			}else{
				downloadCsss(cURL,function(){
					isCssDownload=true;
					if(isJsDownload&&isCssDownload){
						doIt();
						isCssDownload=false; //ִ�����˾Ͳ���js������
					}
				});				
				$.getScript(sURL,function(){
					isJsDownload=true;
					if(isJsDownload&&isCssDownload){
						doIt();
						isJsDownload=false; //ִ�����˾Ͳ���css�����˷�ֹ����
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
