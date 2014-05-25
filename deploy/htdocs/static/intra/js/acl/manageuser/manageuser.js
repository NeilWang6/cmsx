(function($, D){
    var tipEl = $('#dcms-ui-tips'),
    dialogEl = $('#js-set-userinfo-dialog'),
    confirmEl = $('#dcms-message-confirm'),
    awakeEl = $('#dcms-message-awake'),
    optionsContainer = $('.options-container', dialogEl),
    optionsBar = $('.show-options-bar', optionsContainer),
    optionListEl = $('.list-options', optionsContainer),
    optionTitle = optionListEl.prev('h6'),
    userId, userinfoDialog, categoryObj,
    categorySelContent = $('#categorySelContent'),

    readyFun = [
        /**
         * 操作层浮出、隐藏
         */
        function(){
            var gridOperationsWrap = $('#manage-user-operations'),
            modObj = $('.dcms-page-module'),
            timeId;
            
            $('.dcms-search-list tbody').delegate("tr", "mouseenter", function(){
                var el = $(this),
                activation = el.data('activation');
                if (activation=='1'){
                    var container = $('td:last-child',el),
                    isWrap = ($('.dcms-grid-operations-wrap', container).length>0);
                    timeId = window.setTimeout(function(){
                        if (!isWrap) {
                            gridOperationsWrap.appendTo(container);
                        }
                        gridOperationsWrap.fadeIn();
                    }, 300);
                }
            });
            $('.dcms-search-list tbody').delegate("tr", "mouseleave", function(){
                var el = $(this),
                activation = el.data('activation');
                if (activation=='1'){
                    if(timeId){
                        window.clearTimeout(timeId);
                    }
                    gridOperationsWrap.hide();
                }
            });
            
        },
        /**
         * 激活用户
         */
        function(){
            var activeEls = $('.js-user-active');
            activeEls.live('click', function(e){
                e.preventDefault();
                var el = $(this),
                userId = $.trim(el.parents('tr').data('userid'));
                D.Message.confirm(confirmEl, {
                    title: '激活用户',
                    msg: '您确定要激活用户 '+userId+' 吗？',
                    enter: function(){
                        var url = 'manage_user.htm',
                        data = {};
                        data['action'] = 'UserManagerAction';
                        data['event_submit_do_set_user'] = true;
                        data['userId'] = userId;
                        data['retType'] = 'json';
                        $.post(url, data, function(o){
                            o = $.parseJSON(o);
                            if (o.status==='success'){
                                el.replaceWith('已激活');
                                D.Message.confirm(confirmEl, {
                                    relatedEl: el,
                                    title: '权限设置',
                                    msg: '确认是否设置用户角色！',
                                    enter: function(){
                                    		//alert(userId);
                                        setUserRole(userId);
                                    }
                                });
                            } else {
                                D.Message.awake(awakeEl, {
                                    relatedEl: el,
                                    msg: o.msg
                                });
                            }
                        });
                    }
                });
            });
        },
        /**
         * 用户信息以标签形式显示
         */
        function(){
            var userInfoEls = $('.js-tips-userinfo'),
            timeId;
            userInfoEls.live('mouseenter', function(e){
                var el = $(this),
                parent = el.parent(),
                userInfo = parent.data('userinfo'),
                html = '<ul><li>工号 : '+userInfo.jobId+'</li><li>分机 : '+userInfo.phone+'</li><li>邮箱 : '
                     + userInfo.email+'</li><li>部门 : '+userInfo.department+'</li></ul>';
                timeId = setTimeout(function(){
                    D.Tips.show(tipEl, {
                        msg:html, 
                        relatedEl:el
                    });
                }, 200);
            });
            userInfoEls.live('mouseleave', function(e){
                if (timeId){
                    clearTimeout(timeId);
                    timeId = null;
                }
                D.Tips.hide($(this));
            });
        },
        /**
         * 拥有类目 以标签形式显示
         */
        function(){
            var categoryEls = $('.js-tips-category'),
            timeId;
            categoryEls.live('mouseenter', function(){
                var el = $(this),
                categories = el.data('category'),
                length = categories.length;
                if (length>0){
                    var html = '<ul>';
                    for (var i=0; i<length; i++){
                        html += '<li>'+categories[i]+'</li>'
                    }
                    timeId = setTimeout(function(){
                        D.Tips.show(tipEl, {
                            msg:html, 
                            relatedEl:el
                        });
                    }, 200);
                }
            });
            categoryEls.live('mouseleave', function(){
                if (timeId){
                    clearTimeout(timeId);
                    timeId = null;
                }
                D.Tips.hide($(this));
            });
        },
        /**
         * 角色 以标签形式显示
         */
        function(){
            var roleEls = $('.js-tips-role'),
            timeId;
            roleEls.live('mouseenter', function(){
                var el = $(this),
                roles = el.data('role'),
                length = roles.length;
                if (length>0){
                    var text = [];
                    for (var i=0; i<length; i++){
                        text.push(roles[i].roleName);
                    }
                    timeId = setTimeout(function(){
                        D.Tips.show(tipEl, {
                            msg:text.join(', '), 
                            relatedEl:el
                        });
                    }, 200);
                }
            });
            roleEls.live('mouseleave', function(){
                if (timeId){
                    clearTimeout(timeId);
                    timeId = null;
                }
                D.Tips.hide($(this));
            });
        },
        /**
         * 提交搜索表单
         */
        function(){
            //当点击<搜索>时
            var pageNum = $('#js-page-num'),
            isActivedEl = $('#js-is-actived'),
            selectRoleEl = $('#js-select-role'),
            selCategoryIdEl = $('#selCategoryId'),
            userIdEl = $('#input-man'),
            form = $('#js-search-user-form');
            $('#js-user-search-btn').click(function(){
                var isActived = isActivedEl.val(),
                selectRole = selectRoleEl.val(),
                selCategoryId = selCategoryIdEl.val(),
                userId = userIdEl.val();
                
                if (isActived=='0' && !userId && !selCategoryId){
                    D.Message.awake(awakeEl, {
                        relatedEl: form,
                        msg: '当选择“未激活”时，必须再选择“用户ID或姓名”或“类目”中的一个条件！'
                    });
                    return false;
                }
                pageNum.val(1);
                form.submit();
            });
            //当点击<下一页>时
            $('.dcms-page-btn').bind('click', function(){
                var el = $(this),
                btnPageNum = el.data('pagenum');
                pageNum.val(btnPageNum);
                form.submit();
            });
        },
        /**
         * 用户权限设定
         */
        function(){
            var setEls = $('.js-manage-user-setting'),
            //roleNameEl = $('#js-input-part', dialogEl),
            roleIdEl = $('#js-input-partid', dialogEl),
            spCatagoryIdEl = $('#js-input-categoryid', dialogEl),
            endDateEl = $('#js-input-date', dialogEl);
            //userinfoDialog,

            //hidden = $('#js-input-categoryid'),
            //inp = $('#js-input-category');
            
            $('.close-btn, .cancel-btn', dialogEl).bind('click', function(e){
                e.preventDefault();
                if (userinfoDialog){
                    userinfoDialog.dialog('close');
                }
            });

            setEls.live('click', function(e){
                e.preventDefault();
                optionsContainer.hide();
                var el = $(this),
                url = 'edit_user.htm',
                data = {};
                userId = $.trim(el.parents('tr').data('userid'));
                setUserRole(userId);
            });

            //保存用户权限设置信息
            $('#js-set-user-popedom-btn').click(function(e){
                var roleIds = roleIdEl.val(), 
                //roleName = roleNameEl.val(),
                catagoryIds = $.trim(spCatagoryIdEl.val()),
                endDate = endDateEl.val(),
                url = D.domain+'manage_user.htm',
                data = {};
                
                //判断“定制类目”与日期是否同时被选择
                if (catagoryIds && !endDate){
                    D.Message.awake(awakeEl, {
                        msg: '定制类目与到期日期必须共存，请选择“到期日期”！',
                        relatedEl: endDateEl,
                    });
                    return;
                }
                
                data['action'] = 'UserManagerAction';
                data['event_submit_do_modify_user_role_catalog_access'] = true;
                data['userId'] = userId;
                data['catalogId'] = catagoryIds;
                data['roleId'] = roleIds;
                data['endDate'] = endDate;
                data['retType'] = 'json';
                $.post(url, data, function(o){
                    o = $.parseJSON(o);
                    userinfoDialog.dialog('close');
                    if (o.status==='success'){
                        window.location.reload();
                    } else {
                        D.Message.confirm(confirmEl, {
                            msg: o.msg,
                            title: '保存数据出错'
                        });
                    } 
                });
            });
        },
        /**
         * 授予角色、定制类目
         */
        function(){
            var chooseRoleBtn = $('#js-choose-part-btn', dialogEl),
            chooseCatagoryBtn = $('#js-choose-category-btn', dialogEl),
            chooseDate = $('#js-input-date', dialogEl),
            
            
            optionEls = $('input:checkbox', optionListEl);
            
            //绑定<授予角色-选择>事件
            chooseRoleBtn.click(function(e){
                var isExist = optionListEl.data('isExist'),
                roleIds = $('#js-input-partid', dialogEl).val().split(',');
                if (isExist!==true){
                    var url = D.domain+'manage_user.htm', 
                    data = {};
                    data['action'] = 'RoleManageAction';
                    data['event_submit_do_Query_All_Role'] = true;
                    data['retType'] = 'json';
                    $.post(url, data, function(o){
                        o = $.parseJSON(o);
                        if (o.status==='success'){
                            var data = o.data,
                            strHtml = '';
                            for (var i=0, l=data.length; i<l; i++){
                                var roleInfo = data[i],
                                isChecked = false,
                                strChecked = '';
                                for (var j=0, len=roleIds.length; j<len; j++){
                                    if (roleInfo.roleId==roleIds[j]){
                                        isChecked=true;
                                    }
                                }
                                if (isChecked){
                                    strChecked = 'checked="checked"';
                                }
                                strHtml += '<li><input type="checkbox" value="'+roleInfo.roleId+'" '+strChecked+' id="dcms-role-'+i
                                         + '" name="roles"><label for="dcms-role-'+i+'">'+roleInfo.roleName+'</label></li>';
                            }
                            optionListEl.html(strHtml);
                            optionListEl.data('isExist', true);
                        }
                    });
                } else {
                    var checkBoxes = $('input:checkbox', optionListEl);
                    checkBoxes.each(function(){
                        var el = $(this),
                        val = el.val();
                        el.attr('checked', false);
                        for (var i=0, l=roleIds.length; i<l; i++){
                            if (val==roleIds[i]){
                                el.attr('checked', true);
                                return;
                            }
                        }
                    });
                }
                optionListEl.show();
                categorySelContent.hide();
                optionTitle.html('选择角色');
                optionsContainer.show();
            });
            //绑定<定制类目-选择>事件
            chooseCatagoryBtn.click(function(e){
                optionListEl.hide();
                categorySelContent.show();
                optionTitle.html('选择类目');
                optionsContainer.show();
            });
            
            //绑定隐藏选择框区域的bar事件
            optionsBar.click(function(e){
                optionsContainer.hide();
            });
            
            //勾选复选框
            optionEls.live('change', function(e){
                var roleNameEl = $('#js-input-part', dialogEl),
                roleIdEl = $('#js-input-partid', dialogEl),
                optionChecked = $(':checked', optionListEl),
                optionLabel = optionChecked.next('label'),
                labelText = [],
                checkValue = [];
                for (var i=0, l=optionChecked.length; i<l; i++){
                    labelText.push(optionLabel.eq(i).text());
                    checkValue.push(optionChecked.eq(i).val());
                }
                
                roleNameEl.val(labelText.join(','));
                roleIdEl.val(checkValue.join(','));
                
            });
            
            //时间选择
            $.use('ui-datepicker', function(){
                chooseDate.datepicker({
                    triggerType:'focus',
                    minDate:new Date(),
                    select: function(e, ui){
                        chooseDate.val(ui.date.format()).datepicker('hide');
                    }
                });
            });
            // 修复日期控件不显示的问题
            chooseDate.click(function(){
            	try{
            	    var i = $('#js-set-userinfo-dialog').parent().css('zIndex');
          	    i && $('.ui-datepicker').css('zIndex', parseInt(i) + 1);
            	}catch(e){
            	}	
            })
        },
        /**
         * add by hongss on 2011.11.28 for select category on page
         */
        function(){
            var popTree = new D.PopTree({ strUrl:"site.htm"});
            $('#selcategoryName').click(function(){
                var el = $(this);
                popTree.show(el, el, $('#selCategoryId'));
            });
        },
        function(){
            categoryObj = new D.PopTree({
                isDialog: false,
                container: $('#categorySelContent', optionsContainer),
                cancelEls: null,
                submitBtn: null,
                strUrl:"site.htm"
            });
        }
    ];
    // add by pingchun.yupc
	function setUserRole(_userId) {
		userId = _userId;
		var setEls = $('.js-manage-user-setting'),
		roleNameEl = $('#js-input-part',dialogEl),
		roleIdEl = $('#js-input-partid',dialogEl),
		spCatagoryIdEl = $('#js-input-categoryid',dialogEl),
		endDateEl = $('#js-input-date',dialogEl),
		//var userinfoDialog;
		//var hidden = $('#js-input-categoryid');
		inp = $('#js-input-category');
		$('.close-btn,.cancel-btn',dialogEl).bind('click',function(e){
			e.preventDefault();
			if (userinfoDialog){
				userinfoDialog.dialog('close');
			}
		});
		optionsContainer.hide();
		var el = $(this);
		var url = 'edit_user.htm';
		var data = {};
		data['userId'] = _userId;
		data['retType'] = 'json';
		$.post(url,data,function(o){
			o = $.parseJSON(o);
			if (o.status === 'success'){
				var data = o.data,
				permList = data.permList,
				length = permList.length,
				permHtml = '';
				$('.username',dialogEl).text(data.fullName);
				$('.jobid',dialogEl).text(data.empId);
				$('.phone',dialogEl).text(data.busnPhone);
				$('.userid',dialogEl).text(data.userId);
				$('.email',dialogEl).text(data.email);
				$('.department',dialogEl).text(data.depName);
				$('.category',dialogEl).text(jQuery.util.unescapeHTML(data.catalogList.join(),true));
				roleNameEl.val(data.roleNameList.join());
				roleIdEl.val(data.roleIdList.join());
				//$('#js-input-category',dialogEl).val(data.userCatalogNameList.join());
                categoryObj.show($('#js-choose-category-btn', dialogEl), inp, spCatagoryIdEl);
				spCatagoryIdEl.val(data.userCatalogIdList.join());
				endDateEl.val(data.failDate);
				if (length > 0){
					for (var i=0;i<length;i++){
						var perm = permList[i];
						permHtml += '<tr><td class="popedom-name">'+perm.permCode+'</td><td class="popedom-describe">'+perm.description+'</td></tr>';
					}
				$('.dcms-grid',dialogEl).html(permHtml);
				} else {
					$('.dcms-grid',dialogEl).html('<tr><td>暂无权限项</td></tr>');
				}
				userinfoDialog = dialogEl.dialog({fixed:true,center:true});
                
			} else {
				D.Message.confirm(confirmEl,{
					msg:o.msg,
					title:'获取数据失败！'
				});
			}
			
		});
		
	}
	
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
