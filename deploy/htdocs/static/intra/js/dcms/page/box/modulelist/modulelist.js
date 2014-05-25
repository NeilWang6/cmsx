/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-01-10
 */

;(function($, D) {
    var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [

    function() {
        //$('#js-search-page').submit();
        FE.dcms.doPage();
    },
    /**
     * 删除
     */
    function() {
        $('.delete').click(function(e) {
            e.preventDefault();
            if(confirm("确认删除?")) {
                var _this = $(this), moduleId = _this.data('module-id');
                $("#event_submit_do_searchModule").remove();
                var content = '<input type="hidden" name="event_submit_do_deleteModule" id="event_submit_do_searchModule" value="true"/>'
                searchForm.append(content);
                var content = '<input type="hidden" name="moduleId" id="moduleId" value="' + moduleId + '">';
                searchForm.append(content);
                 
                searchForm.submit();
            }

        });
    },
    function() {
        D.bottomAttr.loadModuleCatalog({'type':'module'},function(value) {
            var _data, url = D.domain + '/page/box/module_list.html?catalogId=';
            if(value && value.status === 'success') {
                _data = value.data;
                if(_data) {
                    mTree = new D.dTree('mTree');
                    mTree.add(0, -1, '全部区块模板', url + '0');
                    for(var i = 0, len = _data.length; i < len; i++) {
                        var obj = _data[i];
                        mTree.add(obj.code, obj.parentCode, obj.name, url + obj.code);
                    };
                    $('.dcms-box-content-tree').html(mTree.toString());
                    mTree.openAll();
                }
            }
        });
    },
    function() {
        $('#module-orderby').bind('change', function(e) {
            searchForm.submit();
        });
    }];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(dcms, FE.dcms);
