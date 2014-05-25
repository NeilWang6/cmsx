/**
 * @author springyu
 */
;(function($, D) {
    var DataInterController = D.Class();
    /**
     * ��ʼ������
     */
    DataInterController.fn.init = function() {
        this.service = new D.DataIntervention();
        // this.service.init();
        this.oInputs = $('input[type=text]');
        this.oSaveBtn = $('#btn-save');
        this.localUpload = $('span.local-upload');

    };
    DataInterController.include({

        load : function() {
            var self = this;
            this.oInputs.bind('input', (function(e) {
                var $self = $(this);
                self.service.inputTip($self);
            }));
            this.oSaveBtn.bind('click', (function(event) {
                event.preventDefault();
                self.service.saveDataInter($('li.list'));
            }));

        },
        upload : function() {
            var errorMessage = {
                'img_too_big' : '�ļ�̫��',
                'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
                'img_optimization_required' : '��С����',
                'unauthorized' : '��ȫУ�鲻ͨ��',
                'unknown' : 'δ֪����'
            },
            // ���ύ��ַ
            url = $('#dcms_upload_url').val(), self = this,
            // ��ťƤ��
            buttonSkin = 'http://img.china.alibaba.com/cms/upload/2012/654/092/290456_417709751.png';
            $.use('ui-flash-uploader', function() {
                //console.log($('span.local-upload'));
                self.localUpload.flash({
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
                    var $oFlash = $(this);
                    //console.log(data);
                    if(data.success === '1') {// �ϴ��ɹ�
                        var $selfParent = $oFlash.parent().parent().parent();
                        var offerUrl = $('input[name=OFFERIMGURL]',$selfParent);
                         
                        offerUrl.val(data.url);
                        offerUrl.addClass('update');
                        offerUrl.addClass('change');
                        //$('#thumbnail').val(data.url);
                        $('img',$selfParent).attr("src", data.url);
                        //$('#thumbimg').attr("src", data.url);
                        //alert('�ϴ��ɹ�');

                    } else {// �ϴ�ʧ��
                        alert(errorMessage[data.msg]);
                    }
                });
            });
        }
    });
    D.DataInterController = DataInterController;
})(dcms, FE.dcms);
