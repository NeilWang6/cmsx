/**
 * 新会员名片2.0 core
 * create by chen.chenc on 2012-5-23 for 会员名片2.0
 */
(function($, SYS){
	//默认模板
	var	hasInit = false,
	default_member_url = "http://member.1688.com",
	default_work_url ="http://work.1688.com",
	templates = {
		a:'\
			<div id="businessCard_member_pic" class="businessCard_member_pic" assembleKey="a">\
				<img id="businessCard_member_pic_img" class="businessCard_member_pic_img" src="<%=$data.personInfo.summaryPic%>" onerror="this.src=\'http://img.china.alibaba.com/cms/upload/2012/137/253/352731_936034060.png\';this.onerror=null;" /></div>\
		',
		b:'\
			<div class="businessCard_member_title" assembleKey="b">\
				<div id="businessCard_member_name" class="businessCard_member_name businessCard_word_break">\
					<% if($data.personInfo.name){ %>\
					<a href="<%=$data.personInfo.namelink%>?tracelog=member_card_name_<%=$data.trace%>" id="businessCard_member_firstname"  title="<%=$data.personInfo.name%>" target="_blank"><span><%=$data.personInfo.name%></span></a>\
					<% } %>\
				</div>\
				<% if($data.personInfo.sex){ %>\
				<div id="businessCard_member_gender" class="businessCard_member_gender">\
					<% if($data.personInfo.sex == \'m\'){ %>\
					先生\
					<% } %>\
					<% if($data.personInfo.sex == \'f\'){ %>\
					女士\
					<% } %>\
				</div>\
				<% } %>\
				<%if($data.personInfo.department || $data.personInfo.title){%>\
				<div class="businessCard_member_department" id="businessCard_member_department" title="<%=$data.personInfo.department%><%=$data.personInfo.title%>">\
					<span>(</span><span class="businessCard_member_department_name businessCard_word_break"><%=$data.personInfo.department%><%=$data.personInfo.title%></span><span>)</span>\
				</div>\
				<% } %>\
			</div>\
		',
		c:'\
			<div class="businessCard_member_sns_status" id="businessCard_member_sns_status" assembleKey="c"></div>\
		',
		d:'\
			<% if(!$data.contactInfo.mobileIsBlank){ %>\
			<div class="businessCard_member_mobileno" id="businessCard_member_mobileno" assembleKey="d">\
				<span>手机：</span>\
				<%if($data.contactInfo.islogin){%>\
				<span class="businessCard_member_mobileno_num" id="businessCard_member_mobileno_num" title="<%=$data.contactInfo.mobilePhone%>"><%=$data.contactInfo.mobilePhone.cut(16,"...")%></span>\
				<%}else{%>\
				<s class="businessCard_member_lock"></s><a href="javascript:;" id="businessCard_member_login_float" class="businessCard_member_login_float"><span>登录后可见</span></a>\
				<%}%>\
			</div>\
			<% } %>\
		',
		e:'\
			<div class="businessCard_member_company" assembleKey="e">\
				<% if($data.companyInfo.name){ %>\
				<div id="businessCard_member_companyname" class="businessCard_member_companyname businessCard_word_break"></div>\
				<%}%>\
				<% if($data.companyInfo.isOV || $data.companyInfo.isTp || $data.medalInfo.isPG){ %>\
				<div class="businessCard_member_company_icons">\
					<% if($data.companyInfo.isTp){ %>\
					<div class="businessCard_member_tpicon">\
						<a id="businessCard_member_tpiconlink" href="<%=$data.companyInfo.creditDetailLink%>?tracelog=member_card_source_<%=$data.trace%>" target="_blank">\
							<img src="<%=$data.companyInfo.tpInfo.tpLogo%>">\
							<s class="businessCard_member_tpicon_year businessCard_member_tpicon_year_<%=$data.companyInfo.tpInfo.tpYear%>"></s>\
						</a>\
					</div>\
					<%}%>\
					<% if($data.companyInfo.isOV){ %>\
					<div class="businessCard_member_ovauth">\
						<a id="businessCard_member_ovauthlink"  class="businessCard_member_ovauth_icon" href="<%=$data.companyInfo.creditDetailLink%>" target="_blank">\
						</a>\
					</div>\
					<%}%>\
					<% if($data.medalInfo.isPG){ %>\
					<div class="businessCard_member_company_icon">\
						<a class="businessCard_member_click" data-cardconfig=\'{"trace":"jin_card_click"}\' href="<%=$data.medalInfo.pg_link%>" target="_blank" title="<%=$data.medalInfo.pg_tips%>">\
							<img src="<%=$data.medalInfo.pg_img%>">\
						</a>\
					</div>\
					<%}%>\
					<% if($data.companyInfo.isGMS){ %>\
					<div class="businessCard_member_company_icon">\
						<a href="http://page.1688.com/goldsupplier.html?tracelog=card_gold_medal_supplier" target="_blank" title="金牌供应商">\
							<img src="http://img.china.alibaba.com/cms/upload/member/chatCard/gsm16.png">\
						</a>\
					</div>\
					<%}%>\
				</div>\
				<%}%>\
			</div>\
		',
		f:'\
			<% if($data.contactInfo.address || $data.contactInfo.zipCode){ %>\
			<div class="businessCard_member_address" id="businessCard_member_address" assembleKey="f">\
				<% if($data.contactInfo.address){ %>\
				<span>地址：</span>\
				<span class="businessCard_member_address_full businessCard_word_break" id="businessCard_member_address_full" title="<%=$data.contactInfo.address%>"><%=$data.contactInfo.address%></span>\
				<%}%>\
				<% if($data.contactInfo.zipCode){ %>\
				<span class="businessCard_member_address_zipcode" title="<%=$data.contactInfo.zipCode%>" id="businessCard_member_address_zipcode">(<%=$data.contactInfo.zipCode.cut(7,"...")%>)</span>\
				<%}%>\
			</div>\
			<%}%>\
		',
		g:'\
			<% if($data.contactInfo.telephone){ %>\
			<div class="businessCard_member_phone businessCard_word_break" id="businessCard_member_phone" assembleKey="g">\
				<span>电话：</span>\
				<span class="businessCard_member_phone_num" id="businessCard_member_phone_num" title="<%=$data.contactInfo.telephone%>"><%=$data.contactInfo.telephone%></span>\
			</div>\
			<%}%>\
		',
		h:'\
			<% if($data.contactInfo.fax){ %>\
			<div class="businessCard_member_fax businessCard_word_break" id="businessCard_member_fax" assembleKey="h">\
				<span>传真：</span>\
				<span class="businessCard_member_fax_num" id="businessCard_member_fax_num" title="<%=$data.contactInfo.fax%>"><%=$data.contactInfo.fax%></span>\
			</div>\
			<%}%>\
		',
		i:'\
			<div class="businessCard_member_icons" id="businessCard_member_icons" assembleKey="i">\
				<ul>\
					<% if($data.companyInfo.winport){ %>\
					<li>\
						<a class="businessCard_member_icon" href="<%=$data.companyInfo.winport%>" target="_blank">\
							<img src="http://img.china.alibaba.com/images/app/platform/workplace/appicon16/winporter.png"/>\
							<span>旺铺</span>\
						</a>\
					</li>\
					<%}%>\
					<% if($data.companyInfo.isTp){ %>\
					<li>\
						<a class="businessCard_member_icon" href="<%=$data.companyInfo.creditDetailLink%>" target="_blank">\
							<img src="http://img.china.alibaba.com/images/app/platform/workplace/appicon16/creditdetails.png"/>\
							<span>诚信档案</span>\
						</a>\
					</li>\
					<%}%>\
					<li>\
						<a class="businessCard_member_icon" href="http://<%=$data.personInfo.memberId%>.blog.1688.com/" target="_blank">\
							<img src="http://img.china.alibaba.com/images/app/platform/workplace/appicon16/aliblog.png"/>\
							<span>博客</span>\
						</a>\
					</li>\
				</ul>\
			</div>\
		',
		j:'\
			<div class="businessCard_member_contact"  assembleKey="j">\
				<div id="businessCard_alitalk" class="businessCard_alitalk">\
					<a class="alitalk alitalk-on" href="#" target="_self" data-alitalk="{id:\'<%=$data.personInfo.loginId%>\'}">和我联系</a>\
				</div>\
				<%if($data.status.isLogin && $data.relationInfo && ($data.status.memberId != $data.personInfo.memberId)){%>\
				<div id="businessCard_sns" class="businessCard_sns">\
					<div class="businessCard_sns_follow_null" <%if($data.relationInfo.relation == \'isNull\' ){%>style="display: block;"<%}%>>\
						<a id="businessCard_sns_follow_null" data-myid="<%=$data.status.memberId%>" data-memberid="<%=$data.personInfo.memberId%>" data-snstype="add" href="javascript:;" title="加关注"> <s></s><span class="businessCard_sns_follow_status">加关注</span></a>\
					</div>\
					<div class="businessCard_sns_follow_friend" <%if($data.relationInfo.relation == \'isFriend\' ){%>style="display: block;"<%}%>>\
						<a id="businessCard_sns_follow_friend" data-myid="<%=$data.status.memberId%>" data-memberid="<%=$data.personInfo.memberId%>" data-snstype="add" href="javascript:;" title="加关注"><s></s><span class="businessCard_sns_follow_status">加关注</span></a>\
					</div>\
					<div class="businessCard_sns_follow_mutualFollowed" title="互相关注" <%if($data.relationInfo.relation == \'isMutualFollowed\' ){%>style="display: block;"<%}%>>\
						<s></s><span class="businessCard_sns_follow_status">互相关注</span><a data-myid="<%=$data.status.memberId%>" data-memberid="<%=$data.personInfo.memberId%>" data-snstype="cannel" href="javascript:;"><span class="businessCard_sns_follow_cancel">取消</span></a>\
					</div>\
					<div class="businessCard_sns_follow_followed" title="已关注" <%if($data.relationInfo.relation == \'isFollowed\' ){%>style="display: block;"<%}%>>\
						<s></s><span class="businessCard_sns_follow_status">已关注</span><a data-myid="<%=$data.status.memberId%>" data-memberid="<%=$data.personInfo.memberId%>" data-snstype="cannel" href="javascript:;"><span class="businessCard_sns_follow_cancel">取消</span></a>\
					</div>\
				</div>\
				<%}%>\
			</div>\
		',
		top:'\
				<div class="<%=$data.styleName%>" id="businessCard_member_container">\
					<div class="businessCard_member_inner_frame">\
		',
		bottom:'\
					</div>\
				</div>\
		'
	},
    core = {
		bulidCard: function(element, configs, onSuccess){
			if(!hasInit){
				(FE.test['style.memberweb.url']) && core._switchDomain(configs);
				$.add('sys-logist', {
					css: ['http://style.c.aliimg.com/sys/css/logist/logist-min.css','http://style.c.aliimg.com/css/lib/fdev-v4/core/fdev-float.css'],
					js: ['http://style.c.aliimg.com/js/common/aliclick.js','http://style.c.aliimg.com/sys/js/logist/logist-min.js'],
					ver: '1.0'
				});
				hasInit=true;
			}
			var loginId = configs.loginId,
				checkLogin = configs.checkLogin?configs.checkLogin:'y',
				version = configs.version,
				trace = 'member_card_open_' + configs.trace;
				
			$.ajax( default_member_url + '/member/ajax/memberCardJson.do', {
						dataType : 'jsonp',
						data : {
							loginId : loginId,
							checkLogin: checkLogin,
							version: version,
							tracelog:trace
						},
						success : function(res) {
							if(res.success) {
								core._render(element,res.data,configs);
								core._buildEvent(element,configs);
								if(onSuccess){
									onSuccess(element, configs, res.data);
								}
							}
						}
			});
		},

		//渲染数据事件
		_render: function(element,data,configs){
			
			if(!element){
				return;
			}
			
			function decode_html(str){
				var div = document.createElement('div');
				div.innerHTML = str
				return div.firstChild.nodeValue;
			}

			var assemblekey = configs.assemblekey,
				template,
				html;

			data.trace = configs.trace;
			data.styleName = configs.styleName;
			if(!data.styleName){
				data.styleName = 'businessCard_member_default';
			}

			//绑定数据
			$.use('web-sweet', function() {
				//获取模板
				template = core._mergeTemplate(assemblekey);
				html = FE.util.sweet(template).applyData(data);
				element.html(html);
			});

			//公司名称特殊处理解决XSS问题
			data.companyInfo.name = decode_html(decode_html(data.companyInfo.name));
			var companynamelink = $('<a>').attr('id','businessCard_member_companynamelink').attr('title',data.companyInfo.name).attr('target','_blank').attr('href',data.companyInfo.companyLink+'?tracelog=member_card_company_'+data.trace);
			var companynametext = $('<span>').text(data.companyInfo.name);
			$(companynamelink).append(companynametext);
			$('#businessCard_member_companyname').append(companynamelink);
			
			//一个特殊处理，解决IE6下公司图标超长不自动分行的问题
			var n = $('#businessCard_member .businessCard_member_company_icons div').size()+1;
            $('#businessCard_member div.businessCard_member_company_icons').css('width',n*40+'px');
		},
		_setMaxWidth : function(elem){
			var eles = [$('div.businessCard_member_name',elem),
				$('div.businessCard_member_companyname',elem),
				$('span.businessCard_member_address_full',elem),
				$('span.businessCard_member_department_name',elem)];
			$.each(eles, function(index, ele) {
				if(ele && ele.length > 0){
					var wid = ele.width(),
					max_wid = ele.css('max-width');
					//适配ie6，先获取实际width作为max宽度，再auto
					if(!max_wid && $.util.ua.ie6){
						max_wid = wid;
						ele.width('auto');
						wid = ele.width();
					}
					wid = (max_wid && wid>max_wid)?max_wid:wid;
					ele.width(wid);
				}
			});
		},
		//绑定事件
		_buildEvent: function(element, configs){
			core._initLoginEvent(element,configs);
			core._initClick(element);
			core._initSns(element, configs);
			core._initwebtalk(element);
		},
		_switchDomain : function(configs){
			FE.test['style.memberweb.url'] && (default_member_url = FE.test['style.memberweb.url']);
			FE.test['style.work.url'] && (default_work_url = FE.test['style.work.url']);
		},
		//模板拼凑
		_mergeTemplate: function(assemblekey){
			if(!assemblekey){
				assemblekey = 'abcdefghij';
			}

			var length = assemblekey.length,
				mergedTemplate = templates['top'];
			for(var i=0;i<length;i++){
				mergedTemplate += templates[assemblekey.charAt(i)];
			};
			return mergedTemplate+templates['bottom'];
		},
		/**
		 * 初始化打点事件
		 */
		_initClick:function(element){
			$(".businessCard_member_click",element).click(function(e) {
				var _this=$(this);
				var cardConfig = _this.data('cardconfig');
				aliclick(null, '?tracelog=' + cardConfig.trace);
			});
		},
		/**
		 * 初始化登录Event
		 */
		_initLoginEvent:function(element,configs) {

			$.use('sys-logist', function(){
				$("#businessCard_member_login_float",element).click(function(e) {
				  	e.preventDefault();
					aliclick(null, '?tracelog=member_card_login_' + configs.trace);
					$(this).closest('#businessCard_member_float_parent').hide();
					FE.sys.logist({
						source : 'bussinessMemberCard_'+configs.trace, 
						onLoginSuccess : function() {
							FE.sys.logist('close');
							core.bulidCard(element,configs);
						},
						onRegistSuccess : function() {
							FE.sys.logist('close');
							core.bulidCard(element,configs);
						}
					});
				});
			});
		},

		/**
		 * 初始化旺旺的Event
		 */
		_initwebtalk:function(element){
			$.use('web-alitalk', function() {
				FE.util.alitalk($('a[data-alitalk]', element));
			});
		},
		_initSns : function(element,dataconfig){
			var snsNull = $('div.businessCard_sns_follow_null',element),
			snsFollowed = $('div.businessCard_sns_follow_followed',element),
			snsFriend = $('div.businessCard_sns_follow_friend',element),
			snsMutualFollowed = $('div.businessCard_sns_follow_mutualFollowed',element);
				
			core._initSnsButton(snsNull,snsFollowed,dataconfig);
			core._initSnsButton(snsFollowed,snsNull,dataconfig);
			core._initSnsButton(snsFriend,snsMutualFollowed,dataconfig);
			core._initSnsButton(snsMutualFollowed,snsFriend,dataconfig);
		},
		_initSnsButton : function(current,affter,dataconfig){
			$('a', current).click(function(e) {
				e.preventDefault();
				var _this=$(this);
				core._friendAction(_this,dataconfig,function() {
					current.hide();
					affter.show();
				});
			});
		},
		_friendAction : function(eleObj,configs,onSuccess){
				var loginId=eleObj.data("memberid"), 
					myid=eleObj.data("myid"), 
					snstype=eleObj.data("snstype"),
					url;

				if(snstype==='add'){
					url = default_work_url + '/home/rpc/setFriend.htm';
				}else if(snstype==='cannel'){
					url = default_work_url + '/home/rpc/cancelFriend.htm';
				}else{
					return;
				}

				$.ajax(url, {
					dataType : 'jsonp',
					data : {
						personId:myid,
						friendIds:loginId
					},
					success : function(res) {
						if(res.success) {
							onSuccess();
						}
					}
				});
		}
    };

    SYS.businessCard_core = core;

})(jQuery, FE.sys);
