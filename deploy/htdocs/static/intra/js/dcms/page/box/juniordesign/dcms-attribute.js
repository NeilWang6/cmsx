/**
 * @usefor 属性bar
 * @author zhuguo.nizg
 * @date 2011.12.29
 */
;(function($, D) {
    var Attribute = {
        panel : $('div.js-dialog'),

        init : function() {
            this.initLinkAttr();
            this.initHoverAttr();
            this.initFontAttr();
            this.initMarginAttr();
            this.initPaddingAttr();
            this.initHeightWidthAttr();
            this.initBorderAttr();
            this.initBackgroundAttr();
            this.initImageAttr();
        },
        initLinkAttr : function() {
            var linkAttr = $('div.link-attr', this.panel);
            if(!linkAttr.length) {
                return;
            }

            $('input[type=checkbox]', linkAttr).click(function() {
                var self = $(this), parent = self.parents('div.attr-type'), linkHref = parent.find('textarea[name=link-href]'), linkTitle = parent.find('input[name=link-title]');

                if(self[0].checked) {
                    linkHref.removeAttr('readonly').removeClass('readonly').focus();
                    linkTitle.removeAttr('readonly').removeClass('readonly');
                } else {
                    linkHref.attr('readonly', true).addClass('readonly');
                    linkTitle.attr('readonly', true).addClass('readonly');
                }
            });
        },
        initHoverAttr : function() {
            var hoverAttr = $('div.hover-attr', this.panel);
            if(!hoverAttr.length) {
                return;
            }
            this._bindColorBox($('span.color-preview', hoverAttr));
        },
        initFontAttr : function() {
            var fontAttr = $('div.font-attr', this.panel);
            if(!fontAttr.length) {
                return;
            }

            this._bindColorBox(fontAttr.find('span.color-preview'));
        },
        initMarginAttr : function() {
        },
        initPaddingAttr : function() {
        },
        initHeightWidthAttr : function() {
        },
        initBorderAttr : function() {
            var borderAttr = $('div.border-attr', this.panel);
            //radius     = borderAttr.find('input[name=border-radius]'),
            // borderList = borderAttr.find('li input[type=checkbox]');

            if(!borderAttr.length) {
                return;
            }

            this._bindColorBox(borderAttr.find('span.color-preview'));

        },
        initBackgroundAttr : function() {
            var backgroundAttr = $('div.background-attr', this.panel), noRepeat = backgroundAttr.find('input[name=no-repeat]'), repeatXY = backgroundAttr.find('div.bg-repeat input[name!=no-repeat]');

            noRepeat.click(function() {
                var self = $(this), parent = self.parent();
                if(this.checked) {
                    parent.find('input[name=repeat-x]')[0].checked = false;
                    parent.find('input[name=repeat-y]')[0].checked = false;
                }
            });
            repeatXY.click(function() {
                var self = $(this), parent = self.parent();
                if(this.checked) {
                    parent.find('input[name=no-repeat]')[0].checked = false;
                }
            });

            this._bindLocalUpload(backgroundAttr.find('div.local-upload'));
            this._bindColorBox(backgroundAttr.find('span.color-preview'));
            this._bindLinkUpload(backgroundAttr.find('div.link-upload button'));
            //this._bindBannerMakerUpload(backgroundAttr.find('div.banner-maker-upload button'));
        },
        initImageAttr : function() {
            var imageAttr = $('div.image-attr', this.panel);
            if(!imageAttr.length) {
                return;
            }
            //console.log(imageAttr.find('div.local-upload'));
            this._bindLocalUpload(imageAttr.find('div.local-upload'));
            this._bindLinkUpload(imageAttr.find('div.link-upload button'));
            //this._bindBannerMakerUpload(imageAttr.find('div.banner-maker-upload button'));
        },
        /*
         * @usefor    : 绑定ColorBox
         * @author    : zhuguo.nizg
         * @date      : 2012-01-14
         */
        _bindColorBox : function(button) {
            var input = button.parent().find('input.color-box');
            $.use('ui-colorbox', function() {
                button.colorbox({
                    select : function(event, object) {
                        var self = $(this);
                        var input = self.parent().find('input.color-box');
                        self.css({
                            "background" : object.color
                        }).colorbox('hide');
                        input.val(object.color.substring(1)).trigger('change');

                        /**
                         * 取色板颜色改变触发事件
                         */
                        if(D.bottomAttr && D.bottomAttr.colorBoxChange && typeof D.bottomAttr.colorBoxChange === 'function') {
                            D.bottomAttr.colorBoxChange(self, input.val());
                        }
                    },
                    transparent : true
                });

                input.change(function() {
                    var parent = $(this).parent().find('span.color-preview').css({
                        "background" : '#' + this.value
                    });
                    D.YunYing&&D.YunYing.isVisualChange();
                });
            });
        },
        /*
         * @usefor    : 绑定flash图片上传组件
         * @author    : zhuguo.nizg
         * @date      : 2012-01-14
         */
        _bindLocalUpload : function(uploadButton) {
            var Attribute = this,
            // 表单提交地址
            url = $('#dcms_upload_url').val(),
            // 按钮皮肤
            buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/338/005/500833_983650061.png';
            //http://img.china.alibaba.com/cms/upload/2012/338/005/500833_983650061.png
            //buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';

    
            if($('#attach').length <= 0) {
                $('.link-upload','.attr').before('<a id="attach" class="btn-basic btn-gray" style="display:inline-block;margin-left:58px;">本地上传</a>');
            }
            var $input = $('#attach').browseElement();

            /****/
            $input.bind('change', function(event) {
                var dcms_upload_url = $('#dcms_upload_url').val();
                var files = this.files;
                for(var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if(file.size > 1024 * 1024) {//>=1M
                        fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString();
                        D.Msg.error({
                            message : "提示：文件太大，无法上传！",
                            timeout : 5000
                        });
                        return;
                    } else {//<1M
                        fileSize = (Math.round(file.size * 100 / 1024) / 100).toString();
                        if(fileSize > 512) {
                            D.Msg.error({
                                message : "提示：文件太大，无法上传！",
                                timeout : 5000
                            });
                            return;
                        }
                    }
                    (function(file) {
                        var formData = new FormData($('<form/>')[0]);
                        formData.append('Filedata', file);

                        $.upload(dcms_upload_url, formData, {
                            success : function(text) {
                                var data = $.unparam(text);
                                if(data.success === '1') {//上传成功
                                    var uploads = $('.link-upload').parents('div.attr-type').find('div.uploads');
                                    uploads.data('url', data.url);
                                    uploads.data('adboardid', '');
                                    uploads.trigger('change');
                                    return;
                                } else {//上传失败
                                    D.Msg.error({
                                        message : Attribute.errorMessage[data.msg],
                                        timeout : 5000
                                    });
                                }
                            }
                        });
                    })(file);
                }
      
            });
        },
        _bindLinkUpload : function(button) {
            var parent = button.parents('div.attr-type'), popup = parent.find('div.popup'), btnOk = popup.find('a.btn-ok');
            button.bind('click', function(e) {
                e.preventDefault();
                var self = $(this), parent = self.parents('div.attr-type'), popup = parent.find('div.popup'), btnOk = popup.find('a.btn-ok'), uploads = parent.find('div.uploads'), linkAddr = popup.find('input.link-addr');
                linkAddr.bind('click', function(event) {
                    this.select();
                });
                if(popup.css('display') === "none") {
                    linkAddr[0].value = uploads.data('url') || '';
                    popup.show();
                    self.html('取消上传');
                } else {
                    popup.hide();
                    self.html('链接上传');
                }
            });

            btnOk.click(function(e) {
                e.preventDefault();
                var self = $(this), parent = self.parents('div.attr-type'), popup = parent.find('div.popup'), uploads = parent.find('div.uploads'), button = parent.find('div.link-upload button'), linkAddr = popup.find('input.link-addr'), url = linkAddr[0].value;

                uploads.data('url', url);
                uploads.data('adboardid', '');
                button.html('链接上传');
                popup.hide();
                uploads.trigger('change');
            });
            //parent.bind('mouseup', function(e) {
            // e.preventDefault();
            //var _self = $(e.target);
            //if(!(_self.hasClass('popup') || _self.parent().hasClass('popup'))) {
            //console.log(1111);
            // popup.hide();
            //button.html('链接上传');
            // }
            //});
        },

        errorMessage : {
            'img_too_big' : '文件太大',
            'invalid_img_type' : '文件类型不合法',
            'img_optimization_required' : '大小超标',
            'unauthorized' : '安全校验不通过',
            'unknown' : '未知错误'
        }

    };

    D.Attribute = Attribute;
})(dcms, FE.dcms);
