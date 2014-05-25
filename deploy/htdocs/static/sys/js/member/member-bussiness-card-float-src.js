/**
 * �»�Ա��Ƭ���
 * @version 2.0 
 * @author rufeng.qianrf
 */
(function($, SYS) {
	var hasInit = false,
	hasInitEnv = false,
	configs,
	showCardTask,
	float_hide_handler,
	default_selector = "[membercard]",
	float_parent_ele,
	float_card_ele,
	card = {
		/**
         * ���������صķ���
         */
		ui : {
			/**
			* ҳ���ʼ����(����̬Ԫ�ذ�)
			* @param config ����������
			*/
			init : function(config) {
				if(!hasInitEnv){
					card.ui._initEnv();
					hasInitEnv=true;
				}
				$.use('sys-membercard-core', function() {
					card.ui.bindCard(config);
				});
			},
			/**
			* ��̬Ԫ�ذ��¼�
			* @param config ����������
			*/
		    bindCard:function(config){
		    	if(!hasInit){
		    		hasInit = true;
		    		card.ui.init(config);
		    	}
		    	
		    	configs = config;
		    	var selector = config.selector? config.selector:default_selector;
		    	$(selector).bind(config.eventName, function(event) {
				  	event.preventDefault();
					clearTimeout(showCardTask);
					var _this=$(this);
					showCardTask = setTimeout(function(){card.ui._showCard(_this,event,config);},
						200);
				});
				$(selector).bind('mouseleave', function(event) {
					event.preventDefault();
				  	clearTimeout(showCardTask);
				});
			},
			/**
			* ��ʼ����Ƭ�Ļ�������
			* @param config ����������
			*/
			_initEnv : function() {
				$.add('sys-membercard-core', {
					css: ['http://style.c.aliimg.com/sys/css/member/businessCard_core.css'],
					js: ['http://style.c.aliimg.com/sys/js/member/businessCard_core-min.js'],
					ver: '1.0'
				});
				$.use('web-sweet');
			},
			/**
			 *��ʼ������ڵ� ,����bodyδ׼���ã��û�����ʱ�ŵ��á�
			 */
			_initFloatDom : function(){
				float_parent_ele=$("#businessCard_float_float_parent");
				if(float_parent_ele.length<1){
					var float_parenthtml = '<div id="businessCard_member_float_parent" class="fd-clr">\
										<div id="businessCard_member_float_title">\
											<span>��Ա��Ƭ</span>\
											<a href="javascript:;" class="businessCard_member_float_close"></a>\
										</div>\
									<div>';
					float_parent_ele = $(float_parenthtml);
					float_card_ele = $('<div id="businessCard_member">');
					float_parent_ele.append(float_card_ele);
					float_parent_ele.hide();
					$("body").append(float_parent_ele);
				}
				$('a.businessCard_member_float_close', float_parent_ele).click(function(event){
					event.preventDefault();
                    $(this).closest('#businessCard_member_float_parent').hide();
                });
			},
			_showCard : function(ele, event, config){
				if(!float_parent_ele){
		    		card.ui._initFloatDom();
		    	}
				var dataconfig = ele.data('membercard');
				// �����ϲ��㷽ʽ
				if(dataconfig==null){
					dataconfig = $.parseJSON(ele.attr('membercard').replace(/&quot;/ig, '"')),
					ele.data('membercard',dataconfig);
				}
				var args = {
					triggerElement: ele,
					element : float_parent_ele,
					loginId : dataconfig.loginId,
					version : 'float'
				};
				args = $.extend(true, args, config);
				SYS.businessCard_core.bulidCard(float_card_ele, args, card.ui._initfloatFrameWork);
			},
			_hideCard:function(){
				float_parent_ele.hide();
			},
			_initfloatFrameWork : function(showEle, arg, data) {
				var trace = arg.trace, 
					ele = arg.eventSource, 
					evename = arg.eventName, 
					checkLogin = arg.checkLogin,
					xtarget=arg.clientX,
					ytarget=arg.clientY,
					position_=arg.position;
				if(!xtarget){xtarget=0;}
				if(!ytarget){ytarget=0;}
				if(!position_){position_="absolute";}
				if(!data) {
					return;
				}
				//ҳ���Ѿ����ɹ���Ƭ��DOM�ṹ��
				if(float_parent_ele.length>0){
					var offerId_=arg.offerId?arg.offerId:'',sourceUrl_='';
					if(offerId_&&offerId_!==''){
						sourceUrl_="http://detail.1688.com/buyer/offerdetail/"+offerId_+".html";
					}
					//������Ƭ��ѯ�̴��
					$("a[data-alitalk]", showEle).click(function(event){
						event.preventDefault();
						$.ajax( 'http://interface.xp.1688.com/eq/enquiry/traceEnquiry.json', {
							dataType : 'jsonp',
							data : {
								source :1,
								toId: data.personInfo.memberId,
								fromId: FE.util.lastLoginId==null?"":FE.util.lastLoginId,
								time:new Date().getTime(),
								cna:$.util.cookie("cna")==null?"":$.util.cookie("cna"),
								offerId:offerId_,
								sourceUrl:sourceUrl_
							}
						});
					});
					var sourceele=arg.triggerElement;
					//������Ƭ������λ
					var left_=sourceele.offset().left,top_=sourceele.offset().top;
					if(position_==="fixed" && !$.util.ua.ie6){
						top_-=$(document).scrollTop();
					}
					try{
						var sourceele_attr=sourceele.data("membercard");
						if(sourceele_attr.clientX){
							if(typeof(sourceele_attr.clientX)==="string"){
								xtarget=parseInt(sourceele_attr.clientX);
							}else if(typeof(sourceele_attr.clientX)==="number"){
								xtarget=sourceele_attr.clientX;
							}
						}
						if(sourceele_attr.clientY){
							if(typeof(sourceele_attr.clientY)==="string"){
								ytarget=parseInt(sourceele_attr.clientY);
							}else if(typeof(sourceele_attr.clientY)==="number"){
								ytarget=sourceele_attr.clientY;
							}
						}
					}catch(err){}
					if($.util.ua.ie6 && position_==="fixed"){
						position_="absolute";
					}
					
					// ��̬����float_parent�Ŀ�ȣ�Ĭ��Ϊ402px
					var container_width = $("#businessCard_member_container",float_card_ele).outerWidth(false);
					(container_width>0) && float_parent_ele.width(container_width);
					
					var targetLeft = left_+sourceele.width()+ xtarget,
					targetTop = top_ + sourceele.height()+ ytarget;
					if(position_==="fixed" && !$.util.ua.ie6){
						//�ж���ʾ�ռ��Ƿ���
						if((targetLeft+float_parent_ele.width())>$(window).width()){
							//�ұ߿ռ䲻�㣬��Ϊ�����ʾ
							targetLeft = left_ - (float_parent_ele.width()+xtarget);
						}
						targetLeft = targetLeft>0?targetLeft:0;
						if((targetTop+float_parent_ele.height())>$(window).height()){
							//�ұ߿ռ䲻�㣬��Ϊ�����ʾ
							targetTop = top_ - (float_parent_ele.height()+ytarget);
						}
						targetTop = targetTop>0?targetTop:0;
					}
					float_parent_ele.css({
							position:position_,
							left :targetLeft,
							top : targetTop
					}).show();
					SYS.businessCard_core._setMaxWidth(float_parent_ele);
					//�������߸ı䴰�ڴ�С����������Ƭ
					float_hide_handler = function(e) {
						e.preventDefault();
					  	float_parent_ele.hide();
						$(window).unbind('scroll', float_hide_handler);
						$(window).unbind('resize', float_hide_handler);
					};
					$(window).bind('scroll', float_hide_handler);
					$(window).bind('resize', float_hide_handler);
				}
			}
		}
	};
	SYS.bussinessCard=card;
})(jQuery, FE.sys);
