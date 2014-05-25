/**
 * @usefor catalog manage
 * @author hongss
 * @date 2011.11.14
 * 
 */
 
;(function($, D, undefined){
    var treeContainer = $('#treeshow'),
    editDialogEl = $('#dg-editNode'),
    confirmDialogEl = $('#dg-confirmNode'),
    delDialogEl = $('#dg-removeNode'),
    chooseCatContainer = $('.dg-choosetree', editDialogEl),
    confirmCatContainer = $('.dg-choosetree', confirmDialogEl),
    delectCatContainer = $('.dg-choosetree', delDialogEl),
    chooseDepContainer = $('.dg-bindtree', editDialogEl),
    choosePanel = $('.other-fn', editDialogEl),
    editSubmit = $('.submit-btn', editDialogEl),
    confirmSubmit = $('.submit-btn', confirmDialogEl),
    editForm = $('.form', editDialogEl),
    confirmCatPanel = $('.other-fn', confirmDialogEl),
    confirmOtherCat = $('.otherCategoryId', confirmDialogEl),
    delectOtherCat = $('.otherCategoryId', delDialogEl),
    formInputs = $('input, textarea, select', editDialogEl),
    catgoryInput = $('.upper-input', editDialogEl),
    editDialog, chooseCatTree, chooseDepTree,
    confirmCatTree, confirmDialog, delectCatTree,
    
    CATALOG_INFO = 'cataloginfo',
    DCMS_TREE_NAME = 'dcms-tree-name',
    TREE_CHECKBOX_CLASS = '.tree-checkbox-',
    HIDE_CLASS_NAME = 'ui-hide',
    //manageTreeDt = $('.dcms-tree-name', '#treeshow'),
    readyFun = [
        //初始化类目树，包括主页面中的和编辑对话框中的
        function(){
           // var url = D.domain + '/position/catalogTree.html';
        	 var url = D.domain + '/admin/site.html';
            
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function(o){
                    if (o.status==='200'){
                        var data = o.data,
                        template = '<dl class="dcms-tree-wrapper">'+ // dcms-tree-wrapper-{id}
                                   '<dt class="dcms-tree-name" data-disable="{disabled}"><span class="i-treebtn"></span>{name}'+
                                   '<span class="dcms-tree-fn"><button class="btn-template-choose modify">修改</button>'+
                                   '<button class="btn-template-choose remove">删除</button></span></dt>'+
                                   '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+ 
                                   '</dl>',
                        catalogTemplate = '<dl class="dcms-tree-wrapper">'+  //dcms-tree-wrapper-{id}
                                          '<dt class="dcms-tree-name"><span class="i-treebtn"></span> {name}</dt>'+  // class="tree-checkbox-{id}"
                                          '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+
                                          '</dl>',
                        //创建主页面中的类目树对象
                        catalogTree = new D.Tree(treeContainer, {
                            data: data,
                            template: template
                        });
                        //创建编辑对话框中的类目树对象
                        chooseCatTree = new D.Tree(chooseCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        //创建确认对话框中的类目树对象
                        confirmCatTree = new D.Tree(confirmCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        //创建删除对话框中的类目树对象
                        delectCatTree = new D.Tree(delectCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        
                        //绑定类目列表中的点击事件
                        $('.dcms-tree-name', chooseCatContainer).live('click', function(e){
                            //e.stopPropagation();
                            var el = $(this),
                            id = el.data(CATALOG_INFO)['id'],
                            parents = chooseCatTree.getParents(id),
                            parentsName = '';
                            for (var i=0, l=parents.length; i<l; i++){
                                if (i===l-1){
                                    parentsName += parents[i]['name'];
                                    continue;
                                }
                                parentsName += parents[i]['name']+'->';
                            }
                            catgoryInput.val(parentsName);
                            catgoryInput.data('value', id);
                            
                        });
                        //绑定确认框中类目列表中的点击事件
                        $('.dcms-tree-name', confirmCatContainer).live('click', function(e){
                            //e.stopPropagation();
                            var el = $(this);
                            handleTreeClick(el, confirmCatTree, confirmOtherCat);
                        });
                        //绑定删除对话框中类目列表中的点击事件
                        $('.dcms-tree-name', delectCatContainer).live('click', function(e){
                            //e.stopPropagation();
                            var el = $(this);
                            handleTreeClick(el, delectCatTree, delectOtherCat);
                            
                        });
                        
                        //类目查找事件注册
                        $('.choosePanel button.search-btn', editDialogEl).click(function(e){
                            //e.stopImmediatePropagation();
                            var keyWords = $(this).prev().val();
                            chooseCatTree.searchName(keyWords);
                        });
                    } else {
                        treeContainer.html('加载数据出错：'+o.msg);
                    }
                }
            });
  
        },
        //初始化编辑框中的部门列表
        function(){
            var url = D.domain + '/page/QueryOrganization.html',
            chooseTemplate = '<dl class="dcms-tree-wrapper">'+  //dcms-tree-wrapper-{id}
                             '<dt class="dcms-tree-name"><span class="i-treebtn"></span><input type="checkbox" autocomplete="off" /> {name}</dt>'+  // class="tree-checkbox-{id}"
                             '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+
                             '</dl>';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function(o){
                    if (o.status==='200'){
                        var data = o.data;
                        //创建编辑对话框中的部门列表对象
                        chooseDepTree = new D.Tree(chooseDepContainer, {
                            data: data,
                            template: chooseTemplate,
                            initParentId: ''
                        });
                        
                        //绑定部门列表中的checkbox的点击事件
                        $(':checkbox', chooseDepContainer).live('click', function(e){
                            e.stopPropagation();
                            var el = $(this);
                            clickCheckbox(el, chooseDepTree); //$('.department-input', editDialogEl), 
                            getValue($('.department-input', editDialogEl), chooseDepTree);
                        });
                        
                        //部门查找事件注册
                        $('.bindPanel button.search-btn', editDialogEl).click(function(e){
                            //e.stopImmediatePropagation();
                            var keyWords = $(this).prev().val();
                            chooseDepTree.searchName(keyWords);
                        });
                    } else {
                        chooseDepContainer.html('加载数据出错：'+o.msg);
                    }
                }
            });
        },
        //为类目管理的树结构注册相关事件
        function(){
            var ABLE_CLASS_NAME = 'dcms-tree-able',
            dtEls = $('.'+DCMS_TREE_NAME, treeContainer);
            //hover时显示(隐藏) 修改(删除)按钮
            dtEls.live('mouseenter', function(e){
                var el = $(this);
                if (el.data('disable')==false){
                    el.addClass(ABLE_CLASS_NAME);
                }
            });
            dtEls.live('mouseleave', function(){
                var el = $(this);
                if (el.hasClass(ABLE_CLASS_NAME)){
                    el.removeClass(ABLE_CLASS_NAME);
                }
            });
        },
        //新增\修改节点相关操作
        function(){
            var addNode = $('#addNode'),
            modifyNode = $('.modify', treeContainer),
            
            catalogPanel = $('.choosePanel', editDialogEl),
            depPanel = $('.bindPanel', editDialogEl);
            
            //绑定 “新增节点”单击事件
            addNode.click(function(e){
                //显示编辑对话框
                $.use('ui-dialog', function(){
                    editDialog = editDialogEl.dialog({
                        center : true,
                        open: function(){
                        	//隐藏ued审核
                        	$("#uedAuditorsDiv").hide();
                            //清空所有输入框内的数据
                            formInputs.each(function(index){
                            	
                            		$(this).val('');
                            	    
                            });
                            //告诉保存按钮，是新增节点
                            editSubmit.data('action', 'add');
                        }
                    });
                });
            });
            
            //绑定 “修改节点”单击事件
            modifyNode.live('click', function(e){
                //阻止冒泡
                e.stopPropagation();
                var data = $(this).parents('.'+DCMS_TREE_NAME).data(CATALOG_INFO);
                //显示编辑对话框
                showModifyContent(data);
                //
                if(data.needAudit=='1'){
                	$("#uedAuditorsDiv").show();
                }else{
                	$("#uedAuditorsDiv").hide();
                }
                
            });
            
            //绑定两个“选择”（上级类目、绑定部门）按钮的事件
            $('button.upperCategory', editDialogEl).click(function(e){
                choosePanel.removeClass(HIDE_CLASS_NAME);
                catalogPanel.removeClass(HIDE_CLASS_NAME);
                depPanel.addClass(HIDE_CLASS_NAME);
            });
            $('button.bind').click(function(e){
                choosePanel.removeClass(HIDE_CLASS_NAME);
                catalogPanel.addClass(HIDE_CLASS_NAME);
                depPanel.removeClass(HIDE_CLASS_NAME);
            });
            
            $('.js-set-top-catagory', editDialogEl).click(function(e){
                e.preventDefault();
                catgoryInput.val('');
                catgoryInput.data('value', 0);
            });
       
        },
        //注册dialog的 “取消”和“关闭”按钮事件
        function(){
            $('.close-btn, .cancel-btn', editDialogEl).click(function(e){
                e.preventDefault();
                editDialog.dialog('close');
                if (chooseCatTree){
                    chooseCatTree.resetNodes();
                }
                if (chooseDepTree){
                    chooseDepTree.resetNodes();
                }
                choosePanel.addClass(HIDE_CLASS_NAME);
                //清楚保存按钮上的埋点信息
                editSubmit.removeData('action');
                editSubmit.removeData('olddata');
            });
        },
        //注册隐藏选择区域的事件
        function(){
            $('.hideFn', editDialogEl)
                .add('.hideFn', confirmDialogEl)
                    .add('.hideFn', delDialogEl).click(function(){
                $(this).parents('.other-fn').addClass(HIDE_CLASS_NAME);
            });          
        },
        //注册保存按钮在新增/修改时的事件
        function(){
            editSubmit.click(function(e){
                var btn = $(this),
                action = btn.data('action'),
                data = getFomeValue(editForm);
                if (!$.trim(data.name)){
                    alert('请填写站点名称！');
                    return;
                }
                
                if (action==='add'){
                    //新增保存，发送保存请求
                    $.ajax({
                        url: D.domain+'/admin/AddSiteAjax.html',
                        dataType: 'jsonp',
                        data: data,
                        success: function(o){
                            if(o.status == 200){
                                window.location.reload();
                            }else{
                                alert('数据保存失败：'+o.msg);
                            }
                        }
                    });
                } else if (action==='modify'){
                    //修改保存，跳转到确认对话框
                    var oldData = btn.data('olddata'),
                    newData = getShowValue(editForm);
                    editDialog.dialog('close');
                    data['categoryId'] = oldData['id'];
                    //不知为何获取不到parentId
                    data['parentId'] = newData['parentId'];
                    $.use('ui-dialog', function(){
                        confirmDialog = confirmDialogEl.dialog({
                            center: true,
                            open: function(){
                                var strTemp = '<li><span class="lab">原名称：</span><span class="txt">{name}</span></li>'+
                                              '<li><span class="lab">原上级站点：</span><span class="txt">{parentId}</span></li>'+
                                              '<li><span class="lab">原绑定部门：</span><span class="txt">{departmentId}</span></li>';
                                
                                var strTemp2 = '<li><span class="lab">新名称：</span><span class="txt">{name}</span></li>'+
                                '<li><span class="lab">新上级站点：</span><span class="txt">{parentId}</span></li>'+
                                '<li><span class="lab">原绑定部门：</span><span class="txt">{departmentId}</span></li>';
                                
                                oldHtml = $.util.substitute(strTemp, oldData);
                                newHtml = $.util.substitute(strTemp2, newData);
                                $('.info .old', confirmDialogEl).html(oldHtml);
                                $('.info .new', confirmDialogEl).html(newHtml);
                                confirmSubmit.data('data', data);
                            }
                        });
                    });
                }
            });
    
        },
        //确认对话框
        function(){
            //关闭和取消按钮
            $('.close-btn, .cancel-btn', confirmDialogEl).click(function(e){
                e.preventDefault();
                confirmDialog.dialog('close');
                if (confirmCatTree){
                    confirmCatTree.resetNodes();
                }
                //清空转移类目的相关数据
                confirmOtherCat.text('');
                confirmOtherCat.removeData('value');
                //清除在保存按钮上的埋点信息
                confirmSubmit.removeData('data');
            });
            
            $('.catagory-not-move', confirmDialogEl).click(function(e){
                e.preventDefault();
                //清空转移类目的相关数据
                confirmOtherCat.text('');
                confirmOtherCat.removeData('value');
            });
            
            //选择类目
            $('.chooseCategory', confirmDialogEl).click(function(e){
                confirmCatPanel.removeClass(HIDE_CLASS_NAME);
            });
            
            //查找类目事件注册
            $('.search-btn', confirmDialogEl).click(function(e){
                //e.stopImmediatePropagation();
                var keyWords = $(this).prev().val();
                confirmCatTree.searchName(keyWords);
            });
            
            //确定保存
            $('.submit-btn', confirmDialogEl).click(function(e){
                var el = $(this),
                data = el.data('data');
                data['otherCategoryId'] = confirmOtherCat.data('value') || '';
                $.ajax({
                    url: D.domain+'/admin/UpdateSiteAjax.html',
                    dataType: 'jsonp',
                    data: data,
                    success: function(o){
                        if (o.status==='200'){
                            alert(o.msg);
                            window.location.reload();
                        } else if(o.status==='201') {
                            alert(o.msg);
                            confirmDialog.dialog('close');
                            editDialog = new editDialogEl.dialog({
                                center: true,
                                open: function(){
                                    showModifyContent(data);
                                }
                            });
                        } else {
                            alert('数据保存失败：'+o.msg);
                        }
                    }
                });
            });
      
        },
        //删除类目
        function(){
            var delChooseCat = $('.chooseCategory', delDialogEl),
            showCatNameEl = $('.del-catagory-name'),
            delDialog, data;
            //绑定“删除按钮”单击事件
            $('.remove', treeContainer).live('click', function(e){
                e.stopPropagation();
                data = $(this).parents('.dcms-tree-name').data(CATALOG_INFO);
                
                $.use('ui-dialog', function(){
                    delDialog = delDialogEl.dialog({
                        center: true,
                        open: function(){
                            showCatNameEl.text(data['name']);
                        }
                    });
                });
            });
            
            //绑定“关闭”、“取消”按钮
            $('.close-btn, .cancel-btn', delDialogEl).click(function(e){
                e.preventDefault();
                delDialog.dialog('close');
                delectOtherCat.text('');
                delectOtherCat.removeData('value');
                showCatNameEl.text('');
            });
            
            //不移动类目
            $('.catagory-not-move', delDialogEl).click(function(e){
                e.preventDefault();
                delectOtherCat.text('');
                delectOtherCat.removeData('value');
            });
            
            //类目查找事件注册
            $('button.search-btn', delDialogEl).click(function(e){
                //e.stopImmediatePropagation();
                var keyWords = $(this).prev().val();
                delectCatTree.searchName(keyWords);
            });
            
            //选择类目
            delChooseCat.click(function(e){
                $('.other-fn', delDialogEl).removeClass(HIDE_CLASS_NAME);
            });
            
            //确定删除
            $('.submit-btn', delDialogEl).click(function(e){
                var delData = {
                    'categoryId': data['id'],
                    'parentId': data['parentId'],
                    'otherCategoryId': delectOtherCat.data('value')
                };
                $.ajax({
                    url: D.domain+'/admin/DeleteSiteAjax.html',
                    dataType: 'jsonp',
                    data: delData,
                    success: function(o){
                        if (o.status==200){
                            alert('数据删除成功！');
                            window.location.reload();
                        } else {
                            alert('数据删除失败：'+o.msg);
                        }
                        
                    }
                });
            });
            
        },
        //审核单选按钮事件处理
        function(){          
           	//
        	$("#needAudit").change(function(e) {
        		var needAudit=$(this).val();        		
        		if(needAudit==1){
        			$("#uedAuditorsDiv").show();
        		}else{
        			$("#uedAuditorsDiv").hide();
        		}               
        		
        	}); 
        }
    ];
    
    function handleTreeClick(el, treeObj, otherCat){
        var id = el.data(CATALOG_INFO)['id'],
        parents = treeObj.getParents(id),
        parentsName = '';
        for (var i=0, l=parents.length; i<l; i++){
            if (i===l-1){
                parentsName += parents[i]['name'];
                continue;
            }
            parentsName += parents[i]['name']+'->';
        }
        otherCat.text(parentsName);
        otherCat.data('value', id);
    }
    //单击checkbox后的方法
    function clickCheckbox(el, treeObj){
        var parentEl = el.parent('dt.dcms-tree-name');
        
        if (!!el.filter(':checked').length) {
            //当单击的checkbox被选中时, 选中所有的其父级节点
            var id = parentEl.data(CATALOG_INFO)['id'],
            parentNames = treeObj.showChooseNodes(id, true, false);
        } else {
            //当单击的checkbox取消选中时，将其子节点都取消选择
            parentEl.next('.dcms-tree-list').find('input:checked').attr('checked', false);
        }
    }
    
    //获取所选择的值
    function getValue(input, treeObj){
        var checkedInputs = $('input:checked', treeObj.el),
        chekedIds = [], parentNames='';
        //剔选出真正被选择的节点ID
        checkedInputs.each(function(){
            var el = $(this).parent(),
            silbingEl = el.next('.dcms-tree-list');
            if (!silbingEl.find('input:checked').length){
                chekedIds.push(el.data(CATALOG_INFO)['id']);
            }
        });
        //收集各个被选择节点的父辈name
        for (var i=0, l=chekedIds.length; i<l; i++){
            var parents = treeObj.getParents(chekedIds[i]),
            parentsName = '';
            for (var j=0, n=parents.length; j<n; j++){
                if (j===n-1){
                    parentsName += parents[j]['name'];
                    continue;
                }
                parentsName += parents[j]['name']+'->';
            }
            if (i===l-1){
                parentNames += parentsName;
                continue;
            }
            parentNames += parentsName+', ';
        }
        input.val(parentNames);
        input.data('value', chekedIds);
    }
    
    //补充修改对话框中的内容
    function showModifyContent(data){
        $.use('ui-dialog', function(){
            editDialog = editDialogEl.dialog({
                center : true,
                open : function(){
                    //填充修改前所有输入框的内容
                    var catParents = (chooseCatTree) ? chooseCatTree.showChooseNodes(data.parentId, true, true).join('->') : '',
                    depParents = (chooseDepTree) ? chooseDepTree.showChooseNodes(data.depId, true, true).join(', ') : '';
                    
                    $('#name', editDialogEl).val(data.name);
                    $('#parentId', editDialogEl).data('value',data.parentId);
                    $('#departmentId', editDialogEl).data('value',data.depId);
                    $('#principal', editDialogEl).val(data.principal);
                    $('#materialLibrary', editDialogEl).val(data.materialLibrary);
                    $('#needAudit', editDialogEl).val(data.needAudit);
                    $('#uedAuditors', editDialogEl).val(data.uedAuditors);
                    $('#remarks', editDialogEl).val(data.remarks);
                    $('#parentId', editDialogEl).val(data.parentId);
                    $('#departmentId', editDialogEl).val(depParents);
					$('#needSafeJudge', editDialogEl).val(data.needSafeJudge);
                    
                    /*
                    
                    formInputs.eq(0).val(data.name);
                    formInputs.eq(1).data('value', data.parentId);
                    formInputs.eq(2).data('value', data.depId);
                    formInputs.eq(3).val(data.remarks);
                    formInputs.eq(1).val(catParents);
                    formInputs.eq(2).val(depParents);
                    */
                    
                    //告诉保存按钮，是修改节点
                    var oldData = getShowValue(editForm);
                    oldData['id'] = data['id'];
                    editSubmit.data('action', 'modify');
                    editSubmit.data('olddata', oldData);
                    
                }
            });
        });
    }
    
    //获取所有表单元素中的值
    function getFomeValue(container){
        var formInputs = $('input, textarea,select', container),
        values = {};
        formInputs.each(function(){
            var el = $(this),
            name = el.attr('name'),
            value = el.data('value');
 
            if (name){
                values[name] = (value) ? ($.isArray(value)) ? value.join() : value : encodeURIComponent(el.val());
            }
        });
        return values;
    }
    
    //获取显示的表单元素值
    function getShowValue(container){
        var formInputs = $('input, textarea, select', container),
        values = {};
        formInputs.each(function(){
            var el = $(this),
            name = el.attr('name');
            if (name){
                values[name] = el.val();
            }
        });
        return values;
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
})(jQuery, FE.dcms);