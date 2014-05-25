/**
 * @author zhaoyang.maozy
 * @userfor 设置页面属性浮层
 * @date 2012-1-12
 */

;
(function($, D) {
    var settingDialog, settingCallback, templateIdElm = $('#templateId');

    var readyFun = [

    /*设置页面属性*/
    function() {
        // 点击设置页面属性
        $('#dcms_box_grid_pageattribute').click(function(e) {
            e.preventDefault();
            D.showSettingDialog();
        });
    },
    //如果新建必须先填属性
    function(){
        if (!templateIdElm.val()){
            D.showSettingDialog(true);
        }
    },
    // 点周颜色
    function() {
        $('.js-dialog').delegate('.item', 'click', setColor);
    }];

    /**
     * 设置颜色
     */
    function setColor(e) {
        e.preventDefault();
        var colorVal = $(this).find("a").text();
        if($(this).hasClass('current')) {
            colorVal = '';
            $(this).removeClass('current');
        } else {
            $('.list-color .item').removeClass('current');
            $(this).addClass('current');
        }
        $('#hidden-tag-color').val(colorVal);
    }

    /**
     * 保存属性
     */
    function saveSetting(e) {
        e&&e.preventDefault();
        var data = $('#template-setting #js-save-page').serialize();
        $.post(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, function(text) {
            if(text && text.match(/^\s*\{.+\}\s*$/mg)) {
                var obj = $.parseJSON(text) || {};
                // 设置页面ID
                if(obj.success && !templateIdElm.val()) {
                    templateIdElm.val(obj.templateId);
                    
                    //add by hongss on 2013.08.20 for 刷新取回栅格原型
                    var draftId = $('#draftId').val(),
                        strHref = D.domain + '/page/box/new_edit_template.html?templateId='+obj.templateId;
                    if (draftId){
                        strHref += '&draftId='+draftId;
                    }
                    location.href = strHref;
                }
                e&&e.data.dialog.dialog('close');
                
                // 保存后执行回调方法(如提交页面)
                if(settingCallback) {
                    settingCallback();
                    settingCallback = 0;
                }
            } else {
                showSetting(text);
            }
        }, 'text');
    }

    /*
     * 显示页面属性浮层, 参数有可能是callback，也可能是制定是否是新建的boolean
     */

    D.showSettingDialog = function(param) {
        var isNew = false;
        if ($.type(param)==='function'){
            settingCallback = param;
        } else if ($.type(param)==='boolean'){
            isNew = true;
        }
        
        var data = {
            templateId : templateIdElm.val(),
            templateType : $('#template_type').val(),
            flag : $('#flag').val()
        }, draftId = $('#draftId').val();
        if(draftId) {
            data.draftId = draftId;
        }
        $.get(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, function(text){
            showSetting(text, isNew);
        }, 'text');

    }
    /*
     * 显示页面属性
     */
    function showSetting(text, isNew) {
         $('.js-dialog').addClass('ext-width');
		$('footer','.js-dialog').show();
		D.Msg['confirm']({
			'title' : '保存模板',
			'body' : '<div class="">' + text + '</div>',
			'noclose' : true,
            'open': function(e){
                var dialogEl = $('.js-dialog');
                if (isNew===true){
                    dialogEl.addClass('new-template');
                }
                //适用设备-手机;因为栅格的特殊性，暂时改成不联动
                /*var deviceEl = dialogEl.find('.js-apply-device'),
                    gridEl = dialogEl.find('#select-grid');
                
                deviceEl.on('change', function(event){
                    if ($(this).val()==='phone'){
                        gridEl.val('layoutY720');
                    }
                });*/
            },
			'complete' : function() {
				$("#to_lib").attr('checked', false);
				
			},
			'close':function(ext){
				var dialogEl = $('.js-dialog');
                dialogEl.removeClass('new-template');
                dialogEl.removeClass('ext-width');
			},
			'success' : function(ext) {
				saveSetting(ext);
			}
		});
        //加载布局或模版
        (function() {
           var template_type = $('#template_type'),type='playout';
           if (template_type.val()==='pl_template'){
               type = 'template';
           }
            var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
                params : {
                    type : type,
                    catalogId : '0'
                   
                },
                 htmlCode:'',
                container : 'catalog_content'
            });
            cascade.init();
        })();
        var errorMessage = {
            'img_too_big' : '文件太大',
            'invalid_img_type' : '文件类型不合法',
            'img_optimization_reuired' : '大小超标',
            'unauthorized' : '安全校验不通过',
            'unknown' : '未知错误'
        },
        // 表单提交地址
        url = $('#dcms_upload_url').val(),
        // 按钮皮肤
        buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
        $.use('ui-flash-uploader', function() {
            //console.log($('span.local-upload'));
            $('span.local-upload').flash({
                module : 'uploader',
                width : 70,
                height : 25,
                flash : true,
                inputName : 'Filedata',
                flashvars : {
                    buttonSkin : buttonSkin
                }
            }).bind('fileSelect.flash', function(e, o) {
                $(this).flash('uploadAll', url, {
                    //_csrf_token: 'dcms-box'
                }, 'image', 'fname');
            }).bind('uploadCompleteData.flash', function(e, o) {
                var data = $.unparam(o.data);
                if(data.success === '1') {//上传成功

                    $('#thumbnail').val(data.url);
                    $('#thumbimg').attr("src", data.url);
                    alert('上传成功');

                } else {//上传失败
                    alert(errorMessage[data.msg]);
                }
            });
        });

    }

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });
})(dcms, FE.dcms);
