/**
 * author xianjia.wanxj
 * date 2011-5-31
 * 用法：$('#btn').uploader({});
 * copy from platform/purchase/module/uploader.js by Edgar 110806
 * modified by arcthur
 */

(function($){
    $.DEBUG = false;
    $.fn.uploader = function(opt){
        var _this = this, p, attachmentArr = [];
        
        var conf = {
            numLimit: 1,
            module: 'uploader',
            inputName: 'file',
            fileFilters: [{
                description: "文件(*.jpg, *.gif, *.png, *.doc, *.docx, *.xls, *.xlsx)",
                extensions: "*.jpg;*.gif;*.png;*.doc;*.docx;*.xls;*.xlsx;"
            }],
            //fileSelect
            select: function(e, data){
                if (data.filesRefused.length) {
					var errCode;
                        
					switch(data.filesRefused[0].reason){
						case 'INVALID_FILE_TYPE':
							errCode = 'TYPEERR';
							break;
						default:
							errCode = 'SIZEERR';
							break;
					}
                    errorHandler.call(_this, {
                        errCode: errCode
                    });
                    return false;
                }
                
                var url = $('#new-content').data('uploadurl'),
                    uploaderNum = $(this).parent().siblings('p.uploader-file-info').length;
                
                $(this).flash('uploadAll', url, {} );
                
                if ((uploaderNum + 1)  >= conf.numLimit) {
                    _this.flash('disable');
                }
            },
            //uploadStart
            start: function(e, o){
                _this.flash('disable');
                var fileName = o.fileName;
                if (fileName) {
                    p = $('<p class="uploader-file-info"></p>');
                    p.html('<span title="' + fileName + '" class="file-title loading">' + fileName + '</span><span class="op">正在上传...</span>');
                    _this.parent().after(p);
                }
            },
            //uploadCompleteData
            complete: function(e, o) {
                var data = o.data || {},
                    failureInfo,
                    uploaderNum = $(this).parent().siblings('p.uploader-file-info').length,
                    hiddenInput = $(this).parent().find('input[type=hidden]');
                
                if (typeof data === 'string') {
                    data = $.parseJSON(data);
                }
                //上传成功
                if (data && data.result === 'success') {
                    var fileName = o.fileName,
                        url = data.imgUrls,
                        type = 'img';
                    p.html('<span title="' + fileName + '" class="file-title ' + type + '">' + fileName + '</span><span class="op"><a class="del" data-imgurl='+ url +' href="#">删除</a></span>');
                    !_this.parent().hasClass('error') || _this.parent().removeClass('error');
                    
                    if (uploaderNum >= conf.numLimit) {
                        /* failureInfo = $('<p class="error-info" style="display:inline; margin-left:32px; ">最多上传'+ conf.numLimit +'个图片，不能继续上传</p>');
                        _this.parent().before(failureInfo);
                        
                        setTimeout(function(){
                            failureInfo.slideUp(function(){ failureInfo.remove()});
                        }, 2000); */
                        _this.flash('disable');
                        return;
                    } else {
                        _this.flash('enable');
                    }
                }
                else {
                    p && p.find('.loading').get(0) && p.remove();
					errorHandler.call(_this, data);
                }
            }
        }
        
        //错误提示需要重新判断
        function errorHandler(data){
            var msg = '文件上传失败，请重新上传';
            var code = typeof data.errCode == 'string' ? data.errCode : data.errCode[0];
            switch (code) {
                case '>=2m':
                case 'SIZEERR':
                    msg = '上传的文件大小需在0-2MB之间，上传失败';
                    break;
                case 'ext name forbidden':
                case 'TYPEERR':
                    msg = '上传的文件类型不对，上传失败';
                    break;
                case 'not login':
                    msg = '未登陆';
                    break;
                case 'unknown error':
                    msg = "未知错误";
                    break;
            }
            
            var failp = $('<p class="error-info" style="display:inline; margin-left:32px; ">' + msg + '</p>');
            this.parent().after(failp);
            setTimeout(function(){
                failp.slideUp(function(){ failp.remove() });
            }, 2000);
        }
        opt = opt || {};
        $.extend(conf, opt);
        
        $.use('ui-flash-uploader', function(){
            var p, btn = _this, arr = [], delAttachs = [], addAttachs = [];
            
            btn.flash({
                module: conf.module,
                inputName: conf.inputName,
                fileFilters: conf.fileFilters,
                width: 82,
                height: 25,
                flashvars: {
                    buttonSkin: "http://img.china.alibaba.com/cms/upload/2011/040/820/28040_548721671.gif",
                    sizeLimitEach: 2 * 1024 * 1024,
                    dataTimeoutDelay: 20
                }
            })
            .bind('fileSelect.flash', conf.select )
            .bind('uploadStart.flash', conf.start )
            .bind('uploadCompleteData.flash', conf.complete )
            .bind('interfaceReady.flash', function(){
                //删除附件
                $('p.uploader-file-info a.del').live('click', function(){
                    var a = $(this),
                        p = a.closest('.uploader-file-info'),
                        uploaderNum = $(this).parent().siblings('p.uploader-file-info').length,
                        currentBtn = p.parent().find('.pics'),
                        hiddenInput = p.parent().find('input[type=hidden]');
                    
                    p.remove();
                    
                    if (uploaderNum < conf.numLimit) {
                        $('p.uploader-file-tip').remove();
                        currentBtn.flash('enable');
                    }
                    return false;
                });
            })
            .bind('finish.flash', function() {
                var uploaderNum = $(this).parent().siblings('p.uploader-file-info').length;
                
                if ($.isFunction(aliclick)) {
                    aliclick(this, '?tracelog=' + conf.tracelog);
                }
                
                if (uploaderNum < conf.numLimit) {
                    _this.flash('enable');
                }
            })
            .bind('uploadError.flash', function(e, o) {
                p && p.find('.loading').get(0) && p.remove();
				errorHandler.call(_this, 'error');
            });
        });
        return this;
    }
})(jQuery);
