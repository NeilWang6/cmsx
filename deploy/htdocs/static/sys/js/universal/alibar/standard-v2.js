/**
 * alibar js
 * @author  Edgar <mail@edgarhoo.net>
 * @version 2.5.110531 //change user link
 * @version 2.5.110817 //change signin link
 * @update 2011.08.22 Denis 去掉hasAnd的判断，使用encodeURIComponent替代encodeURI
 * @update 2011.11.30 Denis 去掉注册引导
 * @update 2012.09.04 jianping.shenjp 添加淘宝互通tips
 */
(function($, S){

    var _init = function(item){
        item.init();
    }, //注册功能点
 register = function(name){
        var _this = this;
        $.each(name, function(i, item){
            $(document).ready(function(){
                _init(item);
            });
        });
    };


    /**
     * 检测是否登录
     * */
    var checkSignIn = {
        init: function(){
            this.$in = $('#accountSignIn');
            this.$up = $('#accountSignUp');
            this.$out = $('#accountSignOut');
            this.$id = $('#accountId');
            this.$msg = $('#accountMsg')

            this._check();
        },
        //check
        _check: function(){
            var FU = FE.util, $id = this.$id, $msg = this.$msg, substitute = $.util.substitute, url = 'http://work.1688.com/app/contact.htm', msgInterface = 'http://work.1688.com/home/unReadMsgCount.htm', html = '<a class="{cl}" href="{url}" target="_self">{id}</a>';

            if (FU.isLogin) {
                this.$in.addClass('fd-hide');
                this.$up.addClass('fd-hide');
                this.$out.removeClass('fd-hide');
                $id.empty().append($('<a>', {
                    'class': 'account-signed',
                    href: url,
                    html: FU.loginId
                }));
                if ($msg.length) {
                    $msg.removeClass('fd-hide');
                    $.ajax(msgInterface, {
                        dataType: 'jsonp',
                        success: function(o) {
                            if (o.success && o.count > 0) {
                                $('>a', $msg).append($('<span>', {
                                    html: o.count > 99 ? '99+' : o.count
                                }));
                            }
                        }
                    });
                }
            } else if (!!FU.lastLoginId) {
                $id.html(substitute(html, {
                    cl: 'account-not',
                    url: url,
                    id: FU.lastLoginId
                }));
            } /*else {
                register([_addTip]); //注册引导注册tip功能
            }*/
        }
    };


    /**
     * 登录返回、注册返回链接修改
     * */
    var changeDone = {
        init: function(){
            var loc = window.location;
            //this.hasAnd = loc.search.indexOf('&') > 0 ? true : false;
            this.done = encodeURIComponent(loc.href);
            this.$in = $('#accountSignIn a');
            this.$up = $('#accountSignUp a');

            this._doSignIn();
            this._doSignUp();
        },
        //登录后返回url修改
        _doSignIn: function(){
            var done = this.done, $in = this.$in;
            if (!!$in.length) {
                //                if ( this.hasAnd ){
                //                    done = 'http://exodus.1688.com/';
                //                    $in.attr( 'target', '_blank' );
                //                }
                $in.attr('href', 'https://login.1688.com/member/signin.htm?Done=' + done);
            }
        },
        //注册结束之后返回上一页链接修改
        _doSignUp: function(){
            var leadUrl = this.done;
            if (!!leadUrl.length) {
                leadUrl = '&leadUrl=' + leadUrl;
                this.$up.attr('href', 'http://exodus.1688.com/member/join/common_join.htm?tracelog=common_toolbar_reg' + leadUrl);
            }
        }
    };


    /**
     * 下拉菜单
     * */
    var dropDown = {
        init: function(){
            this._listenEnter('top-cxt-service', 'top-product-over');
            this._listenEnter('top-ali-assistant', 'top-product-over');
            this._listenEnter('top-sitemap', 'top-service-over');
        },
        //侦听mouseenter/mouseleave
        _listenEnter: function(el, cl){
            var $el = $('#alibarV2 div.topnav .' + el), isAlitalkInit = false, t1, t2;
            if (!$el.length) {
                return;
            }
            $el.mouseenter(function(){
                var $this = $(this);
                clearTimeout(t2);
                t1 = setTimeout(function(){
                    if (el === 'top-sitemap') {
                        $this.parent().addClass(cl);
                    } else {
                        $this.addClass(cl);
                        if (el === 'top-cxt-service' && !isAlitalkInit) {
                            register([_alitalk]); //注册alitalk功能
                            isAlitalkInit = true;
                        }
                    }
                }, 200);
            });
            $el.mouseleave(function(){
                var $this = $(this);
                clearTimeout(t1);
                t2 = setTimeout(function(){
                    if (el === 'top-sitemap') {
                        $this.parent().removeClass(cl);
                    } else {
                        $this.removeClass(cl);
                    }
                }, 200);
            });
        }
    };


    /**
     * alitalk初始化
     * */
    var _alitalk = {
        init: function(){
            $.use('web-alitalk-shunt', function(){
                FE.util.alitalk.shunt($('#alibarV2 li.top-cxt-service a.top-alitalk-shunt'), {
                    ruleId: 'ALITALK_INCALL_ROLE_CTP01'
                });
                $.loadCSS('http://' + $.styleDomain + '/css/sys/universal/alibar/alitalk.css');
            });
        }
    };

    //注册功能点
    register([changeDone, checkSignIn, dropDown]);

})(jQuery, FE.sys);

/**
 * Alibar 4 for FDev4
 * @version 4.0 2012.01.18
 * @version 4.1 2012.04.21
 * @version 4.2 2012.09.04 jianping.shenjp 添加淘宝互通tips
 * @version 4.3 2012.10.24 jianping.shenjp 进货单接口优化
 * @author Denis
 * @api FE.sys.Alibar.refresh(); 刷新用户状态
 * @api FE.sys.Alibar.purchaselistRefresh(); 刷新货品list状态
 * @删除货品，$(document).triggerHandler("delitem.alibar")
 * @dongming.jidm 增加用户浮层信息 进货单打点
 * @update 2013.10.11 terence.wangt 为保持和Fdev5统一，更名FU为AliUser
 * @update 2013.11.11 chuanpeng.qchp 进货单中增加specInfo的显示
 */
if (!FE.sys.Alibar) {
    jQuery.namespace('FE.sys.Alibar');
    (function($, Alibar, undefined){
        var alibar, albarTips,isDetailRequested = false ,$util = $.util, $noop = $.noop, AliUser = FE.util, ie6 = $.util.ua.ie6;
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
             * 登录状态
             */
            loginfoInit: function(){
                /**
                 * 刷新用户状态
                 */
                function refresh(){
                    var account = $('span.account-id', alibar), uidUrl = 'http://me.1688.com/', uid;
                    $('li.account-msg, li.account-signin, li.account-signup, li.account-signout', alibar).addClass('fd-hide');

                    hideModifyNickLink();

                    updateLoginInfo({
                        source: ['b2b', 'taobao']
                    }).always(function(){
                        if (AliUser.IsLogin()) {
                            $('li.account-msg, li.account-signout', alibar).removeClass('fd-hide');
						    uid = $('<a>', {
                                href: uidUrl,
                                html: formatName(AliUser.LoginId()),
                                target: '_blank',
								title: AliUser.LoginId()
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
                                        a.attr('title', '你有新消息');
                                        window.aliclick &&
                                        span.mousedown(function(){
                                            aliclick(this, '?tracelog=cn_alibar_msg');
                                        });
                                    } else {
                                        a.attr('title', '查看你的消息');
                                    }
                                }
                            });
                            
							
                        } else {
                            $('li.account-signin, li.account-signup', alibar).removeClass('fd-hide');
                            if (AliUser.LastLoginId()) {
                                uid = $('<a>', {
                                    href: uidUrl,
                                    html: formatName(AliUser.LastLoginId()),
                                    target: '_blank',
									title: AliUser.LastLoginId()
                                }).mousedown(traceIdHandler);
                                account.html(uid);
                                window.aliclick && uid.mousedown(traceIdHandler);
                            } else {
                                account.html('欢迎来到阿里巴巴');
                                $('li.account-msg span', alibar).remove();
                            }

                        }

                    });
					/*判断用户名的长度，若全英文，则字数控制在14个以内，若是包含中文，则控制在11个以内，以'...'替代隐藏部分*/
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
					/*请求验证三个验证位，确定是否显示”修改会员名“*/
					function isShowModifyNickLink(){
						$.use('util-cookie', function(){
							var rn_id=$.util.cookie("__rn_refer_login_id__");
							var memberId = AliUser.getLastMemberId();
							var cn_id=$.util.cookie("__cn_logon_id__");
							var rn_alert=$.util.cookie("__rn_alert__");
							var second_alert = $.util.cookie("__rn_second_alert__");

//							var testUrl = 'http://member-test.1688.com:5100/member/rename/rename_cookie_sync.do?memberId=b2b-3618717382';
							var officalUrl = "http://member.1688.com/member/rename/rename_cookie_sync.do?memberId="+memberId;

							if(!rn_id||rn_id!==cn_id){
								$.ajax(officalUrl,{
									dataType:'jsonp',
									success:function(o){
										if(o.success){
											rn_alert=$.util.cookie("__rn_alert__");
											second_alert = $.util.cookie("__rn_second_alert__");
											
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
						});
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
						var modify_nick_content=('<div class="tips-content"><div class="tip-text add"><p style="color:#444;">为了让客户快速记住您，您需要：</p><div class="modify_nick_btn"><a href="'+modify_nick_url+'">立即修改用户名</a></div></div><div class="tips-close"></div></div><div class="tips-top"></div>');
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
             * 下拉菜单
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
             * 会员信息浮层
             */
            vipInfoInit: function() {
                var infoBox = $('li.vipInfoBox', alibar);
				var that = null;
				var timer = null;
				var notLoginRemind = '<p class="reLoginRemind">您的登录状态已失效,<a href="http://login.1688.com/member/signin.htm" target="_self">请重新登录</a></p>';
				var isSubAccountRemind='<p class="subAccountRemind">您好！您当前登陆了会员子账号  <a href="http://login.1688.com/member/signout.htm" target="_self">退出</a></p>';
                if( !infoBox.length ) {
                    return;
                }

                var isRequested = 0;

                infoBox.mouseenter(function() {
					that = $(this);
					
                    if( !AliUser.IsLogin() || isRequested ) {
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
				
				if( AliUser.IsLogin() ) {
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
                                            <img src="<%= this.userImg %>" alt="" onerror="<%= this.error %>"/>\
                                        </a>\
                                    </div>\
                                    <div class="level">\
                                        <p class="account">\
                                            <a class="accountManage" href="http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=" target="_blank">账号管理</a>\
                                            <span class="sep">|</span>\
                                            <a class="signout" href="http://login.1688.com/member/signout.htm" data-trace="cn_alibar_quit" title="退出">退出</a>\
                                        </p>\
                                        <p class="supplyLevel fd-clr">\
                                            <% if( typeof $data.saleRate !== "undefined" ) { %>\
                                                <span class="title">供应等级:</span>\
                                                <a class="levelImg" data-trace="alibar_supplier_rank" href="<%= $data.saleRate.targetUrl %>" target="_blank" title="<%= $data.saleRate.tips %>">\
                                                    <img src="<%= $data.saleRate.logoUrl %>" alt=""/>\
                                                </a>\
                                            <% } else if(typeof $data.saleRate === "undefined" && typeof $data.buyRate === "undefined" && $data.medals.length === 0 ) { %>\
                                                <a class="vipClub" data-trace="alibar_vip_club" href="http://vip.1688.com" target="_blank">去会员俱乐部逛逛</a>\
                                            <% } %>\
                                        </p>\
                                        <p class="purchaseLevel fd-clr">\
                                            <% if( typeof $data.buyRate !== "undefined" ) { %>\
                                                <span class="title">采购等级:</span>\
                                                <a class="levelImg" data-trace="alibar_buyers_rank" href="<%= $data.buyRate.targetUrl %>" target="_blank" title="<%= $data.buyRate.tips %>">\
                                                    <img src="<%= $data.buyRate.logoUrl %>" alt=""/>\
                                                </a>\
                                            <% } else if(typeof $data.saleRate === "undefined" && typeof $data.buyRate === "undefined" && $data.medals.length === 0 ) { %>\
                                                <a class="newComer" data-trace="alibar_vip_noviciate" href="http://page.1688.com/html/service/aliguide/seller_user_guide.html" target="_blank">新手帮助中心</a>\
                                            <% } %>\
                                        </p>\
                                    </div>\
                                </div>\
                                <% if( $data.medals.length ) { %>\
                                    <div class="medalWrapper fd-clr">\
                                        <% for ( var i = 0; i < $data.medals.length; i++ ) { %>\
                                            <a class="medal" href="<%= $data.medals[i].targetUrl %>" data-trace="alibar_medal_rank" title="<%= $data.medals[i].tips %>">\
                                                <img src="<%= $data.medals[i].logoUrl %>" alt=""/>\
                                            </a>\
                                        <% } %>\
                                    </div>\
                                <% } %>';

                    var userImg = getUserPhoto(memberId);

                    var extraMassage = {
                        userImg: userImg,
                        error: "this.src=\'http://img.china.alibaba.com/cms/upload/2012/137/253/352731_936034060.png\';this.onerror=null;"
                    };

                    $.use('web-sweet', function() {
                        var info;
                        var dom = $('li.vipInfoBox div.nav-content', alibar);

                        info = FE.util.sweet(html).applyData(data, extraMassage);

                        dom.html(info);

                    });


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
             * 进货单状态
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

                //只有当用户鼠标移到"进货单"时，才去调用详情接口
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
                //刷新"进货单"货物详情
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
                            //清空产品列表
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
                                productList.prepend('<h3>最近加入的货品：</h3>')
                            }
                            isDetailRequested = true;
                        },
                        error:function(){
                            hideLoading();
                        }
                    });
                }
                //刷新"进货单"货物数目
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
                 * 创建产品dl
                 * @param {Object} data
                 */
                function dlRender(data){
                    $.each(data, function(i, o){
                        if (i > 4) {
                            return false;
                        }
						//如果有相信信息则显示出来
						var specHtml = '';
						var specItems;
						if(o.specInfos && o.specInfos.length){	
							specItems = [];
							$.each(o.specInfos,function(specIndex,specItem){
								specItems.push('<span title="');
								specItems.push(specItem.specName);
								specItems.push('：');
								specItems.push(specItem.specValue);
								specItems.push('" class="specItem');
								
								if( specIndex === o.specInfos.length - 1){
									specItems.push(' lastItem');
								}
								specItems.push('">');
								specItems.push(specItem.specName);
								specItems.push('：');
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
                        var dl = $('<dl>'), title = $util.escapeHTML(o.goodsName, true),
                            html =
                                ['<dt>',
                                    '<a title="', title, '" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail"></a>',
                                '</dt>',
                                '<dd class="title">',
                                    '<a title="', title ,'" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail">', $util.escapeHTML(o.goodsName.cut(23, '...')) ,'</a>',
                                '</dd>',
								specHtml,
                                '<dd class="price">',
                                    '&yen;<em>', o.goodsPrice, '</em>元&nbsp;×&nbsp;<span>', o.goodsCount, '</span>',
                                '</dd>',
                                '<dd class="action"><a class="delete" title="删除" href="#">删除</a></dd>'],
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
                        html = ['进货单还剩余货品：<span class="orange">', o.remainKind, '</span>种（', o.remainCount, '件）'];
                    }else if(o.sumOfKind){
                        html = ['共计<span>', o.sumOfKind, '</span>种货品（', o.sumOfAcount, '件）<br/>货品合计：<em>', o.sumOfPrice.toFixed(2), '</em>元'];
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
             * 初始化“诚信通服务”下的alitalk
             */
            tpInit: function(){
                $('li.topnav-tp', alibar).one('mouseenter', function(){
                    var self = this;
                    $.use('web-alitalk-shunt', function(){
                        FE.util.alitalk.shunt($('a.order-online', self), {
                            attr: 'alitalk-shunt',
                            ruleId: 'ALITALK_INCALL_ROLE_CTP01'
                        });
                    });
                });
            },
            /**
             * 打点跟踪
             */
            traceInit: function(){
				window.aliclick && $('#alibar-v4').on('mousedown', 'a[data-trace]', function() {
					aliclick(this, '?tracelog=' + $(this).data('trace'));
				});
            },
          

            /**
             * 引入延长淘宝session的组件
             */
            sessionKeeper: function() {
                $(window).one('load', function(){
                    $.getScript('http://style.c.aliimg.com/sys/js/session-keeper/session-keeper.js');
                });
            }
        };

		
		  /**
            * 显示中文站\淘宝互通信息
            */
		 function showXSiteAccountTips(){
			var COOKIE_NAME = "show_inter_tips";
			if(exceptDomain()){
				return;
			}
			if($.util.subCookie(COOKIE_NAME)!="false"){
				showTip(true);
				$.use("util-cookie",function(){
					$(".tips-close", albarTips).on("click",function(){
						$.util.subCookie(COOKIE_NAME,"false");
					});
				});
			}
		}

		function showUserSwitchTips() {
			if(exceptDomain()){
				return;
			}
			$(window).on('userSwitchedToTB', function(evt, info){
			   // showTip(true,$.util.substitute('<p>您正在使用 <em>淘宝帐号 {nick}</em> 访问阿里巴巴中国站，您可以“<a href="http://login.1688.com/member/logout.htm">退出</a>”后重新登录其他阿里巴巴帐号。网店进货可以来“<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">淘货源</a>”逛逛哦~<a class="i-know" href="#i-know">我知道了</a></p>', info));
			  $('.tip-text', albarTips).html($.util.substitute('<p>您正在使用 <em>淘宝帐号 {nick}</em> 访问阿里巴巴中国站，您可以“<a href="http://login.1688.com/member/logout.htm">退出</a>”后重新登录其他阿里巴巴帐号。网店进货可以来“<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">淘货源</a>”逛逛哦~<a class="i-know" href="#i-know">我知道了</a></p>', info));
			  showTip(true);
			});

			albarTips.on('click', 'a.i-know', function(evt){
				evt.preventDefault();
				hideTip();
			});

			$(window).one('load', function(){
				$.getScript('http://style.c.aliimg.com/sys/js/common/user-switching-notify.js');
			});
		}
		// 二次改名提示
		function showSecondaryChangeMemberNameTip() {
			var modifyUrl = 'http://member.1688.com/member/prename/second_pre_name.htm?req_from=2nd_prename',
				memberManageUrl = 'http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=',
				innerText = '您现在有修改登录名的机会，您可以：<a href="' + modifyUrl + '" target="_blank">立即修改</a>或之后在<a href="' + memberManageUrl + '" target="_blank">我的阿里-账号管理</a>中修改';
				
			$('.tip-text', albarTips).html(innerText);
			showTip(false);
		}
			
			
			
        function getTestConfig(key) {
            return FE.test && FE.test[key];
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

        //暴露接口
        Alibar.refresh = Alibar.refresh || $noop;
        Alibar.purchaselistRefresh = Alibar.purchaselistRefresh || $noop;
        Alibar.showTip = showTip;
        Alibar.hideTip = hideTip;

        //domready之后执行
        $(function(){
            alibar = alibar || $('#alibar-v4');
            albarTips = $(".alibar-tips", alibar);
            //判断HTML结构是否符合当前版本
            if (alibar.length) {
                for (var p in handlers) {
                    handlers[p]();
                }
            }
        });
    })(jQuery, FE.sys.Alibar);
}
