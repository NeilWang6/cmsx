/**
 * 菜单增、删、改 ＠hongss
 */
;
(function($, D) {
	var appName = location.search.match(/app_name=([^&#]+)($|&|#)/)[1],
        readyFun = [
		function() {
			var url = 'list_tree_menu.do';  
			$.ajax({
				url: url,
				data:{appName:appName,"_output_charset":"GBK"},
				dataType: 'jsonp',
				success: function(o){ 
                    if (o.status==='200'){ 
						var data = o.data,
							template = '<dl class="dcms-tree-wrapper">'+ // dcms-tree-wrapper-{id}
									   '<dt class="dcms-tree-name"><span class="i-treebtn"></span>{name}'+
									   '<span class="dcms-tree-fn"><button class="btn-template-choose add">增加</button>'+
									   '<button class="btn-template-choose modify">修改</button>'+
									   '<button class="btn-template-choose remove">删除</button></span></dt>'+
									   '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+ 
									   '</dl>',
							treeContainer = $('#treeshow'),
							//创建主页面中的类目树对象
							catalogTree = new D.Tree(treeContainer, {
								data: data,
								parentKey: 'parent',
								template: template
							}); 
						
					} else {
						treeContainer.html('加载数据出错：'+o.msg);
					}
				}
			});
		},
        function(){
            var treeConEl = $('#treeshow');
            //显示操作按钮
            treeConEl.on('mouseenter', '.dcms-tree-name', function(e){
                $(this).find('.dcms-tree-fn').css('visibility', 'visible');
            });
            treeConEl.on('mouseleave', '.dcms-tree-name', function(e){
                $(this).find('.dcms-tree-fn').css('visibility', 'hidden');
            });
            
            var CATALOG_INFO = 'cataloginfo',
                htmlStr = '<div class="dcms-form">\
                            <div class="form"><form class="menu-form" method="post" action="#">\
                                <input type="hidden" name="action" value="ACLMenuAction" />\
                                <input type="hidden" name="event_submit_do_add_or_update_menu" value="true" />\
                                <input type="hidden" name="id" value="" />\
                                <div>\
                                    <label for="name">系统名称<span class="dcms-red">*</span>：</label>\
                                    <input type="text" name="appName" value="" maxlength="50">\
                                </div>\
                                <div>\
                                    <label for="name">菜单名称<span class="dcms-red">*</span>：</label>\
                                    <input type="text" name="name" value="" maxlength="50">\
                                </div>\
                                <div>\
                                    <label for="name">Code<span class="dcms-red">*</span>：</label>\
                                    <input type="text" name="code" value="" maxlength="50">\
                                </div>\
                                <div>\
                                    <label for="name">上级菜单<span class="dcms-red">*</span>：</label>\
                                    <span class="parent-name"></span>\
                                    <input type="hidden" readonly="readonly" name="parent" value="" maxlength="50">\
                                </div>\
                                <div>\
                                    <label for="name">菜单Url：</label>\
                                    <input type="text" name="url" value="">\
                                </div>\
                                <div>\
                                    <label for="name">白名单：</label>\
                                    <select name="isWhite">\
                                        <option value="0">否</option>\
                                        <option value="1">是</option>\
                                    </select>\
                                </div>\
                                <div>\
                                    <label for="name">描述：</label>\
                                    <textarea name="description"></textarea>\
                                </div>\
                            </div></form></div>';
            //新增顶级菜单
            $('#addNode').click(function(e){
                D.Msg['confirm']({
                    'title' : '新增菜单',
                    'body' : htmlStr,
                    'onlymsg':false,
                    'success':function(obj){
                        var dialogEl = obj.data.dialog;
                        
                        dialogEl.find('.menu-form').submit();
                    }
                }, {
                    'open':function(){
                        var dialogEl = $(this);
                        //父级菜单名称
                        dialogEl.find('input[name=parent]').val('');
                        dialogEl.find('.parent-name').text('顶级菜单');
                        //应用名称
                        dialogEl.find('input[name=appName]').val(appName);
                    }
                });
            });
            //新增子菜单
            treeConEl.on('click', '.add', function(e){
                e.stopPropagation();
                var addEl = $(this),
                    data = addEl.closest('.dcms-tree-name').data(CATALOG_INFO);
                
                D.Msg['confirm']({
                    'title' : '新增菜单',
                    'body' : htmlStr,
                    'onlymsg':false,
                    'success':function(obj){
                        var dialogEl = obj.data.dialog;
                        
                        dialogEl.find('.menu-form').submit();
                    }
                }, {
                    'open':function(){
                        var dialogEl = $(this);
                        //父级菜单名称
                        dialogEl.find('input[name=parent]').val(data.id);
                        dialogEl.find('.parent-name').text(data.name);
                        //应用名称
                        dialogEl.find('input[name=appName]').val(appName);
                    }
                });
            });
            //修改
            treeConEl.on('click', '.modify', function(e){
                e.stopPropagation();
                var focusEl = $(this),
                    data = focusEl.closest('.dcms-tree-name').data(CATALOG_INFO);
                    
                D.Msg['confirm']({
                    'title' : '修改菜单',
                    'body' : htmlStr,
                    'onlymsg':false,
                    'success':function(obj){
                        var dialogEl = obj.data.dialog;
                        
                        dialogEl.find('.menu-form').submit();
                    }
                }, {
                    'open':function(){
                        var dialogEl = $(this),
                            parentName = '顶级菜单';
                        
                        setFormValue(dialogEl, data);
                        
                        //父级菜单名称
                        dialogEl.find('input[name=parent]').val(data.parent);
                        if (data.parent){
                            parentName = focusEl.closest('.dcms-tree-list').prev().data(CATALOG_INFO).name;
                        }
                        dialogEl.find('.parent-name').text(parentName);
                        //应用名称
                        dialogEl.find('input[name=appName]').val(appName);
                        
                    }
                });
            });
            //删除
            treeConEl.on('click', '.remove', function(e){
                e.stopPropagation();
                
                if (confirm('请确定删除此菜单？')){
                    var focusEl = $(this),
                        data = focusEl.closest('.dcms-tree-name').data(CATALOG_INFO),
                        delFormEl = $('#del-menu');
                    
                    delFormEl.find('input[name=id]').val(data.id);
                    delFormEl.submit();
                }
            });
        }
	];
    
    function getFormValue(container){
        var els = $('input,select,textarea', container),
            formDate = {};
        els.each(function(){
            formDate[this.name] = $(this).val();
        });
        return formDate;
    }
    
    function setFormValue(container, data){
        var els = $('input,select,textarea', container);
        els.each(function(){
            if (data[this.name]){
                $(this).val(data[this.name]);
            }
            
        });
    }
    
	$(function() {
		$.each(readyFun,
			function(i, fn) {
				try {
					fn();
				} catch (e) {
					if ($.log) {
						$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
					}
				}
			})
	});

})(dcms, FE.dcms);