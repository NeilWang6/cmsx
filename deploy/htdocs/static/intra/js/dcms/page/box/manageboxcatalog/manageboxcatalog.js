/**
 *����Ŀ��̨����ά��
 * ��springyu
 */
;(function($, D) {
    var globalParams = $.unparam(location.href, '&'), type = 'playout', url = D.domain + '/page/box/box_module_cell_catalog.html?_input_charset=UTF8';
    var catalogType = {
        'playout' : '����',
        'template' : 'ģ��',
        'module' : '���',
        'cell' : '�ؼ�',
        'grids' : 'դ��'
    }, request = function(params, _object) {
        $.post(url, params, function(text) {
            var self = this, _json;
            _json = $.parseJSON(text);
            if(_json && _json.status === 'success') {
                alert(_object.name + '�ɹ�!');
                loadCatalogTree();
                return;
            } else {
                alert(_object.name + 'ʧ��!');
                return;
            }
        });
    }, loadCatalogTree = function() {
        if(globalParams) {
            if(globalParams.catalog_type) {
                type = globalParams.catalog_type;
            }
            if(globalParams.catalogType) {
                type = globalParams.catalogType;
            }
        }
        if(type) {
            $('#catalog_type').val(type);
            $.post(D.domain + '/page/box/query_module_catalog.html', {
                'type' : type
            }, function(value) {
                var _data;
                if(value && value.status === 'success') {
                    _data = value.data;
                    if(_data) {
                        //console.log(_data);
                        mmTree = new D.dTree({
                            'name' : 'mmTree',
                            'isImg' : true,
                            icon : {
                                root : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                folder : 'http://img.china.alibaba.com/cms/upload/2012/699/874/478996_983650061.png',
                                folderOpen : 'http://img.china.alibaba.com/cms/upload/2012/051/974/479150_1184429892.png',
                                plus : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                plusBottom : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                minus : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                minusBottom : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                line : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                nlPlus : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                nlMinus : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                empty : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                node : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                join : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png',
                                joinBottom : 'http://img.china.alibaba.com/cms/upload/2012/151/974/479151_1184429892.png'

                            }
                        });
                        mmTree.add(0, -1, catalogType[type] + '��Ŀչʾ');
                        for(var i = 0, len = _data.length; i < len; i++) {
                            var _obj = _data[i];
                            mmTree.add(_obj.code, _obj.parentCode, _obj.name);
                        };
                        // console.log(mmTree.toString());
                        $('#mmTree').html(mmTree.toString());
                        //mmTree.openAll();
                    }
                }
            }, 'json');
        } else {
            // window.location.href=D.domain + '/position/index.html';
            $('#catalog_body').html('����������������ȷ�Ĳ���');
        }
    }, readyFun = [
    function() {
        $('#page').hide();
    },
    //������Ŀ��
    function() {
        loadCatalogTree();
    },
    function() {
        var treeFn = $('#dcms-tree-fn'), timeId;
        /****/
        // $('div.dTreeNode').bind('mouseenter',function(e){
        $("#mmTree").delegate('div.dTreeNode', "mouseenter", function() {
            var self = $(this), isWrap, $elem = self.find('.elem');

            isWrap = ($('.dcms-box-module-tree', self).length > 0);
            timeId = window.setTimeout(function() {
                if(!isWrap) {
                    treeFn.appendTo(self);
                }
                treeFn.css('display', 'inline-block');

                if($elem && $elem.length > 0) {//��Ԫ��Ĭ����ʾ�޸ĺ�ɾ��
                    $('.modify', self).css('display', 'inline-block');
                    $('.remove', self).css('display', 'inline-block');
                    //ֻ�� ������Ŀ��������������Ŀ
                    if($elem.data('parent') === 0) {
                        $('.add', self).css('display', 'inline-block');
                    } else {
                        $('.add', self).hide();
                    }
                    //�����ǰ�ڵ�Ϊ0���Ҹ��ڵ�Ϊ��1 ��ʾ���£�
                    if($elem.data('code') === 0 && $elem.data('parent') === -1) {
                        $('.add', self).css('display', 'inline-block');
                        $('.modify', self).hide();
                        $('.remove', self).hide();
                    }
                } else {//û�ҵ�Ԫ�أ�Ĭ����ʾ����
                    $('.add', self).css('display', 'inline-block');
                    $('.modify', self).hide();
                    $('.remove', self).hide();
                }
            }, 100);

        });
        $("#mmTree").delegate('div.dTreeNode', "mouseleave", function() {

            if(timeId) {
                window.clearTimeout(timeId);
            }
            treeFn.hide();
        });

    },
    function() {
        $('.catalog-body').delegate('a.btn-template-choose', 'click', function(event) {
            var $self = $(this), $elem = $self.closest('.dTreeNode').find('.elem'), htmlCode = '', parentId = 0, catalogType = type, $catalogType = $('#catalog_type');

            if($catalogType && $catalogType.length > 0) {
                catalogType = $catalogType.val();
            }
            if($self.hasClass('add')) {
                if($elem.data('code')) {
                    parentId = $elem.data('code');
                }
                htmlCode = '<form id="save_from"><input value="' + catalogType + '" type="hidden" id="catalog_type" name="catalogType"><input class="c_input" type="hidden" value="' + parentId + '" id="parent_id" name="parentId"><label>��Ŀ����</label><input class="c_input" type="text" placeholder="��������Ŀ!" id="catalog_name" name="catalogName"></form>';
                D.Msg['confirm']({
                    'title' : '�����Ŀ',
                    'body' : '<div class="dialog-content">' + htmlCode + '</div>',
                    'noclose' : true,
                    success : function(evt) {
                        var $name = $('#catalog_name');
                        if(!$name.val()) {
                            $name.focus();
                            alert('��������Ŀ!');
                            return;
                        }
                        //��������
                        request($('#save_from').serialize(), {
                            name : '����',
                            code : 'save'
                        });
                        evt.data.dialog.dialog('close');
                    }
                });
            }
            if($self.hasClass('modify')) {
                if($elem.data('parent') && $elem.data('parent') !== -1) {
                    parentId = $elem.data('parent');
                }
                htmlCode = '<form id="modify_from"><input value="' + catalogType + '" type="hidden" id="catalog_type" name="catalogType"><input type="hidden" id="parent_id" value="' + parentId + '" class="c_input" name="parentId"><input type="hidden" id="catalog_id" class="c_input" name="catalogId" value="' + $elem.data('code') + '"><label>��Ŀ����</label><input class="c_input" type="text" value="' + $elem.data('name') + '" placeholder="��������Ŀ!" id="catalog_name" name="catalogName"></form>';
                D.Msg['confirm']({
                    'title' : '�޸���Ŀ',
                    'body' : '<div class="dialog-content">' + htmlCode + '</div>',
                    'noclose' : true,
                    success : function(evt) {
                        var $name = $('#catalog_name');
                        if(!$name.val()) {
                            $name.focus();
                            alert('��������Ŀ!');
                            return;
                        }
                        //����
                        request($('#modify_from').serialize(), {
                            name : '����',
                            code : 'modify'
                        });
                        evt.data.dialog.dialog('close');
                    }
                });
            }
            if($self.hasClass('remove')) {
                D.Msg['confirm']({
                    'title' : '��ʾ',
                    'noclose' : true,
                    'body' : '<div class="dialog-content">�㼴��Ҫɾ����Ŀ<b>' + $elem.data('name') + '</b>����ȷ���Ƿ�ɾ��!</div>',
                    success : function(evt) {
                        //ɾ��
                        request('&catalogId=' + $elem.data('code') + '&command=delete', {
                            name : 'ɾ��',
                            code : 'delete'
                        });
                        evt.data.dialog.dialog('close');
                    }
                });
            }
        });
    }];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(dcms, FE.dcms);
