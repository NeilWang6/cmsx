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
            'img_too_big' : '文件太大',
            'invalid_img_type' : '文件类型不合法',
            'img_optimization_reuired' : '大小超标',
            'unauthorized' : '安全校验不通过',
            'unknown' : '未知错误'
        },
        // 表单提交地址
        url = $('#dcms_upload_url').val(),
        // 按钮皮肤
        buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/654/092/290456_417709751.png';
        $.use('ui-flash-uploader', function() {
            //console.log($('span.local-upload'));
            $('span.local-upload').flash({
                module : 'uploader',
                width : 67,
                height : 25,
                flash : true,
                inputName : 'Filedata',
                flashvars : {
                    buttonSkin : buttonSkin
                }
            }).bind('fileSelect.flash', function(e, o) {
                $(this).flash('uploadAll', url, {
                    // _csrf_token: 'dcms-box'
                }, 'image', 'fname');
            }).bind('uploadCompleteData.flash', function(e, o) {
                var data = $.unparam(o.data);
                if(data.success === '1') {// 上传成功
		    $('.upload-img-input',$(this).parent()).val(data.url);
                    //alert('上传成功' + data.url);
                } else {// 上传失败
                    alert(errorMessage[data.msg]);
                }
            });
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
