/**
 * 报名工具设计与查看页面接口
 */
;(function($, D) {
    var readyFun = [
    function() {
        var domain = $('#domain_cmsModule').val();
        $('.dcms-page-design').live('click', function(e) {
            e.preventDefault();
            var self = $(this), pageId = self.data('pageid');
            //console.log(D.EditPage.edit);
            //console.log('aaaa');
            $.post(domain + '/page/box/can_edit_page.html', {
                'pageId' : pageId
            }, D.EditPage.edit, 'jsonp');
        });
        $('.dcms-page-view').live('click', function(e) {
            e.preventDefault();
            var self = $(this), pageId = self.data('pageid');
            //location.target = "_blank";
            //location.href= domain + '/page/open/check_box_page.html?page_id=' + pageId;
            createForm(domain + '/page/open/check_box_page.html', {
                'pageId' : pageId
            });
        });
    }];
    /**
     *create 并提交表单
     * @param {Object} url
     * @param {Object} obj
     */
    var createForm = function(url, obj) {
        var temp = '<form id="dcms_submit_box" action="' + url + '" method="get" target="_blank">';

        temp += '<input type="hidden" name="page_id" value="' + obj.pageId + '"></form>';
        var oForm = $(temp);
        var tempForm = $('#dcms_submit_box');
        tempForm.remove();
        oForm.appendTo('body');
        oForm.trigger('submit');
    }
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
