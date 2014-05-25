/**
 * author jiankai.xujk modify by hongss on 2012.09.28
 * date 2012-8-14
 * �÷���$('#btn').uploader({});
 * copy from platform/purchase/module/uploader.js by Edgar 110806
 * modified by jiankai.xujk
 */
(function ($) {
  $.DEBUG = false;
  $.fn.uploader = function (opt) {
    var _this = this, p, attachmentArr = [];
    var conf = {
      numLimit: 1,
      module: 'uploader',
      inputName: 'file',
      width: 82,
      height: 25,
      flashvars: {
        buttonSkin: "http://img.china.alibaba.com/cms/upload/2011/374/051/150473_1428599264.png",
        sizeLimitEach: 2 * 1024 * 1024,
        dataTimeoutDelay: 20
      },
      fileFilters: [{
        description: "�ļ�(*.bmp, *.jpg, *.jpeg, *.png)",
        extensions: "*.bmp;*.jpg;*.jpeg;*.png;"
      }],
      //fileSelect
      select: function (e, data) {
        if (data.filesRefused.length) {
          var errCode;
          switch (data.filesRefused[0].reason) {
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
        var url = $('#new-content').data('uploadurl')/*,
          uploaderNum = $(this).parent().siblings('p.uploader-file-info').length*/;
        $(this).flash('uploadAll', url, {});
        /*if ((uploaderNum + 1) >= conf.numLimit) {
          _this.flash('disable');
        }*/
      },
      //uploadStart
      start: function (e, o) {
        _this.flash('disable');
        var fileName = o.fileName;
        if (fileName) {
          /*p = $('<p class="uploader-file-info"></p>');
          p.html('<span title="' + fileName + '" class="file-title loading">' + fileName + '</span><span class="op">�����ϴ�...</span>');
          _this.parent().after(p);*/
          var p = _this.parent().find('.upload-info');
          p.show();
          p.html('<span title="' + fileName + '" class="file-title loading">' + fileName + '</span><span class="size">�����ϴ�...</span><span class="delete-con"></span>');
          p.siblings('span').hide();
        }
      },
      //uploadCompleteData
      complete: function (e, o) {
        var data = o.data || {},
          failureInfo, 
          //uploaderNum = $(this).parent().siblings('p.uploader-file-info').length,
          p = _this.parent().find('.upload-info'),
          uploadImage = _this.closest('.uplod-image'),
          hiddenInput = $(this).parent().find('input[type=hidden]');
        
        if (typeof data === 'string') {
          data = $.parseJSON(data);
        }
        //�ϴ��ɹ�
        if (data && data.result === 'success') {
          var fileName = o.fileName,
            url = data.imgUrls,
            fileSize = data.fileSize || '',
            type = 'img';
          
          p.html('<span title="' + fileName + '" class="file-title ' + type + '">' + fileName + '</span><span class="size">'+fileSize+'</span><span class="delete-con"><a class="del" data-imgurl=' + url + ' href="#">ɾ��</a></span>');
          /*!_this.parent().hasClass('error') || _this.parent().removeClass('error');*/
          hiddenInput.val(url);
          //ȥ��������Ϣ
          uploadImage.removeClass('error');
          
          _this.hide();
          _this.next('.success').show();
        } else {
          _this.flash('enable').show();
          uploadImage.addClass('error');
          p.hide();
          p.siblings('span').show();
          //p && p.find('.loading').get(0) && p.remove();
          //errorHandler.call(_this, data);
        }
      }
    }
    //������ʾ��Ҫ�����ж�

    function errorHandler(data) {
      var msg = '�ļ��ϴ�ʧ�ܣ��������ϴ�';
      var code = typeof data.errCode == 'string' ? data.errCode : data.errCode[0];
      switch (code) {
      case '>=2m':
      case 'SIZEERR':
        msg = '�ϴ����ļ���С����0-2MB֮�䣬�ϴ�ʧ��';
        break;
      case 'ext name forbidden':
      case 'TYPEERR':
        msg = '�ϴ����ļ����Ͳ��ԣ��ϴ�ʧ��';
        break;
      case 'not login':
        msg = 'δ��½';
        break;
      case 'unknown error':
        msg = "δ֪����";
        break;
      }
      var failp = $('<p class="error-info" style="display:inline;">' + msg + '</p>');
      this.parent().after(failp);
      setTimeout(function () {
        failp.slideUp(function () {
          failp.remove()
        });
      }, 2000);
    }
    
    opt = opt || {};
    $.extend(conf, opt);
    
    //ɾ������
        $('p.upload-info a.del').live('click', function (e) {
          e.preventDefault();
          var a = $(this),
            p = a.closest('.upload-info'),
            flashEl = p.closest('.input-upload').find('.ui-flash'),
            hiddenInput = flashEl.parent().find('input[type=hidden]');
          
          hiddenInput.val('');
          p.html('').hide();
          
          p.siblings('span').show();
          flashEl.flash('enable').show();
          
          flashEl.closest('.uplod-image').addClass('error');
          console.log();
          flashEl.next('.success').hide();
          
        });
        
    $.use('ui-flash-uploader', function () {
      var p, btn = _this, 
        arr = [],
        delAttachs = [],
        addAttachs = [];
      btn.flash({
        module: conf.module,
        inputName: conf.inputName,
        fileFilters: conf.fileFilters,
        width: conf.width,
        height: conf.height,
        flashvars: conf.flashvars
        /*width: 82,
        height: 25,
        flashvars: {
          buttonSkin: "http://img.china.alibaba.com/cms/upload/2011/374/051/150473_1428599264.png",
          sizeLimitEach: 2 * 1024 * 1024,
          dataTimeoutDelay: 20
        }*/
      }).bind('fileSelect.flash', conf.select).bind('uploadStart.flash', conf.start).bind('uploadCompleteData.flash', conf.complete).bind('interfaceReady.flash', function () {
        //ɾ������
        /*$('p.upload-info a.del').live('click', function (e) {
          e.preventDefault();
          var a = $(this),
            p = a.closest('.upload-info'),
            hiddenInput = _this.parent().find('input[type=hidden]');
          console.log(p);
          hiddenInput.val('');
          p.html('').hide();
          
          p.siblings('span').show();
          _this.flash('enable').show();
          
          _this.closest('.uplod-image').find('.error').show();
          _this.next('.success').hide();
          
        });*/
      }).bind('finish.flash', function () {
        //var uploaderNum = $(this).parent().siblings('p.uploader-file-info').length;
        if ($.isFunction(aliclick)) {
          aliclick(this, '?tracelog=' + conf.tracelog);
        }
        /*if (uploaderNum < conf.numLimit) {
          _this.flash('enable');
        }*/
      }).bind('uploadError.flash', function (e, o) {
        //p && p.find('.loading').get(0) && p.remove();
        //errorHandler.call(_this, 'error');
        var p = _this.parent().find('.upload-info');
        _this.flash('enable').show();
        _this.closest('.uplod-image').addClass('error');
        p.hide();
        p.siblings('span').show();
      });
    });
    return this;
  }
})(jQuery);