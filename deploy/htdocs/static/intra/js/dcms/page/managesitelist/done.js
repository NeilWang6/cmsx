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
        //��ʼ����Ŀ����������ҳ���еĺͱ༭�Ի����е�
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
                                   '<span class="dcms-tree-fn"><button class="btn-template-choose modify">�޸�</button>'+
                                   '<button class="btn-template-choose remove">ɾ��</button></span></dt>'+
                                   '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+ 
                                   '</dl>',
                        catalogTemplate = '<dl class="dcms-tree-wrapper">'+  //dcms-tree-wrapper-{id}
                                          '<dt class="dcms-tree-name"><span class="i-treebtn"></span> {name}</dt>'+  // class="tree-checkbox-{id}"
                                          '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+
                                          '</dl>',
                        //������ҳ���е���Ŀ������
                        catalogTree = new D.Tree(treeContainer, {
                            data: data,
                            template: template
                        });
                        //�����༭�Ի����е���Ŀ������
                        chooseCatTree = new D.Tree(chooseCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        //����ȷ�϶Ի����е���Ŀ������
                        confirmCatTree = new D.Tree(confirmCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        //����ɾ���Ի����е���Ŀ������
                        delectCatTree = new D.Tree(delectCatContainer, {
                            data: data,
                            template: catalogTemplate
                        });
                        
                        //����Ŀ�б��еĵ���¼�
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
                        //��ȷ�Ͽ�����Ŀ�б��еĵ���¼�
                        $('.dcms-tree-name', confirmCatContainer).live('click', function(e){
                            //e.stopPropagation();
                            var el = $(this);
                            handleTreeClick(el, confirmCatTree, confirmOtherCat);
                        });
                        //��ɾ���Ի�������Ŀ�б��еĵ���¼�
                        $('.dcms-tree-name', delectCatContainer).live('click', function(e){
                            //e.stopPropagation();
                            var el = $(this);
                            handleTreeClick(el, delectCatTree, delectOtherCat);
                            
                        });
                        
                        //��Ŀ�����¼�ע��
                        $('.choosePanel button.search-btn', editDialogEl).click(function(e){
                            //e.stopImmediatePropagation();
                            var keyWords = $(this).prev().val();
                            chooseCatTree.searchName(keyWords);
                        });
                    } else {
                        treeContainer.html('�������ݳ���'+o.msg);
                    }
                }
            });
  
        },
        //��ʼ���༭���еĲ����б�
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
                        //�����༭�Ի����еĲ����б����
                        chooseDepTree = new D.Tree(chooseDepContainer, {
                            data: data,
                            template: chooseTemplate,
                            initParentId: ''
                        });
                        
                        //�󶨲����б��е�checkbox�ĵ���¼�
                        $(':checkbox', chooseDepContainer).live('click', function(e){
                            e.stopPropagation();
                            var el = $(this);
                            clickCheckbox(el, chooseDepTree); //$('.department-input', editDialogEl), 
                            getValue($('.department-input', editDialogEl), chooseDepTree);
                        });
                        
                        //���Ų����¼�ע��
                        $('.bindPanel button.search-btn', editDialogEl).click(function(e){
                            //e.stopImmediatePropagation();
                            var keyWords = $(this).prev().val();
                            chooseDepTree.searchName(keyWords);
                        });
                    } else {
                        chooseDepContainer.html('�������ݳ���'+o.msg);
                    }
                }
            });
        },
        //Ϊ��Ŀ��������ṹע������¼�
        function(){
            var ABLE_CLASS_NAME = 'dcms-tree-able',
            dtEls = $('.'+DCMS_TREE_NAME, treeContainer);
            //hoverʱ��ʾ(����) �޸�(ɾ��)��ť
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
        //����\�޸Ľڵ���ز���
        function(){
            var addNode = $('#addNode'),
            modifyNode = $('.modify', treeContainer),
            
            catalogPanel = $('.choosePanel', editDialogEl),
            depPanel = $('.bindPanel', editDialogEl);
            
            //�� �������ڵ㡱�����¼�
            addNode.click(function(e){
                //��ʾ�༭�Ի���
                $.use('ui-dialog', function(){
                    editDialog = editDialogEl.dialog({
                        center : true,
                        open: function(){
                        	//����ued���
                        	$("#uedAuditorsDiv").hide();
                            //�������������ڵ�����
                            formInputs.each(function(index){
                            	
                            		$(this).val('');
                            	    
                            });
                            //���߱��水ť���������ڵ�
                            editSubmit.data('action', 'add');
                        }
                    });
                });
            });
            
            //�� ���޸Ľڵ㡱�����¼�
            modifyNode.live('click', function(e){
                //��ֹð��
                e.stopPropagation();
                var data = $(this).parents('.'+DCMS_TREE_NAME).data(CATALOG_INFO);
                //��ʾ�༭�Ի���
                showModifyContent(data);
                //
                if(data.needAudit=='1'){
                	$("#uedAuditorsDiv").show();
                }else{
                	$("#uedAuditorsDiv").hide();
                }
                
            });
            
            //��������ѡ�񡱣��ϼ���Ŀ���󶨲��ţ���ť���¼�
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
        //ע��dialog�� ��ȡ�����͡��رա���ť�¼�
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
                //������水ť�ϵ������Ϣ
                editSubmit.removeData('action');
                editSubmit.removeData('olddata');
            });
        },
        //ע������ѡ��������¼�
        function(){
            $('.hideFn', editDialogEl)
                .add('.hideFn', confirmDialogEl)
                    .add('.hideFn', delDialogEl).click(function(){
                $(this).parents('.other-fn').addClass(HIDE_CLASS_NAME);
            });          
        },
        //ע�ᱣ�水ť������/�޸�ʱ���¼�
        function(){
            editSubmit.click(function(e){
                var btn = $(this),
                action = btn.data('action'),
                data = getFomeValue(editForm);
                if (!$.trim(data.name)){
                    alert('����дվ�����ƣ�');
                    return;
                }
                
                if (action==='add'){
                    //�������棬���ͱ�������
                    $.ajax({
                        url: D.domain+'/admin/AddSiteAjax.html',
                        dataType: 'jsonp',
                        data: data,
                        success: function(o){
                            if(o.status == 200){
                                window.location.reload();
                            }else{
                                alert('���ݱ���ʧ�ܣ�'+o.msg);
                            }
                        }
                    });
                } else if (action==='modify'){
                    //�޸ı��棬��ת��ȷ�϶Ի���
                    var oldData = btn.data('olddata'),
                    newData = getShowValue(editForm);
                    editDialog.dialog('close');
                    data['categoryId'] = oldData['id'];
                    //��֪Ϊ�λ�ȡ����parentId
                    data['parentId'] = newData['parentId'];
                    $.use('ui-dialog', function(){
                        confirmDialog = confirmDialogEl.dialog({
                            center: true,
                            open: function(){
                                var strTemp = '<li><span class="lab">ԭ���ƣ�</span><span class="txt">{name}</span></li>'+
                                              '<li><span class="lab">ԭ�ϼ�վ�㣺</span><span class="txt">{parentId}</span></li>'+
                                              '<li><span class="lab">ԭ�󶨲��ţ�</span><span class="txt">{departmentId}</span></li>';
                                
                                var strTemp2 = '<li><span class="lab">�����ƣ�</span><span class="txt">{name}</span></li>'+
                                '<li><span class="lab">���ϼ�վ�㣺</span><span class="txt">{parentId}</span></li>'+
                                '<li><span class="lab">ԭ�󶨲��ţ�</span><span class="txt">{departmentId}</span></li>';
                                
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
        //ȷ�϶Ի���
        function(){
            //�رպ�ȡ����ť
            $('.close-btn, .cancel-btn', confirmDialogEl).click(function(e){
                e.preventDefault();
                confirmDialog.dialog('close');
                if (confirmCatTree){
                    confirmCatTree.resetNodes();
                }
                //���ת����Ŀ���������
                confirmOtherCat.text('');
                confirmOtherCat.removeData('value');
                //����ڱ��水ť�ϵ������Ϣ
                confirmSubmit.removeData('data');
            });
            
            $('.catagory-not-move', confirmDialogEl).click(function(e){
                e.preventDefault();
                //���ת����Ŀ���������
                confirmOtherCat.text('');
                confirmOtherCat.removeData('value');
            });
            
            //ѡ����Ŀ
            $('.chooseCategory', confirmDialogEl).click(function(e){
                confirmCatPanel.removeClass(HIDE_CLASS_NAME);
            });
            
            //������Ŀ�¼�ע��
            $('.search-btn', confirmDialogEl).click(function(e){
                //e.stopImmediatePropagation();
                var keyWords = $(this).prev().val();
                confirmCatTree.searchName(keyWords);
            });
            
            //ȷ������
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
                            alert('���ݱ���ʧ�ܣ�'+o.msg);
                        }
                    }
                });
            });
      
        },
        //ɾ����Ŀ
        function(){
            var delChooseCat = $('.chooseCategory', delDialogEl),
            showCatNameEl = $('.del-catagory-name'),
            delDialog, data;
            //�󶨡�ɾ����ť�������¼�
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
            
            //�󶨡��رա�����ȡ������ť
            $('.close-btn, .cancel-btn', delDialogEl).click(function(e){
                e.preventDefault();
                delDialog.dialog('close');
                delectOtherCat.text('');
                delectOtherCat.removeData('value');
                showCatNameEl.text('');
            });
            
            //���ƶ���Ŀ
            $('.catagory-not-move', delDialogEl).click(function(e){
                e.preventDefault();
                delectOtherCat.text('');
                delectOtherCat.removeData('value');
            });
            
            //��Ŀ�����¼�ע��
            $('button.search-btn', delDialogEl).click(function(e){
                //e.stopImmediatePropagation();
                var keyWords = $(this).prev().val();
                delectCatTree.searchName(keyWords);
            });
            
            //ѡ����Ŀ
            delChooseCat.click(function(e){
                $('.other-fn', delDialogEl).removeClass(HIDE_CLASS_NAME);
            });
            
            //ȷ��ɾ��
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
                            alert('����ɾ���ɹ���');
                            window.location.reload();
                        } else {
                            alert('����ɾ��ʧ�ܣ�'+o.msg);
                        }
                        
                    }
                });
            });
            
        },
        //��˵�ѡ��ť�¼�����
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
    //����checkbox��ķ���
    function clickCheckbox(el, treeObj){
        var parentEl = el.parent('dt.dcms-tree-name');
        
        if (!!el.filter(':checked').length) {
            //��������checkbox��ѡ��ʱ, ѡ�����е��丸���ڵ�
            var id = parentEl.data(CATALOG_INFO)['id'],
            parentNames = treeObj.showChooseNodes(id, true, false);
        } else {
            //��������checkboxȡ��ѡ��ʱ�������ӽڵ㶼ȡ��ѡ��
            parentEl.next('.dcms-tree-list').find('input:checked').attr('checked', false);
        }
    }
    
    //��ȡ��ѡ���ֵ
    function getValue(input, treeObj){
        var checkedInputs = $('input:checked', treeObj.el),
        chekedIds = [], parentNames='';
        //��ѡ��������ѡ��Ľڵ�ID
        checkedInputs.each(function(){
            var el = $(this).parent(),
            silbingEl = el.next('.dcms-tree-list');
            if (!silbingEl.find('input:checked').length){
                chekedIds.push(el.data(CATALOG_INFO)['id']);
            }
        });
        //�ռ�������ѡ��ڵ�ĸ���name
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
    
    //�����޸ĶԻ����е�����
    function showModifyContent(data){
        $.use('ui-dialog', function(){
            editDialog = editDialogEl.dialog({
                center : true,
                open : function(){
                    //����޸�ǰ��������������
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
                    
                    //���߱��水ť�����޸Ľڵ�
                    var oldData = getShowValue(editForm);
                    oldData['id'] = data['id'];
                    editSubmit.data('action', 'modify');
                    editSubmit.data('olddata', oldData);
                    
                }
            });
        });
    }
    
    //��ȡ���б�Ԫ���е�ֵ
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
    
    //��ȡ��ʾ�ı�Ԫ��ֵ
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