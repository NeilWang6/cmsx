/**
 *
 */
;(function($, D) {
    var readyFun = [
    function() {
        //console.log(4444);
        var obj = $.unparam(location.href, '&');
        
        if(obj && (obj.type === 'module' || obj.type === 'cell')) {
            $('#catalog-type').val(obj.type);
            D.bottomAttr.loadModuleCatalog({
                'type' : obj.type
            }, function(value) {
                var _data;
                if(value && value.status === 'success') {
                    _data = value.data;
                    
                    if(_data) {
                        //console.log(_data);
                        mmTree = new D.dTree('mmTree');
                        mmTree.add(0, -1, obj.type+'类目根节点');
                        for(var i = 0, len = _data.length; i < len; i++) {
                            var _obj = _data[i];
                            mmTree.add(_obj.code, _obj.parentCode, _obj.name);
                        };
                        // console.log(mmTree.toString());
                        $('#mmTree').html(mmTree.toString());
                        mmTree.openAll();
                    }
                }
            });
        } else {
           // window.location.href=D.domain + '/position/index.html';
            $('#content').html('参数错误，请输入正确的参数');
        }

    },
    function() {
        var treeFn = $('#dcms-tree-fn'), timeId;
        // $('div.dTreeNode').bind('mouseenter',function(e){
        $("div.dTreeNode").bind("mouseenter", function() {
            var self = $(this), isWrap;
            isWrap = ($('.dcms-box-module-tree', self).length > 0);
            timeId = window.setTimeout(function() {
                if(!isWrap) {
                    treeFn.appendTo(self);
                }
                treeFn.css('display', 'inline-block');
            }, 300);

        });
        $("div.dTreeNode").bind("mouseleave", function() {

            if(timeId) {
                window.clearTimeout(timeId);
            }
            treeFn.hide();
        });
    },
    function() {
        $('button', '.dcms-box-module-tree').bind('click', function(e) {
            e.preventDefault();
            var self = $(this), _node = self.closest('div.dTreeNode'), _elem = $('a.elem', _node);

            if(self.hasClass('add')) {
                $('#parentId').val('');
                $('#catalogId').val('');
                $('#catalogName').val('');
                $('#parentId').val(_elem.data('code'));
            }
            if(self.hasClass('modify')) {
                $('#parentId').val('');
                $('#catalogId').val('');
                $('#parentId').val(_elem.data('parent'));
                $('#catalogId').val(_elem.data('code'));
                $('#catalogName').val(_elem.data('name'));
            }
            var oDialog = $('#dForm');
            $.use('ui-dialog', function() {
                oDialog.dialog({
                    modal : true,
                    shim : true,
                    center : true,
                    fadeOut : true
                });
            });
        })
        //$('button.modify', 'div.dialog-body').closest('div.dialog-body').dialog('close');
    },
    function() {
        $('a.close-btn').bind('click', function(e) {
            e.preventDefault();
            var self = $(this);
            self.closest('div.dialog-body').dialog('close');
        });
        $('#m_body_btn_cancel').bind('click', function(e) {
            e.preventDefault();
            var self = $(this);
            self.closest('div.dialog-body').dialog('close');
        });
        $('#m_body_btn_ok').bind('click', function(e) {
            e.preventDefault();
            var json = {};
            $('input').each(function(index, obj) {
                if(obj && obj.name) {
                    json[obj.name] = obj.value;
                }

            });
             
            $.ajax({
                url : D.domain + '/page/box/box_module_cell_catalog.html?_input_charset=UTF8',
                type : "POST",
                data:$.param(json),
                async : false,
                success : function(_data) {
                    var self = this, _json;
                   
                    _json = $.parseJSON(_data);
                     if (_json&&_json.status==='success'){
                         alert('保存成功!');
                         window.location.reload();
                     } else {
                         alert('保存失败!');
                     }
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    alert("连接超时请重试！");
                }
            });
        })
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
