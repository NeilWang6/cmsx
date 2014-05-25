;(function( $, D, window, undefined ){

    var
        HIDE_CLS = 'ui-hide',

        // ����չʾ�������Ŀչʾ��
        tree = new D.Tree({
            render : $('#treeshow'),
            template: D.treeTemplate.hover
        }),

        defaultData,
        bindData,

        btnAddNode = $('#addNode'),  // �����ڵ㰴ť

        /**
         * ��һ��Ԫ�������еı���ת��Ϊjson��ʽ������ñ�Ԫ����data�洢��Ϣ(jQuery data)����ȡdata��value��ֵ
         * @param {Element} rootԪ��
         * @return ���ر���json����
         */
        getFormJson = function(root){
            var obj = {};
            $('input,textarea,select',root).each(function(k,v){
                v = $(v),
                name = v.attr('name');
                if(name != undefined){
                    !v.data('value')
                        ? (obj[name] = encodeURIComponent( v.val() ))
                        : (obj[name] = v.data('value'));
                }
            });
            return obj;
        };

    //��ʼ����Ⱦtree
    tree.render();
    //��ʼ����Ŀ��������
    tree.on('afterDataChange',function(e){
        //console.log(this.search('��Ŀ'));
        //this.createTree( this.search('��Ŀ'), false, $('.cagegory-show-hd'), true );
    });



    //����
    $.use('ui-dialog', function(){

        //=================
        //      ����
        //=================


        var

            /*------------- dialog�ĸ�Ԫ�� -------------*/

                addNodeRoot = $('#dg-addNode'),     //����
                modifyRoot  = $('#dg-modifyNode'),  //�޸�
                confirmRoot = $('#dg-confirmNode'), //ȷ���޸�
                removeRoot  = $('#dg-removeNode'),  //ȷ��ɾ��

            /* end */

            /*------------- ��Ŀ���Ŀ��� -------------*/

            // ѡ����Ŀ���
                panelEl = $('.other-fn'),   //ѡ����Ŀ���

            //��Ŀ����Ƿ���ʾ
                isPanelHide = function(){
                    return panelEl.hasClass(HIDE_CLS);
                },
            //��ʾ��Ŀ���,��ʾ���ʱ��Ⱦtree
                showPanel = function(  ){

                    panelEl.removeClass(HIDE_CLS);
                },
            //��ȡ�󶨲��ŵ����ݲ���Ⱦtree
                renderTree = function(upperTree,bindTree){
                    if(upperTree){
                        upperTree.render();
                        upperTree.renderTree();
                    }
                    if(bindTree){
                        bindTree.render();
                        bindTree.renderExpandChecked();
                    }
                },
            //������Ŀѡ�����
                hidePanel = function(){
                    panelEl.addClass(HIDE_CLS);
                },

            /* end */



                modifyUpperInput = $('.upperInput',modifyRoot),

            /*------------- ��ʼ�����е���Ŀ�� -------------*/

                addUpperTree = new D.Tree({
                    render : $('.dg-choosetree',addNodeRoot),
                    data : defaultData
                }),
                modifyUpperTree = new D.Tree({
                    render : $('.dg-choosetree',modifyRoot),
                    data : defaultData
                }),
                confirmUpperTree = new D.Tree({
                    render : $('.dg-choosetree',confirmRoot),
                    data : defaultData
                }),
                removeUpperTree = new D.Tree({
                    render : $('.dg-choosetree',removeRoot),
                    data : defaultData
                }),


                addBindTree = new D.Tree({
                    render : $('.dg-bindtree',addNodeRoot),
                    url : D.domain + '/page/QueryOrganization.html',
                    template: D.treeTemplate.checkbox
                }),
                modifyBindTree = new D.Tree({
                    render : $('.dg-bindtree',modifyRoot),
                    url : D.domain + '/page/QueryOrganization.html',
                    template: D.treeTemplate.checkbox
                }),

            /* end */

                oldInfoTemplate = D.template.htmlFn('oldInfoTemplate'),
                newInfoTemplate = D.template.htmlFn('newInfoTemplate'),

                modifyData = null,
                modifyNewData = null,

                formatData = function( data,tree ){
                    var parentName = [],
                            departmentName = [];

                    if(data.parentId){
                        $.each(tree.getPath(data.parentId), function(k,v){
                            parentName.push( v.name );
                        });
                    }
                    //����δ�ܻ�� departmentName
                    if(data.depId.length){
                        $.each( data.depId ,function( k, v ){
                            departmentName.push( v.name );
                        });
                    }

                    data.parentName = parentName.reverse().join('>');
                    data.departmentName = departmentName.join(',');
                    data.catalogName = tree.getNodeInfo(data.id).name;
                    return data;

                },

            /*------------- �ϲ���Ŀ��󶨲��ŵ�Ŀ¼������ʾ -------------*/

            //��ʾѡ����Ŀ���
                showCategory = function(root){
                    $('.bindPanel',root).addClass(HIDE_CLS);
                    $('.choosePanel',root).removeClass(HIDE_CLS);
                },
            //��ʾ�󶨲������
                showBind = function(root){
                    $('.bindPanel',root).removeClass(HIDE_CLS);
                    $('.choosePanel',root).addClass(HIDE_CLS);
                };

            /* end */



        //������ dialog �رհ�ť
        $('.close-btn,footer .cancel-btn').click(function(e){
            e.preventDefault();
            hidePanel();
            $(this).closest('.dcms-dialog').dialog('close');
        });

        //=================
        // �����ڵ㸡���߼�
        //=================

        //����open dialog
        btnAddNode.click(function(){
            addNodeRoot.dialog({
                center : true
            }).find('.form').html(D.template.html('dialogForm', {
                name : '',
                parentName : '',
                departmentName : '',
                remarks : ''
            }));

            renderTree(addUpperTree,addBindTree);

        });
        //�ύ��
        $('.submit-btn',addNodeRoot).click(function(){
            var self = this,
                data =  getFormJson(addNodeRoot);
            if(!data.catalogName ){
                alert('����д������Ŀ���ƣ�');
                return
            }
            /*if(!data.departmentId){
                alert('��ѡ��󶨲��ţ�');
                return
            }*/
            $.ajax({
               url: D.domain + "/position/AddCatalogAjax.html",
               dataType : 'jsonp',
               data : getFormJson(addNodeRoot),
               success: function(msg){
                   if(msg.status == 200){
                       tree.refreshTree();
                       addUpperTree.refreshTree();
                       modifyUpperTree.refreshTree();
                       hidePanel();
                       tree.on('loadData',function(){
                            $(self).closest('.dcms-dialog').dialog('close');
                       });
                   }else{
                       alert(msg.msg);
                   }
               }
            });


        });




        //��ʾ�ϼ���Ŀpanle
        $('.upperCategory',addNodeRoot).live('click',function(){
            showPanel(addUpperTree);
            showCategory(addNodeRoot);
        })  ;
        //��ʾ�󶨲���panel
        $('.bind',addNodeRoot).live('click',function(){
            showPanel(addBindTree);
            showBind(addNodeRoot);
        });
        //չ����Ŀ
        addUpperTree.on('ui_selected',function(v){
           var addUpperInput = $('.upperInput',addNodeRoot);
           addUpperInput.val(v.name);
           addUpperInput.data('value',v.id);
        });
        //������Ŀ
        $('.search button',addNodeRoot).live('click',function(e){
            var inp = $(this).siblings('input'),
                renderEl =  $('.dg-bindtree',addNodeRoot);
            if(inp.val()){
                addBindTree.createTree( addBindTree.search(inp.val()), false, renderEl);
            }else{

                addBindTree.renderTree(0,renderEl);
            }
        });

        //ѡ��󶨲���
        addBindTree.on('ui_checked',function( v, el ){

            var
                self = this,
                inp = $('[name=departmentId]',addNodeRoot),
                listId = inp.data('value')?inp.data('value').split(','):[],
                listName = [],
                id = v.id;

            if( el.attr('checked') ){
                if($.inArray(id,listId) == -1){
                    listId.push(id);
                }
            }else{
               listId =  $.grep( listId ,function( v, i ){
                    return v!= id;
                });
            }

            $.each( listId , function(k,v){
                var info =  self.getNodeInfo(v);
                if(info){
                    listName.push(  info.name );
                }
            });
            // TODO
            inp.data( 'value', listId.join(',') )
               .val ( listName.join(',') );

        });

        $('.hideFn',addNodeRoot).click(function(){
              hidePanel();
        });


        //=================
        // �޸Ľڵ㸡���߼�
        //=================

        //����open dialog
        var triggerModifyDialog =  function(data,tree){
            modifyRoot.dialog({
                center : true
            }).data('info',data).find('.form').html(D.template.html('dialogForm', formatData( data, tree )));


            $('.upperInput',modifyRoot).data('value',data.parentId);
            $('[name="departmentId"]', modifyRoot).data('value',data.depId.join(','));

            //���ð󶨲���tree��checked
            modifyBindTree.set('checked',data.depId);

            modifyData = D.merge(getFormJson(modifyRoot),{
                id : data.id,
                departmentName : $('[name="departmentId"]',modifyRoot).val(),
                parentName : $('[name="parentId"]',modifyRoot).val()
            });

            renderTree(modifyUpperTree,modifyBindTree);

        };
        modifyBindTree.on('loadData',function( data ){

        });
        // ����޸İ�ťʱ�����޸ĸ���
        tree.on('ui_modify',function(data){
            triggerModifyDialog(data,this)
        });
        // ����URLָ���� cid �����޸ĸ���
        tree.on('loadData',function( data ){
            var pr = /\?cid=(\d+)/.exec(location.href),
                data = pr? data[pr[1]]: null;
            if(data){
               triggerModifyDialog(data,this);
            }
        });
        //������Ŀ
        $('.search button',modifyRoot).live('click',function(e){
            var inp = $(this).siblings('input'),
                renderEl =  $('.dg-bindtree',modifyRoot);
            if(inp.val()){
                modifyBindTree.createTree( modifyBindTree.search(inp.val()), false, renderEl);
            }else{
                modifyBindTree.renderTree(0,renderEl);
            }
        });
        //�ύ��
        $('.submit-btn',modifyRoot).click(function(){
            var data =  getFormJson(modifyRoot);
            if(!data.catalogName ){
                alert('����д������Ŀ���ƣ�');
                return
            }
            /*if(!data.departmentId){
                alert('��ѡ��󶨲��ţ�');
                return
            }*/
            hidePanel();

            modifyNewData = D.merge( modifyData, getFormJson(modifyRoot),{
                departmentName : $('[name="departmentId"]',modifyRoot).val(),
                parentName : $('[name="parentId"]',modifyRoot).val()
            });

            $(this).closest('.dcms-dialog').dialog('close');
            //��ȷ�ϴ���
            confirmRoot.dialog({
                center : true,
                beforeClose: function(){
                    $('.otherCategoryId',confirmRoot).html('').data('value','');
                }
            });


            $('.info .item',confirmRoot).eq(0).html( D.template.html('oldInfoTemplate', D.merge(modifyData,{
                catalogName : decodeURIComponent(modifyData['catalogName'])
            })));
            $('.info .item',confirmRoot).eq(1).html( D.template.html('newInfoTemplate', D.merge(modifyNewData,{
                catalogName : decodeURIComponent(modifyNewData['catalogName'])
            })) );

        });
        //��ʾ�ϼ���Ŀpanle
        $('.upperCategory',modifyRoot).live('click',function(){
            showPanel();
            showCategory(modifyRoot);
        });
        //��ʾ�󶨲���panel
        $('.bind',modifyRoot).live('click',function(){
            showPanel();
            showBind(modifyRoot);
        });
        //ѡ���ϼ���Ŀ
        modifyUpperTree.on('ui_selected',function(v){
           $('.upperInput',modifyRoot)
               .val(v.name)
               .data('value',v.id);
        });

        //ѡ��󶨲���
        modifyBindTree.on('ui_checked',function( v, el ){

            var
                self = this,
                inp = $('[name=departmentId]',modifyRoot),
                listId = inp.data('value').split(','),
                listName = [],
                id = v.id;

            if( el.attr('checked') ){
                if($.inArray(id,listId) == -1){
                    listId.push(id);
                }

            }else{
               listId =  $.grep( listId ,function( v, i ){
                    return v!= id;
                });
            }

            $.each( listId , function(k,v){
                var info =  self.getNodeInfo(v);
                if(info){
                    listName.push(  info.name );
                }
            });
            // TODO
            inp.data( 'value', listId.join(',') )
               .val ( listName.join(',') );

        });
        modifyBindTree.on('loadData',function( data ){
            var inp = $('[name=departmentId]',modifyRoot),
                listIds =  this.get('checked'),
                tp = [];
            if(listIds){
                $.each( listIds, function(k,v){
                    if(data[v]){
                        tp.push(data[v].name);
                    }
                });
                inp.val(tp.join(','));
                //add by hongss on 2011.10.10
                modifyData['departmentName'] = tp.join(',');
            }
        });
        $('.hideFn',modifyRoot).click(function(){
              hidePanel();
        });
        //=================
        // ȷ���޸ĸ����߼�
        //=================

        //ѡ���ϼ���Ŀ
        $('.chooseCategory',confirmRoot).click(function(){
             renderTree(confirmUpperTree);
             showPanel(confirmUpperTree);

        });
        confirmUpperTree.on('ui_selected',function(v){
           $('.otherCategoryId',confirmRoot).html(v.name).data('value',v.id||'');
        });

        $('.hideFn',confirmRoot).click(function(){
             hidePanel();
        });
        //�ύ��
        $('.submit-btn',confirmRoot).click(function(){
            var self = this,
                data = D.merge(getFormJson(modifyRoot),{
                    'otherCategoryId' :  $('.otherCategoryId',confirmRoot).data('value'),
                    'categoryId' : modifyNewData.id
                 });
            $.ajax({
               url: D.domain + "/position/UpdateCatalogAjax.html",
               dataType : 'jsonp',
               data : data,
               success: function(msg){
                   if(msg.status == 200){
                       tree.refreshTree();
                       addUpperTree.refreshTree();
                       modifyUpperTree.refreshTree();
                       hidePanel();
                       tree.on('loadData',function(){
                            $(self).closest('.dcms-dialog').dialog('close');
                       });
                       
                   }if(msg.status == 201){
                       alert(msg.msg);
                       $(self).closest('.dcms-dialog').dialog('close');
                       //���ص��޸ĸ��㣬�����û���������
                       modifyRoot.dialog({
                            center : true
                       });
                   }else{
                       alert(msg.msg);
                   }
                   $('.otherCategoryId',confirmRoot).html('').data('value','');
               }
            });
        });
        //=================
        // ȷ��ɾ�������߼�
        //=================

        //����open dialog
        tree.on('ui_remove',function(data){
            removeRoot.dialog({
                center : true
            }).data('info',data);
        });
        //�ύ��
        $('.submit-btn',removeRoot).click(function(){

            var self = this,
                data = {
                    'categoryId': removeRoot.data('info').id,
                    'parentId': removeRoot.data('info').parentId,
                    'otherCategoryId':$('.otherCategoryId',removeRoot).data('value')
                };
            $.ajax({
               url: D.domain + "/position/DeleteCatalogAjax.html",
               dataType : 'jsonp',
               data : data,
               success: function(msg){
                   if(msg.status == 200){
                       tree.refreshTree();
                       addUpperTree.refreshTree();
                       modifyUpperTree.refreshTree();
                       hidePanel();
                       tree.on('loadData',function(){
                            $(self).closest('.dcms-dialog').dialog('close');
                       });
                   }else{
                       alert(msg.msg);
                   }
               }
            });
        });
        //ѡ����Ŀ
        $('.chooseCategory',removeRoot).click(function(){
            showPanel(removeUpperTree);
            renderTree(removeUpperTree);
        });
        removeUpperTree.on('ui_selected',function(v){
            $('.otherCategoryId',removeRoot).html(v.name).data('value',v.id);
        });

        $('.hideFn',removeRoot).click(function(){
              hidePanel();
        });
    });

})(jQuery, FE.dcms, window);
