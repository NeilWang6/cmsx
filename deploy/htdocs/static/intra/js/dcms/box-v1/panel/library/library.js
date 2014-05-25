/**
 * @author springyu
 * @userfor  ��ѯ����Ϣ����JS
 * @date  2012-12-25
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

(function($, D, panel) {
    var library = panel.library;
    /**
     * ������ؼ�չʾ�����߼�
     * @param {Object} o ��̨�������
     * @param {Object} content ҳ���Ŷ��� jQuery
     * @param {Object} option
     */
    library.showMessage = function(o, content, option) {
        var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
        template += '<div class="dcms-box-layoutcontent" data-eleminfo="<%=$data[i].eleminfo%>">';
        template += '<img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false"  />';
        template += '<br><span><%= $data[i].name%></span>';
        template += '</div>';
        template += '<% } %>';
        var data = o['dataList'];
        if(data) {
            var html = FE.util.sweet(template).applyData(data);
            var type = o['type'], pageNavStr = '', pageNav = $('#page_nav');
            var countPage = o['pageSize'];
            var $page = '';
            if(countPage > 0) {
                $page += '<div class="dcms-box-page fd-clr"';
                if(option) {
                    $page += (option.id ? (' id="' + option.id) + '"' : '') + (option.display ? (' style="display:' + option.display) + '"' : '');
                }
                $page += '><ul class="">';
                if(o['currentPage'] === 1) {
                    $page += '<li class="disabled"><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
                }
                if(o['currentPage'] !== 1) {
                    $page += '<li><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
                }

                $page += '<li>' + o['currentPage'] + ' / ' + countPage + '</li>';
                if(o['currentPage'] !== countPage) {
                    $page += '<li><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
                }
                if(o['currentPage'] === countPage) {
                    $page += '<li class="disabled"><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
                }
                $page += '</ul></div>';

            }
            content.append(html);
            content.after($page);

            if(data && data.length <= 0) {
                content.append('<div>��ѯ���Ϊ�գ�</div>');
            }
        } else {
            content.append('<div>��ѯ���Ϊ�գ�</div>');
        }
    };

    /**
     * �����ͼ���
     */
    library.libraryTypeInit = function(selected, fn) {
        var that = this, type = that.CONSTANTS.MODULE_LIBRARY_TYPE, options = '';
        if(!selected) {
            selected = "library";
        }
        for(var name in type) {
            if(selected === name) {
                if(fn && typeof fn === 'function') {
                    fn.call(that, selected);
                }
                options += '<option selected="selected" value="' + name + '">' + type[name] + '</option>'
            } else {
                options += '<option value="' + name + '">' + type[name] + '</option>'
            }

        }
        $('#library_type').append(options);
        $('#library_type').bind('change', function(event) {
            var that = this, self = $(that);
            if(fn && typeof fn === 'function') {
                fn.call(that, self.val());
            }

        })
    };
    library.CONSTANTS = $.extend({
        MODULE_LIBRARY_TYPE : {
            "library" : '�زĿ�',
            "synclib" : '���ÿ�',
            "personal" : '���˿�',
            "favorit" : '�ղ�'
        }
    }, library.CONSTANTS);

})(dcms, FE.dcms, FE.dcms.box.panel);
