/**
 * 权限申请功能
 */
;(function($, D) {
    var readyFun = [
    function() {
        //初始化页面
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
    function() {//页面id 检查有效性
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
                            pageIdTip.html('系统出错，请输入有效的id!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('你输入的ID不存在!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('你输入的ID:' + data.data + '不存在!');
                        }
                    }
                }, 'json');
            } else {
                pageIdTip.html('');
            }
        });
    },
    function() {
        //页面url 检查有效性
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
                            var tip = "<div>有以下URL符合条件，请选择：</div>";
                            var _data = data['data'].urlList;
                            for(var i = 0; i < _data.length; i++) {
                                tip += '<div><input type="radio" class="page-url-tip" name="pageUrlTip" value="' + _data[i].id + '">' + _data[i].url + '</div>';
                            }
                            tip += "<div>以上还没有你要找的URL，请提供更详细一点的URL.</div>";
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
                            pageIdTip.html('你输入的URL不存在！请重新输入！');
                            return;
                        }
                        if(data.status === 'fail') {
                            pageIdTip.html('系统出错，请输入有效的URL!');
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
        //检查模版ID 有效性
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
                            pageIdTip.html('系统出错，请输入有效的id!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('你输入的ID不存在!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('你输入的ID:' + data.data + '不存在!');
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
                            pageIdTip.html('系统出错，请输入有效的模版调用名!');
                        }
                        if(data.status === 'notexist') {
                            pageIdTip.html('你输入的模版调用名不存在!');
                        }
                        if(data.status === 'unmatch') {
                            pageIdTip.html('你输入的模版调用名:' + data.data + '不存在!');
                        }
                    }
                }, 'json');
            } else {
                pageIdTip.html('');
            }
        });
    },
    function() {
        //加载权限
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
        //加载站点树
        $.post(D.domain + '/position/site_tree.html', function(json) {
            if(json && json.status === '200') {
                var data = json.data;
                if(data) {
                    cTree = new D.dTree('cTree', 'child');
                    cTree.add(0, -1, '站点选择');
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
     * 操作权限事件bind
     */
    function() {
        //把左边选中的元素移动到右边来。
        $('#all-role').bind('dblclick', function(e) {
            var that = this, $selectRole = $('#select-role');
            moveItem(that, $selectRole[0], false);
        });
        $('#add-role').bind('click', function(e) {
            var $self = $('#all-role'), $selectRole = $('#select-role');
            moveItem($self[0], $selectRole[0], false);
        });
        //把右边选中的元素移动到左边来。
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
     * 保存申请权限
     */
    function() {
        $('#btn_submit').bind('click', function(e) {
            var oInput = $('input:checked'), _val = oInput.val(), code = '', name = '';
            if(_val === 'page') {
                code = $('#page-id').val();
                if(!code) {
                    alert('亲，请输入页面ID!');

                    return;
                }
            }
            if(_val === 'template') {
                code = $('#template-id').val();
                name = $('#template-code').val();
                if(!code && !name) {
                    alert('亲，请输入模块ID或模块调用名!');
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
                    alert('亲，请选择需要开通的权限!');
                    return;
                }

            }
            if(_val === 'site') {
                code = $('#site-id').val();
                name = $('#site-name').val();
                if(!code) {
                    alert('亲，请选择需要开通的权限!');
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
                alert('保存成功！');
                window.location.reload();
            } else {
                alert('提交失败！');
            }

        }
    };
    /**
     * bind 选中按钮事件
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
     * 获得选中元素的所有parent节点 并选中所有parent节点
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
     * 获得选中元素的所有parent节点
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
     * 获得选中元素的所有parent节点，并去除勾选
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
     * //移动选中的项目 select使用
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
