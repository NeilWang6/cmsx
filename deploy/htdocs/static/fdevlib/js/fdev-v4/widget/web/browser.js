/**
 * 提供“设为首页”“加入收藏夹”两个浏览器功能
 * @author: Edgar 110524
 * @update: Denis 修改组件名为"web-browser" ---- 2011-09-20
 * @update  chuangui.xiecg 修复360极速浏览器下点击无反应的bug
 */
(function($, Util){
    /**
     * 设为首页
     * */
    Util.setHome = function( url ){
        url = url ? url : window.location.href;
        try {
            document.body.style.behavior='url(#default#homepage)';
            document.body.setHomePage(url);
        } catch(e) {
            if(window.sidebar) {
                if(window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch(e) {
                        alert("该操作被浏览器拒绝，假如想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
                    }
                }
                var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage',url);
            } else {
                alert('设为首页失败，请手动设置');
            }
        }
    };
    
    /**
     * 加入收藏夹
     * */
    Util.addBookmark = function( url, title ){
        url = url ? url : window.location.href;
        title = title ? title : document.title;
        if ( window.sidebar && window.sidebar.addPanel ){ //mozilla
            window.sidebar.addPanel( title, url, '' );
        } else if ( $.util.ua.ie && window.external&&typeof window.external.AddFavorite!='undefined' ) { //msie msie下window.external.AddFavorite为unknown，极速浏览器下为undefined
			window.external.AddFavorite( url, title );
        } else {
            alert('由于您的浏览器不支持自动设置功能\n请按快捷键(Ctrl+D)手工收藏');
        }
    };
    
    $.add('web-browser');
})(jQuery, FE.util);
