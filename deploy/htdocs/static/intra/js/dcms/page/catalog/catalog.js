;(function( $, D, window, undefined ){

    var
        HIDE_CLS = 'ui-hide',

        // 管理展示规则的类目展示树
        tree = new D.Tree({
            render : $('#treeshow'),
            template: D.treeTemplate.hover
        }),

        defaultData,
        bindData,

        btnAddNode = $('#addNode'),  // 新增节点按钮

        /**
         * 把一个元素内所有的表单作转换为json形式，如果该表单元素有data存储信息(jQuery data)，则取data中value的值
         * @param {Element} root元素
         * @return 返回表单的json数据
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

    //初始化渲染tree
    tree.render();
    //初始化类目树的数据
    tree.on('afterDataChange',function(e){
        //console.log(this.search('类目'));
        //this.createTree( this.search('类目'), false, $('.cagegory-show-hd'), true );
    });



    //浮层
    $.use('ui-dialog', function(){

        //=================
        //      声明
        //=================


        var

            /*------------- dialog的根元素 -------------*/

                addNodeRoot = $('#dg-addNode'),     //新增
                modifyRoot  = $('#dg-modifyNode'),  //修改
                confirmRoot = $('#dg-confirmNode'), //确认修改
                removeRoot  = $('#dg-removeNode'),  //确认删除

            /* end */

            /*------------- 类目面板的控制 -------------*/

            // 选择类目面板
                panelEl = $('.other-fn'),   //选择类目面板

            //类目面板是否显示
                isPanelHide = function(){
                    return panelEl.hasClass(HIDE_CLS);
                },
            //显示类目面板,显示面板时渲染tree
                showPanel = function(  ){

                    panelEl.removeClass(HIDE_CLS);
                },
            //获取绑定部门的数据并渲染tree
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
            //隐藏类目选择面板
                hidePanel = function(){
                    panelEl.addClass(HIDE_CLS);
                },

            /* end */



                modifyUpperInput = $('.upperInput',modifyRoot),

            /*------------- 初始化所有的类目树 -------------*/

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
                    //这里未能获得 departmentName
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

            /*------------- 上层类目与绑定部门的目录树的显示 -------------*/

            //显示选择类目面板
                showCategory = function(root){
                    $('.bindPanel',root).addClass(HIDE_CLS);
                    $('.choosePanel',root).removeClass(HIDE_CLS);
                },
            //显示绑定部门面板
                showBind = function(root){
                    $('.bindPanel',root).removeClass(HIDE_CLS);
                    $('.choosePanel',root).addClass(HIDE_CLS);
                };

            /* end */



        //绑定所有 dialog 关闭按钮
        $('.close-btn,footer .cancel-btn').click(function(e){
            e.preventDefault();
            hidePanel();
            $(this).closest('.dcms-dialog').dialog('close');
        });

        //=================
        // 新增节点浮层逻辑
        //=================

        //触发open dialog
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
        //提交表单
        $('.submit-btn',addNodeRoot).click(function(){
            var self = this,
                data =  getFormJson(addNodeRoot);
            if(!data.catalogName ){
                alert('请填写完整类目名称！');
                return
            }
            /*if(!data.departmentId){
                alert('请选择绑定部门！');
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




        //显示上级类目panle
        $('.upperCategory',addNodeRoot).live('click',function(){
            showPanel(addUpperTree);
            showCategory(addNodeRoot);
        })  ;
        //显示绑定部门panel
        $('.bind',addNodeRoot).live('click',function(){
            showPanel(addBindTree);
            showBind(addNodeRoot);
        });
        //展开类目
        addUpperTree.on('ui_selected',function(v){
           var addUpperInput = $('.upperInput',addNodeRoot);
           addUpperInput.val(v.name);
           addUpperInput.data('value',v.id);
        });
        //搜索类目
        $('.search button',addNodeRoot).live('click',function(e){
            var inp = $(this).siblings('input'),
                renderEl =  $('.dg-bindtree',addNodeRoot);
            if(inp.val()){
                addBindTree.createTree( addBindTree.search(inp.val()), false, renderEl);
            }else{

                addBindTree.renderTree(0,renderEl);
            }
        });

        //选择绑定部门
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
        // 修改节点浮层逻辑
        //=================

        //触发open dialog
        var triggerModifyDialog =  function(data,tree){
            modifyRoot.dialog({
                center : true
            }).data('info',data).find('.form').html(D.template.html('dialogForm', formatData( data, tree )));


            $('.upperInput',modifyRoot).data('value',data.parentId);
            $('[name="departmentId"]', modifyRoot).data('value',data.depId.join(','));

            //设置绑定部门tree的checked
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
        // 点击修改按钮时弹出修改浮层
        tree.on('ui_modify',function(data){
            triggerModifyDialog(data,this)
        });
        // 根据URL指定的 cid 弹出修改浮层
        tree.on('loadData',function( data ){
            var pr = /\?cid=(\d+)/.exec(location.href),
                data = pr? data[pr[1]]: null;
            if(data){
               triggerModifyDialog(data,this);
            }
        });
        //搜索类目
        $('.search button',modifyRoot).live('click',function(e){
            var inp = $(this).siblings('input'),
                renderEl =  $('.dg-bindtree',modifyRoot);
            if(inp.val()){
                modifyBindTree.createTree( modifyBindTree.search(inp.val()), false, renderEl);
            }else{
                modifyBindTree.renderTree(0,renderEl);
            }
        });
        //提交表单
        $('.submit-btn',modifyRoot).click(function(){
            var data =  getFormJson(modifyRoot);
            if(!data.catalogName ){
                alert('请填写完整类目名称！');
                return
            }
            /*if(!data.departmentId){
                alert('请选择绑定部门！');
                return
            }*/
            hidePanel();

            modifyNewData = D.merge( modifyData, getFormJson(modifyRoot),{
                departmentName : $('[name="departmentId"]',modifyRoot).val(),
                parentName : $('[name="parentId"]',modifyRoot).val()
            });

            $(this).closest('.dcms-dialog').dialog('close');
            //打开确认窗口
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
        //显示上级类目panle
        $('.upperCategory',modifyRoot).live('click',function(){
            showPanel();
            showCategory(modifyRoot);
        });
        //显示绑定部门panel
        $('.bind',modifyRoot).live('click',function(){
            showPanel();
            showBind(modifyRoot);
        });
        //选择上级类目
        modifyUpperTree.on('ui_selected',function(v){
           $('.upperInput',modifyRoot)
               .val(v.name)
               .data('value',v.id);
        });

        //选择绑定部门
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
        // 确认修改浮层逻辑
        //=================

        //选择上级类目
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
        //提交表单
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
                       //返回到修改浮层，便于用户重新输入
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
        // 确认删除浮层逻辑
        //=================

        //触发open dialog
        tree.on('ui_remove',function(data){
            removeRoot.dialog({
                center : true
            }).data('info',data);
        });
        //提交表单
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
        //选择类目
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
