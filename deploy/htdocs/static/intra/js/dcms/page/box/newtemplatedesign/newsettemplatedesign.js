/**
 * @author zhaoyang.maozy
 * @userfor ����ҳ�����Ը���
 * @date 2012-1-12
 */

;
(function($, D) {
    var settingDialog, settingCallback, templateIdElm = $('#templateId');

    var readyFun = [

    /*����ҳ������*/
    function() {
        // �������ҳ������
        $('#dcms_box_grid_pageattribute').click(function(e) {
            e.preventDefault();
            D.showSettingDialog();
        });
    },
    //����½�������������
    function(){
        if (!templateIdElm.val()){
            D.showSettingDialog(true);
        }
    },
    // ������ɫ
    function() {
        $('.js-dialog').delegate('.item', 'click', setColor);
    }];

    /**
     * ������ɫ
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
     * ��������
     */
    function saveSetting(e) {
        e&&e.preventDefault();
        var data = $('#template-setting #js-save-page').serialize();
        $.post(D.domain + '/page/box/settingBoxTemplate.htm?_input_charset=UTF-8', data, function(text) {
            if(text && text.match(/^\s*\{.+\}\s*$/mg)) {
                var obj = $.parseJSON(text) || {};
                // ����ҳ��ID
                if(obj.success && !templateIdElm.val()) {
                    templateIdElm.val(obj.templateId);
                    
                    //add by hongss on 2013.08.20 for ˢ��ȡ��դ��ԭ��
                    var draftId = $('#draftId').val(),
                        strHref = D.domain + '/page/box/new_edit_template.html?templateId='+obj.templateId;
                    if (draftId){
                        strHref += '&draftId='+draftId;
                    }
                    location.href = strHref;
                }
                e&&e.data.dialog.dialog('close');
                
                // �����ִ�лص�����(���ύҳ��)
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
     * ��ʾҳ�����Ը���, �����п�����callback��Ҳ�������ƶ��Ƿ����½���boolean
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
     * ��ʾҳ������
     */
    function showSetting(text, isNew) {
         $('.js-dialog').addClass('ext-width');
		$('footer','.js-dialog').show();
		D.Msg['confirm']({
			'title' : '����ģ��',
			'body' : '<div class="">' + text + '</div>',
			'noclose' : true,
            'open': function(e){
                var dialogEl = $('.js-dialog');
                if (isNew===true){
                    dialogEl.addClass('new-template');
                }
                //�����豸-�ֻ�;��Ϊդ��������ԣ���ʱ�ĳɲ�����
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
        //���ز��ֻ�ģ��
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
            'img_too_big' : '�ļ�̫��',
            'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
            'img_optimization_reuired' : '��С����',
            'unauthorized' : '��ȫУ�鲻ͨ��',
            'unknown' : 'δ֪����'
        },
        // ���ύ��ַ
        url = $('#dcms_upload_url').val(),
        // ��ťƤ��
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
                if(data.success === '1') {//�ϴ��ɹ�

                    $('#thumbnail').val(data.url);
                    $('#thumbimg').attr("src", data.url);
                    alert('�ϴ��ɹ�');

                } else {//�ϴ�ʧ��
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
