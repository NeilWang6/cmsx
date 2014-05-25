/**
 * @package FD.app.cms.rule.manage
 * @author: hongss
 * @Date: 2011-03-09
 */


(function($, D){
    var disDialogEl = $('#js-distribute-user-dialog'),
    modifyDialogEl = $('#js-modify-role-dialog'),
    confirmEl = $('#dcms-message-confirm'),
    awakeEl = $('#dcms-message-awake'),
    url = D.domain + '/admin/manage_role.html',
    delKeyEl = $('#added-user-id-or-name', disDialogEl),
    tbody = $('.dcms-grid tbody', disDialogEl),
    roleId, dialogObj,
    readyFun = [
        /**
         * 操作层浮出、隐藏
         */
        function(){
            var gridOperationsWrap = $('#manage-role-operations'),
            modObj = $('.dcms-page-module'),
            timeId;
            
            $('.dcms-search-list tbody').delegate("tr", "mouseenter", function(){
                var container = $('td:last-child',$(this)),
                isWrap = ($('.dcms-grid-operations-wrap', container).length>0);
                timeId = window.setTimeout(function(){
                    if (!isWrap) {
                        gridOperationsWrap.appendTo(container);
                    }
                    gridOperationsWrap.fadeIn();
                }, 300);
            });
            $('.dcms-search-list tbody').delegate("tr", "mouseleave", function(){
                if(timeId){
                    window.clearTimeout(timeId);
                }
                gridOperationsWrap.hide();
            });
            
        },
        /**
         * 用户权限设置 tabs 切换
         */
        function(){
            var tabEl = $('#js-tabs-1st', disDialogEl);
            $.use('ui-tabs',function(){
                tabEl.tabs({
                    isAutoPlay: false,
                    event: 'click',
                    titleSelector: '.dcms-tab-t',
                    boxSelector: '.dcms-tab-b'
                });
            });
        },
        /**
         * 角色 - 新增用户
         */
        function(){
            var showDisDialogEls = $('.js-manage-role-distribute'), //分配用户
            closeEls = $('.close-btn, .cancel-btn', disDialogEl)
                       .add('.close-btn, .cancel-btn', modifyDialogEl),  //对话框中的“关闭”和“取消”按钮
            addSearchBtn = $('#js-add-user-search', disDialogEl),
            keyWordsEl = $('#add-user-id-or-name', disDialogEl),
            addUserListEl = $('.add-user-list', disDialogEl),
            addedUserListEl = $('.added-user-list', disDialogEl),
            addedUserLis = $('li', addedUserListEl),
            delBtns = $('.dcms-del-btn', addedUserListEl);
            //点击“分配用户”
            showDisDialogEls.live('click', function(e){
                e.preventDefault();
                roleId = $(this).parents('tr').data('roleid');
                //清空所有内容
                keyWordsEl.val('');
                addUserListEl.html('');
                addedUserListEl.html('');
                tbody.html('');
                delKeyEl.val('');
                
                //显示“分配用户”浮出框
                dialogObj = disDialogEl.dialog({
                    fixed: true,
                    center: true
                });
            });
            
            //对话框中的取消、关闭按钮
            closeEls.bind('click', function(e){
                e.preventDefault();
                dialogObj.dialog('close');
            });
            
            //右侧已选择用户框内的元素移上去后出现“删除”按钮
            addedUserLis.live('mouseenter', function(e){
                $(this).find('.dcms-del-btn').fadeIn(200);
            });
            addedUserLis.live('mouseleave', function(e){
                $(this).find('.dcms-del-btn').fadeOut(200);
            });
            
            //右侧已选择用户框内“删除”按钮,绑定事件
            delBtns.live('click', function(e){
                $(this).parents('li').remove();
            });
            
            //搜索需要增加的用户
            addSearchBtn.click(function(e){
                var keyWords = encodeURIComponent(keyWordsEl.val());
                //判断是否有输入搜索条件
                if (!keyWords){
                    D.Message.awake(awakeEl, {
                        relatedEl: keyWordsEl,
                        msg: '请输入搜索条件'
                    });
                    return;
                }
                //发送搜索请求
                var data = {};  
                data['action'] = 'RoleManageAction';
                data['event_submit_do_Search_Role_User'] = true;
                data['userId'] = keyWords;
                data['roleId'] = roleId;
                data['retType'] = 'json';
                $.post(url, data, function(o){
                    o = $.parseJSON(o);
                    if (o.status==='success'){
                        var data = o.data,
                        strHtml = '';
                        if (data.length===0){
                            D.Message.awake(awakeEl, {
                                relatedEl: addUserListEl,
                                msg: '没有搜索到相关数据'
                            });
                            return;
                        }
                        for (var i=0, l=data.length; i<l; i++){
                            var userId = data[i].userId;
                            strHtml += '<li><input id="dcms-user-'+i+'" type="checkbox" value="'+userId
                                     + '" /><label for="dcms-user-'+i+'">'+userId+'</label></li>';
                        }
                        addUserListEl.html(strHtml);
                    } else {
                        D.Message.awake(awakeEl, {
                            relatedEl: keyWordsEl,
                            msg: o.msg
                        });
                    }
                });
            });
            
            //将可增加用户的列表中增加到已增加用户列表中
            var addUserBtn = $('.add-user-btn', disDialogEl);
            addUserBtn.click(function(e){
                e.preventDefault();
                var addUserEls = $('input:checked', addUserListEl),
                addUsers = [], 
                addedUsers = getAddedUsers();
                //判断是是否已选择需要增加的用户
                if (addUserEls.length<=0){
                    D.Message.awake(awakeEl, {
                        relatedEl: addUserListEl,
                        msg: '请选择需要增加的用户！'
                    });
                    return;
                }
                
                //将左侧备选框中已选的用户移到右侧框内
                addUserEls.each(function(i){
                    addUsers.push($(this).val());
                });
                for(var i=0, l=addUsers.length; i<l; i++){
                    var exist = false,
                    strHtml = '';
                    for (var j=0, len=addedUsers.length; j<len; j++){
                        if (addUsers[i]==addedUsers[j]){
                            exist = true;
                            return;
                        }
                    }
                    if (exist===false){
                        strHtml = '<li><span class="added-user-id">'+addUsers[i]
                                + '</span><button class="dcms-del-btn">移除</button></li>';
                        addedUserListEl.append(strHtml);
                    }
                }
            });
            
            //保存右侧框内已经选择的用户
            var saveAddBtn = $('#js-add-save', disDialogEl);
            saveAddBtn.click(function(){
                var addedUsers = getAddedUsers(),
                data = {};   
                if (addedUsers.length<=0){
                    D.Message.awake(awakeEl, {
                        relatedEl: addedUserListEl,
                        msg: '请选择需要保存的用户！'
                    });
                    return;
                }
                
                data['action'] = 'RoleManageAction';
                data['event_submit_do_Update_User_Role'] = true;
                data['roleId'] = roleId;
                data['userId'] = addedUsers.join(',');
                data['retType'] = 'json';
                $.post(url, data, function(o){
                    o = $.parseJSON(o);
                    if (o.status==='success'){
                        addedUserListEl.html('');
                        addUserListEl.html('');
                        D.Message.awake(awakeEl, {
                            relatedEl: addedUserListEl,
                            msg: '保存成功'
                        });
                    } else {
                        D.Message.awake(awakeEl, {
                            relatedEl: addedUserListEl,
                            msg: o.msg
                        });
                    }
                });
            });
            
            function getAddedUsers(){
                var addedUserEls = $('.added-user-id', addedUserListEl),
                addedUsers = [];
                addedUserEls.each(function(i){
                    addedUsers.push($(this).text());
                });
                return addedUsers;
            }
        },
        /**
         * 角色 - 删除用户
         */
        function(){
            var userListTr = $('.dcms-grid tr', disDialogEl),
            delBtns = $('.dcms-grid .dcms-del-btn', disDialogEl);
            
            //隐藏、显示“删除”按钮
            userListTr.live('mouseenter', function(e){
                $(this).find('.dcms-del-btn').fadeIn(200);
            });
            userListTr.live('mouseleave', function(e){
                $(this).find('.dcms-del-btn').fadeOut(200);
            });
            
            //“删除”按钮事件
            delBtns.live('click', function(){
                var tr = $(this).parents('tr'),
                userId = $('td:first-child', tr).text();
                D.Message.confirm(confirmEl, {
                    title: '移除用户',
                    msg: '此操作不能返回，确认要移除用户吗？',
                    enter: function(){
                        var data = {};  //=pingchun,asdf&=4 
                        data['action'] = 'RoleManageAction';
                        data['event_submit_do_Delete_Role_User'] = true;
                        data['userId'] = userId;
                        data['roleId'] = roleId;
                        data['retType'] = 'json';
                        $.post(url, data, function(o){
                            o = $.parseJSON(o);
                            if (o.status==='success'){
                                D.Message.awake(awakeEl, {
                                    relatedEl: disDialogEl,
                                    msg: '删除成功'
                                });
                                tr.remove();
                            } else {
                                D.Message.awake(awakeEl, {
                                    relatedEl: disDialogEl,
                                    msg: o.msg
                                });
                            }
                        });
                    }
                });
            });
            
            //搜索需要移除的用户
            var delSearchBtn = $('#js-del-search', disDialogEl);
            //delKeyEl = $('#added-user-id-or-name', disDialogEl),
            //tbody = $('.dcms-grid tbody', disDialogEl);
            delSearchBtn.click(function(){
                var keyWords = encodeURIComponent(delKeyEl.val());
                //判断是否有输入搜索条件
                if (!keyWords){
                    D.Message.awake(awakeEl, {
                        relatedEl: delKeyEl,
                        msg: '请输入搜索条件'
                    });
                    return;
                }
                //发送搜索请求
                var data = {}; 
                data['action'] = 'RoleManageAction';
                data['event_submit_do_Search_Role_Has_User'] = true;
                data['userId'] = keyWords;
                data['roleId'] = roleId;
                data['retType'] = 'json';
                $.post(url, data, function(o){
                    o = $.parseJSON(o);
                    if (o.status==='success'){
                        var data = o.data,
                        strHtml = '';
                        if (data.length===0){
                            D.Message.awake(awakeEl, {
                                relatedEl: tbody,
                                msg: '没有搜索到相关数据'
                            });
                            return;
                        }
                        for (var i=0, l=data.length; i<l; i++){
                            var user = data[i];
                            strHtml += '<tr><td class="user-id">'+user.userId+'</td><td class="user-name">'+user.fullName
                                     + '</td><td class="department">'+user.depName+'</td><td class="td-del-btn">'
                                     + '<button class="dcms-del-btn">删除</button></td></tr>';
                        }
                        tbody.html(strHtml);
                    } else {
                        D.Message.awake(awakeEl, {
                            relatedEl: delKeyEl,
                            msg: o.msg
                        });
                    }
                });
            });
        },
        /**
         * 角色 - 新增或修改
         */
        function(){
            var showModifyRoleDialogEls = $('.js-manage-role-modify, #js-add-role'),
            roleNameInput = $('#js-role-name', modifyDialogEl),
            roleDescriptionInput = $('#js-role-description', modifyDialogEl),
            popChooseBoxes = $('.js-choose-popedom', modifyDialogEl),
            saveBtn = $('#js-save-role-btn', modifyDialogEl);
            
            showModifyRoleDialogEls.live('click', function(e){
                e.preventDefault();
                var parent = $(this).parents('tr');
                roleId = parent.data('roleid');
                if (roleId){
                    var data = {}; 
                    data['action'] = 'RoleManageAction';
                    data['event_submit_do_Init_edit_Role'] = true;
                    data['roleId'] = roleId;
                    data['retType'] = 'json';
                    $.post(url, data, function(o){
                        o = $.parseJSON(o);
                        if (o.status==='success'){
                            var data = o.data,
                            permIds = data.permList;
                            roleNameInput.val(data.roleName);
                            roleDescriptionInput.val(data.description);
                            
                            //对已经选择的权限打上勾
                            popChooseBoxes.attr('checked', false);
                            if (permIds){
                                popChooseBoxes.each(function(){
                                    var el = $(this),
                                    val = el.val();
                                    for (var i=0, l=permIds.length; i<l; i++){
                                        if (val==permIds[i]){
                                            el.attr('checked', true);
                                            return;
                                        }
                                    }
                                });
                            }
                            
                            dialogObj = modifyDialogEl.dialog({
                                fixed: true,
                                center: true
                            });
                        } else {
                            D.Message.awake(awakeEl, {
                                relatedEl: parent,
                                msg: '因'+o.msg+', 获取数据失败！'
                            });
                        }
                    });
                } else {
                    dialogObj = modifyDialogEl.dialog({
                        fixed: true,
                        center: true,
                        open: function(){
                            roleNameInput.val('');
                            roleDescriptionInput.val('');
                            popChooseBoxes.attr('checked', false);
                        }
                    });
                }
            });
            
            //保存修改、新增的角色信息
            saveBtn.click(function(e){
                var roleName = encodeURIComponent(roleNameInput.val()),
                roleDescription = encodeURIComponent(roleDescriptionInput.val()),
                popCheckedBoxes = popChooseBoxes.filter(':checked'),
                permIds = [], data={};
                popCheckedBoxes.each(function(){
                    permIds.push($(this).val());
                });
                
                if (roleId){
                    data['roleId'] = roleId;
                    data['event_submit_do_Edit_Role_Permission'] = true;
                } else {
                    data['event_submit_do_Create_Role'] = true;
                } 
                data['action'] = 'RoleManageAction';
                data['roleName'] = roleName;
                data['description'] = roleDescription;
                data['permissionCode'] = permIds.join(',');
                data['retType'] = 'json';
                $.post(url, data, function(o){
                    o = $.parseJSON(o);
                    if (o.status==='success'){
                        D.Message.confirm(confirmEl, {
                            title: '保存成功',
                            msg: '数据保存成功！',
                            enter: function(){
                                window.location.reload();
                            },
                            cancel: function(){
                                window.location.reload();
                            }
                        });
                    } else {
                        D.Message.awake(awakeEl, {
                            relatedEl: modifyDialogEl,
                            msg: o.msg
                        });
                    }
                });
            });
        },
        /**
         * 角色 - 删除
         */
        function(){
            var delBtns = $('.js-manage-role-delate');
            delBtns.live('click', function(e){
                e.preventDefault();
                var parent = $(this).parents('tr'),
                parPrev = parent.prev();
                roleId = parent.data('roleid');
                D.Message.confirm(confirmEl, {
                    title: '删除角色',
                    msg: '此操作不能返回，确定要删除该角色吗？',
                    enter: function(){
                        var data = {};
                        data['action'] = 'RoleManageAction';
                        data['event_submit_do_Delete_Role'] = true;
                        data['roleId'] = roleId;
                        data['retType'] = 'json';
                        $.post(url, data, function(o){
                            o = $.parseJSON(o);
                            if (o.status==='success'){
                                parent.remove();
                                D.Message.awake(awakeEl, {
                                    relatedEl: parPrev,
                                    msg: '删除成功'
                                });
                            } else {
                                D.Message.awake(awakeEl, {
                                    relatedEl: parent,
                                    msg: '删除失败：'+o.msg
                                });
                            }
                        });
                    }
                });
            });
        }
    ];
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                 readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    
})(dcms, FE.dcms);