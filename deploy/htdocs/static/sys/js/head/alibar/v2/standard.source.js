/**
 * @package FD.sys.head.alibar.standard
 * @version 2.0.101019
 * @version 2.1.101025
 * @version 2.1.101213
 * @version 2.1.101221 //change shuntAlitalk url
 * @version 2.2.101223 //add username link to modifyProfile
 * @update  2.3.110413 //change alicnwb to alicnweb
 * @update  2.3.110427 //fix login done
 * @update  2.4.110518 //add sign up done
 * @update  2.5.110531 //change user url
 * @update  2.5.110817 //change signin url
 * @update 2011.08.22 Denis ȥ��hasAnd���жϣ�ʹ��encodeURIComponent���encodeURI
 * @update 2011.11.30 Denis �Ƴ�ע����
 * @author  Edgar
 */
FDEV.namespace('FD.sys.head');
(function(S){

    //S.memberId = '';
    S.isLogin = false;
    //S.loginUrl = 'http://profile.1688.com/user/admin/modifyProfile.html';
    S.loginUrl = 'http://work.1688.com/app/contact.htm';

    S.getCookie = function(name){
        var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return value ? unescape(value[1]) : '';
    };

    S.loginId = FD.common.loginId;
    //��ǰ�Ƿ��е�¼�û�
    S.isLogin = FD.common.isLogin;
    //��һ�ε�¼��ID
    S.lastLoginId = FD.common.lastLoginId;

    S.alibar = {
        checkSignIn: function(){
            var accountId = $('accountId'), accountMsg = $('accountMsg'), msgInterface = 'http://work.1688.com/home/unReadMsgCount.htm';
            if (S.isLogin) {
                S._accountId = document.createElement('a');
                $D.addClass(S._accountId, 'account-signed');
                S._accountId.href = S.loginUrl;
                S._accountId.target = '_self';
                S._accountId.innerHTML = S.loginId;
                // '<a class="account-signed" href="' + S.loginUrl + '" target="_self">' + S.loginId + '</a>';
                $D.addClass('accountSignIn', 'fd-hide');
                $D.addClass('accountSignUp', 'fd-hide');
                $D.removeClass('accountSignOut', 'fd-hide');
                accountId.innerHTML = '';
                accountId.appendChild(S._accountId);
                if (accountMsg) {
                    //������Ϣ����
                    $D.removeClass(accountMsg, 'fd-hide');
                    FD.common.request('jsonp', msgInterface, {
                        onCallback: function(o) {
                            if (o.success && o.count > 0) {
                                var msgCount = document.createElement('span');
                                msgCount.innerHTML = o.count > 99 ? '99+' : o.count;
                                $$('>a', accountMsg, true).appendChild(msgCount);
                            }
                        }
                    });
                }
            } else if (S.lastLoginId !== '') {
                S._accountId = '<a class="account-not" href="' + S.loginUrl + '" target="_self">' + S.lastLoginId + '</a>';
                $('accountId').innerHTML = S._accountId;
            } else {
                var currentDate = new Date(), tTip, currentMonth = currentDate.getMonth() + 1, currentDay = currentDate.getDate(), barDate, bomRequest, _self = this;

                barDate = currentDate.getFullYear() + '' + this._formatDate(currentMonth) + this._formatDate(currentDay);
            }
        },
        _formatDate: function(date){
            return (date < 10) ? ('0' + date) : date;
        },
        _getSubCookie: function(name, subName){
            var hash = this._getSubCookieHash(name);
            if (hash != null) {
                return hash[subName] ? hash[subName] : null;
            }
            return null;
        },
        _getSubCookieHash: function(name){
            var hashParts = S.getCookie(name).split('|'), hashPart = null, hash = {};

            if (name.length > 0) {
                for (var i = 0, len = hashParts.length; i < len; ++i) {
                    if (hashParts[i].indexOf('=') !== -1) {
                        hashPart = hashParts[i].split('=');
                        hash[unescape(hashPart[0])] = unescape(hashPart[1]);
                    }
                }
            }
            return hash;
        },
        _setSubCookie: function(name, subName, value, options){
            var hash = this._getSubCookieHash(name), subArr = [], subStr, cookieStr;

            hash[subName] = value;

            for (var key in hash) {
                if (FDEV.lang.hasOwnProperty(hash, key)) {
                    subArr.push(escape(key) + '=' + escape(String(hash[key])));
                }
            }
            subStr = subArr.join('|');

            cookieStr = escape(name) + "=" + escape(subStr);

            if (options.expires instanceof Date) {
                cookieStr += "; expires=" + options.expires.toUTCString();
            }
            if (FDEV.lang.isNumber(options.expires) && options.expires !== 0) {
                var date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                cookieStr += "; expires=" + date.toUTCString();
            }
            if (options.path !== '') {
                cookieStr += "; path=" + options.path;
            }
            if (options.domain !== '') {
                cookieStr += "; domain=" + options.domain;
            }
            if (options.secure === true) {
                cookieStr += "; secure";
            }

            document.cookie = cookieStr;
        },
        topOver: function(node, txt){
            var over = $$('.alibar-v2 .topnav .' + node), t1, t2;
            if (over.length < 1) {
                return;
            }
            $E.addListener(over, 'mouseover', function(){
                var _this = this;
                clearTimeout(t2);
                t1 = setTimeout(function(){
                    if (node === 'top-sitemap') {
                        $D.addClass(_this.parentNode, txt);
                    } else {
                        $D.addClass(_this, txt);
                        if (node === 'top-cxt-service' && !S.alibar.isAlitalk) {
                            S.alibar.alitalk();
                        }
                    }
                }, 200);
            });
            $E.addListener(over, 'mouseout', function(){
                var _this = this;
                clearTimeout(t1);
                t2 = setTimeout(function(){
                    if (node === 'top-sitemap') {
                        $D.removeClass(_this.parentNode, txt);
                    } else {
                        $D.removeClass(_this, txt);
                    }
                }, 200);
            });
        },
        changeDone: function(){
            var a = $$('#accountSignIn a'), b = $$('#accountSignUp a'), loc = window.location, //hasAnd = loc.search.indexOf('&') > 0 ? true : false,
 done = encodeURIComponent(loc.href);
            if (a.length > 0) {
                //                if ( hasAnd ){
                //                    done = 'http://exodus.1688.com/';
                //                    a[0].target = '_blank';
                //                }
                a[0].href = 'https://login.1688.com/member/signin.htm?Done=' + done;
            }
            if (b.length > 0) {
                done = '&leadUrl=' + done;
                b[0].href = 'http://exodus.1688.com/member/join/common_join.htm?tracelog=common_toolbar_reg' + done;
            }
        },
        isAlitalk: false,
        shuntInit: function(){
            S.alibar.isAlibarUpdate ? new FD.widget.ShuntAlitalk('top-alitalk-shunt', {
                ruleId: 'ALITALK_INCALL_ROLE_CTP01',
                remote: true,
                attname: 'data-shunt'
            }) : new FD.widget.ShuntAlitalk('alitalk-shunt', {
                ruleId: 'ALITALK_INCALL_ROLE_CTP01',
                remote: true
            });
        },
        alitalk: function(){
            var urls = [], configs, alitalk, SA = S.alibar;
            $Y.Get.css('http://style.c.aliimg.com/css/lib/fdev-v3/widget/alitalk.css');
            if (FDEV.env.ua.ie) {
                if (typeof FD.widget.Alitalk === 'undefined') {
                    ((FD.version.charAt(0) - 0) === 3) ? urls.push('http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js') : urls.push('http://style.c.aliimg.com/js/fdevlib/widget/alitalk/fdev-alitalk-v3.js');
                }
                if (typeof FD.widget.ShuntAlitalk === 'undefined') {
                    urls.push('http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/shuntalitalk-v2.js');
                }
                if (urls.length > 0) {
                    configs = {
                        onSuccess: function(o){
                            SA.shuntInit();
                        }
                    };
                    alitalk = FD.common.request('jsonp', urls, configs);
                } else {
                    SA.shuntInit();
                }
            } else {
                $E.addListener($$('.list-cxt-service .iconAlitalk'), 'click', function(e){
                    $E.preventDefault(e);
                    return false;
                });
            }
            SA.isAlitalk = true;
        },
        init: function(){
            this.isAlibarUpdate = $$('.list-cxt-service .top-alitalk-shunt').length > 0 ? true : false;

            this.checkSignIn();
            this.topOver('top-cxt-service', 'top-product-over');
            this.topOver('top-ali-assistant', 'top-product-over');
            this.topOver('top-sitemap', 'top-service-over');
            this.changeDone();
        },
        end: 0
    };

    $E.onDOMReady(function(){
        S.alibar.init();
    });

})(FD.sys.head);

/**
 * Alibar 4 for FDev3
 * @version FDev3 4.0 2012.01.30
 * @version 4.1 2012.04.21
 * @author Denis
 * @api FD.sys.Alibar.refresh();
 * @api FD.sys.Alibar.purchaselistRefresh();
 */
if (!FD.sys.Alibar) {
    FDEV.namespace('FD.sys.Alibar');
    (function(Alibar){
        var alibar, emptyFn = FD.common.emptyFn, ie6 = YAHOO.env.ua.ie === 6;
        var handlers = {
         
            /**
             * ��¼״̬
             */
            loginfoInit: function(){
                FYS('li.account-signin>a', alibar, true).href = 'https://login.1688.com/member/signin.htm?Done=' + encodeURIComponent(location.href);
                /**
                 * ˢ���û�״̬
                 */
                function refresh(){
                    var loginId = FD.common.loginId, isLogin = FD.common.isLogin, lastLoginId = FD.common.lastLoginId, uidUrl = 'http://me.1688.com/', account = FYS('span.account-id', alibar, true), uid, span;
                    FYD.addClass(FYS('li.account-msg, li.account-signin, li.account-signup, li.account-signout', alibar), 'fd-hide')
                    if (isLogin) {
                        FYD.removeClass(FYS('li.account-signout', alibar, true), 'fd-hide');
                        FYD.removeClass(FYS('li.account-msg', alibar, true), 'fd-hide');
                        uid = document.createElement('a');
                        uid.href = uidUrl;
                        uid.target = '_blank';
                        uid.innerHTML = formatName(loginId);
						uid.title = loginId;
						if(FYS('li.vipInfoBox', alibar,true)) {
							FYD.addClass(uid,'nav-arrow');	
						}
						
                        FYD.addClass(FYS('li.account-signin', alibar, true), 'fd-hide');
                        FYD.addClass(FYS('li.account-signup', alibar, true), 'fd-hide');
                        FYD.removeClass(FYS('li.account-signout', alibar, true), 'fd-hide');

                        account.innerHTML = '';
                        account.appendChild(uid);

                        window.aliclick && FYE.on(uid, 'mousedown', traceIdHandler);

                        FD.common.request('jsonp', 'http://work.1688.com/home/unReadMsgCount.htm', {
                            onCallback: function(o){
                                var msg = FYS('li.account-msg', alibar, true), a = FYS('>a', msg, true), span = FYS('>span', a, true);
                                span && a.removeChild(span);
                                if (o.success && o.count > 0) {
                                    span = document.createElement('span');
                                    span.innerHTML = (o.count > 99 ? '99+' : o.count);

                                    a.appendChild(span);
                                    a.title = '��������Ϣ';
                                    window.aliclick &&
                                    FYE.on(span, 'mousedown', function(){
                                        aliclick(this, '?tracelog=cn_alibar_msg');
                                    });
                                } else {
                                    a.title = '�鿴�����Ϣ';
                                }
                            }
                        });
                    } else {
                        FYD.removeClass(FYS('li.account-signin, li.account-signup', alibar), 'fd-hide');
                        if (lastLoginId) {
                            uid = document.createElement('a');
                            uid.href = uidUrl;
                            uid.target = '_blank';
                            uid.innerHTML = formatName(lastLoginId);
							uid.title= lastLoginId;

                            account.innerHTML = '';
                            account.appendChild(uid);
                            window.aliclick && FYE.on(uid, 'mousedown', traceIdHandler);
                        } else {
                            span = FYS('li.account-msg span', alibar, true);
                            account.innerHTML = '��ӭ��������Ͱ�';
                            span && span.parentNode.removeChild(span);
                        }
                    }
					/*�ж��û���ĳ��ȣ���ȫӢ�ģ������������14�����ڣ����ǰ����ģ��������11�����ڣ���'...'������ز���*/
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
					
					
					
                    function traceIdHandler(){
                        aliclick(this, '?tracelog=cn_alibar_id');
                    }
                }
                refresh();
                Alibar.refresh = refresh;
            },
			
			   /**
             * �����˵�
             */
            dropdownInit: function(){
                var extras = FYS('li.extra', alibar);
                FYE.on(extras, 'mouseenter', function(){
                    ie6 && FYD.addClass(this, 'nav-hover');
                    FYD.addClass(FYD.getPreviousSibling(this), 'nav-hover-prev');
                });
                FYE.on(extras, 'mouseleave', function(){
                    ie6 && FYD.removeClass(this, 'nav-hover');
                    FYD.removeClass(FYD.getPreviousSibling(this), 'nav-hover-prev');
                });
            },
			
			 /**
             * ��Ա��Ϣ����
             */

            vipInfoInit: function() {
                var infoBox = FYS('li.vipInfoBox', alibar, true);
				var that = null;
				var timer = null;
				var notLoginRemind = '<p class="reLoginRemind">��ĵ�¼״̬��ʧЧ,<a href="http://login.1688.com/member/signin.htm" target="_self">�����µ�¼</a></p>';
                var isSubAccountRemind='<p class="subAccountRemind">��ã���ǰ��½�˻�Ա���˺�  <a href="http://login.1688.com/member/signout.htm" target="_self">�˳�</a></p>';
				if( !infoBox) {
                    return;
                }
				isLogin = FD.common.isLogin;
                var isRequested = 0;
				if(isLogin) {
					FYE.delegate(alibar,'mouseenter',function(){
						that = this;
							if(timer){
								clearTimeout(timer);
								timer=null;
							}
							setTimeout(function() {
									FYD.addClass(that,'infoHover');
								}, 100);
						 if( !isLogin || isRequested ) {
							return;
						}
						FD.common.request('jsonp','http://vip.1688.com/club/club_info_json.do',{
							cache: false,
							onCallback:function(data){
								if(data.success !== true){
									if( data.data.errorMsg === 'NOT_LOGIN' ) {
										FYS('li.vipInfoBox div.nav-content', alibar,true).innerHTML=notLoginRemind;
										isRequested = 1;
									}else if( data.data.errorMsg === 'SUB_ACCOUNT'){
										FYS('li.vipInfoBox div.nav-content', alibar,true).innerHTML=isSubAccountRemind;
										isRequested = 1;
									}
									return;
								}
								renderTemplate(data.data);
								isRequested = 1;
							},
							onFailure:function(){
							
							}
						});
					},'li.vipInfoBox');
					FYE.delegate(alibar,'mouseleave',function(){
						timer=setTimeout(function() {
							FYD.removeClass(that,'infoHover');
							timer=null;
						}, 400);
					},'li.vipInfoBox');
				}
				
                function renderTemplate(data) {
                    var memberId = FD.common.lastLoginId;
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
                                            <a class="medal" data-trace="alibar_medal_rank" href="<%= $data.medals[i].targetUrl %>" title="<%= $data.medals[i].tips %>">\
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
					
					FD.common.request('jsonp','/static/fdevlib/js/fdev-v3/widget/template/sweet-min.js',{
						onSuccess:function(){
							var info;
							var dom = FYS('li.vipInfoBox div.nav-content', alibar ,true );
							info = FD.widget.Sweet(html).applyData(data, extraMassage);
							dom.innerHTML=info;
						}
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
					var loadingContent = FYS('div.nav-content', infoBox , true);
					FYD.addClass(loadingContent,'alibar-loading');
					FYD.setStyle(loadingContent,'height',60);
                }
                function hideLoading(){
					var loadingContent = $('div.nav-content', infoBox);
                    FYD.removeClass(loadingContent,'alibar-loading');
					FYD.setStyle(loadingContent,'height','auto');
                }
            },
			
            /**
             * �����״̬
             */
            purchaselistInit: function(){
                //noformat
                var purchaselist = FYS('li.topnav-purchaselist', alibar, true);
                if(!purchaselist){
                    return;
                }
                var navTitle = FYS('div.nav-title', purchaselist, true),
                    emKind = FYS('em', navTitle, true),
                    navContent = FYS('div.nav-content', purchaselist, true),
                    productList = FYS('>.product-list', navContent, true),
                    purchaseInfo = FYS('>.purchase-info', navContent, true);
					
				FYE.delegate(alibar,'mouseenter',function(){
					window.aliclick && aliclick(this, '?tracelog=cn_alibar_purchaselist_hover');
				},'li.topnav-purchaselist');
				
					
				
                //format
                FYE.delegate(productList, 'click', function(e){
                    FYE.preventDefault(e);
                    var dl = FYD.getAncestorByTagName(this, 'dl'), goodsType = 'offer', goodsID = FYD.getAttribute(dl, 'goodsid'), specId = FYD.getAttribute(dl, 'specid');
                    FD.common.request('jsonp', 'http://order.1688.com/order/purchase/ajax/deleteFromPurchaseListNoCsrfAuth.jsx?t=' + new Date().getTime(), {
                        cache: false,
                        onSuccess: function(){
                            if (window.delFromPurchaseListResult && delFromPurchaseListResult.success) {
                                refresh();
                                window.delFromPurchaseListResult = undefined;
                            }
                        }
                    }, {
                        returnType: 'jsonp',
                        batchDel: [goodsType, goodsID, specId].join()
                    });
                }, 'a.delete');
                function refresh(){
                    FD.common.request('jsonp', 'http://order.1688.com/order/purchase/ajax/quick_purchase_list.jsx?t=' + new Date().getTime(), {
                        cache: false,
                        onSuccess: function(){
                            if (window.goodsList && goodsList.success) {
                                var kind = goodsList.totalKind || goodsList.sumOfKind, dl, p, h3;
                                if(!kind){
                                    kind = 0;
                                }
                                emKind.innerHTML = kind;
                                //��ղ�Ʒ�б�
                                while (dl = FYS('>dl', productList, true)) {
                                    productList.removeChild(dl);
                                }
                                while (h3 = FYS('>h3', productList, true)) {
                                    productList.removeChild(h3);
                                }
                                while (p = FYS('>p', purchaseInfo, true)) {
                                    purchaseInfo.removeChild(p);
                                }

                                if (kind) {
                                    FYD.addClass(purchaselist, 'topnav-purchaselist-stock');
                                    dlRender(goodsList.data);
                                    infoRender(goodsList);
                                } else {
                                    FYD.removeClass(purchaselist, 'topnav-purchaselist-stock');
                                }
                                if(goodsList.totalKind && FYS('>dl', productList, true)){
                                    var h3new = document.createElement('h3');
                                    h3new.innerHTML = '������Ļ�Ʒ��';
                                    FYD.insertBefore(h3new, FYS('>dl', productList, true));
                                }
                                window.goodsList = undefined;
                            }
                        }
                    });
                }
                /**
                 * ������Ʒdl
                 * @param {Object} data
                 */
                function dlRender(data){
                    data.forEach(function(o, i){
                        if (i > 4) {
                            return;
                        }
						//�����������Ϣ����ʾ����
						var specHtml = '';
						var specItems;
						if(o.specInfos && o.specInfos.length){	
							specItems = [];
							o.specInfos.forEach(function(specItem,specIndex){
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
                        var dl = document.createElement('dl'), title = FD.common.escapeHTML(o.goodsName),
                        html =
                                ['<dt>',
                                    '<a title="', title, '" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail"></a>',
                                '</dt>',
                                '<dd class="title">',
                                    '<a title="', title ,'" target="_blank" href="', o.imgLinkUrl, '" data-trace="cn_alibar_purchaselist_offerdetail">', FD.common.escapeHTML(o.goodsName.cut(23, '...')) ,'</a>',
                                '</dd>',
								specHtml,
                                '<dd class="price">',
                                    '&yen;<em>', o.goodsPrice, '</em>Ԫ&nbsp;��&nbsp;<span>', o.goodsCount, '</span>',
                                '</dd>',
                                '<dd class="action"><a class="delete" title="ɾ��" href="#">ɾ��</a></dd>'],
                            img = new Image();
                        //format
                        img.onload = function(){
                            if (this.width && this.height) {
                                var h = w = 50;
                                if (this.width > w || this.height > h) {
                                    var scale = this.width / this.height, fit = scale >= w / h;
                                    img[fit ? 'width' : 'height'] = fit ? w : h;
                                    if (ie6) {
                                        img[fit ? 'height' : 'width'] = (fit ? w : h) * (fit ? 1 / scale : scale);
                                    }
                                }
                            }
                        };
                        img.alt = o.goodsName;
                        img.src = o.imgUrl;
                        dl.innerHTML = html.join('');
                        dl.setAttribute('goodsid', o.goodsID);
                        o.specId && dl.setAttribute('specid', o.specId);
                        productList.appendChild(dl);
                        FYS('>dt>a', dl, true).appendChild(img);
                    });
                }
                function infoRender(o){
                    var p = document.createElement('p'), html = [];

                    if(o.remainKind){
                        html = ['�������ʣ���Ʒ��<span class="orange">', o.remainKind, '</span>�֣�', o.remainCount, '����'];
                    }else if(o.sumOfKind){
                        html = ['����<span>', o.sumOfKind, '</span>�ֻ�Ʒ��', o.sumOfAcount, '����<br/>��Ʒ�ϼƣ�<em>', o.sumOfPrice.toFixed(2), '</em>Ԫ'];
                    }
                    p.innerHTML = html.join('');
                    FYD.insertBefore(p, FYS('>a', purchaseInfo, true));
                }
                refresh();
                Alibar.purchaselistRefresh = refresh;
            },
            /**
             * ��ʼ��������ͨ�����µ�alitalk
             */
            tpInit: function(){
                FYE.on(FYS('li.topnav-tp', alibar, true), 'mouseenter', enterHandler);
                function enterHandler(){
                    var self = this, urls = [];
                    YAHOO.util.Get.css('http://style.c.aliimg.com/css/lib/fdev-v4/widget/web/alitalk-min.css');
                    if (typeof FD.widget.Alitalk === 'undefined') {
                        urls.push('http://style.c.aliimg.com/js/fdevlib/widget/alitalk/fdev-alitalk-v3.js');
                    }
                    if (typeof FD.widget.ShuntAlitalk === 'undefined') {
                        urls.push('http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/shuntalitalk-v2.js');
                    }
                    if (urls.length > 0) {
                        FD.common.request('jsonp', urls, {
                            onSuccess: function(o){
                                shuntInit();
                            }
                        });
                    } else {
                        shuntInit();
                    }
                    function shuntInit(){
                        new FD.widget.ShuntAlitalk('order-online', {
                            ruleId: 'ALITALK_INCALL_ROLE_CTP01',
                            remote: true,
                            attname: 'data-alitalk-shunt'
                        });
                    }
                    FYE.removeListener(this, 'mouseenter', enterHandler);
                }
            },
            /**
             * ������
             */
            traceInit: function(){
                window.aliclick &&
                FYE.on(FYS('a[data-trace]', alibar), 'mousedown', function(){
                    aliclick(this, '?tracelog=' + FYD.getAttribute(this, 'data-trace'));
                });
            }
        };

        //��¶�ӿ�
        Alibar.refresh = Alibar.refresh || emptyFn;
        Alibar.purchaselistRefresh = Alibar.purchaselistRefresh || emptyFn;
        FYE.onDOMReady(function(){
            alibar = alibar || FYG('alibar-v4');
            //�ж�HTML�ṹ�Ƿ��ϵ�ǰ�汾
            if (alibar) {
                for (var p in handlers) {
                    handlers[p]();
                }
            }
        });
    })(FD.sys.Alibar);
}

