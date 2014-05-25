/**
 * @usefor ����bar
 * @author zhuguo.nizg
 * @date 2011.12.29
 */
;(function($, D) {
    var Attribute = {
        panel : $('div.dcms-box-attr'),

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

            // Բ�� checkbox
            /*radius.change(function(){
             var self = $(this),
             value = parseInt(this.value),
             parent = self.parents('div.attr-type');

             if(value){
             this.value = value;
             parent.find('li input[type=checkbox]').each(function(){
             this.checked = true;
             this.disabled = true;
             });
             } else {
             this.value = '';
             parent.find('li input[type=checkbox]').each(function(){
             this.disabled = false;
             });
             }
             });
             */
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
            this._bindBannerMakerUpload(backgroundAttr.find('div.banner-maker-upload button'));
        },
        initImageAttr : function() {
            var imageAttr = $('div.image-attr', this.panel);
            if(!imageAttr.length) {
                return;
            }
            //console.log(imageAttr.find('div.local-upload'));
            this._bindLocalUpload(imageAttr.find('div.local-upload'));
            this._bindLinkUpload(imageAttr.find('div.link-upload button'));
            this._bindBannerMakerUpload(imageAttr.find('div.banner-maker-upload button'));
        },
        /*
         * @usefor    : ��ColorBox
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
                         * ȡɫ����ɫ�ı䴥���¼�
                         */
                        if(D.bottomAttr && D.bottomAttr.colorBoxChange && typeof D.bottomAttr.colorBoxChange === 'function') {
                            D.bottomAttr.colorBoxChange(self, input.val());
                        }
                    },
                    transparent:true
                });

                input.change(function() {
                    var parent = $(this).parent().find('span.color-preview').css({
                        "background" : '#' + this.value
                    });
                });
            });
        },
        /*
         * @usefor    : ��flashͼƬ�ϴ����
         * @author    : zhuguo.nizg
         * @date      : 2012-01-14
         */
        _bindLocalUpload : function(uploadButton) {
            var Attribute = this,
            // ���ύ��ַ
            url = $('#dcms_upload_url').val(),
            // ��ťƤ��
            //buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/857/072/270758_1357790532.png';
            buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/081/364/463180_133354742.png';
             
            $.use('ui-flash-uploader', function() {
                
                uploadButton.flash({
                    module : 'uploader',
                    width : 69,
                    height : 23,
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
                        var uploads = $(this).parents('div.attr-type').find('div.uploads');
                        uploads.data('url', data.url);
                        uploads.data('adboardid', '');
                        uploads.trigger('change');
                    } else {//�ϴ�ʧ��
                        alert(Attribute.errorMessage[data.msg]);
                    }
                });
            });
        },
        _bindLinkUpload : function(button) {
            var parent = button.parents('div.attr-type'), popup = parent.find('div.popup'), btnOk = popup.find('a.btn-ok');

            button.bind('click',function(e) {
                 e.preventDefault();
                var self = $(this), parent = self.parents('div.attr-type'), popup = parent.find('div.popup'), 
                btnOk = popup.find('a.btn-ok'), uploads = parent.find('div.uploads'), 
                linkAddr = popup.find('input.link-addr');
                 linkAddr.bind('click',function(event){
                     this.select();
                 });
                if(popup.css('display') === "none") {
                    linkAddr[0].value = uploads.data('url') || '';
                    popup.show();
                    self.html('ȡ���ϴ�');
                } else {
                    popup.hide();
                    self.html('�����ϴ�');
                }
            });

            btnOk.click(function(e) {
                e.preventDefault();
                var self = $(this), parent = self.parents('div.attr-type'), popup = parent.find('div.popup'), uploads = parent.find('div.uploads'), button = parent.find('div.link-upload button'), linkAddr = popup.find('input.link-addr'), url = linkAddr[0].value;

                uploads.data('url', url);
                uploads.data('adboardid', '');
                button.html('�����ϴ�');
                popup.hide();
                uploads.trigger('change');
            });
            //parent.bind('mouseup', function(e) {
               // e.preventDefault();
               //var _self = $(e.target);
                //if(!(_self.hasClass('popup') || _self.parent().hasClass('popup'))) {
                     //console.log(1111);
                   // popup.hide();
                    //button.html('�����ϴ�');
               // }
            //});
        },
        /*
         * @usefor    : ����bannerMaker����ͼƬ
         * @author    : lusheng.linls
         * @date      : 2012-05-14
         */
        _bindBannerMakerUpload : function(button) {
        	button.bind('click',function(e) {
	            e.preventDefault();
			    var parent = button.parents('div.attr-type'), uploads = parent.find('div.uploads'),confirmEl = $('#dcms-message-confirm-2');
			    var draftId=$('#draftId').val();
			    if(!draftId){
			    	alert('���ȱ���һ�Σ���ʹ�ô˹���');
			    	return;
			    }
			    D.Message.confirm(confirmEl, {
        						msg : '�Ƿ���BannerMaker����ɲ���<br/>(ע�⣺�����ڶ�������ϱ༭ͬһ���ݸ�)',
        						title : '',
        						enter : function() {
        							$.ajax({
						                url: D.domain + '/page/bannermaker/query_bm.htm?draft_id='+draftId,
						                success: function(o){
						                    o = $.parseJSON(o);
						                    if (o.success===true){
						                    	uploads.data('url', o.img_url);
											    uploads.data('adboardid', o.adboard_id);
											    uploads.trigger('change');
											    return;
						                    }
											alert('δ���κ��޸ģ�');
						                },
						                error: function(){
						                    alert('����ʧ�ܣ�');
						                }
        							});
        						}
        					});
        		//��bannerMaker
        		var url = D.domain + '/page/bannermaker/goto_banner_maker.do?draft_id='+draftId;
			    if(uploads.data('adboardid')){
			    	url=url+'&adboard_id='+uploads.data('adboardid');
			    }
        		var form=$('<form target="_blank" method ="POST" action="'+url+'"><input type="submit" /></form>').appendTo('body');
        		form.submit();
        		form.remove();
        		//setTimeout(function(){
        		//},2000);
            });
        },
        errorMessage : {
            'img_too_big' : '�ļ�̫��',
            'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
            'img_optimization_reuired' : '��С����',
            'unauthorized' : '��ȫУ�鲻ͨ��',
            'unknown' : 'δ֪����'
        }

    };

    D.Attribute = Attribute;
})(dcms, FE.dcms);
