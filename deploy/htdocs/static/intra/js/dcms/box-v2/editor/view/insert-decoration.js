/**
 * @author shanshan.hongss
 * @userfor ����༭����Ԫ��
 * @date  2013.08.20
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    var EMPTY_CSS_URL = ED.config.STYLE_URL_HOST+'app/tools/css/dcms/module/box/empty.css',
        //layout�˵�����
        LAYOUT_COVER_HTML = '<div id="crazy-box-cover-layout" class="cover-crazy-box">\
                                <dl class="area-opt">\
                                    <dt><em class="title">����</em></dt><dd class="icon moveup" title="����"></dd><dd class="icon movedown" title="����"></dd><dd class="icon add" title="���"></dd><dd class="icon delect" title="ɾ��"></dd><dd class="icon more">\
                                        <ul class="list-more">\
                                            <li class="copy">����</li>\
                                        </ul></dd></dl></div>',
        //����˵�����
        MODULE_COVER_HTML = '<div id="crazy-box-cover-module" class="cover-crazy-box">\
                                <div class="con-width"><em class="width"></em></div>\
                                <dl class="area-opt">\
                                    <dt class="normal"><em class="title">���</em></dt><dt class="public"><em class="title">��������</em></dt><dd class="icon moveup" title="����"></dd><dd class="icon movedown" title="����"></dd><dd class="icon add" title="���"></dd><dd class="icon delect" title="ɾ��"></dd><dd class="icon more">\
                                        <ul class="list-more">\
                                            <li class="replace">�������</li>\
                                            <li class="copy">����</li>\
                                            <li class="setpublic">��Ϊ����</li>\
                                            <li class="show"><a target="_black" data-href="'+D.domain+'/page/box/public_block_list.html?action=public_block_action&event_submit_do_query_public_block=true&ids=" href="#">�鿴</a></li>\
                                            <li class="off-made untext"></li>\
                                        </ul></dd></dl><div class="main"></div></div>'
        //���ݱ༭�˵�����
        EDIT_COVER_HTML = '<div id="crazy-box-cover-dataedit" class="cover-crazy-box-edit">\
                                <dl class="area-opt">\
                                    <dt class="info">�������鲻�ɱ༭</dt>\
                                    <dd class="data-more join-data" title="�������">�������</dd>\
                                    <dd class="edit-define" title="�༭Դ����">�༭Դ����</dd>\
                                    <dd class="edit-option" title="�༭����">�༭����</dd>\
                                    <dd class="attr">�������</dd>\
                                </dl>\
                                <div class="main"></div></div>',
        CON_ERROR_MESSAGE = '<div id="container-error-msg"></div>',   //������Ϣչʾ����
    readyFun = [
        //����CSS
        function(doc){
            $('<link rel="stylesheet" href="'+EMPTY_CSS_URL+'" />').appendTo(doc.find('head'));
        },
        //�������Ԫ��
        function(doc){
            doc.find('body').append( LAYOUT_COVER_HTML + MODULE_COVER_HTML + EDIT_COVER_HTML + CON_ERROR_MESSAGE );
        }
    ];
    ED.insertDecoration = function(iframeDoc){
        for (var i=0, l=readyFun.length; i<l; i++) {
            //try {
                readyFun[i].call(this, iframeDoc);
            /*} catch(e) {
                if (console.log) {
                    console.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }*/
        }
    }
})(dcms, FE.dcms, FE.dcms.box.editor);