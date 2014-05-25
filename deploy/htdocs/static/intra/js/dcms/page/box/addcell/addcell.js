/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

;(function($, D) {
    var errorMessage = {
        'img_too_big' : '�ļ�̫��',
        'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
        'img_optimization_reuired' : '��С����',
        'unauthorized' : '��ȫУ�鲻ͨ��',
        'unknown' : 'δ֪����'
    }, readyFun = [
    /**
     * �ύ��֤
     */
    function() {
        $('#btn-sub').click(function(e) {
            _validator();
        });
    },
     /**
     * ����Զ���Ӧ
     */  
    function(){
       $("input[name='autoFit']").click(function(e){
           $('.width').css('display', $(this)[0].checked?'none':'');
       });
    },
    /**
     * ������Ŀ����
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
     * �������Ŀ
     */
    function() {
        var dialog1 = $('.level-one-category-dialog'), 
			dialog2 = $('.level-two-category-dialog'), 
			addCat1 = $('.add-cat1'), 
			addCat2 = $('.add-cat2');

        // �Ի���λ
        _dialogPosition(dialog1, addCat1);
        _dialogPosition(dialog2, addCat2);

        // һ����Ŀ�Ա߰�ť�ĵ���¼�
        addCat1.click(addCat);
        addCat2.click(addCat);
        
        // ɾ����Ŀ
        $('.del-cat1').click(deleteCatalog);
        $('.del-cat2').click(deleteCatalog)
        
        // ������Ŀ
        $('.modi-cat1').click(updateCatalog);
        $('.modi-cat2').click(updateCatalog);
        
        // ģ��Ի���ʧȥ����ʱ�ر�
        $(document).click(function(e) {
            var target = $(e.target), dialog=$(e.target).closest('div.catalog-dialog');
            if(dialog[0]){
            	return;
            }
            $('#catalog-dialog textarea').val('');
           	$('div.catalog-dialog').css('display', 'none');
        });
    },
    // �ָ�ҳ������
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
    // 1. ��֤cell�ĸ��ڵ��Ƿ����
    // 2. ��֤"cell-"Ϊǰ׺��class�Ƿ���ڣ�����֤��Ψһ��
    // 3. Ϊcell��Ψһ���ڵ����"crazy-box-cell"��class��
    // 4. Ϊ<style>��<script>��<link>����"data-for"�Զ������ԣ�����ֵΪ����ȡ�õ�"cell-"��ʼ��class��
    function _validator() {
        var text = $('div.textarea textarea'), dom, errorMessage = $('.submit-error-message'), cellId = $('#cellId').val(), data, className, root,
			checkNode=$('div.auto-size input:checked'),
			autoWidth=$('div.auto-size .width input');

        try {
            dom = $(text.val());
        } catch (e) {
            alert('��������ȷ��html���룡');
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
            errorMessage.html('���ڵ㲻Ψһ�򲻴��ڸ��ڵ�');
            return;
        }
        className = FE.dcms.BoxTools.getClassName(root, /^cell-/);
        if(className === "" || className === undefined) {
            errorMessage.html('��"cell-"Ϊǰ׺��class������');
            return;
        }
		if(checkNode.length===0){
			if(autoWidth.val()===''){
				errorMessage.html('��֧������Ӧ����£�������д���');
				return;
			}else if(!($.isNumeric(autoWidth.val()))){
				errorMessage.html('��֧������Ӧ����£���д�Ŀ�ȱ���������');
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
        // ��ajax��֤className�Ŀ�����,�������ύ
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
                    // ��ֹjs������append��ʱ��ִ��
                    var div = $('<div></div>');
                    div.append(dom);
                    dom.filter('script').attr('type', 'text/javascript');
                    // script��ǩ��type���Ի�ԭ
                    text.val(div.html());

                    $('#className').val(className);
                    $('#addCellForm').submit();
                } else {
                    errorMessage.html('���ڵ��class:' + className + '�Ѿ����ڣ�');
                }
            },
            error : function(o) {
                errorMessage.html('(' + o.status + ') ' + o.statusText);
            }
        });
    }
    
    // ������Ŀ
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
    
    // ɾ����Ŀ
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
       			alert('ɾ��ʧ�ܣ���ȷ��Ҫɾ������Ŀ�Ƿ��������Ŀ��Cell');
       		}
       	}, function(){
       		alert('ɾ��ʧ�ܣ��������Ա��ϵ��');
       	});
    }
    
    // �޸���Ŀ����
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
    
    // ������Ŀ
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

    // ��̬�����Ŀ�Ի���Ķ�λ����
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
    
    // ��ȡ��Ŀ��
    function getCatalogTree(){
    	var treeJson = $('#catalog-trees').val()
    	return treeJson ? $.parseJSON(treeJson) : null;
    }
    
    // ������Ŀ��
    function updateCatalogTree(tree){
    	tree && $('#catalog-trees').val(JSON.stringify(tree));
    }

    // ��̬�����Ŀ�Ի���Ķ�λ����
    
    

})(dcms, FE.dcms);
