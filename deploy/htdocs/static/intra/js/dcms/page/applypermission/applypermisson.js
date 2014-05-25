/**
 * Ȩ�����빦��
 */
;(function($, D) {
    var readyFun = [
    function() {
        //��ʼ��ҳ��
        hideAll();
        $('input[type=radio]').each(function(index, obj) {
            obj.checked = false;
        });
        $('input[type=radio]').bind('mousedown', function(e) {
            e.preventDefault();
            var that = this, _self = $(this);
            hideAll();
            $('div.dcms-apply-' + _self.val()).show();
        });
        $('#site')[0].checked = true;
        $('.dcms-apply-site').show();
    },
    function() {//ҳ��id �����Ч��
        $('#page-id').bind('blur', function(e) {
            var that = this, _self = $(this);
            var pageIdTip = $('.page-id');
            if(_self.val()) {
                $.post(D.domain + '/admin/apply_check.html', {
                    'pageId' : _self.val(),
                    'type' : 'page'
                }, function(data) {
                    if(data) {
                        if(data.status === 'success') {
                            pageIdTip.html('');
                        }
                        if(data.status === 'fail') {
                            pageIdTip.html('ϵͳ������������Ч��id!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('�������ID������!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('�������ID:' + data.data + '������!');
                        }
                    }
                }, 'json');
            } else {
                pageIdTip.html('');
            }
        });
    },
    function() {
        //ҳ��url �����Ч��
        $('#page-url').bind('blur', function(e) {
            var that = this, _self = $(this);
            var pageIdTip = $('.page-url');
            var pageId = $('#page-id');
            if(_self.val()) {
                $.post(D.domain + '/admin/apply_check.html', {
                    'pageUrl' : _self.val(),
                    'type' : 'page'
                }, function(data) {
                    if(data) {
                        //console.log(data);
                        if(data.status === 'multi') {
                            var tip = "<div>������URL������������ѡ��</div>";
                            var _data = data['data'].urlList;
                            for(var i = 0; i < _data.length; i++) {
                                tip += '<div><input type="radio" class="page-url-tip" name="pageUrlTip" value="' + _data[i].id + '">' + _data[i].url + '</div>';
                            }
                            tip += "<div>���ϻ�û����Ҫ�ҵ�URL�����ṩ����ϸһ���URL.</div>";
                            pageIdTip.html(tip);
                            bindMulti();
                        }
                        if(data.status === 'success') {
                            var urlList = data['data'].urlList;
                            if(urlList) {
                                var _val = pageId.val(), ids, id;
                                for(var n = 0; n < urlList.length; n++) {
                                    id = urlList[n].id;
                                    if(_val) {
                                        ids = _val.split(',');
                                        if(ids.indexOf(id) === -1) {
                                            ids.push(id);
                                            pageId.val(ids);
                                        }
                                    } else {
                                        pageId.val(id);
                                    }
                                }
                            }
                            pageIdTip.html('');
                            return;
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('�������URL�����ڣ����������룡');
                            return;
                        }
                        if(data.status === 'fail') {
                            pageIdTip.html('ϵͳ������������Ч��URL!');
                            return;
                        }

                    }
                }, 'json');
            } else {
                pageIdTip.html('');
                return;
            }
        });
    },
    function() {
        //���ģ��ID ��Ч��
        $('#template-id').bind('blur', function() {
            var that = this, _self = $(this);
            var pageIdTip = $('.template-id');
            if(_self.val()) {
                $.post(D.domain + '/admin/apply_check.html', {
                    'templateId' : _self.val(),
                    'type' : 'template'
                }, function(data) {
                    if(data) {
                        //console.log(data);
                        if(data.status === 'success') {
                            pageIdTip.html('');
                        }
                        if(data.status === 'fail') {
                            pageIdTip.html('ϵͳ������������Ч��id!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('�������ID������!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('�������ID:' + data.data + '������!');
                        }
                    }
                }, 'json');
            } else {
                pageIdTip.html('');
            }
        });
        $('#template-code').bind('blur', function() {
            var that = this, _self = $(this);
            var pageIdTip = $('.template-code');
            if(_self.val()) {
                $.post(D.domain + '/admin/apply_check.html', {
                    'templateCode' : _self.val(),
                    'type' : 'template'
                }, function(data) {
                    if(data) {
                        //console.log(data);
                        if(data.status === 'success') {
                            pageIdTip.html('');
                        }
                        if(data.status === 'fail') {
                            pageIdTip.html('ϵͳ������������Ч��ģ�������!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('�������ģ�������������!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('�������ģ�������:' + data.data + '������!');
                        }
                    }
                }, 'json');
            } else {
                pageIdTip.html('');
            }
        });
    },
    function() {
        //����Ȩ��
        $.post(D.domain + '/admin/query_roles.html', function(json) {
            var oRole = $('#all-role');
            if(json && json.status === 'success') {
                var data = json.data, _option = '';
                for(var i = 0; i < data.length; i++) {
                    _option += '<option value="' + data[i].roleId + '">' + data[i].roleName + '</option>';
                }
                oRole.append(_option);
            }
        }, 'json');
    },
    function() {
        //����վ����
        $.post(D.domain + '/position/site_tree.html', function(json) {
            if(json && json.status === '200') {
                var data = json.data;
                if(data) {
                    cTree = new D.dTree('cTree', 'child');
                    cTree.add(0, -1, 'վ��ѡ��');
                    for(var code in data) {
                        cTree.add(code, data[code].parentId, data[code].name);
                    }
                    $('.site-tree').html(cTree.toString());
                    //cTree.openAll();
                    bindChecked();
                    var siteid = $("#dtree_hidden_Id").val();
                    if(siteid!="" && siteid!="0"){
                        $('.site-tree').find('input[type=checkbox]').each(function(i,e){
                        	if($(e).data("code")==siteid){
                        		$(e)[0].checked = true;
                        		$(e).trigger("click");
                        		$(e)[0].checked = true;
                        	}
                        });
                    }
                }
            }
        }, 'jsonp');

    },
    /**
     * ����Ȩ���¼�bind
     */
    function() {
        //�����ѡ�е�Ԫ���ƶ����ұ�����
        $('#all-role').bind('dblclick', function(e) {
            var that = this, $selectRole = $('#select-role');
            moveItem(that, $selectRole[0], false);
        });
        $('#add-role').bind('click', function(e) {
            var $self = $('#all-role'), $selectRole = $('#select-role');
            moveItem($self[0], $selectRole[0], false);
        });
        //���ұ�ѡ�е�Ԫ���ƶ����������
        $('#select-role').bind('dblclick', function(e) {
            var that = this, $selectRole = $('#all-role');
            moveItem(that, $selectRole[0], false);
        });
        $('#remove-role').bind('click', function(e) {
            var $self = $('#all-role'), $selectRole = $('#select-role');
            moveItem($selectRole[0], $self[0], false);
        });
    },
    /**
     * ��������Ȩ��
     */
    function() {
        $('#btn_submit').bind('click', function(e) {
            var oInput = $('input:checked'), _val = oInput.val(), code = '', name = '';
            if(_val === 'page') {
                code = $('#page-id').val();
                if(!code) {
                    alert('�ף�������ҳ��ID!');

                    return;
                }
            }
            if(_val === 'template') {
                code = $('#template-id').val();
                name = $('#template-code').val();
                if(!code && !name) {
                    alert('�ף�������ģ��ID��ģ�������!');
                    return;
                }
            }
            if(_val === 'operation') {
                var o$SelectRole = $('#select-role'), _selectRole = o$SelectRole[0];
                if(_selectRole) {
                    for(var i = 0; i < _selectRole.options.length; i++) {
                        code += _selectRole.options[i].value + ',';
                        name += _selectRole.options[i].text + ',';
                    }
                }
                if(!code) {
                    alert('�ף���ѡ����Ҫ��ͨ��Ȩ��!');
                    return;
                }

            }
            if(_val === 'site') {
                code = $('#site-id').val();
                name = $('#site-name').val();
                if(!code) {
                    alert('�ף���ѡ����Ҫ��ͨ��Ȩ��!');
                    return;
                }
            }
            $.post(D.domain + '/admin/add_apply_permission.html?_input_charset=UTF8', {
                'type' : _val,
                'code' : code,
                'name' : name
            }, function(json) {
                // console.log(json);
                jAlert(json);
            }, 'json');
            return;

        });
    }];
    var jAlert = function(json) {
        if(json) {
            if(json.status === 'success') {
                alert('����ɹ���');
                window.location.reload();
            } else {
                alert('�ύʧ�ܣ�');
            }

        }
    };
    /**
     * bind ѡ�а�ť�¼�
     */
    var bindChecked = function() {
        $('input[type=checkbox]', 'div.dtree').bind('click', function(e) {
            var self = $(this), chk = self[0].checked, arr, selfParent = self.parent(), chkCatalog;
            var $cName = $('#site-name'), $cId = $('#site-id');
            if(chk) {
                arr = findParentAndCheckedCatalog(selfParent);
                if(arr) {
                    chkCatalog = formatCatalog(arr);
                    (function() {
                        var valId = $cId.val();

                        if(valId) {
                            $cId.val(valId + ',' + chkCatalog.id);
                        } else {
                            $cId.val(chkCatalog.id);
                        }
                        valName = $cName.val();
                        if(valName) {
                            $cName.val(valName + ',' + chkCatalog.name);
                        } else {
                            $cName.val(chkCatalog.name);
                        }
                    })();
                }
            } else {
                arr = findParentAndUnCheckedCatalog(selfParent);
                if(arr) {
                    chkCatalog = formatCatalog(arr);
                    unCheckedCatalog(chkCatalog);
                    var chkId = chkCatalog.id, valId = $cId.val();

                    var _oInputs = $('input[type=checkbox]', $('#checkbox' + chkId).parent().next('.clip'));
                    //console.log(_oInputs);
                    _oInputs.each(function(index, obj) {
                        var cArray = findParentCatalog($(obj).parent());
                        chkCatalog = formatCatalog(cArray);
                        unCheckedCatalog(chkCatalog);
                    });
                }
            }
        });
    };
    var unCheckedCatalog = function(chkCatalog) {
        var $cName = $('#site-name'), $cId = $('#site-id'), valId = $cId.val(), id = chkCatalog.id;
        if(valId) {
            var n = valId.indexOf(id), idLen = valId.split(',').length;
            if(n === 0) {
                if(idLen === 1) {
                    $cId.val(valId.replace(id, ''));
                } else {
                    $cId.val(valId.replace(id + ',', ''));
                }
            } else {
                $cId.val(valId.replace(',' + id, ''));
            }
        }
        valId = $cId.val();
        var chkValIds = valId.split(',');
        if(valId && chkValIds) {
            for(var p = 0; p < chkValIds.length; p++) {
                var sites = formatCatalog(findParentCatalog($('#checkbox' + chkValIds[p]).parent()));

                var valName;
                if(valName) {
                    $cName.val(valName + ',' + sites.name);
                } else {
                    $cName.val(sites.name);
                }
                valName = $cName.val();
            }

        } else {
            $cName.val('');
        }

    };
    var formatCatalog = function(arr) {
        var len = arr.length - 1, showName = '', hideId = '', id;
        for(var i = len; i >= 0; i--) {
            if(i == 0) {
                //hideId += arr[i].id;
                showName += arr[i].name;
                id = arr[i].id;
            } else {
                // hideId += arr[i].id + ">";
                showName += arr[i].name + ">";
            }

        }
        return {
            id : id,
            name : showName
        };
    };
    var bindMulti = function() {
        $('.page-url-tip').bind('mousedown', function() {
            var _self = $(this), id = _self.val(), _pageId = $('#page-id'), _val = _pageId.val();
            if(_val) {
                ids = _val.split(',');
                if(ids.indexOf(id) === -1) {
                    ids.push(id);
                    _pageId.val(ids);
                }
            } else {
                _pageId.val(id);
            }
        });
    };
    var hideAll = function() {
        $('.page-url').html('');
        $('div.dcms-apply').each(function(index, obj) {
            var _self = $(this);
            _self.hide();
        });
        $('input[type=text]').each(function(index, obj) {
            var _self = $(this);
            _self.val('');
        });
    }
    /**
     * ���ѡ��Ԫ�ص�����parent�ڵ� ��ѡ������parent�ڵ�
     * @param {Object} target
     * @param {Object} arr
     */
    var findParentAndCheckedCatalog = function(target, arr) {
        var arr = arr || [], name, id, checkbox;
        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
            var oA = $('a.elem', target);
            name = oA.data('name');
            id = oA.data('code');
            checkbox = $('.checkbox', target);
            if(name) {
                if(checkbox[0]) {
                    checkbox[0].checked = true;
                }
                arr.push({
                    'name' : name,
                    'id' : id
                });
            }

        }
        if(target.parent().hasClass('dtree')) {
            return arr;
        }
        return arguments.callee(target.parent().prev(), arr);
    };
    /**
     * ���ѡ��Ԫ�ص�����parent�ڵ�
     * @param {Object} target
     * @param {Object} arr
     */
    var findParentCatalog = function(target, arr) {
        var arr = arr || [], name, id, checkbox;
        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
            var oA = $('a.elem', target);
            name = oA.data('name');
            id = oA.data('code');
            if(name) {
                arr.push({
                    'name' : name,
                    'id' : id
                });
            }

        }
        if(target.parent().hasClass('dtree')) {
            return arr;
        }
        return arguments.callee(target.parent().prev(), arr);
    };
    /**
     * ���ѡ��Ԫ�ص�����parent�ڵ㣬��ȥ����ѡ
     * @param {Object} target
     * @param {Object} arr
     */
    var findParentAndUnCheckedCatalog = function(target, arr) {
        var arr = arr || [], name, id, _target, _next;

        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
            var oClip = target.parent(), oChecked, oA = $('a.elem', target);

            name = oA.data('name');
            id = oA.data('code');
            if(name) {
                arr.push({
                    'name' : name,
                    'id' : id
                });
            }
            _next = target.next('.clip');

            if(_next && _next.length > 0) {
                $('input[type=checkbox]', _next).each(function(index, obj) {
                    obj.checked = false;
                });
            }
            oChecked = $('input:checked', oClip);
            if(oChecked.length > 0) {
                return arr;
            } else {
                _target = target.parent().prev();
                if(_target && _target.length > 0) {
                    var _checked = $('input[type=checkbox]', _target);
                    var $valId = $('#site-id'), _valId = $valId.val(), _code = _checked.data('code'), bln = true;
                    if(_valId) {
                        var temp = _valId.split(',');
                        //console.log(temp);
                        var index = temp.indexOf(_code + '');
                        //console.log(index);
                        if(index !== -1) {
                            bln = false;
                        }
                    }
                    if(bln && _checked && _checked.length > 0) {
                        _checked[0].checked = false;
                    }

                }

            }
            if(target.parent().hasClass('dtree')) {
                return arr;
            }
            return arguments.callee(_target, arr);
        }

        return arr;
    };

    /**
     * //�ƶ�ѡ�е���Ŀ selectʹ��
     * @param {Object} sObj
     * @param {Object} tObj
     * @param {Object} allFlg
     */
    var moveItem = function(sObj, tObj, allFlg) {
        if(sObj == null || tObj == null)
            return;
        var i = 0;
        //alert(sObj.length);
        while(sObj.length > i) {
            if(allFlg || sObj.options[i].selected) {
                addOption(tObj, sObj.options[i].text, sObj.options[i].value);
                sObj.remove(i);
            } else {
                i++;
            }
        }
        sObj.selectedIndex = -1;
        tObj.selectedIndex = -1;
        return;
    };
    var addOption = function(oListbox, sName, sValue) {
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(sName));

        if(arguments.length == 3) {
            oOption.setAttribute("value", sValue);
        }
        oListbox.appendChild(oOption);
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
