/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

;(function($, D) {
    var errorMessage = {
        'img_too_big' : '文件太大',
        'invalid_img_type' : '文件类型不合法',
        'img_optimization_reuired' : '大小超标',
        'unauthorized' : '安全校验不通过',
        'unknown' : '未知错误'
    }, readyFun = [
    /**
     * 提交验证
     */
    function() {
        $('#btn-sub').click(function(e) {
            _validator();
        });
    },
     /**
     * 点击自动适应
     */  
    function(){
       $("input[name='autoFit']").click(function(e){
           $('.width').css('display', $(this)[0].checked?'none':'');
       });
    },
    /**
     * 二级类目联动
     */
    function() {
		$('#firstSelect').bind('change', function(e){
			var tree = getCatalogTree(), shtml = "", selectId = $('#firstSelect').val();
            if(tree){
                var parentCat = tree[selectId], cat, catId;
                if(parentCat && parentCat.children){
                	for(var i = 0; i < parentCat.children.length; i++) {
                		catId = parentCat.children[i];
                		if(tree[catId]) shtml = shtml + "<option value='" + catId + "'>" + tree[catId].name + "</option>";
                	}
                	
                }
            }
            $('#secondSelect').html(shtml);
        });
    },

    /**
     * 添加新类目
     */
    function() {
        var dialog1 = $('.level-one-category-dialog'), 
			dialog2 = $('.level-two-category-dialog'), 
			addCat1 = $('.add-cat1'), 
			addCat2 = $('.add-cat2');

        // 对话框定位
        _dialogPosition(dialog1, addCat1);
        _dialogPosition(dialog2, addCat2);

        // 一级类目旁边按钮的点击事件
        addCat1.click(addCat);
        addCat2.click(addCat);
        
        // 删除类目
        $('.del-cat1').click(deleteCatalog);
        $('.del-cat2').click(deleteCatalog)
        
        // 更新类目
        $('.modi-cat1').click(updateCatalog);
        $('.modi-cat2').click(updateCatalog);
        
        // 模拟对话框失去焦点时关闭
        $(document).click(function(e) {
            var target = $(e.target), dialog=$(e.target).closest('div.catalog-dialog');
            if(dialog[0]){
            	return;
            }
            $('#catalog-dialog textarea').val('');
           	$('div.catalog-dialog').css('display', 'none');
        });
    },
    // 恢复页面内容
    function (){
       if($('#cellId').val()){
          var txtArea=$('#com-content');
          if(txtArea.val()){
             var html=txtArea.val().replace(/data-boxoptions\s*=\s*([\"])([^"]*)\"/gi, function(s, g1, g2){
                 return "data-boxoptions='" + g2.replace(/&quot;/g, "\"") + "'";
             });
            txtArea.val(html);
          }
       }
    }
    ];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        });
    });
    // Todo:
    // 1. 验证cell的父节点是否可用
    // 2. 验证"cell-"为前缀的class是否存在，并验证其唯一性
    // 3. 为cell的唯一父节点加上"crazy-box-cell"的class名
    // 4. 为<style>、<script>、<link>加上"data-for"自定义属性，属性值为上面取得的"cell-"开始的class名
    function _validator() {
        var text = $('div.textarea textarea'), dom, errorMessage = $('.submit-error-message'), cellId = $('#cellId').val(), data, className, root,
			checkNode=$('div.auto-size input:checked'),
			autoWidth=$('div.auto-size .width input');

        try {
            dom = $(text.val());
        } catch (e) {
            alert('请输入正确的html代码！');
            return;
        }
        errorMessage.html('');
        root = dom.not(function() {
            if($.inArray(this.nodeName.toUpperCase(), ['LINK', 'SCRIPT', 'STYLE', '#TEXT']) === -1) {
                return false;
            }
            return true;
        });
        if(root.length !== 1) {
            errorMessage.html('父节点不唯一或不存在父节点');
            return;
        }
        className = FE.dcms.BoxTools.getClassName(root, /^cell-/);
        if(className === "" || className === undefined) {
            errorMessage.html('以"cell-"为前缀的class不存在');
            return;
        }
		if(checkNode.length===0){
			if(autoWidth.val()===''){
				errorMessage.html('不支持自适应情况下，必须填写宽度');
				return;
			}else if(!($.isNumeric(autoWidth.val()))){
				errorMessage.html('不支持自适应情况下，填写的宽度必须是数字');
				return;
			}
		}
		
        if(cellId) {
            data = {
                currentClassName : className,
                cellId : cellId
            };
        } else {
            data = {
                currentClassName : className
            };
        }
        // 用ajax验证className的可用性,若是则提交
        $.ajax({
            type : "POST",
            url : "/page/box/class_name_checker_ajax.html",
            data : data,
            cache : false,
            dateType : "json",
            success : function(o) {
                o = $.parseJSON(o);
                errorMessage.html('');
                if(o.isValid === "true") {
                    root.addClass('crazy-box-cell');
                    dom.filter('script,style,link').attr('data-for', className);
                    dom.filter('script').attr('type', 'text/plain');
                    // 防止js代码在append的时候被执行
                    var div = $('<div></div>');
                    div.append(dom);
                    dom.filter('script').attr('type', 'text/javascript');
                    // script标签的type属性还原
                    text.val(div.html());

                    $('#className').val(className);
                    $('#addCellForm').submit();
                } else {
                    errorMessage.html('根节点的class:' + className + '已经存在！');
                }
            },
            error : function(o) {
                errorMessage.html('(' + o.status + ') ' + o.statusText);
            }
        });
    }
    
    // 增加类目
    function addCat(e){
      e.stopPropagation();
      var offset = $(this).offset();
      $('#catalog-dialog').css('left', offset.left).css('top', offset.top + $(this).innerHeight() + 5 ).css('display', 'block');
      var data = $(this).hasClass('add-cat1') ? 1 :2;
      $('#catalog-dialog .btn').unbind().click(data, function(e){ 
    	  var level =  e.data, data = {level : level, catalogName : $('#catalog-dialog textarea').val()}; 
    	  if(level == 2) data.parentId = $('#firstSelect option:selected').val();
          $.ajax({
              type : "POST",
              'data' : data,
              url : D.domain+"/page/box/add_catalog_ajax.html?_input_charset=UTF8",
              success : function(o) {
                  o = $.parseJSON(o);
                  if(o.msg === "success") {
                      var sel, tree = getCatalogTree() || {};   
                      if(level == 1){
                    	  sel = $('#firstSelect');  
                    	  tree[o.id] = {name: o.text, top:"1"};
                      } else {
                    	  sel = $('#secondSelect');
                    	  tree[o.id] = {name: o.text};
                    	  var parentCat = tree[data.parentId], children=parentCat.children || [];
                    	  children.push(o.id);
                    	  parentCat.children = children;
                      }
                      updateCatalogTree(tree);
                      sel.append( '<option value=' + o.id + '>' + o.text + '</option>');
                      sel[0].selectedIndex = $("option[value='"+ o.id +"']", sel)[0].index;
                      $('div.catalog-dialog').css('display', 'none');
                      $('#catalog-dialog textarea').val('');
                      sel.change();
                  } else {
                      alert(o.msg);
                  }
              }
          });    	  
      });      
         
    }
    
    // 删除类目
    function deleteCatalog(e){
       	var sel = $(this).hasClass('del-cat1') ? $('#firstSelect') : $('#secondSelect'), data={cmd:'delete', catalogId: sel.val()}; 
       	manageCatalog(data, function(o){
       		if(o.success){
       		    $("option[value='"+o.id+"']", sel).remove();
       		    var tree = getCatalogTree() || {};
       		    if(tree){
       		    	for(var id in tree){
       		    		var children = tree[id].children || [], i = $.inArray(o.id +'', children);
       		    		if(i>-1) children.splice(i, 1);
       		    	}
       		    	delete tree[o.id];
       		    	updateCatalogTree(tree);
       		    	sel.change();
       		    }
       		} else {
       			alert('删除失败！请确认要删除的类目是否存在子类目或Cell');
       		}
       	}, function(){
       		alert('删除失败！请与管理员联系！');
       	});
    }
    
    // 修改类目名称
    function updateCatalog(e){
        e.stopPropagation();
        var offset = $(this).offset(), sel = $(this).hasClass('modi-cat1') ? $('#firstSelect') : $('#secondSelect'), text = $("option:selected", sel).text();
        text && $('#catalog-dialog textarea').val(text);
        $('#catalog-dialog').css('left', offset.left).css('top', offset.top + $(this).innerHeight() + 5 ).css('display', 'block');
    	$('#catalog-dialog .btn').unbind().click({cmd:'modify', catalogId: sel.val()}, function(e){ 
    		var data=e.data;
    		data.catalogName = $('#catalog-dialog textarea').val();
    		manageCatalog(data, function(o){
    			if(o.success){
    				$("option[value='"+o.id+"']", sel)[0].text = data.catalogName;
           		    var tree = getCatalogTree() || {};
           		    if(tree[o.id]) tree[o.id].name = data.catalogName;
           		    $('div.catalog-dialog').css('display', 'none');
           		    updateCatalogTree(tree);
    			}
    		});
    	});
    }
    
    // 管理类目
    function manageCatalog(data, fn, fnError){
    	var data = {
            	dataType: 'json',
                type: 'post',
            	'data' : data,
                url : D.domain+"/page/box/catalog_manage.html?_input_charset=UTF8",
                success : function(o) {
                    if(fn) fn(o);
                }
        };
    	if (fnError) data.error = fnError;
        $.ajax(data);     	
    }

    // 动态添加类目对话框的定位函数
    function _dialogPosition(dialog, parent) {
        $.use('ui-position', function() {
            dialog.position({
                of : parent,
                my : 'right top',
                at : 'right bottom',
                offset : '0 2px'
            });
        });
    }
    
    // 获取类目树
    function getCatalogTree(){
    	var treeJson = $('#catalog-trees').val()
    	return treeJson ? $.parseJSON(treeJson) : null;
    }
    
    // 更新类目树
    function updateCatalogTree(tree){
    	tree && $('#catalog-trees').val(JSON.stringify(tree));
    }

    // 动态添加类目对话框的定位函数
    
    

})(dcms, FE.dcms);
