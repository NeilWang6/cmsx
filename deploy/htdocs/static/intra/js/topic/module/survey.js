jQuery.namespace('FE.survey');
/**
 * author xianjia.wanxj
 * date 2011-5-31
 * �÷���$('#btn').uploader({});
 * copy from platform/purchase/module/uploader.js by Edgar 110806
 * modified by lusheng.linls
 */

;(function($, S){
    $.DEBUG = false;
    $.fn.surveyUploader = function(opt){
        var _this = this, p, attachmentArr = [];
        if(!opt.numLimit){
            opt.numLimit=1;
        }
        var conf = {
            numLimit: opt.numLimit,
            module: 'uploader',
            inputName: 'file',
            fileFilters: opt.fileFilters,
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
                
                var uploaderNum = $(this).parent().siblings('p.sur-uploader').length;
                
                $(this).flash('uploadAll', opt.url, {} );
                
                if ((uploaderNum + 1)  >= opt.numLimit) {
                    _this.flash('disable');
                }
            },
            //uploadStart
            start: function(e, o){
                _this.flash('disable');
                var fileName = o.fileName;
                if (fileName) {
                    p = $('<p class="sur-uploader"></p>');
                    p.html('<span class="sur-uploader-filetitle sur-uploader-loading" title="'+fileName+'" >'+fileName+'</span><span class="sur-uploader-op">�ϴ���</span>');
                    _this.parent().after(p);
                }
            },
            //uploadCompleteData
            complete: function(e, o) {
                var data = o.data || {},
                    failureInfo,
                    uploaderNum = $(this).parent().siblings('p.sur-uploader').length,
                    uploaderFiles,
                    hiddenInput = $(this).parent().find('input[type=hidden]');
                
                if (typeof data === 'string') {
                    data = $.parseJSON(data);
                }
                //�ϴ��ɹ�
                if (data && data.result === 'success') {
                    var fileName = o.fileName,
                        url = data.imgUrls,
                        type = 'sur-uploader-img';
                        if(!url || url.indexOf('.') == -1){
                            //url�����ڻ�û����չ��
                            p && p.find('.sur-uploader-loading').get(0) && p.remove();
                            data.errorCode='save type error';
                            errorHandler.call(_this, data);
                            return;
                        }
                        if(url){
                            if(url.indexOf('.xls') != -1){
                                type='sur-uploader-excel';
                            }else if(url.indexOf('.doc') != -1){
                                type='sur-uploader-word';
                            }
                        }
                    p.html('<span class="sur-uploader-filetitle ' + type + '" title="'+fileName+'">'+fileName+'</span><span class="sur-uploader-op"><a class="sur-uploader-del" data-imgurl='+ url +' href="#">ɾ��</a></span>');
                    !_this.parent().hasClass('error') || _this.parent().removeClass('error');
                    
                    if (uploaderNum >= opt.numLimit) {
                        /* failureInfo = $('<p class="sur-uploader-errorinfo" style="display:inline; margin-left:32px; ">����ϴ�'+ opt.numLimit +'��ͼƬ�����ܼ����ϴ�</p>');
                        _this.parent().before(failureInfo);
                        
                        setTimeout(function(){
                            failureInfo.slideUp(function(){ failureInfo.remove()});
                        }, 2000); */
                        _this.flash('disable');
                    } else {
                        _this.flash('enable');
                    }
                    uploaderFiles = $(this).parent().siblings('p.sur-uploader').find('.sur-uploader-del');
                    var arrFlash = [], strFlash;
                    uploaderFiles.each(function(i, elc) {
                        arrFlash.push($(elc).data('imgurl'));
                    });
                    strFlash = arrFlash.join('|');
                    hiddenInput.val(strFlash);
                }
                else {
                    p && p.find('.sur-uploader-loading').get(0) && p.remove();
                    errorHandler.call(_this, data);
                }
            }
        }
        
        //������ʾ��Ҫ�����ж�
        function errorHandler(data){
            var msg = '�ļ��ϴ�ʧ�ܣ��������ϴ�';
            var code = typeof data.errCode == 'string' ? data.errCode : data.errCode[0];
            switch (code) {
                case '>=2m':
                case 'SIZEERR':
                    msg = '�ϴ����ļ���С����0-2MB֮�䣬�ϴ�ʧ��';
                    break;
                case 'ext name forbidden':
                case 'TYPEERR':
                    msg = '�ϴ����ļ����Ͳ��ԣ�ֻ֧�֣�'+opt.fileFilters[0].extensions;
                    break;
                case 'not login':
                    msg = 'δ��½';
                    break;
                case 'unknown error':
                    msg = '���糬ʱ';
                    break;
                case 'save type error':
                    msg = '�ύ���ļ������⣬�޷�����';
                    break;
            }
            
            var failp = $('<p class="sur-uploader-errorinfo" style="display:block;">' + msg + '</p>');
            this.parent().after(failp);
            setTimeout(function(){
                failp.slideUp(function(){ failp.remove() });
            }, 5000);
        }
        $.use('ui-flash-uploader', function(){
            var p, btn = _this, arr = [], delAttachs = [], addAttachs = [];
            
            btn.flash({
                module: conf.module,
                inputName: conf.inputName,
                fileFilters: conf.fileFilters,
                width: 82,
                height: 22,
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
                //ɾ���
                $('body').delegate('a.sur-uploader-del','click',function(){
                    var a = $(this),
                        p = a.closest('.sur-uploader'),
                        uploaderFiles = p.siblings('p.sur-uploader').find('.sur-uploader-del');
                        currentBtn = p.parent().find('.sur-uploader-pics'),
                        hiddenInput = p.parent().find('input[type=hidden]');
                    
                    p.remove();
                    currentBtn.flash('enable');
                    var arrFlash = [], strFlash;
                    uploaderFiles.each(function(i, elc) {
                        arrFlash.push($(elc).data('imgurl'));
                    });
                    strFlash = arrFlash.join('|');
                    hiddenInput.val(strFlash);
                    return false;
                });
            })
            .bind('finish.flash', function() {
                var uploaderNum = $(this).parent().siblings('p.sur-uploader').length;
                if (uploaderNum < conf.numLimit) {
                    _this.flash('enable');
                }
            })
            .bind('uploadError.flash', function(e, o) {
                p && p.find('.sur-uploader-loading').get(0) && p.remove();
                errorHandler.call(_this, 'error');
            });
        });
        return this;
    }
})(jQuery,FE.survey);


/**
 * @author lusheng.linls
 * @usefor �����ʾ���Ⱦ
 * @dependency /static/fdevlib/js/fdev-v4/core/fdev-min.js
 * @date   2013.2.27
 * @help http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=???
 */
;(function($,S){
    var version='1.0.0',    //�汾��
    form,                   //�?���ǩ
    formModel,              //�?����
    isInit=false,           //�Ƿ���ɳ�ʼ��
    isSubmiting=false,      //�Ƿ������ύ�?
    customResLoading=0,     //��ʾ��customResLoading�����ƿؼ��������أ�0��ʾû��
    isFinishRender=false,   //�������Ƿ������Ⱦ
    config= {
            site : 'http://small.1688.com',  //���� �ʾ�λ��
            formId : null,  //���� �?������Ⱦ�������ǩ����,��ѡ����
            tid : null,  //���� ר��id
            csrf : null, //����
            code : null, //ѡ��
            ref : null, //ѡ��
            viewonly : false, //ѡ��
            doneUrl : null, //ѡ��
            loginUrl : null, //ѡ��
            debug :false,//ѡ�� �Ƿ�������ģʽ
            imgServer : 'http://img.china.alibaba.com'
        };

    var ERROR='ҳ�泬ʱ����ˢ������',
    INIT_ERROR='��ʼ��ʧ��';

    /** ��ʼ�� */
    S.init = function(opts){
        if(isInit){
            return;
        }
        config = $.extend(true, {}, config, opts);
        form=$(config.formId);
        if(form){
            form = form.empty().addClass('sur-form').append('<form></form>').find('form').append('<div class="sur-gmsg"></div>').hide();
        }
        
        if(!config.formId||!config.tid||!config.csrf||!config.site||!form){
            log(INIT_ERROR,config);
            if(form){
                showMsg(INIT_ERROR);
            }
            return;
        }
        isInit=true;
    }
    //��Ⱦ�?
    S.render = function(){
        if(!isInit){
            log('δ��ʼ���ɹ�');
            return;
        }
        var urlForQuery=config.site+'/topic/survey.json?_input_charset=UTF-8';
        var queryParams='tid='+config.tid;
        var urlForSubmit=config.site+'/topic/survey_submit.json?_input_charset=UTF-8';
        var submitParams='tid='+config.tid;
        if(config.code){
            queryParams=queryParams+'&code='+config.code;
            submitParams=submitParams+'&code='+config.code;
        }
        if(config.viewonly){
            queryParams=queryParams+'&viewonly='+config.viewonly;
        }
        if(config.ref){
            submitParams=submitParams+'&ref='+config.ref;
        }
        //��ʱ�����ǿ�������
        //�?��ѯ
        $.ajax({
                type: 'post',
                cache: false,
                url: urlForQuery,
                data: queryParams,
                success: function(rs){
                            if(!rs.success){
                                showErrorMsg(rs);
                                return;
                            }
                            if(!rs.model || !rs.model.base || !rs.model.items || rs.model.items.length==0){
                                showMsg('������Ϣ');
                                return;
                            }
                            formModel=rs.model;
                            S.formModel=formModel;
                            build(formModel);
                        },
                error: ajaxError
        });
        //�?�ύ
        form.delegate('.sur-js-submit','click',function(){
            var submitBtn=$(this);
            if(isSubmiting){
                return;
            }
            isSubmiting=true;
            submitBtn.text('�����ύ...');
            var moduleValidFailed=false;
            $('.sur-modulemsg').each(function(index){
                var el=$(this);
                var displayVal=el.css('display');
                if(displayVal&&displayVal!='none'){
                    moduleValidFailed=true;
                }
            });
            showInvalidMsg();
            if(moduleValidFailed){
                //��ģ��У��ʧ��
                isSubmiting=false;
                submitBtn.text('�ύ');
                return;
            }
            showMsg();
            var submitParamsTmp=submitParams;
            placeholderEnableSubmitFixed();
            var params=form.serialize();
            if(params){
                submitParamsTmp=submitParamsTmp+'&'+params;
            }
            if(config.csrf){
                submitParamsTmp=submitParamsTmp+'&_csrf_token='+config.csrf;
            }
            $.ajax({
                type: 'post',
                cache: false,
                url: urlForSubmit,
                data: submitParamsTmp,
                complete: function(jqXHR, textStatus){
                            isSubmiting=false;
                            submitBtn.text('�ύ');
                        },
                success: function(rs){
                            if(!rs.success){
                                showErrorMsg(rs);
                                return;
                            }
                            doneSubmit();
                        },
                error: ajaxError
            });
        });
    };


    /** ������� */
    //δ��½
    function notLogin(){
        var redirectBeforeLogin=formModelFind('redirectBeforeLogin');
        if(redirectBeforeLogin&&redirectBeforeLogin.conf.defaultValue){
            window.location.href=redirectBeforeLogin.conf.defaultValue;
            return;
        }
        if(config.loginUrl){
            window.location.href=config.loginUrl;
            return;
        }
        showMsg('���ȵ�½');
    }
    //����ύ��
    function doneSubmit(){
        var redirectAfterSubmitItem=formModelFind('redirectAfterSubmit');
        if(redirectAfterSubmitItem&&redirectAfterSubmitItem.conf.defaultValue){
            window.location.href=redirectAfterSubmitItem.conf.defaultValue;
            return;
        }
        if(config.doneUrl){
            window.location.href=config.doneUrl;
            return;
        }
        showMsg('�ύ�ɹ�');
    }


    /** ajax�ص���� */
    function ajaxError(){
        showMsg(ERROR);
    }

    /** �¼� */
    function buildAction(){
        //��ѡ�� ����
        form.delegate('.sur-radiobox','click',function(){
            var thisEl=$(this);
            thisEl.closest('.sur-quest').find('.sur-meta-other').hide();
            if(thisEl.prop('checked')==true){
                var metaOther=thisEl.closest('label').siblings('.sur-meta-other');
                metaOther.show();
                metaOther.find('input').focus();
            }
        });
        //��ѡ�� ����
        form.delegate('.sur-checkbox','click',function(){
            var thisEl=$(this);
            var metaOther=thisEl.closest('label').siblings('.sur-meta-other');
            if(thisEl.prop('checked')==true){
                metaOther.show();
                metaOther.find('input').focus();
            }else{
                metaOther.hide();
            }
        });
        //ѡ�� ����
        form.delegate('.sur-meta-otherinput,','blur',function(){
            var thisEl=$(this);
            var curBox=thisEl.closest('.sur-radio,.sur-check').find('.sur-radiobox,.sur-checkbox');
            var curDesc=curBox.closest('label').text();
            curBox.val(curDesc+':'+$.trim(thisEl.val()));
        });
    }

    /** ����?��� */
    function build(model){
        buildIntroduction(model);
        buildForm(model);
        buildOperate(model);
        buildAction();
        isFinishRender=true;
        //��������Ƿ�������
        if(customResLoading<=0){
            form.show();
        }
    }
    function buildIntroduction(model){
        //form.append('<div class="sur-title">'+model.base.name+'</div>');
        //form.append('<div class="sur-time">'+new Date(model.base.promotionBegin.time).toLocaleDateString()+'-'+new Date(model.base.promotionEnd.time).toLocaleDateString()+'</div>');

    }
    function buildForm(model){
        var items=model.items;
        for (var i = 0; i < items.length; i++) {
            if(!items[i] || !items[i].base || !items[i].conf){
                continue;
            }
            if(renderFN[items[i].base.ctrlType]){
                renderFN[items[i].base.ctrlType](items[i]);
            }
        };
        for (var i = 0; i < items.length; i++) {
            if(!items[i] || !items[i].base || !items[i].conf || !items[i].relations || items[i].relations.length==0){
                continue;
            }
            for (var j = 0; j < items[i].relations.length; j++) {
                if(relationFN[items[i].relations[j].type]){
                    relationFN[items[i].relations[j].type](items[i]);
                }
            }
        };
    }
    function buildOperate(model){
        if(!formModel.viewonly){
            var oper='<a class="sur-button sur-js-submit" href="javascript:void(0)">�ύ</a>';
            form.append($(tagItem(oper)).addClass('sur-operate'));
        }
    }
    /** �ؼ���ϵ���� �ο�:ItemRelationTypeEnum */
    var relationFN = {
        eitherOrNeed:function(item){
            //��ʱֻ�����У��
        }
    }
    /** ��Ⱦ�ؼ� */
    var renderFN = {
        html:function(item){
            form.append($(tagItem(item.conf.defaultValue)).data('item',item));
        },
        text:function(item){
            
            var field='<input class="input-text" type="text" value="'+item.value+'"'+attrName(item)+attrDisabled()+attrValid(item)+attrMaxLen(item)+attrAutoComp(item)+'/>';
            addFieldToForm(item,field);
        },
        textarea:function(item){
            var field='<textarea rows="5" cols="40"'+attrName(item)+attrDisabled()+attrValid(item)+attrMaxLen(item)+attrAutoComp(item)+'>'+item.value+'</textarea>';
            addFieldToForm(item,field);
        },
        select:function(item){
            var field='<select '+attrName(item)+attrDisabled()+attrValid(item)+attrAutoComp(item)+'><option></option>';
            if(item.meta&&item.meta.length>0){
                for (var i = 0; i < item.meta.length; i++) {
                    var selected='';
                    if(item.value==item.meta[i].metadataKey){
                        selected=' selected="true"';
                    }
                    field=field+'<option value="'+item.meta[i].metadataKey+'"'+selected+'>'+item.meta[i].value+'</option>';
                };
            }
            field=field+'</select>';
            addFieldToForm(item,field);
        },
        checkbox:function(item){
            var field='';
            if(item.meta&&item.meta.length>0){
                for (var i = 0; i < item.meta.length; i++) {
                    var uid=genUid();
                    var checked='';
                    var metaKey=item.meta[i].metadataKey;
                    var metaKeyForSubmit=item.meta[i].metadataKey;
                    var metaValue=item.meta[i].value;
                    var metaOther='';
                    var isMetaOther=metaKey&&metaKey.lastIndexOf(':')==metaKey.length-1;
                    var itemValue=item.value;
                    if(isMetaOther){
                        metaKey=metaKey.substr(0,metaKey.length-1);
                        metaValue=metaValue.substr(0,metaValue.length-1);
                        var showOther='';
                        var showValue='';
                        var iv =itemValue.split(',');
                        for (var j = 0; j < iv.length; j++) {
                            if(iv[j].indexOf(':')>=0&&iv[j].substr(0,iv[j].indexOf(':'))==metaKey){
                                checked=' checked="checked"';
                                metaKeyForSubmit=iv[j];
                                showOther=' style="display:inline-block;" ';
                                if(iv[j].indexOf(':')>=0){
                                    showValue=iv[j].substr(iv[j].indexOf(':')+1);
                                }
                                break;
                            }
                        }
                        metaOther='<span '+showOther+' class="sur-meta-other"><input '+attrDisabled()+' maxlength="30" placeholder="����д" class="input-text sur-meta-otherinput" type="text" value="'+showValue+'"><span class="sur-meta-otherrequired">&nbsp</span></span>';

                    }else if($.inArray(item.meta[i].metadataKey,item.value.split(','))>-1){
                        checked=' checked="checked"';
                    }
                    field=field+'<div class="sur-check"><label for="'+uid+'"><input class="sur-checkbox" type="checkbox" id="'+uid+'"'+checked+attrName(item)+attrDisabled()+attrValid(item)+attrAutoComp(item)+' value="'+metaKeyForSubmit+'"/>'+metaValue+'</label>'+metaOther+'</div>';
                };
            }
            addFieldToForm(item,field);
        },
        radio:function(item){
            var field='';
            if(item.meta&&item.meta.length>0){
                for (var i = 0; i < item.meta.length; i++) {
                    var uid=genUid();
                    var checked='';
                    var metaKey=item.meta[i].metadataKey;
                    var metaKeyForSubmit=item.meta[i].metadataKey;
                    var metaValue=item.meta[i].value;
                    var metaOther='';
                    var isMetaOther=metaKey&&metaKey.lastIndexOf(':')==metaKey.length-1;
                    var itemValue=item.value;
                    if(isMetaOther){
                        metaKey=metaKey.substr(0,metaKey.length-1);
                        metaValue=metaValue.substr(0,metaValue.length-1);
                        if(itemValue.indexOf(':')>=0){
                            itemValue=itemValue.substr(0,itemValue.indexOf(':'));
                        }
                    }
                    if(itemValue==metaKey){
                        checked=' checked="checked"';
                    }
                    if(isMetaOther){
                        var showOther='';
                        var showValue='';
                        if(itemValue==metaKey){
                            metaKeyForSubmit=item.value;
                            showOther=' style="display:inline-block;" ';
                            if(item.value.indexOf(':')>=0){
                                showValue=item.value.substr(item.value.indexOf(':')+1);
                            }
                        }
                        metaOther='<span '+showOther+' class="sur-meta-other"><input '+attrDisabled()+' maxlength="30" placeholder="����д" class="input-text sur-meta-otherinput" type="text" value="'+showValue+'"><span class="sur-meta-otherrequired">&nbsp</span></span>';
                    }
                    field=field+'<div class="sur-radio"><label for="'+uid+'"><input class="sur-radiobox" type="radio" id="'+uid+'"'+checked+attrName(item)+attrDisabled()+attrValid(item)+attrAutoComp(item)+' value="'+metaKeyForSubmit+'"/>'+metaValue+'</label>'+metaOther+'</div>';
                };
            }
            addFieldToForm(item,field);
        },
        uploadimg:function(item){
            uploader(item,{
                fileFilters : [{
                    description: "�ļ�(*.jpg,*.jpeg, *.gif, *.png)",
                    extensions: "*.jpg;*.jpeg;*.gif;*.png;"
                }]
            });
        },
        uploadfile:function(item){
            uploader(item,{
                fileFilters: [{
                        description: "�ļ�(*.jpg, *.jpeg, *.gif, *.png, *.doc, *.docx, *.xls, *.xlsx)",
                        extensions: "*.jpg;*.jpeg;*.gif;*.png;*.doc;*.docx;*.xls;*.xlsx;"
                    }]
            });
        },
        custom:function(item){
            //���ز���Ⱦ�������
            customResLoading++;
            $.add('survey-addons-'+item.base.id, {
                css: ['/static/intra/css/topic/module/surveymodule/'+item.base.id+'.css?uid='+genUid()],
                js: ['/static/intra/js/topic/module/surveymodule/'+item.base.id+'.js?uid='+genUid()],
                ver: "1.0"
            });
            $.use('survey-addons-'+item.base.id);
            form.append($(tagItem('<input type="hidden" name="'+item.base.id+'"/>'+tagMsg(item))).data('item',item).addClass('sur-ordernum-'+item.conf.orderNum));
        }

   };
   function uploader(item,conf){
        var field='<div><input type="hidden" name="'+item.base.id+'" value="'+item.value+'" /><div id="sur-uploader-'+item.base.id+'" class="sur-uploader-pics"></div></div>';
        addFieldToForm(item,field);
        var thisUploader=$('#sur-uploader-'+item.base.id);
        var thisUploaderParent=thisUploader.parent();
        if(formModel.viewonly){
            //ֻ��ģʽ
            uploadeFilesShowBack(thisUploaderParent,item);
        }else{
            var fileLimitExp=item.base.format.split('|||')[0];
            var fileLimit=1;
            if(fileLimitExp.cut(2)=='>='){
                fileLimit = 5;
            }else if(fileLimitExp.cut(2)=='<=' || fileLimitExp.cut(2)=='=='){
                if($.isNumeric(fileLimitExp.slice(2))){
                    fileLimit = fileLimitExp.slice(2);
                }
            }else if(fileLimitExp.cut(1)=='='){
                if($.isNumeric(fileLimitExp.slice(1))){
                    fileLimit = fileLimitExp.slice(1);
                }
            }else if(fileLimitExp.cut(1)=='>'){
                fileLimit = 5;
            }else if(fileLimitExp.cut(1)=='<'){
                if($.isNumeric(fileLimitExp.slice(1))){
                    fileLimit = fileLimitExp.slice(1)-1;
                }
            }
            thisUploader.surveyUploader({
                imgServer: config.imgServer,
                url: config.site+'/topic/upload_file.do',
                numLimit : fileLimit,
                fileFilters : conf.fileFilters
            });
            //����
            if(uploadeFilesShowBack(thisUploaderParent,item)){
                thisUploaderParent.append('<div class="sur-unimportant sur-fixie-inlineblock">�����ϴ��������Ѿ��ϴ����ļ�</div>');
            }
        }
   }
   function uploadeFilesShowBack(thisUploader,item){
        if(item.value){
            var thisUploaderDesc=$('<div class="sur-fixie-inlineblock"></div>');
            thisUploader.append(thisUploaderDesc);
            var uploaderUrls=item.value.split('|');
            for (var i = 0; i < uploaderUrls.length ; i++) {
                var type = 'sur-uploader-img';
                var tips='';
                if(uploaderUrls[i]){
                    if(uploaderUrls[i].indexOf('.xls') != -1){
                        type='sur-uploader-excel';
                    }else if(uploaderUrls[i].indexOf('.doc') != -1){
                        type='sur-uploader-word';
                    }
                    if(uploaderUrls[i].indexOf('.docx')!=-1||uploaderUrls[i].indexOf('.xlsx')!=-1){
                        tips='�������ʱ����������Ҽ����Ϊ...'
                    }
                    thisUploaderDesc.append('<a target="_blank" class="sur-download '+type+'" title="'+tips+'" href="'+config.imgServer+'/bttopic/'+uploaderUrls[i]+'">�ļ�'+(i+1)+'</a>');
                }
            };
            
            return true;
        }
        return false;
   }
    //��ӵ��?���
    function addFieldToForm(item,field){
        var html=tagName(item)+tagRequired(item)+tagMsg(item)+tagQuest(field);
        form.append($(tagItem(html)).data('item',item));
    }
    //��ӵ��?ָ��λ��
    S.addToForm=function(item,field){
        form.find('.sur-ordernum-'+item.conf.orderNum).append(field);
    }
    S.setModuleMsg=function(item,msg){
        var node=$('.surm-'+item.base.id).closest('.sur-item').find('.sur-modulemsg').html(msg);
        if(msg){
            node.show();
        }else{
            node.hide();
        }
    }
    //ÿ������ģ��ֻ�ܵ�һ�Σ����ұ����
    S.Imfinish=function(){
        customResLoading--;
        //��ض�������Ƿ�ȫ���������
        if(customResLoading<=0){
            placeholderEnable();
            form.show();
        }
    }
    /** ���߷��� */
    //���ȫ��Ψһid
    function genUid(){
        return 'sur'+(version+Math.random()).replace(/\D/g,'')+($.guid++);
    }
    //placeholder ֧��ie6
    function placeholderEnable(){
        if (!$.support.placeholder) {
            form.delegate('input[placeholder], textarea[placeholder]','focus',function(){
                el = $(this);
                var defValue = el.attr('placeholder');
                if (this.value === '' || this.value === defValue) {
                        el.css('color', '#333');
                        this.value = '';
                    }
            });
            form.delegate('input[placeholder], textarea[placeholder]','blur',blurHandler);
            $('input[placeholder], textarea[placeholder]').each(function(i, el){
                blurHandler.call($(el)[0]);
            });
            function blurHandler(){
                el = $(this);
                var defValue = el.attr('placeholder'), defColor = el.css('color');
                if (this.value === '' || this.value === defValue) {
                    el.css('color', '#999');
                    this.value = defValue;
                }
            }
        }
    }
    //�ύǰ���placeholder
    function placeholderEnableSubmitFixed(){
        if (!$.support.placeholder) {
            $('input[placeholder], textarea[placeholder]').each(function(i, el){
                el = $(el);
                if (el.val() === el.attr('placeholder')) {
                    el.val('');
                }
            });
        }
    }
    function formModelFind(ctrlType){
        var items=formModel.items;
        for (var i = 0; i < items.length; i++) {
            if(!items[i] || !items[i].base || !items[i].conf){
                continue;
            }
            if(ctrlType==items[i].base.ctrlType){
                return items[i];
            }
        };
    }
    S.formModelFindByItemId=function(itemId){
        var items=formModel.items;
        for (var i = 0; i < items.length; i++) {
            if(!items[i] || !items[i].base || !items[i].conf){
                continue;
            }
            if(itemId==items[i].base.id){
                return items[i];
            }
        };
    }
    function log(msg,obj){
        if(!config.debug){
            return;
        }
        if(!console||!console.log){
            return;
        }
        if(msg){
            console.log(msg);
        }
        if(obj){
            console.log(obj);
        }
    }
    //��ʾ��ʾ��Ϣ
    function showMsg(msg){
        if(msg){
            form.find('.sur-gmsg').html(msg).show();
            form.show();
            autoscroll('.sur-gmsg');
        }else{
            form.find('.sur-gmsg').html('').hide();
        }
    }
    //��ʾ������ʾ��Ϣ
    function showErrorMsg(rs){
        if(rs.model){
            var spliteIndex=rs.model.search(':');
            var errorMsg=rs.model.slice(spliteIndex+1);
            var errorCode=rs.model.cut(spliteIndex);
            if(spliteIndex==-1){
                showMsg(rs.model);
            }else{
                switch(errorCode){
                    case 'NOT_ALLOW_REASON_NOT_LOGIN':
                        notLogin();
                        break;
                    case 'NOT_ALLOW_REASON_INPUT_INVALID':
                        showInvalidMsg(rs.invalidMsg);
                        break;
                    default:
                        //do nothing
                        break;
                }
                if(errorMsg){
                    showMsg(errorMsg);
                }else{
                    showMsg(errorCode);
                }
            }
        }else{
            showMsg(ERROR);
        }
    }
    //��ʾУ��ʧ����ʾ��Ϣ
    function showInvalidMsg(invalidMsg){
        form.find('.sur-msg').hide();
        if(!invalidMsg){
            return;
        }
        $.each(invalidMsg,function(key, value){
            var itemSel='[name="'+key+'"]';
            form.find(itemSel).closest('.sur-item').find('.sur-msg').text(value).show();
        });
    }
    function autoscroll(selector) {
        $('html,body').scrollTop($(selector).offset().top); 
    }


    /** �����ǩ */
    function tagQuest(html){
        return '<div class="sur-quest">'+html+'</div>';
    }
    function tagItem(html){
        return '<div class="sur-item">'+html+'</div>';
    }
    function tagMsg(item){
        return '<span class="sur-msg"></span><span class="sur-modulemsg"></span>';
    }
    function tagRequired(item){
        if(item.conf.isNeed=='y'){
            return '<span class="sur-required" title="����">&nbsp</span>';
        }
        return '<span class="sur-norequired">&nbsp</span>';
    }
    function tagName(item){
        if(!item.base.name){
            return '';
        }
        return '<span class="sur-title">'+item.base.name+'</span>';
    }


    /** �������� */
    function attrName(item){
        if(!item.base.id){
            return '';
        }
        return ' name="'+item.base.id+'"';
    }
    function attrDisabled(){
        if(formModel.viewonly){
            return ' disabled="disabled"';
        }
    }
    function attrMaxLen(item){
        if(!item.conf.maxLen||item.conf.maxLen=='0'){
            return '';
        }
        return ' maxlength="'+item.conf.maxLen+'"';
    }
    function attrAutoComp(item){
        return ' autocomplete="off"';
    }
    function attrValid(item){
        var valid=' data-valid="{required:'+(item.conf.isNeed=='y');
        if(item.base.format){
            valid=valid+',type:\'reg\',reg:/^[a-z]\w{3,}$/i';
        }
        valid=valid+',key:\''+item.base.id+'\'}"';
        return valid;
    }

})(jQuery,FE.survey);