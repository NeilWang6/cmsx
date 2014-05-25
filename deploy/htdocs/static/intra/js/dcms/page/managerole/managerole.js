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
         * �����㸡��������
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
         * �û�Ȩ������ tabs �л�
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
         * ��ɫ - �����û�
         */
        function(){
            var showDisDialogEls = $('.js-manage-role-distribute'), //�����û�
            closeEls = $('.close-btn, .cancel-btn', disDialogEl)
                       .add('.close-btn, .cancel-btn', modifyDialogEl),  //�Ի����еġ��رա��͡�ȡ������ť
            addSearchBtn = $('#js-add-user-search', disDialogEl),
            keyWordsEl = $('#add-user-id-or-name', disDialogEl),
            addUserListEl = $('.add-user-list', disDialogEl),
            addedUserListEl = $('.added-user-list', disDialogEl),
            addedUserLis = $('li', addedUserListEl),
            delBtns = $('.dcms-del-btn', addedUserListEl);
            //����������û���
            showDisDialogEls.live('click', function(e){
                e.preventDefault();
                roleId = $(this).parents('tr').data('roleid');
                //�����������
                keyWordsEl.val('');
                addUserListEl.html('');
                addedUserListEl.html('');
                tbody.html('');
                delKeyEl.val('');
                
                //��ʾ�������û���������
                dialogObj = disDialogEl.dialog({
                    fixed: true,
                    center: true
                });
            });
            
            //�Ի����е�ȡ�����رհ�ť
            closeEls.bind('click', function(e){
                e.preventDefault();
                dialogObj.dialog('close');
            });
            
            //�Ҳ���ѡ���û����ڵ�Ԫ������ȥ����֡�ɾ������ť
            addedUserLis.live('mouseenter', function(e){
                $(this).find('.dcms-del-btn').fadeIn(200);
            });
            addedUserLis.live('mouseleave', function(e){
                $(this).find('.dcms-del-btn').fadeOut(200);
            });
            
            //�Ҳ���ѡ���û����ڡ�ɾ������ť,���¼�
            delBtns.live('click', function(e){
                $(this).parents('li').remove();
            });
            
            //������Ҫ���ӵ��û�
            addSearchBtn.click(function(e){
                var keyWords = encodeURIComponent(keyWordsEl.val());
                //�ж��Ƿ���������������
                if (!keyWords){
                    D.Message.awake(awakeEl, {
                        relatedEl: keyWordsEl,
                        msg: '��������������'
                    });
                    return;
                }
                //������������
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
                                msg: 'û���������������'
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
            
            //���������û����б������ӵ��������û��б���
            var addUserBtn = $('.add-user-btn', disDialogEl);
            addUserBtn.click(function(e){
                e.preventDefault();
                var addUserEls = $('input:checked', addUserListEl),
                addUsers = [], 
                addedUsers = getAddedUsers();
                //�ж����Ƿ���ѡ����Ҫ���ӵ��û�
                if (addUserEls.length<=0){
                    D.Message.awake(awakeEl, {
                        relatedEl: addUserListEl,
                        msg: '��ѡ����Ҫ���ӵ��û���'
                    });
                    return;
                }
                
                //����౸ѡ������ѡ���û��Ƶ��Ҳ����
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
                                + '</span><button class="dcms-del-btn">�Ƴ�</button></li>';
                        addedUserListEl.append(strHtml);
                    }
                }
            });
            
            //�����Ҳ�����Ѿ�ѡ����û�
            var saveAddBtn = $('#js-add-save', disDialogEl);
            saveAddBtn.click(function(){
                var addedUsers = getAddedUsers(),
                data = {};   
                if (addedUsers.length<=0){
                    D.Message.awake(awakeEl, {
                        relatedEl: addedUserListEl,
                        msg: '��ѡ����Ҫ������û���'
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
                            msg: '����ɹ�'
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
         * ��ɫ - ɾ���û�
         */
        function(){
            var userListTr = $('.dcms-grid tr', disDialogEl),
            delBtns = $('.dcms-grid .dcms-del-btn', disDialogEl);
            
            //���ء���ʾ��ɾ������ť
            userListTr.live('mouseenter', function(e){
                $(this).find('.dcms-del-btn').fadeIn(200);
            });
            userListTr.live('mouseleave', function(e){
                $(this).find('.dcms-del-btn').fadeOut(200);
            });
            
            //��ɾ������ť�¼�
            delBtns.live('click', function(){
                var tr = $(this).parents('tr'),
                userId = $('td:first-child', tr).text();
                D.Message.confirm(confirmEl, {
                    title: '�Ƴ��û�',
                    msg: '�˲������ܷ��أ�ȷ��Ҫ�Ƴ��û���',
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
                                    msg: 'ɾ���ɹ�'
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
            
            //������Ҫ�Ƴ����û�
            var delSearchBtn = $('#js-del-search', disDialogEl);
            //delKeyEl = $('#added-user-id-or-name', disDialogEl),
            //tbody = $('.dcms-grid tbody', disDialogEl);
            delSearchBtn.click(function(){
                var keyWords = encodeURIComponent(delKeyEl.val());
                //�ж��Ƿ���������������
                if (!keyWords){
                    D.Message.awake(awakeEl, {
                        relatedEl: delKeyEl,
                        msg: '��������������'
                    });
                    return;
                }
                //������������
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
                                msg: 'û���������������'
                            });
                            return;
                        }
                        for (var i=0, l=data.length; i<l; i++){
                            var user = data[i];
                            strHtml += '<tr><td class="user-id">'+user.userId+'</td><td class="user-name">'+user.fullName
                                     + '</td><td class="department">'+user.depName+'</td><td class="td-del-btn">'
                                     + '<button class="dcms-del-btn">ɾ��</button></td></tr>';
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
         * ��ɫ - �������޸�
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
                            
                            //���Ѿ�ѡ���Ȩ�޴��Ϲ�
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
                                msg: '��'+o.msg+', ��ȡ����ʧ�ܣ�'
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
            
            //�����޸ġ������Ľ�ɫ��Ϣ
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
                            title: '����ɹ�',
                            msg: '���ݱ���ɹ���',
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
         * ��ɫ - ɾ��
         */
        function(){
            var delBtns = $('.js-manage-role-delate');
            delBtns.live('click', function(e){
                e.preventDefault();
                var parent = $(this).parents('tr'),
                parPrev = parent.prev();
                roleId = parent.data('roleid');
                D.Message.confirm(confirmEl, {
                    title: 'ɾ����ɫ',
                    msg: '�˲������ܷ��أ�ȷ��Ҫɾ���ý�ɫ��',
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
                                    msg: 'ɾ���ɹ�'
                                });
                            } else {
                                D.Message.awake(awakeEl, {
                                    relatedEl: parent,
                                    msg: 'ɾ��ʧ�ܣ�'+o.msg
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