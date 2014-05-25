/**
 * @package FD.app.cms.box.color-system
 * @author qiheng.zhuqh
 * @date: 2012-01-14
 */
(function($, D) {
    var selClrBtn = $('#hidden-color');

    var readyFun = [
    function() {
        var errorMessage = {
            'img_too_big' : '�ļ�̫��',
            'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
            'img_optimization_required' : '��С����',
            'unauthorized' : '��ȫУ�鲻ͨ��',
            'unknown' : 'δ֪����'
        },
        // ���ύ��ַ
        url = $('#dcms_upload_url').val(),
        // ��ťƤ�� 
        //http://img.china.alibaba.com/cms/upload/2012/654/092/290456_417709751.png
        buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
        $.use('ui-flash-uploader', function() {
            $('span.local-upload').flash({
                module : 'uploader',
                width : 70,
                height : 23,
                flash : true,
                inputName : 'Filedata',
                flashvars : {
                    buttonSkin : buttonSkin
                }
            }).bind('fileSelect.flash', function(e, o) {
                /* start ���������ϴ�*/
                var _popup = $('#popup'),_uploadbtn = $('#uploadbtn');
                _uploadbtn.html('�����ϴ�');
                _uploadbtn.removeClass('btn-blue');
                _uploadbtn.addClass('btn-gray');
                _popup.hide();
                /* end */
                $(this).flash('uploadAll', url, {
                    // _csrf_token: 'dcms-box'
                }, 'image', 'fname');
            }).bind('uploadCompleteData.flash', function(e, o) {
                var data = $.unparam(o.data);
                if(data.success === '1') {// �ϴ��ɹ�

                    $('#thumbnail').val(data.url);
                    $('#thumbimg').attr("src", data.url);
                    //alert('�ϴ��ɹ�');

                } else {// �ϴ�ʧ��
                    //console.log(data);
                    alert(errorMessage[data.msg]);
                }
            });
        });
    },

    function() {
        var _popup = $('#popup'),_uploadbtn = $('#uploadbtn');
        
        $('#uploadbtn').live('click',function(e) {
            e.preventDefault();
             _uploadbtn = $(this);
             _popup = $('#popup');
            if(_uploadbtn.html() === '�����ϴ�') {

                _uploadbtn.html('ȡ���ϴ�');
                _uploadbtn.removeClass('btn-gray');
                _uploadbtn.addClass('btn-blue');
                _popup.show();

            } else {
                _uploadbtn.html('�����ϴ�');
                _uploadbtn.removeClass('btn-blue');
                _uploadbtn.addClass('btn-gray');
                _popup.hide();

            }

        });
        
    },

    function() {
        $('#okbtn').live('click',function(e) {
            e.preventDefault();
            //alert($('#link-url').val())
            if($('#link-url').val() !== '') {
                $('#thumbnail').val($('#link-url').val());
                $('#thumbimg').attr("src", $('#link-url').val());
            }
            $('#popup').hide();
            $('#uploadbtn').removeClass('btn-blue').addClass('btn-gray').html('�����ϴ�');

        });
        
        $(document).on('focus', '#link-url', function(e){
            this.select();
        });
    }];

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
