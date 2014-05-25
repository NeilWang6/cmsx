/**
 * @author springyu
 * @userfor 设置模版
 * @date 2012-10-4
 */

;(function($, D) {

    var readyFun = [
    function() {
        $('#set_template').bind('click', function(event) {
            var oDialog = $('div.dialog-template-tag');
            var pageId = $('#template_tag_list').data('pageid');

            showTemplate({
                'page' : 1,
                'pageId' : pageId
            });
            $.use('ui-dialog', function() {
                oDialog.dialog({
                    modal : true,
                    shim : true,
                    center : true,
                    fadeOut : true
                });
            });
        });
    },
    function() {
        $('.close-btn', 'div.dialog-template-tag').bind('click', function(e) {
            e.preventDefault();
            var _self = $(this);
            _self.closest('div.dialog-template-tag').dialog('close');
        });
    }, /**
     * 对话框拖动
     */
    function() {
        $.use('ui-draggable', function() {
            var con = 'document';
            if($.browser.mozilla) {
                con = 'html';
            }
            $('div.dialog-template-tag').draggable({
                handle : '.nav',
                containment : con
            });
        });
    },
    function() {
        //分页事件
        $('div.template-page').delegate('a.elem', 'click', function(e) {
            e.preventDefault();
            var _self = $(this), _selfParent = _self.parent();
            var pageId = $('#template_tag_list').data('pageid');
            var keyword = $('#keyword').val();
            if(!_selfParent.hasClass('disabled')) {

                showTemplate({
                    'page' : _self.data('val'),
                    'pageId' : pageId,
                    'keyword' : keyword
                });
                return;
            }
        });
    },
    function() {
        $('#search-template').bind('click', function(event) {
            var pageId = $('#template_tag_list').data('pageid');
            var keyword = $('#keyword').val();
           // console.log(9999);
            showTemplate({
                'page' : 1,
                'pageId' : pageId,
                'keyword' : keyword
            });
        });
    }];
    var showTemplate = function(params) {
        var templateList = $('#template_tag_list'), templateBody = $('.template-body', templateList), templatePage = $('.template-page', templateList);
        templateBody.empty();
        templatePage.empty();
        $.post(D.domain + '/page/box/set_template_list.html?_input_charset=UTF8', params, function(json) {
            if(json && json.status === 'success') {
                var data = json.data;
               // console.log(data);
                if(data.dataList) {
                    var datalist = data.dataList;

                    var template = '<ul class="fd-clr">';
                    var temp = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
                    temp += ' <li>';
                    temp += ' <dl>';
                    temp += '  <dt class="image dl-preview"  data-id="<%=$data[i].templateId%>"  data-type="template">';
                    temp += '       <a href="#"><img src="<%=$data[i].thumbnail%>"/></a>';
                    temp += '   </dt>';
                    temp += '   <dd class="name"><%=$data[i].templateName%></dd>';
                    temp += '  <dd class="meta"><a href="#" class="author" data-keyword="<%=$data[i].userId%>" title=""><%=$data[i].userId%></a></dd>';
                    temp += '  </dl>';
                    temp += '  <div class="operation">';
                    temp += '         <a class="import dcms-box-btn-import" href="import_page.html?fromTemplate=<%=$data[i].templateId%>&pageId=<%=$data[i].pageId%>">导入</a>';
                    temp += '  </div>';
                    temp += '  </li>';
                    temp += '   <% } %>';
                    var html = FE.util.sweet(temp).applyData(datalist);
                    template += html;
                    template += '</ul>';
                    templateBody.append(template);
                    var current = parseInt(data.currentPage), sumPage = parseInt(data.pages);
                    if(data && sumPage && sumPage > 1) {
                        var pageHtml = '<div class=""><ul>';
                        if(current !== 1) {
                            pageHtml += '<li><a class="elem" data-val="1">首页</a></li>';
                            pageHtml += '<li><a class="elem" data-val="' + (current - 1) + '">上一页</a></li>';
                        } else {
                            pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">首页</a></li>';
                            pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">上一页</a></li>';
                        }
                        if(current !== sumPage) {
                            pageHtml += '<li><a class="elem" data-val="' + (current + 1) + '">下一页</a></li>';
                            pageHtml += '<li><a class="elem" data-val="' + sumPage + '">尾页</a></li>';
                        } else {
                            pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">下一页</a></li>';
                            pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">尾页</a></li>';
                        }

                        pageHtml += '<li><a class="desc">第' + data.currentPage + '页/共' + sumPage + '页</a></li>';
                        pageHtml += '</ul></div>';
                        templatePage.append(pageHtml);
                    }

                }
            }

        }, 'json');
    };

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });

})(dcms, FE.dcms);
