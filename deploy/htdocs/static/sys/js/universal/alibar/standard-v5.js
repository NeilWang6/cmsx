/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * Alibar for FDev5
 * @author terence.wangt
 * @log ��Fdev4�汾��Alibar����ΪFdev5�汾
 * @api Alibar.refresh(); ˢ���û�״̬
 * @api Alibar.purchaselistRefresh(); ˢ�»�Ʒlist״̬
 */
 
define('sys/universal/alibar/standardV5', ['jquery', 
									   'util/cookie/1.0', 
									   'util/misc/1.0',
									   'util/template/1.0',
									   'alicn/subcookie/1.0',
									   'alicn/alitalk-shunt/1.0',
									   'alicn/aliuser/1.0',
									   'require'],
  function($, Cookie, Util, Template, subCookie, AlitalkShunt, AliUser,require){
  'use strict';
	var Alibar = {};
	var alibar, albarTips,isDetailRequested = false , ie6 = Util.isIE6();
	
	var handlers = {

		urlInit: function() {
			$('li.account-signout>a', alibar).attr('href',
				(getTestConfig('style.loginchinahttp.url') || 'http://login.1688.com')
				+ '/member/signout.htm'
			);

			$('li.account-signin>a', alibar).attr('href',
				(getTestConfig('style.loginchina.url') || 'https://login.1688.com')
				+ '/member/signin.htm?Done='
				+ encodeURIComponent( location.href ));
		},
		/**
		 * ��¼״̬
		 */
		loginfoInit: function(){
			/**
			 * ˢ���û�״̬
			 */
			function refresh(){
				var account = $('span.account-id', alibar), uidUrl = 'http://me.1688.com/', uid;
				$('li.account-msg, li.account-signin, li.account-signup, li.account-signout', alibar).addClass('fd-hide');

				hideModifyNickLink();

				updateLoginInfo({
					source: ['b2b', 'taobao']
				}).always(function(){
					if (AliUser.isLogin()) {
						$('li.account-msg, li.account-signout', alibar).removeClass('fd-hide');
						uid = $('<a>', {
							href: uidUrl,
							html: formatName(AliUser.getLoginId()),
							target: '_blank',
							title: AliUser.getLoginId()
						});
						if($('li.vipInfoBox', alibar).length) {
							uid.addClass('nav-arrow');		
						}
						account.html(uid);
						window.aliclick && uid.mousedown(traceIdHandler);
						isShowModifyNickLink();
						$.ajax('http://work.1688.com/home/unReadMsgCount.htm', {
							dataType: 'jsonp',
							success: function(o){
								var msg = $('li.account-msg', alibar), a = msg.children(), span;
								a.children().remove();
								if (o.success && o.count > 0) {
									span = $('<span>', {
										html: o.count > 99 ? '99+' : o.count
									});
									a.append(span);
									a.attr('title', '��������Ϣ');
									window.aliclick &&
									span.mousedown(function(){
										aliclick(this, '?tracelog=cn_alibar_msg');
									});
								} else {
									a.attr('title', '�鿴�����Ϣ');
								}
							}
						});
						
						
					} else {
						$('li.account-signin, li.account-signup', alibar).removeClass('fd-hide');
						if (AliUser.getLastLoginId()) {
							uid = $('<a>', {
								href: uidUrl,
								html: formatName(AliUser.getLastLoginId()),
								target: '_blank',
								title: AliUser.getLastLoginId()
							}).mousedown(traceIdHandler);
							account.html(uid);
							window.aliclick && uid.mousedown(traceIdHandler);
						} else {
							account.html('��ӭ��������Ͱ�');
							$('li.account-msg span', alibar).remove();
						}

					}

				});
				/*�ж��û����ĳ��ȣ���ȫӢ�ģ�������������14�����ڣ����ǰ������ģ��������11�����ڣ���'...'������ز���*/
				function formatName(name){
					var r="";
					if(name.length<=11){
						return name;
					}else{
						if(escape(name).indexOf("%u")!==-1){
							r=name.substring(0,10)+"...";
						}else{
							r=name.length>14?name.substring(0,13)+"...":name;
						}
						return r;
					}
				}
				/*������֤������֤λ��ȷ���Ƿ���ʾ���޸Ļ�Ա����*/
				function isShowModifyNickLink(){
					var rn_id = Cookie.get("__rn_refer_login_id__");
					var memberId = AliUser.getLastMemberId();
					var cn_id = Cookie.get("__cn_logon_id__");
					var rn_alert = Cookie.get("__rn_alert__");

                    var second_alert = Cookie.get("__rn_second_alert__");
                    var officalUrl = "http://member.1688.com/member/rename/rename_cookie_sync.do?memberId="+memberId;
//                    var testUrl = 'http://member-test.1688.com:5100/member/rename/rename_cookie_sync.do?memberId=b2b-3618717382';
					if(!rn_id||rn_id!==cn_id){
						$.ajax(officalUrl,{
							dataType:'jsonp',
							success:function(o){
								if(o.success){
									rn_alert = Cookie.get("__rn_alert__");
                                    second_alert = Cookie.get("__rn_second_alert__");

                                    if(second_alert&&second_alert==="true") {
                                        showSecondaryChangeMemberNameTip();
                                    } else if(rn_alert&&rn_alert==="true"){
                                        showModifyNickLink();
                                    } else {
                                        showXSiteAccountTips();
                                        showUserSwitchTips();
                                    }
								}else{
									showXSiteAccountTips();
									showUserSwitchTips();
								}
							},
							error:function(){
							
							}
						});
					}else{

                        if(second_alert&&second_alert==="true") {
                            showSecondaryChangeMemberNameTip();
                        } else if(rn_alert&&rn_alert==="true"){
                            showModifyNickLink();
                        }
					}
					
				}

				function updateLoginInfo(cfg) {
					if('updateLoginInfo' in AliUser) {
						return AliUser.updateLoginInfo(cfg);
					} else {
						var dfd = new $.Deferred;
						dfd.resolve();
						return dfd;
					}
				}

				function traceIdHandler(){
					aliclick(this, '?tracelog=cn_alibar_id');
				}

				function showModifyNickLink() {
					var modify_nick_url='http://member.1688.com/member/prename/pre_name.htm?req_from=alibar';
					var modify_nick_content=('<div class="tips-content"><div class="tip-text add"><p style="color:#444;">Ϊ���ÿͻ����ټ�ס��������Ҫ��</p><div class="modify_nick_btn"><a href="'+modify_nick_url+'">�����޸��û���</a></div></div><div class="tips-close"></div></div><div class="tips-top"></div>');
					albarTips.html(modify_nick_content);
					showTip(false);	
			  }

				function hideModifyNickLink() {
					$('a.modify-nick', alibar).remove();
				}
			}
			refresh();
			Alibar.refresh = refresh;
		},
		
		/**
		 * �����˵�
		 */
		dropdownInit: function(){
			$('li.extra', alibar).mouseenter(function(){
				ie6 && $(this).addClass('nav-hover');
				$(this).prev().addClass('nav-hover-prev');
			}).mouseleave(function(){
				ie6 && $(this).removeClass('nav-hover');
				$(this).prev().removeClass('nav-hover-prev');
			});
		},

		/**
		 * ��Ա��Ϣ����
		 */
		vipInfoInit: function() {
			var infoBox = $('li.vipInfoBox', alibar);
			var that = null;
			var timer = null;
			var notLoginRemind = '<p class="reLoginRemind">���ĵ�¼״̬��ʧЧ,<a href="http://login.1688.com/member/signin.htm" target="_self">�����µ�¼</a></p>';
			var isSubAccountRemind='<p class="subAccountRemind">���ã�����ǰ��½�˻�Ա���˺�  <a href="http://login.1688.com/member/signout.htm" target="_self">�˳�</a></p>';
			if( !infoBox.length ) {
				return;
			}

			var isRequested = 0;

			infoBox.mouseenter(function() {
				that = $(this);
				
				if( !AliUser.isLogin() || isRequested ) {
					return;
				}

				hideTip();
				showLoading();
				$.ajax({
					url: 'http://vip.1688.com/club/club_info_json.do',
					dataType: 'jsonp',
					success: function(data){
						if(data.success !== true){
							if( data.data.errorMsg === 'NOT_LOGIN' ) {
								hideLoading();
								$('li.vipInfoBox div.nav-content', alibar).html(notLoginRemind);
								isRequested = 1;
							}else if( data.data.errorMsg === 'SUB_ACCOUNT' ){
								hideLoading();
								$('li.vipInfoBox div.nav-content', alibar).html(isSubAccountRemind);
								isRequested = 1;
							}
							return;
						}

						renderTemplate(data.data);
						hideLoading();
						isRequested = 1;

					},
					error:function(){

					}
				});

			});
			
			if( AliUser.isLogin() ) {
				infoBox.hover(function() {
							$(".modify_nick",alibar).addClass("fd-hide");
							if(timer){
								clearTimeout(timer);
								timer=null;
							}
						
							setTimeout(function(){
								that.addClass('infoHover');
							},100);
				}, function() {
					timer=setTimeout(function(){
						that.removeClass('infoHover');
						timer=null;
					},400);
				});
			}

			function renderTemplate(data) {
				var memberId = AliUser.getLastMemberId();
				memberId = memberId ? memberId : '';

				var html = '<div class="levelWrapper fd-clr">\
								<div class="memberPhoto">\
									<a href="http://me.1688.com" target="_blank">\
										<img src="<%= userImg %>" alt="" onerror="<%= errorImg %>"/>\
									</a>\
								</div>\
								<div class="level">\
									<p class="account">\
										<a class="accountManage" href="http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=" target="_blank">�˺Ź���</a>\
										<span class="sep">|</span>\
										<a class="signout" href="http://login.1688.com/member/signout.htm" data-trace="cn_alibar_quit" title="�˳�">�˳�</a>\
									</p>\
									<p class="supplyLevel fd-clr">\
										<% if( typeof saleRate !== "undefined" ) { %>\
											<span class="title">��Ӧ�ȼ�:</span>\
											<a class="levelImg" data-trace="alibar_supplier_rank" href="<%= saleRate.targetUrl %>" target="_blank" title="<%= saleRate.tips %>">\
												<img src="<%= saleRate.logoUrl %>" alt=""/>\
											</a>\
										<% } else if(typeof saleRate === "undefined" && typeof buyRate === "undefined" && medals.length === 0 ) { %>\
											<a class="vipClub" data-trace="alibar_vip_club" href="http://vip.1688.com" target="_blank">ȥ��Ա���ֲ����</a>\
										<% } %>\
									</p>\
									<p class="purchaseLevel fd-clr">\
										<% if( typeof buyRate !== "undefined" ) { %>\
											<span class="title">�ɹ��ȼ�:</span>\
											<a class="levelImg" data-trace="alibar_buyers_rank" href="<%= buyRate.targetUrl %>" target="_blank" title="<%= buyRate.tips %>">\
												<img src="<%= buyRate.logoUrl %>" alt=""/>\
											</a>\
										<% } else if(typeof saleRate === "undefined" && typeof buyRate === "undefined" && medals.length === 0 ) { %>\
											<a class="newComer" data-trace="alibar_vip_noviciate" href="http://page.1688.com/html/service/aliguide/seller_user_guide.html" target="_blank">���ְ�������</a>\
										<% } %>\
									</p>\
								</div>\
							</div>\
							<% if( medals.length ) { %>\
								<div class="medalWrapper fd-clr">\
									<% for ( var i = 0; i < medals.length; i++ ) { %>\
										<a class="medal" href="<%= medals[i].targetUrl %>" data-trace="alibar_medal_rank" title="<%= medals[i].tips %>">\
											<img src="<%= medals[i].logoUrl %>" alt=""/>\
										</a>\
									<% } %>\
								</div>\
							<% } %>';

				var userImg = getUserPhoto(memberId);

				var extraMassage = {
					userImg: userImg,
					errorImg: "this.src=\'http://img.china.alibaba.com/cms/upload/2012/137/253/352731_936034060.png\';this.onerror=null;"
				};
				data = $.extend(data, extraMassage);
				
				var info;
				var dom = $('li.vipInfoBox div.nav-content', alibar);
				var render = Template.compile(html);
				info = render(data);
				dom.html(info);
			}

			function getUserPhoto( memberID ) {
				var first = memberID.substring(0,1),
					seconed = memberID.substring(1,2),
					third = memberID.substring(2,3),
					fourth = memberID.substring(3,4);
					
				var subString = first + '/' + seconed + '/' + third + '/' + fourth + '/';

				return 'http://img.china.alibaba.com/club/upload/pic/user/' + subString + memberID + '_s.jpeg';
			}
			
			function showLoading(){
				var loadingContent = $('div.nav-content', infoBox);
				loadingContent.addClass("alibar-loading");
				loadingContent.css("height", 60);
			}
			function hideLoading(){
				var loadingContent = $('div.nav-content', infoBox);
				loadingContent.removeClass("alibar-loading");
				loadingContent.css("height", "auto");
			}
		},

		/**
		 * ������״̬
		 */
		purchaselistInit: function(){
			//noformat
			var purchaselist = $('li.topnav-purchaselist', alibar);
			if(!purchaselist.length){
				return;
			}
			var navTitle = $('div.nav-title', purchaselist),
				emKind = $('em', navTitle),
				navContent = $('div.nav-content', purchaselist),
				productList = navContent.children('.product-list'),
				purchaseInfo = navContent.children('.purchase-info'),
				txtContainer = $("p",productList);

			//ֻ�е��û�����Ƶ�"������"ʱ����ȥ��������ӿ�
			purchaselist.mouseenter(function(){
				window.aliclick && aliclick(this, '?tracelog=cn_alibar_purchaselist_hover');
				refreshDetail();
			});
			//format
			productList.on('click', 'a.delete', function(e){
				e.preventDefault();
				var dl = $(this).closest('dl'), item = dl.data('item'), goodsType = 'offer';
				$.ajax({
					url: (getTestConfig('style.luna.url') || 'http://order.1688.com' )
						+ '/order/purchase/ajax/delete_from_purchase_list_no_csrf_auth.jsx',
					dataType: 'script',
					cache: false,
					data: {
						returnType: 'jsonp',
						batchDel: [goodsType, item.goodsID, item.specId].join()
					},
					success: function(){
						if (window.delFromPurchaseListResult && delFromPurchaseListResult.success) {
							isDetailRequested = false;
							refreshDetail();
							$(document).triggerHandler("delitem.alibar");
							window.delFromPurchaseListResult = undefined;
						}
					},
					error:function(){
						isDetailRequested = false;
						refreshDetail();
					}
				});
			});
			//ˢ��"������"��������
			function refreshDetail(){
				if(isDetailRequested){
					return;
				}
				showLoading();
				$.ajax({
					url : (getTestConfig('style.luna.url') || 'http://order.1688.com') + '/order/purchase/ajax/quick_purchase_list.jsx',
					dataType: 'jsonp',
					success: function(data){
						if(data.success !== true){
							return;
						}
						hideLoading();
						//��ղ�Ʒ�б�
						productList.children('h3, dl').remove();
						purchaseInfo.children('p').remove();
						var kind = data.totalKind || data.sumOfKind;
						emKind.text(kind);
						dealWithPurchaselistStyle(kind);
						if (kind) {
							dlRender(data.data);
							infoRender(data);
						}
						if(data.totalKind && productList.find('dl').length){
							productList.prepend('<h3>�������Ļ�Ʒ��</h3>')
						}
						isDetailRequested = true;
					},
					error:function(){
						hideLoading();
					}
				});
			}
			//ˢ��"������"������Ŀ
			function refresh(){
				$.ajax({
					url : (getTestConfig('style.luna.url') || 'http://order.1688.com') + '/order/purchase/ajax/quick_purchase_list_count.jsx',
					dataType: 'jsonp',
					success: function(data){
						if(data.success!==true){
							return;
						}
						var kind = data.sumOfKind;
						emKind.text(kind);
						dealWithPurchaselistStyle(kind);
						isDetailRequested = false;
					}
				});
			}
			function dealWithPurchaselistStyle(kind){
				if (kind) {
					purchaselist.addClass('topnav-purchaselist-stock');
				} else {
					purchaselist.removeClass('topnav-purchaselist-stock');
				}
			}
			/**
			 * ������Ʒdl
			 * @param {Object} data
			 */
			function dlRender(data){
				$.each(data, function(i, o){
					if (i > 4) {
						return false;
					}
					//�����������Ϣ����ʾ����
					var specHtml = '';
					var specItems;
					if(o.specInfos && o.specInfos.length){	
						specItems = [];
						$.each(o.specInfos,function(specIndex,specItem){
							specItems.push('<span title="');
							specItems.push(specItem.specName);
							specItems.push('��');
							specItems.push(specItem.specValue);
							specItems.push('" class="specItem');
							
							if( specIndex === o.specInfos.length - 1){
								specItems.push(' lastItem');
							}
							specItems.push('">');
							specItems.push(specItem.specName);
							specItems.push('��');
							specItems.push(specItem.specValue);
							specItems.push('</span>');
						})
						specHtml = [
							'<dd class="specInfos">',
								specItems.join(''),
							'</dd>'
						].join('');
					}
					//noformat
					var dl = $('<dl>'), title = Util.escapeHTML(o.goodsName, true),
						html =
							['<dt>',
								'<a title="', title, '" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail"></a>',
							'</dt>',
							'<dd class="title">',
								'<a title="', title ,'" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail">', Util.escapeHTML(Util.cut(o.goodsName, 23, '...')) ,'</a>',
							'</dd>',
							specHtml,
							'<dd class="price">',
								'&yen;<em>', o.goodsPrice, '</em>Ԫ&nbsp;��&nbsp;<span>', o.goodsCount, '</span>',
							'</dd>',
							'<dd class="action"><a class="delete" title="ɾ��" href="#">ɾ��</a></dd>'],
						img = new Image();
					//format
					$(img).one('load', function(){
						if (this.width && this.height) {
							var w, h;
							h = w = 50;
							if (this.width > w || this.height > h) {
								var scale = this.width / this.height, fit = scale >= w / h;
								img[fit ? 'width' : 'height'] = fit ? w : h;
								if (ie6) {
									img[fit ? 'height' : 'width'] = (fit ? w : h) * (fit ? 1 / scale : scale);
								}
							}
						}
					});
					img.alt = o.goodsName;
					img.src = o.imgUrl;
					dl.html(html.join('')).data('item', o);
					productList.append(dl.html(html.join('')).data('item', o));
					$('>dt>a', dl).append(img);
				});
			}
			function infoRender(o){
				var p = $('<p>'), html = [];

				if(o.remainKind){
					html = ['��������ʣ���Ʒ��<span class="orange">', o.remainKind, '</span>�֣�', o.remainCount, '����'];
				}else if(o.sumOfKind){
					html = ['����<span>', o.sumOfKind, '</span>�ֻ�Ʒ��', o.sumOfAcount, '����<br/>��Ʒ�ϼƣ�<em>', o.sumOfPrice.toFixed(2), '</em>Ԫ'];
				}

				purchaseInfo.prepend(p.html(html.join('')));
			}
			function showLoading(){
				productList.addClass("alibar-loading");
				var height = 0;
				if(productList.children('dl').length){
					height = productList.height();
				}else{
					height = 60;
				}
				productList.css("height",height);
				txtContainer.addClass("fd-hide");
			}
			function hideLoading(){
				productList.removeClass("alibar-loading");
				productList.css("height","auto")
				txtContainer.removeClass("fd-hide");
			}
			refresh();
			Alibar.purchaselistRefresh = refresh;
		},
		/**
		 * ��ʼ��������ͨ�����µ�alitalk
		 */
		tpInit: function(){
			$('li.topnav-tp', alibar).one('mouseenter', function(){
				var self = this;
				AlitalkShunt.init($('a.order-online', self), {
					attr: 'alitalk-shunt',
					ruleId: 'ALITALK_INCALL_ROLE_CTP01'
				})
			});
		},
		/**
		 * ������
		 */
		traceInit: function(){
			window.aliclick && $('#alibar-v4').on('mousedown', 'a[data-trace]', function() {
				aliclick(this, '?tracelog=' + $(this).data('trace'));
			});
		},
	  

		/**
		 * �����ӳ��Ա�session�����
		 */
		sessionKeeper: function() {
			$(window).one('load', function(){
				require.use(['sys/session-keeper/session-keeper-amd'],function(){});
			});
		}
	};

	
	  /**
		* ��ʾ����վ\�Ա���ͨ��Ϣ
		*/
	 function showXSiteAccountTips(){
		var COOKIE_NAME = "show_inter_tips";
		if(exceptDomain()){
			return;
		}
		
		
		if(subCookie.get(COOKIE_NAME) != "false"){
			showTip(true);

			$(".tips-close", albarTips).on("click",function(){
				subCookie.set(COOKIE_NAME,"false");
			});
		}
	}

	function showUserSwitchTips() {
		if(exceptDomain()){
			return;
		}
		$(window).on('userSwitchedToTB', function(evt, info){
		   // showTip(true,Util.substitute('<p>������ʹ�� <em>�Ա��ʺ� {nick}</em> ���ʰ���Ͱ��й�վ�������ԡ�<a href="http://login.1688.com/member/logout.htm">�˳�</a>�������µ�¼��������Ͱ��ʺš����������������<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">�Ի�Դ</a>�����Ŷ~<a class="i-know" href="#i-know">��֪����</a></p>', info));
		  $('.tip-text', albarTips).html(Util.substitute('<p>������ʹ�� <em>�Ա��ʺ� {nick}</em> ���ʰ���Ͱ��й�վ�������ԡ�<a href="http://login.1688.com/member/logout.htm">�˳�</a>�������µ�¼��������Ͱ��ʺš����������������<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">�Ի�Դ</a>�����Ŷ~<a class="i-know" href="#i-know">��֪����</a></p>', info));
		  showTip(true);
		});

		albarTips.on('click', 'a.i-know', function(evt){
			evt.preventDefault();
			hideTip();
		});

		$(window).one('load', function(){
			require.use(['sys/common/user-switching-notify-amd'],function(){});
		});
	}

      // ���θ�����ʾ
      function showSecondaryChangeMemberNameTip() {
          var modifyUrl = 'http://member.1688.com/member/prename/second_pre_name.htm?req_from=2nd_prename',
              memberManageUrl = 'http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=',
              innerText = '���������޸ĵ�¼���Ļ��ᣬ�����ԣ�<a href="' + modifyUrl + '" target="_blank">�����޸�</a>��֮����<a href="' + memberManageUrl + '" target="_blank">�ҵİ���-�˺Ź���</a>���޸�';

          $('.tip-text', albarTips).html(innerText);
          showTip(false);
      }
		
		
		
	function getTestConfig(key) {
		return lofty.test && lofty.test[key];
	}

	function exceptDomain(){
		var reg = /d.1688.com|d.1688.com/g;
		if(reg.test(document.location.host)){
			return true;
		}
		return false;
	}

	function showTip(flag,html){
		if(html) {
			$('.tip-text', albarTips).html( html );
		}
		albarTips.show().offset(getTipPos());
		if(flag){
			albarTips.delay(10000).fadeOut(100);
		}
		$(".tips-close", albarTips).on("click",function(evt){
			evt.preventDefault();
			hideTip();
		});

		$(window).resize(function(){
			setTimeout(function(){
				albarTips.offset(getTipPos());
			},25);
		});
	}

	function getTipPos(){
		var target = $(".account-id",alibar).offset();
		var jq_alibar = alibar;
		return {
			left: target.left -5,
			top: jq_alibar.offset().top + jq_alibar.height()
		};
	}

	function hideTip() {
		albarTips.hide();
	}
	
	//��¶�ӿ�
	Alibar.refresh = Alibar.refresh || $.noop;
	Alibar.purchaselistRefresh = Alibar.purchaselistRefresh || $.noop;
	Alibar.showTip = showTip;
	Alibar.hideTip = hideTip;
			
	//domready֮��ִ��
	$(function(){
		alibar = alibar || $('#alibar-v4');
		albarTips = $(".alibar-tips", alibar);
		//�ж�HTML�ṹ�Ƿ���ϵ�ǰ�汾
		if (alibar.length) {
			for (var p in handlers) {
				handlers[p]();
			}
		}
	});
	
	return Alibar;
	
});


