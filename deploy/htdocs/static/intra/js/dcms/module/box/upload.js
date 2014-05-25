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
            'img_optimization_required' : '大小超标',
            'unauthorized' : '安全校验不通过',
            'unknown' : '未知错误'
        },
        // 表单提交地址
        url = $('#dcms_upload_url').val(),
        // 按钮皮肤 
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
                /* start 隐藏连接上传*/
                var _popup = $('#popup'),_uploadbtn = $('#uploadbtn');
                _uploadbtn.html('链接上传');
                _uploadbtn.removeClass('btn-blue');
                _uploadbtn.addClass('btn-gray');
                _popup.hide();
                /* end */
                $(this).flash('uploadAll', url, {
                    // _csrf_token: 'dcms-box'
                }, 'image', 'fname');
            }).bind('uploadCompleteData.flash', function(e, o) {
                var data = $.unparam(o.data);
                if(data.success === '1') {// 上传成功

                    $('#thumbnail').val(data.url);
                    $('#thumbimg').attr("src", data.url);
                    //alert('上传成功');

                } else {// 上传失败
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
            if(_uploadbtn.html() === '链接上传') {

                _uploadbtn.html('取消上传');
                _uploadbtn.removeClass('btn-gray');
                _uploadbtn.addClass('btn-blue');
                _popup.show();

            } else {
                _uploadbtn.html('链接上传');
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
            $('#uploadbtn').removeClass('btn-blue').addClass('btn-gray').html('链接上传');

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
