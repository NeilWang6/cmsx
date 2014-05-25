/**
 * @author springyu
 * @userfor 派生CELL功能
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * iframe margin-top 高度
     */
    var IFRAME_MARGIN_TOP = 40,
        formValid, area, formEl, 
        inputClassName = $('#cell-classname'),
        attrDialog = $('div.cell-derive-attr');

    var readyFun = [

    /**
     * 初始化CELL属性设置
     */
    function() {
        $('#dcms_box_grid_cellattribute').bind('click', function(e) {
            e.preventDefault();
            $.use('ui-dialog', function() {
                attrDialog.dialog({
                    modal : false,
                    shim : true,
                    draggable : true,
                    center : true
                });
            });
        });
        $('#cell_cancel').bind('click', function() {
            attrDialog.dialog('close');
            //$('#cell-name').val('');
            //$('#cell-tags').val('');
        });
        $('#cell_ok').bind('click', function(){
            if (formValid.valid()===true){
                attrDialog.dialog('close');
            }
        });
    },

    /**
     * box工具条动态定位
     */
    function() {
       // $(window).scroll(auto);
        //$(window).resize(auto);
        //setTimeout(auto, 50);
    },
    /**
     * add by hongss on 2012.02.22
     * 派生cell内容的iframe，动态插入
     */
    function(){
        var pageUrl = D.domain + '/page/box/cellContent.html',
            iframe = $('<iframe id="dcms_box_main" class="dcms-box-main" src="'+pageUrl+'" onload="FE.dcms.handleLoad(this)" />');
        
        $('div.dcms-box-center').html('').append(iframe);
    },
    /**
     * 表单验证
     */
    function(){
        formEl = $('#cell-submit-form');
        var els = formEl.find('[data-valid]');
        formValid = new FE.ui.Valid(els, {
            onValid: function(res, o){
                var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                if (tip.length>1){
                    for (var i=1, l=tip.length; i<l; i++){
                        tip.eq(i).remove();
                    }
                }
                if (res==='pass') {
                    tip.removeClass('dcms-validator-error');
                } else {
                    switch (res){
                        case 'required':
                            //dialog显示
                            msg = '请填写'+o.key;
                            break;
                        default:
                            msg = '请填写正确的内容';
                            break;
                    }
                    tip.text(msg);
                    tip.addClass('dcms-validator-error');
                }
            }
        });
        
        formEl.submit(function(){
            var result = formValid.valid();
            if (result===false){
                $.use('ui-dialog', function() {
                    attrDialog.dialog({
                        modal : false,
                        shim : true,
                        draggable : true,
                        center : true
                    });
                });
            }
            return result;
        });
    }];
    
    /**
     * @methed handleLoad iframe加载成功后执行
     * @param el 指向iframe，dom节点
     */
    D.handleLoad = function(el){
        var iframeDoc = $(el.contentWindow.document),
            area = $('#content', iframeDoc),
            currentElem;
        
        D.highLightEl = $('#crazy-box-highlight-fix', iframeDoc);   //用于高亮
        //D.jsControlEl = $('#crazy-box-js-control', iframeDoc);   //用于JS失效与否控制
        
        requestOriginCell(function(data){  //请求成功,
            var newClassName = data.className+'-'+data.sequence,
                htmlcode = D.BoxTools.replaceClassName(data.content, data.className, newClassName);
            //area.html(D.BoxTools.replaceClassName(data.content, data.className, newClassName));
            D.InsertHtml.init(htmlcode, area, 'html', iframeDoc);
            
            //监听是否需要JS失效
            var jsControl = new D.JsControl({
                inureBtn: $('#crazy-box-control-btn', iframeDoc),
                type: 'crazy-box-cell',
                iframeDoc: iframeDoc
            });
            
            inputClassName.val(newClassName);
            area.bind('click', function(e){
                e.preventDefault();
            });
            area.bind('mouseup', function(e){
                var target = $(e.target);
                if (target[0] !== area[0]){
                    D.BoxTools.showHighLight(target);
                    target = jsControl.add(target);
                    D.showAttr(target);
                    currentElem = target;
                }
            });
            
        }, function(){  //请求失败
            area.html('数据加载失败，请重试！');
        });
        
        D.highLightEl.bind('mousedown', function(e){
            D.BoxTools.hideHighLight();
        });
        
        //删除按钮事件添加
        $('.bar-a-delete').bind('click', function(e){
            e.preventDefault();
            currentElem = delLable(currentElem, iframeDoc);
            D.BoxTools.hideHighLight();
        });
        
        //提交派生cell
        $('#btnDraftSubmit').click(function(e){
            e.preventDefault();
            if ($.trim(inputClassName.val())){
                $('#cell-content').val(area.html());
                formEl.submit();
            } else {
                alert('Cell数据还未加载，请稍后重试！');
            }
        });
        
        //预览派生cell
        $('#dcms_box_grid_pre').click(function(e){
            e.preventDefault();
            var content = area.html();
            if ($.trim(content)){
                $('#cell-preview-content').val(content);
                $('#cell-preview-form').submit();
            } else {
                alert('Cell数据还未加载，请稍后重试！');
            }
        });
        
        //“回撤”和“恢复”功能
		D.PageOperateHistory.init(iframeDoc.find('body'));
    };
    /**
     * @methed requestOriginCell 请求取回原生Cell的HTML代码并执行相关操作
     * @param elem 需要删除的元素
     */
    function delLable(elem, doc){
        var options = elem.data('boxoptions');
        if (options && D.BoxTools.parseOptions(options, ['ability', 'delete', 'enable'])==="true"){
            var editDelSteps = D.EditContent.editDel({'elem':elem, 'isEdit':true, 'doc':doc});
            elem = null;
            D.BoxTools.setEdited({
                'param': editDelSteps,
                'callback': null
            });
        } else {
            alert('此标签不允许删除！');
        }   
        return elem;
    }
    /**
     * @methed requestOriginCell 请求取回原生Cell的HTML代码并执行相关操作
     */
    function requestOriginCell(success, error){
        var params = $.unparam(location.href),
            url = D.domain+'/page/box/derive_cell_ajax.html',
            paramData = {};
 
        paramData['originid'] = params['originid'];
        paramData['cellid'] = params['cellid'];
        $.ajax({
            url: url,
            type: 'POST',
            data: paramData,
            success: function(o){
                var data = $.parseJSON(o);
                
                if (data.msg==='success'){
                    if (success && $.isFunction(success)===true){
                        success.call(this, data);
                    }
                } else {
                    if (error && $.isFunction(error)===true){
                        error.call(this);
                    }
                }
                
            },
            error: function(){
                if (error && $.isFunction(error)===true){
                    error.call(this);
                }
            }
        });
    }
    
    

    function auto() {
        editModuleFloat();
        windowResize();
    }

    /**
     * @author pingchun.yupc
     * @userfor box工具条动态定位
     * @date 2012-01-04
     */
    var editModuleFloat = function() {
        var dst = $(window).scrollTop();
        if(dst > 87) {
            $('#operation_area').css('position', 'fixed');
            $('#operation_area').css('top', '0px');
        }
        if(dst < 100) {
            $('#operation_area').css('position', 'absolute');
            $('#operation_area').css('top', '90px');
        }
    };
    /**
     * @author pingchun.yupc
     * @userfor 窗口放大缩小处理
     * @date 2012-01-04
     */
    var windowResize = function() {
        var winHeight = $(window).height(), boxHeader = $('#pub_header').outerHeight(), pageDesignNav = $('#page_design_nav').outerHeight(), pageAttribute = $('#page_attribute').outerHeight();
        var mainHeight = winHeight - boxHeader - pageDesignNav - pageAttribute - IFRAME_MARGIN_TOP;
        if(mainHeight <= 0) {
            $('#dcms_box_main').css('height', 0);
        } else {
            $('#dcms_box_main').css('height', mainHeight);
        }

    };
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);
