/**
 * alibar js
 * @author  Edgar <mail@edgarhoo.net>
 * @version 2.5.110531 //change user link
 * @version 2.5.110817 //change signin link
 * @update 2011.08.22 Denis ȥ��hasAnd���жϣ�ʹ��encodeURIComponent���encodeURI
 * @update 2011.11.30 Denis ȥ��ע������
 * @update 2012.09.04 jianping.shenjp ����Ա���ͨtips
 */
(function($, S){

    var _init = function(item){
        item.init();
    }, //ע�Ṧ�ܵ�
 register = function(name){
        var _this = this;
        $.each(name, function(i, item){
            $(document).ready(function(){
                _init(item);
            });
        });
    };


    /**
     * ����Ƿ��¼
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
                register([_addTip]); //ע������ע��tip����
            }*/
        }
    };


    /**
     * ��¼���ء�ע�᷵�������޸�
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
        //��¼�󷵻�url�޸�
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
        //ע�����֮�󷵻���һҳ�����޸�
        _doSignUp: function(){
            var leadUrl = this.done;
            if (!!leadUrl.length) {
                leadUrl = '&leadUrl=' + leadUrl;
                this.$up.attr('href', 'http://exodus.1688.com/member/join/common_join.htm?tracelog=common_toolbar_reg' + leadUrl);
            }
        }
    };


    /**
     * �����˵�
     * */
    var dropDown = {
        init: function(){
            this._listenEnter('top-cxt-service', 'top-product-over');
            this._listenEnter('top-ali-assistant', 'top-product-over');
            this._listenEnter('top-sitemap', 'top-service-over');
        },
        //����mouseenter/mouseleave
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
                            register([_alitalk]); //ע��alitalk����
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
     * alitalk��ʼ��
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

    //ע�Ṧ�ܵ�
    register([changeDone, checkSignIn, dropDown]);

})(jQuery, FE.sys);

/**
 * Alibar 4 for FDev4
 * @version 4.0 2012.01.18
 * @version 4.1 2012.04.21
 * @version 4.2 2012.09.04 jianping.shenjp ����Ա���ͨtips
 * @version 4.3 2012.10.24 jianping.shenjp �������ӿ��Ż�
 * @author Denis
 * @api FE.sys.Alibar.refresh(); ˢ���û�״̬
 * @api FE.sys.Alibar.purchaselistRefresh(); ˢ�»�Ʒlist״̬
 * @ɾ����Ʒ��$(document).triggerHandler("delitem.alibar")
 * @dongming.jidm �����û�������Ϣ ���������
 * @update 2013.10.11 terence.wangt Ϊ���ֺ�Fdev5ͳһ������FUΪAliUser
 * @update 2013.11.11 chuanpeng.qchp ������������specInfo����ʾ
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
                                            <a class="accountManage" href="http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=" target="_blank">�˺Ź���</a>\
                                            <span class="sep">|</span>\
                                            <a class="signout" href="http://login.1688.com/member/signout.htm" data-trace="cn_alibar_quit" title="�˳�">�˳�</a>\
                                        </p>\
                                        <p class="supplyLevel fd-clr">\
                                            <% if( typeof $data.saleRate !== "undefined" ) { %>\
                                                <span class="title">��Ӧ�ȼ�:</span>\
                                                <a class="levelImg" data-trace="alibar_supplier_rank" href="<%= $data.saleRate.targetUrl %>" target="_blank" title="<%= $data.saleRate.tips %>">\
                                                    <img src="<%= $data.saleRate.logoUrl %>" alt=""/>\
                                                </a>\
                                            <% } else if(typeof $data.saleRate === "undefined" && typeof $data.buyRate === "undefined" && $data.medals.length === 0 ) { %>\
                                                <a class="vipClub" data-trace="alibar_vip_club" href="http://vip.1688.com" target="_blank">ȥ��Ա���ֲ����</a>\
                                            <% } %>\
                                        </p>\
                                        <p class="purchaseLevel fd-clr">\
                                            <% if( typeof $data.buyRate !== "undefined" ) { %>\
                                                <span class="title">�ɹ��ȼ�:</span>\
                                                <a class="levelImg" data-trace="alibar_buyers_rank" href="<%= $data.buyRate.targetUrl %>" target="_blank" title="<%= $data.buyRate.tips %>">\
                                                    <img src="<%= $data.buyRate.logoUrl %>" alt=""/>\
                                                </a>\
                                            <% } else if(typeof $data.saleRate === "undefined" && typeof $data.buyRate === "undefined" && $data.medals.length === 0 ) { %>\
                                                <a class="newComer" data-trace="alibar_vip_noviciate" href="http://page.1688.com/html/service/aliguide/seller_user_guide.html" target="_blank">���ְ�������</a>\
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
                    $.use('web-alitalk-shunt', function(){
                        FE.util.alitalk.shunt($('a.order-online', self), {
                            attr: 'alitalk-shunt',
                            ruleId: 'ALITALK_INCALL_ROLE_CTP01'
                        });
                    });
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
                    $.getScript('http://style.c.aliimg.com/sys/js/session-keeper/session-keeper.js');
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
			   // showTip(true,$.util.substitute('<p>������ʹ�� <em>�Ա��ʺ� {nick}</em> ���ʰ���Ͱ��й�վ�������ԡ�<a href="http://login.1688.com/member/logout.htm">�˳�</a>�������µ�¼��������Ͱ��ʺš����������������<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">�Ի�Դ</a>�����Ŷ~<a class="i-know" href="#i-know">��֪����</a></p>', info));
			  $('.tip-text', albarTips).html($.util.substitute('<p>������ʹ�� <em>�Ա��ʺ� {nick}</em> ���ʰ���Ͱ��й�վ�������ԡ�<a href="http://login.1688.com/member/logout.htm">�˳�</a>�������µ�¼��������Ͱ��ʺš����������������<a href="http://tao.1688.com/?tracelog=hipage_home_alibar" target="_blank">�Ի�Դ</a>�����Ŷ~<a class="i-know" href="#i-know">��֪����</a></p>', info));
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
		// ���θ�����ʾ
		function showSecondaryChangeMemberNameTip() {
			var modifyUrl = 'http://member.1688.com/member/prename/second_pre_name.htm?req_from=2nd_prename',
				memberManageUrl = 'http://work.1688.com/home/page/index.htm#app=accountmanagement&menu=&channel=',
				innerText = '���������޸ĵ�¼���Ļ��ᣬ�����ԣ�<a href="' + modifyUrl + '" target="_blank">�����޸�</a>��֮����<a href="' + memberManageUrl + '" target="_blank">�ҵİ���-�˺Ź���</a>���޸�';
				
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

        //��¶�ӿ�
        Alibar.refresh = Alibar.refresh || $noop;
        Alibar.purchaselistRefresh = Alibar.purchaselistRefresh || $noop;
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
    })(jQuery, FE.sys.Alibar);
}
