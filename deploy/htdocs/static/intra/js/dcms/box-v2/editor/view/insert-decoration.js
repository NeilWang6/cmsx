/**
 * @author shanshan.hongss
 * @userfor 插入编辑所需元素
 * @date  2013.08.20
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    var EMPTY_CSS_URL = ED.config.STYLE_URL_HOST+'app/tools/css/dcms/module/box/empty.css',
        //layout菜单操作
        LAYOUT_COVER_HTML = '<div id="crazy-box-cover-layout" class="cover-crazy-box">\
                                <dl class="area-opt">\
                                    <dt><em class="title">布局</em></dt><dd class="icon moveup" title="上移"></dd><dd class="icon movedown" title="下移"></dd><dd class="icon add" title="添加"></dd><dd class="icon delect" title="删除"></dd><dd class="icon more">\
                                        <ul class="list-more">\
                                            <li class="copy">复制</li>\
                                        </ul></dd></dl></div>',
        //组件菜单操作
        MODULE_COVER_HTML = '<div id="crazy-box-cover-module" class="cover-crazy-box">\
                                <div class="con-width"><em class="width"></em></div>\
                                <dl class="area-opt">\
                                    <dt class="normal"><em class="title">组件</em></dt><dt class="public"><em class="title">公用区块</em></dt><dd class="icon moveup" title="上移"></dd><dd class="icon movedown" title="下移"></dd><dd class="icon add" title="添加"></dd><dd class="icon delect" title="删除"></dd><dd class="icon more">\
                                        <ul class="list-more">\
                                            <li class="replace">更换组件</li>\
                                            <li class="copy">复制</li>\
                                            <li class="setpublic">设为公用</li>\
                                            <li class="show"><a target="_black" data-href="'+D.domain+'/page/box/public_block_list.html?action=public_block_action&event_submit_do_query_public_block=true&ids=" href="#">查看</a></li>\
                                            <li class="off-made untext"></li>\
                                        </ul></dd></dl><div class="main"></div></div>'
        //内容编辑菜单操作
        EDIT_COVER_HTML = '<div id="crazy-box-cover-dataedit" class="cover-crazy-box-edit">\
                                <dl class="area-opt">\
                                    <dt class="info">公用区块不可编辑</dt>\
                                    <dd class="data-more join-data" title="添加数据">添加数据</dd>\
                                    <dd class="edit-define" title="编辑源代码">编辑源代码</dd>\
                                    <dd class="edit-option" title="编辑内容">编辑内容</dd>\
                                    <dd class="attr">组件属性</dd>\
                                </dl>\
                                <div class="main"></div></div>',
        CON_ERROR_MESSAGE = '<div id="container-error-msg"></div>',   //错误信息展示容器
    readyFun = [
        //插入CSS
        function(doc){
            $('<link rel="stylesheet" href="'+EMPTY_CSS_URL+'" />').appendTo(doc.find('head'));
        },
        //插入高亮元素
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