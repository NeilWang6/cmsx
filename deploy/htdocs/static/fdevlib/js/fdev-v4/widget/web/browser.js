/**
 * �ṩ����Ϊ��ҳ���������ղؼС��������������
 * @author: Edgar 110524
 * @update: Denis �޸������Ϊ"web-browser" ---- 2011-09-20
 * @update  chuangui.xiecg �޸�360����������µ���޷�Ӧ��bug
 */
(function($, Util){
    /**
     * ��Ϊ��ҳ
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
                        alert("�ò�����������ܾ������������øù��ܣ����ڵ�ַ�������� about:config,Ȼ���� signed.applets.codebase_principal_support ֵ��Ϊtrue");
                    }
                }
                var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage',url);
            } else {
                alert('��Ϊ��ҳʧ�ܣ����ֶ�����');
            }
        }
    };
    
    /**
     * �����ղؼ�
     * */
    Util.addBookmark = function( url, title ){
        url = url ? url : window.location.href;
        title = title ? title : document.title;
        if ( window.sidebar && window.sidebar.addPanel ){ //mozilla
            window.sidebar.addPanel( title, url, '' );
        } else if ( $.util.ua.ie && window.external&&typeof window.external.AddFavorite!='undefined' ) { //msie msie��window.external.AddFavoriteΪunknown�������������Ϊundefined
			window.external.AddFavorite( url, title );
        } else {
            alert('���������������֧���Զ����ù���\n�밴��ݼ�(Ctrl+D)�ֹ��ղ�');
        }
    };
    
    $.add('web-browser');
})(jQuery, FE.util);
