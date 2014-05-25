/**
 * ��ԱС��Ƭ���
 * ��Ҫʹ����work��ҳ
 * @version 1.0 
 * @author rufeng.qianrf
 */
(function($, SYS) {
	var default_url = "http://member.1688.com",
	default_work_url ="http://work.1688.com",
	configs,
	hide,
	showCardTask,
	card = {
		/**
         * ���������صķ���
         */
		ui : {
			/**
			* ҳ���ʼ����(Ϊ��̬���ɵ�Ԫ�ؽ��а󶨣���Ҫ�Ѿ����ù�init)
			* @param elements ��Ҫbind�¼���Ԫ��
			* @param config ����������
			*/
		    bindCard:function(elements, config){
		    	configs = config;
		    	$.use('ui-core,ui-draggable', function() {
		    		$.each(elements, function() {
						$(this).bind(config.eventName, function(event) {
							event.preventDefault();
							clearTimeout(showCardTask);
							var _this=$(this);
							showCardTask = setTimeout(function(){
								card.ui._showCard(_this,event,config);},
								200);
						});
						$(this).bind('mouseleave', function(event) {
							clearTimeout(showCardTask);
							hide = setTimeout(card.ui._hideCard,300);
						});
					});
			    });
			},
			/**
			* ҳ���ʼ����(Ϊ��̬Ԫ�ذ���Ƭ)
			* @param elements ��Ҫbind�¼���Ԫ��
			* @param config ����������
			*/
			init : function(elements, config) {
				card.ui._initEnv();
				card.ui.bindCard(elements, config);
			},
			/**
			* ҳ���ʼ��ʱί���¼�
			* @param selector 
			* @param config ����������
			*/
			delegateEvent : function (selector, config, ele_root) {
				configs = config;
			  	card.ui._initEnv();
			  	$.use('ui-core,ui-draggable', function() {
					if(!ele_root){
						ele_root = $(document);
					}
				  	ele_root.delegate(selector,config.eventName,function(event){
				  		event.preventDefault();
						clearTimeout(showCardTask);
						var _this=$(this);
						showCardTask = setTimeout(function(){
							card.ui._showCard(_this,event,config);},
							200);
				  	});
				  	ele_root.delegate(selector,'mouseleave',function(event){
				  		clearTimeout(showCardTask);
						hide = setTimeout(card.ui._hideCard,300);
				  	});
			  	});
			},
			/**
			* ��ʼ����Ƭ�Ļ�������
			* @param config ����������
			*/
			_initEnv : function() {
				$.use('web-sweet');
				var float_=$("#businessCard_little_float_parent");
				if(float_.length<1){
					var float_ = $("<div id='businessCard_little_float_parent'>");
					$("body").append(float_);
				}
				$("#businessCard_little_float_parent").bind('mouseenter',function(event) {
					clearTimeout(hide);
				});
				$("#businessCard_little_float_parent").bind('mouseleave',function(event) {
					hide = setTimeout(card.ui._hideCard,300);
				});
			},
			_showCard : function(ele, event, config){
				clearTimeout(hide);
				card.action.aync(event, false, ele, config);
			},
			/**
			* ��Ƭ��DOM�ṹ��ʼ��
			*/
			initCardDom : function(config,data,dataconfig) {
				var trace = config.trace;
				var trace_company={trace_val:"member_card_company_"+trace};
				$.use('web-sweet', function() {
						var template = '<div id="businessCard_little_float">\
							<div class="businessCard_member_info">\
								<div class="businessCard_member_pic" id="businessCard_member_pic">\
									<img id="businessCard_member_pic_img" class="businessCard_member_pic_img" src="<%=$data.personInfo.summaryPic%>"  onerror="this.src=\'http://img.china.alibaba.com/cms/upload/2012/137/253/352731_936034060.png\'" width="60px" height="60px"/>\
								</div>\
								<div class="businessCard_member_baseinfo">\
									<div class="businessCard_member_title">\
										<div id="businessCard_member_name" class="businessCard_member_name businessCard_word_break">\
										<% if($data.personInfo.name){ %>\
											<a href="<%=$data.personInfo.namelink%>" target="_blank" id="businessCard_member_firstname"  title="<%=$data.personInfo.name%>"><span><%=$data.personInfo.name%></span></a>\
										<% } %>\
										</div>\
										<%if($data.personInfo.department || $data.personInfo.title){%>\
											<div class="businessCard_member_department businessCard_word_break" id="businessCard_member_department" title="<%=$data.personInfo.department%><%=$data.personInfo.title%>">\
												<%=$data.personInfo.department%><%=$data.personInfo.title%></div>\
										<% } %>\
									</div>\
									<div class="businessCard_member_company">\
										<div class="businessCard_member_companyname businessCard_word_break" id="businessCard_member_companyname">\
										<% if($data.companyInfo.name){ %>\
											<a href="<%=$data.companyInfo.companyLink%>" target="_blank" id="businessCard_member_companynamelink" title="<%=$data.companyInfo.name%>"><span><%=$data.companyInfo.name%></span></a>\
										<% } %>\
										</div>\
										<% if($data.companyInfo.isTp && $data.companyInfo.tpInfo.tpLogo){ %>\
											<div class="businessCard_member_tpicon">\
												<a target="_blank" href="<%=$data.companyInfo.creditDetailLink%>" id="businessCard_member_tpiconlink">\
													<img src="<%=$data.companyInfo.tpInfo.tpLogo%>" width="14px" height="14px"/>\
												</a>\
											</div>\
										<% } %>\
									</div>\
									<% if(!$data.contactInfo.mobileIsBlank){ %>\
										<div class="businessCard_member_mobileno" id="businessCard_member_mobileno">\
											<span>�ֻ���</span>\
											<%if($data.contactInfo.islogin){%>\
												<span class="businessCard_member_mobileno_num" id="businessCard_member_mobileno_num"  title="<%=$data.contactInfo.mobilePhone%>"><%=$data.contactInfo.mobilePhone.cut(16,"...")%></span>\
											<%}else{%>\
												<s class="businessCard_member_lock"></s><a href="javascript:;" id="businessCard_member_login_float" class="businessCard_member_login_float"><span>��¼��ɼ�</span></a>\
											<%}%>\
										</div>\
									<% } %>\
								</div>\
							</div>\
							<div class="businessCard_member_contact">\
								<div class="businessCard_alitalk" id="businessCard_alitalk">\
									<a class="alitalk alitalk-on" href="#" target="_self" data-alitalk="{id:\'<%=$data.personInfo.loginId%>\'}">������ϵ</a>\
								</div>\
								<%if($data.contactInfo.islogin && $data.relationInfo){%>\
									<div class="businessCard_sns" id="businessCard_sns">\
										<div class="businessCard_sns_follow_null">\
											<a title="�ӹ�ע" href="javascript:;" data-snstype="add" data-memberid="<%=$data.personInfo.memberId%>"  data-myid="<%=$data.status.memberId%>" id="businessCard_sns_follow_null">\
											<s></s><span class="businessCard_sns_follow_status">�ӹ�ע</span></a>\
										</div>\
										<div class="businessCard_sns_follow_friend">\
											<a title="�ӹ�ע" href="javascript:;" data-snstype="add" data-memberid="<%=$data.personInfo.memberId%>"  data-myid="<%=$data.status.memberId%>" id="businessCard_sns_follow_friend"><s></s><span class="businessCard_sns_follow_status">�ӹ�ע</span></a>\
										</div>\
											<div title="�����ע" class="businessCard_sns_follow_mutualFollowed">\
												<s></s><span class="businessCard_sns_follow_status">�����ע</span>\
												<a  href="javascript:;" data-snstype="cannel" data-memberid="<%=$data.personInfo.memberId%>" data-myid="<%=$data.status.memberId%>"><span class="businessCard_sns_follow_cancel">ȡ��</span></a></div>\
											<div title="�ѹ�ע" class="businessCard_sns_follow_followed">\
												<s></s><span class="businessCard_sns_follow_status">�ѹ�ע</span>\
												<a  href="javascript:;" data-snstype="cannel" data-memberid="<%=$data.personInfo.memberId%>" data-myid="<%=$data.status.memberId%>"><span class="businessCard_sns_follow_cancel">ȡ��</span></a></div>\
									</div>\
								<% } %>\
							</div>\
						</div>';
						var float_=$("#businessCard_little_float_parent");
						if(float_.length<1){
							var float_ = $("<div id='businessCard_little_float_parent'>");
							$("body").append(float_);
						}
						//Ӧ�����ݺ�HTML�ṹ
						var html=FE.util.sweet(template).applyData(data,trace_company);
						float_.html(html);
						if(!data.contactInfo.mobileIsBlank && !data.contactInfo.islogin){
							card.ui._initLoginEvent('','');
						}
						card.ui._initwebtalk();
						card.ui._showSns(data,dataconfig);
						float_.hide();
				});
			},
			/**
			* ��ʼ����¼Event
			*/
			_initLoginEvent:function(req_url,trace) {
				$.add('sys-logist', {
				    css: ['http://style.c.aliimg.com/sys/css/logist/logist-min.css'],
				    js: ['http://style.c.aliimg.com/js/common/aliclick.js','http://style.c.aliimg.com/sys/js/logist/logist-min.js'],
				    ver: '1.0'
				});
				$.use('sys-logist', function(){
					$("#businessCard_member_login_float").click(function(e) {
						e.preventDefault();
						var float_ = $('#businessCard_little_float_parent');
						float_.hide();
						FE.sys.logist({
							source : 'bussinessMemberCard_'+trace, 
							onLoginSuccess : function() {
								FE.sys.logist('close');
							},
							onRegistSuccess : function() {
								FE.sys.logist('close');
							}
						});
					});
				});  
			},
			/**
			* ��ʼ��������Event
			*/
			_initwebtalk:function(){
				$.use('web-alitalk', function() {
					FE.util.alitalk($('a[data-alitalk]', '#businessCard_little_float'));
				});
			},
			_showSns : function(data,dataconfig){
				if(!data.status.isLogin || data.status.memberId===data.personInfo.memberId){
					// �����¼�Ҳ��ǲ鿴�Լ�����Ƭ
					return;
				}
				var little_float = $('#businessCard_little_float'),
				snsNull = $('div.businessCard_sns_follow_null',little_float),
				snsFollowed = $('div.businessCard_sns_follow_followed',little_float),
				snsFriend = $('div.businessCard_sns_follow_friend',little_float),
				snsMutualFollowed = $('div.businessCard_sns_follow_mutualFollowed',little_float);
				
				card.ui._initSnsButton(snsNull,snsFollowed,dataconfig);
				card.ui._initSnsButton(snsFollowed,snsNull,dataconfig);
				card.ui._initSnsButton(snsFriend,snsMutualFollowed,dataconfig);
				card.ui._initSnsButton(snsMutualFollowed,snsFriend,dataconfig);
				switch (data.relationInfo.relation) {
				 	case 'isNull':
				 		snsNull.show();break;
				 	case 'isFollowed':
				 		snsFollowed.show();break;
				 	case 'isFriend':
				 		snsFriend.show();break;
				 	case 'isMutualFollowed':
				 		snsMutualFollowed.show();break;
				}
			},
			_initSnsButton : function(current,affter,dataconfig){
				$('a', current).click(function(e) {
					e.preventDefault();
					var _this=$(this);
					$.use('util-debug', function() {
						card.action._friendAction(_this,dataconfig,function() {
							current.hide();
							affter.show();
							}
						);
					});
				});
			},
			_initfloatFrameWork : function(data, arg, event, url) {
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
				var float_=$("#businessCard_little_float_parent");
				//ҳ���Ѿ����ɹ���Ƭ��DOM�ṹ��
				if(float_.length>0){
					card.ui._traceLogEvent(trace);
					var offerId_=arg.offerId?arg.offerId:'',sourceUrl_='';
					if(offerId_&&offerId_!==''){
						sourceUrl_="http://detail.1688.com/buyer/offerdetail/"+offerId_+".html";
					}
					//������Ƭ��ѯ�̴��
					$("a[data-alitalk]", "#businessCard_alitalk").click(function(){
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
					var sourceele=$(event.target);
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
					var targetLeft = left_+sourceele.width()+ xtarget,
					targetTop = top_ + sourceele.height()+ ytarget;
					//�ж���ʾ�ռ��Ƿ���
					if((targetLeft+float_.width())>$(window).width()){
						//�ұ߿ռ䲻�㣬��Ϊ�����ʾ
						targetLeft = left_ - (float_.width()+xtarget);
					}
					if((targetTop+float_.height())>$(window).height()){
						//�ұ߿ռ䲻�㣬��Ϊ�����ʾ
						targetTop = top_ - (float_.height()+ytarget);
					}
					float_.css({
							position:position_,
							left :targetLeft,
							top : targetTop
					}).show();
				}
			},
			_htmldecode:function(str){
				if(str){
					return $("<div>").html(str).text();
				}
				return "";
			},
			_hideCard:function(){
				$("#businessCard_little_float_parent").hide();
			},
			_traceLogEvent:function(trace){
				//����ʼ��
				$("#businessCard_member_companynamelink").click(function(){
						aliclick(null, '?tracelog=member_card_company_' + trace);
				});
					
				$("#businessCard_member_firstname").click(function(){
						aliclick(null, '?tracelog=member_card_name_' + trace);
				});
					
				$('#businessCard_member_tpiconlink').click(function(){
						aliclick(null, '?tracelog=member_card_source_' + trace);
				});
					
				$("#businessCard_member_login_float").click(function(){
						aliclick(null, '?tracelog=member_card_login_' + trace);
				});
			}
		},
		/**
         * ������ݻ�ȡ����ط���
         */
		action : {
			aync : function(event, isinit, eleObj, config) {
				var dataconfig = eleObj.data("membercard"),loginId=dataconfig.loginId,
								diy_url = dataconfig.url, isfloat = dataconfig.isfloat;
				var url = default_url;
				$.ajax( url+'/member/ajax/memberCardJson.do', {
					dataType : 'jsonp',
					data : {
						loginId : loginId,
						checkLogin: config.checkLogin?config.checkLogin:'y',
						version:'small'
					},
					success : function(res) {
						if(res.success) {
							card.ui.initCardDom(config,res.data,dataconfig);
							card.ui._initfloatFrameWork(res.data, config, event,url);
						}else{
							$('#businessCard_little_float_parent').hide();
						}
					}
				});
			},
			_friendAction : function(eleObj,dataconfig, onSuccess){
				var loginId=eleObj.data("memberid"), myid=eleObj.data("myid"), snstype=eleObj.data("snstype"),url;
				var work_domain = FE.test['style.work.url']?FE.test['style.work.url']:default_work_url;
				if(snstype==='add'){
					url = work_domain + '/home/rpc/setFriend.htm';
				}else if(snstype==='cannel'){
					url = work_domain + '/home/rpc/cancelFriend.htm';
				}else{
					return;
				}
				$.ajax( url, {
					dataType : 'jsonp',
					data : {
						personId:myid,
						friendIds:dataconfig.loginId,
                        _csrf_token:$('input[name=_csrf_token]').val()
					},
					success : function(res) {
						if(res.success) {
							onSuccess();
						}
					}
				});
			}
		}
	};
	SYS.bussinessCard_little=card;
})(jQuery, FE.sys);
