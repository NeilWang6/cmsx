/**
 * @package FD.app.cms.rule.create
 * @author: hongss
 * @Date: 2011-03-06
 */

 ;(function($, D){
     var formValid,
     timeStartEl = $('#start-time'),
     timeEndEl = $('#end-time'),
     dateFormat = 'yy-MM-dd hh:mm',
     cmsdomain = D.domain,
     readyFun = [
        /**
         * Ŀ¼ ������
         */
        function(){
            var ruleCategory = new D.Category($('#ruleCategoryOne'), $('#ruleCategoryTwo'), cmsdomain);
            ruleCategory.reset($('#catalogId').val(),$('#catalogChildId').val());
        },
        /**
         * ����֤
         */
        function(){

            var formEl = $('#putRuleForm'),
            els = formEl.find('[vg=1]');
            //����֤���
            formValid = new FE.ui.Valid(els, {
                //evt:'change',
                onValid: function(res, o) {
                    var tip = $(this).nextAll('.dcms-validator-tip'), msg;
                    if (tip.length>1){
                        for (var i=1, l=tip.length; i<l; i++){
                            tip.eq(i).remove();
                        }
                    }
                    if (res==='pass') {
                        tip.removeClass('dcms-validator-error');
                    } else {
                        switch (res){
                            case 'required':
                                msg = '����д'+o.key;
                                break;
                            case 'fun':
                                if (o.key==='�û�Ⱥ����'){
                                    $('#dcms-terms-message').hide();
                                }
                                msg = o.msg;
                                break;
                            case 'nameisExisted' :
                                msg = o.key + '�Ѿ�����';
                                break;
                            case 'quoteNameisExisted' :
                                msg = o.key + '�Ѿ�����';
                                break;
                            case 'templateNameIsWrong' :
                                msg = o.key + '��Ч';
                                break;
                            case 'nameFormatIsWrong' :
                                msg = '����ĸa~z�������ִ�Сд��������0~9�����ġ����Ż��»������';
                                break;
                                case 'quoteNameFormatisWrong' :
                                msg = '����ĸa~z�������ִ�Сд��������0~9���»������';
                                break;
                            default:
                                msg = '����д��ȷ������';
                                break;
                        }
                        tip.text(msg);
                        tip.addClass('dcms-validator-error');
                    }
                }
            });
            formEl.submit(function(){
                return formValid.valid();
            });
            
            //�û�Ⱥ������Ϣ��ʾ ����/��ʾ �¼�
            $('#dcms-terms-message .hide-tag').click(function(e){
                e.preventDefault();
                $('#dcms-terms-message').addClass('hide-message');
            });
            $('#dcms-terms-message .show-tag').click(function(e){
                e.preventDefault();
                $('#dcms-terms-message').removeClass('hide-message');
            });
            
            /**
             * ��֤ʱ����Զ��巽��
             */
            D.checkTime = function(el, startId, endId) {
                var id = $(el).attr('id'),
                startTime=new Date.parseDate(timeStartEl.val(), dateFormat),
                endTime=new Date.parseDate(timeEndEl.val(), dateFormat); 
                switch (id) {
                    case startId:
                        if (!$('#'+startId).val()) { return '��ѡ����Ч��ʼʱ��'; }
                        if ($('#'+endId).val()) {
                            if (startTime>endTime) {
                                return '��Ч��ʼʱ�䲻�ô�����Ч����ʱ��';
                            }
                        } 
                        break;
                    case endId:
                        if (!$('#'+endId).val()) { return '��ѡ����Ч����ʱ��'; }
                        if ($('#'+startId).val()) {
                            if (startTime>endTime) {
                                return '��Ч��ʼʱ�䲻�ô�����Ч����ʱ��';
                            }
                        } else { 
                            return '����ѡ����Ч��ʼʱ��';
                        }
                        break;
                }
                return true;
            }
            
            /**
             * ��֤�û�Ⱥ������ʽ
             */
            D.checkTerms = function(el){
                var value = $(el).val().toUpperCase();
                if (value) {
                    var reg = /^[A-J](&&[A-J]|\|\|[A-J]){0,9}$/,
                    regCode = /[A-J]/g,
                    regRelator = /&&|\|\|/g,
                    els = $('.js-user-group li'),
                    termCode, termRelator, strRelator,
                    obj = '{"obj":[',
                    letters=[0,0,0,0,0,0,0,0,0,0],
                    arrObj = [], strHtml = '', expMapp={},
                    isLetter = function(c){
                    	return c >='A' && c <= 'J';
                    }, isLogic = function(c, p) {
                    	return c == '&' || c == '|';
                    }, isExtExpression = function(s){
                    	return s.indexOf('(') != -1;
                    }
                    n=0 ;
                    if (!reg.test(value.replace(/[\\(\\)]/g,''))){
                        return '����д��ȷ�ı��ʽ';
                    }
                    // ��֤��չ���ʽ
                    if(isExtExpression(value)){
	                    for(var i = 0; i < value.length; i++){
	                    	var c = value.charAt(i), p, ok = 0;
	                    	if(i > 0){
	                    		p = value.charAt(i-1);
		                    	if(isLetter(p)) {//A-J
		                    		ok = c == ')' || isLogic(c);
		                    	} else if(p == '('){
		                    		ok = c==p || isLetter(c);
		                    	} else if(p == ')') {
			                        ok = c == p || isLogic(c);
		                      	} else if(p == '|' || p == '&') {
		                      		ok = 0;
		                      		if (i > 1) {
		                      			if (value.charAt(i-2) != p){
		                      				ok = c == p;
		                      			} else {
		                      				ok = c=='(' || isLetter(c);
		                      			}
		                      		}
		                      	}
	                    	} else {
	                    		ok = 1;
	                    	}
	                    	// ͳ������
	                    	c == '(' && n++;
	                    	c == ')' && n--;
	                    	if(!ok){
	                    		return '����д��ȷ�ı��ʽ!';
	                    	}
	                    }
	                    if(n != 0){
	                    	return '���ʽ�е����ű���ɶԳ���!';
	                    }
                    }
                    
                    termCode = value.match(regCode);
                    termRelator = value.match(regRelator);
                    
                    for (var i=0, l=termCode.length; i<l; i++){
                        var serial = termCode[i].charCodeAt() - 'A'.charCodeAt(), termValue;
                        // ͳ������ʹ�ô���
                        letters[serial]++;
                        strRelator = (i===l-1) ? '' :  termRelator[i];
                        termValue = getTermValue(els[serial], termCode[i], strRelator);
                        
                        if (termValue[0]===true){
                        	//������ĸ�����ֵ�ӳ���ϵ
                        	expMapp[termCode[i]] = arrObj.length;
                            arrObj.push(termValue[1]);
                            strHtml += termValue[2];
                        } else {
                            return termValue[1];
                        }
                    }
                    for (var i=0,l=letters.length; i<l; i++){
                        if (letters[i]>1){
                            return '���������ظ�ʹ��';
                        }
                    }
                    obj += arrObj.join()+']';
                    // ������չ���ʽ(���û�����ű���ԭ���ķ�ʽ
                    if (isExtExpression(value)) {
                        for(var p in expMapp){
                        	value=value.replace(p, expMapp[p]);
                        }                    	
                       obj +=  ',"exp":"'+value + '"';
                    }
                    obj += '}';

                    $('#cperotion-data').val(obj);
                    $('#dcms-terms-message .message ul').html(strHtml);
                    $('#dcms-terms-message').show();
                } else {
                    $('#cperotion-data').val('');
                    $('#dcms-terms-message').hide();
                }
            }
            
            //��ȡĳ��������value�������ؽ��
            function getTermValue(el, termCode, strRelator) {
                var els = $(el).find('.dcms-term-content').children(),
                values = '', strHtml = '', num,
                l = els.length;
                
                if (els.length===1){
                    return [false, '����'+termCode+'Ϊ��'];
                }
                 //add by pingchun.yupc 2011-11-22 ֻƥ����Ҫƫ��
                var primaryCkb = $(el).find('input:checkbox'),
                oChecked = primaryCkb.filter(':checked'),
                onlyPrimary ="false";
                if (oChecked.length){
                    onlyPrimary = "true";
                }
                //values['name'] = $(els[0]).data('key');
                values = '{"name":"'+$(els[0]).data('key')+'","only_primary":"'+onlyPrimary+'", ';  
                strHtml = '<li>'+$(els[0]).text();  //��ʾ��Ϣ�е�HTML
                //�ж��Ƿ��бȽϷ�
                if ($(els[1]).data('key')==='op'){
                    if ($(els[1]).val()){
                        values += '"op":"'+$(els[1]).val()+'", ';
                        strHtml += $(els[1]).val();
                        //i =2;
                        if (l-1===2){
                            if((num=$(els[2]).val()) &&/^\d+$/.test(num)){
                                values += '"value":"'+num+'", "type":"int", ';
                                strHtml += num;
                            } else {
                                return [false, '����'+termCode+'������������ȷ����ֵ'];
                            }
                        }
                    } else {
                        return [false, '����'+termCode+'������ѡ����ȷ�ıȽϷ�'];
                    }
                    
                } else {
                    //values['op']='=';
                    values += '"op":"==", ';
                    //i = 1;
                    
                    if (l-1===1){
                        if($(els[1]).val()){
                            var key = $(els[1]).data('key'),
                            val = $(els[1]).val();
                            values += (key) ? '"value":[{"key":"'+key+'", "val":"'+val+'"}], "type":"string", ': '"value":"'+val+'", "type":"string", ';
                            //�����select��ȡselect��text������ȡvalue
                            if (els[1].nodeName.toUpperCase()==='SELECT'){
                                strHtml += els[1].options[els[1].selectedIndex].text;
                            } else {
                                strHtml += val;
                            }
                        } else {
                            return [false, termCode+'�����е�ֵ����Ϊ��'];
                        }
                    } else {
                        var value = '';
                        values += '"value":['
                        for (var i=1; i<l; i++){
                            var key = $(els[i]).data('key'),
                            val = $(els[i]).val(),
                            text = els[i].options[els[i].selectedIndex].text;
                            if (val&&key){
                                if ( key==='province' || key==='city'){  //key==='bu_name' || key==='pinlei_name' ||
                                    //value += '{"key":"'+key+'", "val":"'+text+'"}, ';
                                    value += '{"key":"'+key+'", "val":"'+text+'", "id":"'+val+'"}, ';
                                } else {
                                    value += '{"key":"'+key+'", "val":"'+val+'"}, ';
                                }
                                
                                strHtml += text + '&nbsp;';
                            }
                        }
                        if(value===''){
                            return [false, termCode+'�����е�ֵΪ�գ���ѡ��'];
                        }
                        value = value.replace(/, $/, '');
                        values += value + '], "type":"string", ';
                    }
                }
                values += '"logic":"'+strRelator+'"}';
                strHtml += '<span class="logic">'+strRelator+'</span></li>';
                return [true, values, strHtml];
            }
        },
        /**
         * ���ʱ��ؼ�
         */
        function(){
            var nowDate = new Date().format() + ' 00:00:00',
            startTimeObj = timeStartEl.datepicker({
                triggerType: 'focus',
                minDate: new Date(),
                date: new Date.parseDate(nowDate),
                showTime: true,
                select: function(e, ui){
                    doSelect(this, e, ui);
                },
                timeSelect: function(e, ui) {
                    doSelect(this, e, ui);
                    $(this).datepicker('hide');
                }
            }),
            endTimeObj = timeEndEl.datepicker({
                triggerType: 'focus',
                showTime: true,
                date: new Date.parseDate(nowDate),
                select: function(e, ui){
                    doSelect(this, e, ui);
                },
                timeSelect: function(e, ui) {
                    doSelect(this, e, ui);
                    $(this).datepicker('hide');
                },
                beforeShow: function(){
                    if (!timeStartEl.val()) {
                        var tip = timeStartEl.nextAll('.dcms-validator-tip');
                        tip.text('����ѡ����Ч�ڵĿ�ʼʱ��');
                        tip.addClass('dcms-validator-error');
                        return false;
                    }
                    var startTime=new Date.parseDate(timeStartEl.val(), dateFormat); 
                    $(this).datepicker('option', 'minDate', startTime);
                }
            });
            
            //������ģ��������ý�������صڶ���ʱ��ؼ�
            $('#templateName').focus(function(){
                timeEndEl.datepicker('hide');
            });
            /**
             * ѡ��ʱ������ں�Ĳ���
             */
            function doSelect(el, e, ui) {
                $(el).val(ui.date.format(dateFormat));
                formValid.valid($(e.target));
            }
        },
        /**
         * ������
         */
        function () {
            var templateCategory = new D.Category($('#templateCategoryOne'), $('#templateCategoryTwo'), cmsdomain),
            templateDialog = new D.TemplateDialog($('#templatesDialog'),{
                fixed : true,
                center : true,
                open : function(){
                    templateDialog.reset();
                    //D.popTree('selcategoryNameTpl','selcategoryNameTpl','selCategoryIdTpl','dgTempTree','admin/catalog.html');
                }
            },{
                container : $('#templatesDialog tbody'),
                previousBtn : $('#templatesPreviousBtn'),
                nextBtn : $('#templatesNextBtn'),
                firstPageBtn : $('#templatesFirstPageBtn'),
                cmsdomain : cmsdomain,
                openBtn : $('#chooseTemplateBtn'),
                closeBtns : $('#templatesDialog .close-btn,#templatesDialog .cancel-btn'),
                submitBtn : $('#selectedTemplateBtn'),
                searchBtn : $('#searchTemplatesBtn'),
                templateName : $('#templateName'),
                keywordElement : $('#searchTemplatesKeyword'),
                categoryTwoElement : $('#selCategoryIdTpl'),
                category : templateCategory,
                validator : formValid
            });
        },
        
        /**
         * ���������ҳ��λ�� �ĸ����㣬ֻ���޸�ҳ���в���
         */
        function (){
            if ($('.dcms-search-list')){
                var gridOperationsWrap = $('#ruleRelationsOperations'),
                father = $('.related-pages tbody'),
                timeId;
                
                father.delegate("tr", "mouseenter", function(){
                    var container = $('td:last-child',$(this));
                    timeId = window.setTimeout(function(){
                        gridOperationsWrap.appendTo(container);
                        gridOperationsWrap.fadeIn();
                    }, 300);
                });
                father.delegate("tr", "mouseleave", function(){
                    if(timeId){
                        window.clearTimeout(timeId);
                    }
                    gridOperationsWrap.hide();
                });
                gridOperationsWrap.delegate(".preview-btn", "mouseenter", function(e){
                    var theCurrentTr = $(this).closest('tr'),
                    positionId = $(this).closest('td').data('positionid'),
                    url = cmsdomain+'/position/view_position.html';
                    $(this).attr('href', url+'?positionId='+positionId);
                });
                gridOperationsWrap.delegate(".view-data-btn", "mouseenter", function(e){
                    var theCurrentTr = $(this).closest('tr'),
                    positionId = $(this).closest('td').data('positionid'),
                    ruleId = $('#ruleId').val(),
                    url = cmsdomain+'/position/top_url.html';
                    $(this).attr('href', url+'?pid='+positionId+'&rid='+ruleId);
                });
            }
        },
        /**
         * �Զ����û�Ⱥ
         */
        function(){
            var termDialog, that,
            selectObj = $('<select />'),
            inputObj = $('<input />'),
            spanObj = $('<span />'),
            cperotion = $('#cperotion-data').val();
            //���#cperotion-data��valueֵ
            if (cperotion) {
                cperotion = cperotion.replace(/\\/g, '');
                var objCpe = $.parseJSON(cperotion),
                arrObj = objCpe.obj,
                els = $('.js-user-group .dcms-term-content'),
                strVal = '';
                for (var i=0, l=arrObj.length; i<l && i<els.length; i++){
                    var name = arrObj[i].name,
                    text = getTermText(name),
                     //add by pingchun.yupc 2011-11-22 ֻƥ����Ҫƫ��
                    opCheck =arrObj[i].only_primary;
                    getTermTemplate(name, text, els[i], arrObj[i].value, arrObj[i].op,opCheck);
                    strVal += i + arrObj[i].logic;
                }
                strVal = strVal.replace('0', 'A').replace('1', 'B').replace('2', 'C').replace('3', 'D').replace('4', 'E').replace('5', 'F').replace('6', 'G')
                .replace('7', 'H').replace('8', 'I').replace('9', 'J');
                $('#dcms-terms-cperotion').val(strVal);
                //��չ���ʽ
                if(objCpe.exp){
                	arrObj = objCpe.exp.match(/[0-9]+|[^0-9]+/g);
                	strVal = '';
                	for(var i = 0; i < arrObj.length; i++){
                		var e=arrObj[i];
                		if (e.match(/^[0-9]+$/)) {
                			strVal += String.fromCharCode('A'.charCodeAt() + parseInt(e));
                		} else {
                			strVal += e;
                		}
                	}
                	strVal && $('#dcms-terms-cperotion').val(strVal);
                }                
            }
            //ѡ���û�Ⱥ�����¼���
            $('.dcms-choose-term').live('click', function(){
                var keyName = $(this).data('key'),
                radios = $('#dcms-choose-terms input[type=radio]');
                that = $(this);
                //������
                termDialog = $('#dcms-choose-terms').dialog({
                    //fixed:true,
                    center:true
                });
                //ѡ�е�ǰ��ѡ��
                if (keyName) {
                    radios.val([keyName]);
                } else {
                    radios.val(['']);
                }
            });
            
            //�����ı�󴥷����ʽ��֤
            $('.dcms-term').live('change', function(){
                formValid.valid($('#dcms-terms-cperotion'));
            });
            // //add by pingchun.yupc 2011-11-22 ֻƥ����Ҫƫ��
            $('.only-primary').live('click', function(){
                formValid.valid($('#dcms-terms-cperotion'));
            });
            
            //�رպ�ȡ����ťЧ��
            $('#dcms-choose-terms .close-btn, #dcms-choose-terms .cancel-btn').click(function(e){
                e.preventDefault();
                termDialog.dialog('close');
            });
            //���������б����¼���
            $('#selectedTermBtn').click(function(){
                var radioChecked = $('#dcms-choose-terms input[type=radio]:checked'),
                radioValue = radioChecked.val(),
                radioText = radioChecked.data('text');
                if (!radioValue) {
                    return;
                }
                getTermTemplate(radioValue, radioText);
                //that.parent().html(termHtml);
                
                termDialog.dialog('close');
                
            });
            
            function getTermText(val) {
                var text;
                switch (val){
                    case 'prefer_category_id':
                        text = 'ƫ��BU��Ʒ�ࣺ';
                        break;
                    case 'offer_lpv_30d':
                        text = '����������offer��LPV��';
                        break;
                    case 'company_lpv_30d':
                        text = '������������˾���LPV��';
                        break;
                    case 'visit_offer_dpv_30d':
                        text = '���������offer��DPV��';
                        break;
                    case 'visit_comp_dpv_30d':
                        text = '������������̵�DPV��';
                        break;
                    case 'b_fb_offer_cnt_30d':
                        text = '�����ܷ���offer��������';
                        break;
                    case 'b_fb_company_cnt_30d':
                        text = '�����ܷ�����˾�ⷴ������';
                        break;
                    case 'b_pay_ord_cnt_30d':
                        text = '������֧��������';
                        break;
                    case 'b_pay_ord_amt_30d':
                        text = '������֧����';
                        break;
                    case 'valid_cnt':
                        text = '����������Ч��Ӧoffer����';
                        break;
                    case 'offer_dpv_30d':
                        text = '�����ܱ������offer��DPV��';
                        break;
                    case 'comp_dpv_30d':
                        text = '�����ܱ���������̵�DPV��';
                        break;
                    case 's_fb_offer_cnt_30d':
                        text = '�����ܽ���offer��������';
                        break;
                    case 's_fb_company_cnt_30d':
                        text = '�����ܽ��չ�˾����������';
                        break;
                    case 's_pay_ord_cnt_30d':
                        text = '�����ܱ�֧��������';
                        break;
                    case 's_pay_ord_amt_30d':
                        text = '�����ܱ�֧����';
                        break;
                     case 'biz_dpt':
                        text = '��������������ѫ�¹���';
                       break;
                    case 'offer_category_2_attr':
                        text = '������Ӫ��Ŀ��';
                        break;
                    case 'bu_attr':
                        text = '������ӪBU��';
                        break;
                    case 'grade_sort':
                        text = '����ѫ�µȼ�';
                        break;
                    case 'last_grade_change_type':
                        text = '����ѫ�µȼ��仯';
                        break;
                    case 'termsProvinceCity':
                        text = '���ڳ��У�';
                        break;
                    case 'member_level':
                        text = '��Ա���ͣ�';
                        break;                 
                    case 'day_due':
                        text = '����ͨ��Ա����������';
                        break;
                    case 'template_no':
                        text = 'ģ�����';
                        break;
                    case 'trust_service_year':
                        text = '����ͨ���ޣ�';
                        break;
                    case 'g4_online_cnt':
                        text = '������offer����';
                        break;
                    case 'approved_offer_cnt_30d':
                        text = '��30�췢��offer�ɹ�����';
                        break;
                    case 'av_atm_ol_times_30d':
                        text = '��30���վ���������(��)��';
                        break;
                    case 'login_site_d_cnt_30d':
                        text = '��30����վ��¼������';
                        break;
                    case 'real_time_info.service_days':
                    	text = '��ͨ����ͨ������';
                    	break;
                    case 'is_real_price':
                    	text = '�Ƿ������ʵ���ۣ�';
                    	break;
                    case 'is_credit':
                    	text = '�Ƿ����ϱ���';
                    	break;
                    case 'biz_mode':
                    	text = '��Ӫģʽ��';
                    	break;
                    case 'is_company':
                        text='��Ա�Ƿ��й�˾��:';
                        break;
                    case 'is_auth_approved':
                         text='��Ա�Ƿ�ͨ��ʵ����֤:';
                         break;
                    case 'is_domain':
                    	text = '�Ƿ�������̣�';
                    	break;
                    case 'realprice_cnt':
                    	text='��ʵ����offer����';
                    	break;

		   case 'is_personal_full':
                    	text='������Ϣ�Ƿ�����';
                    	break;
		   case 'is_company_full':
                    	text='��˾��Ϣ�Ƿ�����';
                    	break;
		   case 'is_mobile_binded':
                    	text='�ֻ��Ƿ��';
                    	break;
		    case 'is_alitalk_login':
                    	text='�Ƿ���������¼';
                    	break;
 		    case 'is_alipay':
                    	text='�Ƿ��֧����';
                    	break;
 		    case 'is_renew':
                    	text='��ǩ���Ƿ�������';
                    	break;
		    case 'wp_decoration_score':
                    	text='����װ�޷���';
                    	break;
		    case 'company_level':
                    	text='��˾���Ǽ�';
                    	break;
		    case 'forum_post_cnt_30d':
                    	text='30����̳������';
                    	break;
 		    case 'xp_login_cnt_30d':
                    	text='30���¼ѯ�̹����';
                    	break;
		  ��case 'pm_login_cnt_30d':
                    	text='30���¼��׼Ӫ����';
                    	break;
��		   case 'regist_days':
                    	text='ע������';
                    	break;
           case 'high_quality_cnt':
                    	text='4������offer';
                    	break;
           case 'wp_total_score':
                    	text='����������';
                    	break;
           case 'is_p4p_present':
                    	text='�Ƿ���ȡ��P4P���';
                    	break;
           case 'is_p4p_present_use':
                    	text='P4P����Ƿ����������';
                    	break;
			
			
			
			
			case 'member_name_auth':
			            text='�Ƿ�ʵ����֤';
						break;
			case 'member_phone_bind':
			            text='�Ƿ��ֻ���';
						break;
			case 'member_mail_bind':
			            text='�Ƿ������';
                        break;
            case 'member_info_complete':
                        text='��ϵ��Ϣ�Ƿ�ȫ';
						break;
			case 'offer_count':
			            text='offer����';
						break;
			case 'offer_4star_count':
			            text='����offer����';
						break;
			case 'company_is_company':
			            text='�Ƿ��й�˾��(company)';
						break;
			case 'company_star_level':
			            text='��˾��(����)�Ǽ�';
						break;
			case 'wp_has_wp':
			            text='�Ƿ�������';
						break;
			case 'wp_score':
			            text='���̷���';
						break;
			
			case 'credit_onsite_verified':
			            text='�Ƿ�ʵ����֤';
						break;
			
			case 'member_biz_role':
			            text='��Աó�׽�ɫ';
						break;
			case 'is_mobile_full':
	            text='�ֻ��Ƿ���д';
				break;
			case 'is_phone_full':
	            text='�̻��Ƿ���д';
				break;
			case 'is_miyoshi_pass':
	            text='���ð��Ƿ����';
				break;
			case 'is_growth_pass':
	            text='�ɳ����Ƿ����';
				break;	
			case 'last_tp':
			    text='��ͨ����ͨ����';
				break;
			case 'is_tp':
			    text='�Ƿ��ǳ���ͨ��Ա';
				break;	
			case 'question_asked_cnt_7d':
	            text='7�������⾭���ʴ���';
				break;
			case 'question_asked_cnt_30d':
	            text='30�������⾭���ʴ���';
				break;
			case 'question_answered_cnt_7d':
	            text='7�������⾭�ش����';
				break;
			case 'question_answered_cnt_30d':
	            text='30�������⾭�ش����';
				break;
			case 'publish_thread_cnt_7d':
	            text='7������̳��������';
				break;
			case 'publish_thread_cnt_30d':
	            text='30������̳��������';
				break;
			case 'publish_article_cnt_30d':
	            text='30���ڷ�����ƪ��';
				break;	
		   case 'is_login_ba_30d':
			    text='���30���¼�̻�����';
				break;		
		    case 'status_order':
			    text='��֤״̬';
				break;	
		    case 'ordered_app':
                text = '�Ѷ���APP��';
                break;	
          case 'status_renewal':
                text = '��ǩ״̬��';
                break;	
		 case 'tp_period':
                text = '����ͨ����ʱ�䣺';
                break;	
		 case 'tp_period_day':
                text = '����ͨʣ��������';
                break;
          case 'is_handsel':
                text = '�Ƿ���֤������ͣ�';
                break;
          case 'biz_ov_flow_node':
              text = 'ʵ����֤��չ״̬��';
              break;
          case 'pending_count':
              text = '�������������';
              break;
          case 'offline_count':
              text = '�¼ܵ���Ϣ������';
              break;

          case 'is_p4p_exchange':
              text = '�Ƿ�P4P��ֵ�ͻ���';
              break;
          case 'p4p_account_balance':
              text = '��������P4P�ʻ���';
              break;

          case 'p4p_prod_ol_time':
              text = 'P4P���������ʼʱ�䣺';
              break;

          case 'p4p_daily_max_cost':
              text = 'P4P���������ޣ�';
              break;
          case 'p4p_cost_amt_1d':
              text = '���1��P4P���������ģ�';
              break;    

                }
						
			
                return text;
       }

            /**
             * �������ģ��
             * name: ��ѡ���ֶ���
             * txt: ��ѡ����ʾ������˵��
            */
            function getTermTemplate(name, txt, select, args, op, opCheck) {
                //var html;
                //add by pingchun.yupc 2011-11-22 ֻƥ����Ҫƫ��
                /*var pLen = arguments.length;
                var opCheck = "false";
                if (pLen==6){
                    opCheck = arguments[5];
                }*/
                //add by hongss on 2011.12.04 ֻƥ����Ҫƫ��
                var containerEl = (select) ? $(select) : that.parent();
                containerEl.next('span').remove();
                opCheck = opCheck || 'false';
                
                switch (name){
                    //���ڳ���
                    case 'termsProvinceCity':
                        var tempHtml = '<option value="">��ѡ��</option>',
                        apiUrl = cmsdomain+'/position/ajaxArea.html',
                        span = createSpan(name, txt),
                        provinceSelect = createSelect('province', tempHtml),
                        citySelect = createSelect('city', tempHtml);
                        if (select){
                            $(select).html('').append(span).append(provinceSelect).append(citySelect);
                        } else {
                            that.parent().html('').append(span).append(provinceSelect).append(citySelect);
                        }
                        getCategory(provinceSelect, apiUrl, function(){
                            if (args){
                                var province = args[0].id || args[0].val;
                                $(this).val(province);
                                getCategory(citySelect, apiUrl, {area:province}, function(){
                                    if (args[1]){
                                        var city = args[1].id || args[1].val;
                                        $(this).val(city);
                                    }
                                });
                            }
                        });
                        provinceSelect.change(function(){
                            citySelect.val('');
                            var provinceId = $(this).val();
                            getCategory(citySelect, apiUrl, {area:provinceId});
                        });
                        formValid.valid($('#dcms-terms-cperotion'));
                        break;
                    //ƫ����Ŀ
                    case 'prefer_category_id':
                        var tempHtml = '<option value="">��ѡ��</option>',
                        apiUrl = cmsdomain + '/position/ajaxBuPinLei.html',
                        span = createSpan(name, txt),
                        buSelect = createSelect('bu_id', tempHtml),
                        categorySelect = createSelect('pinlei_id', tempHtml),
                        leafSelect = createSelect('category_id', tempHtml);
                        getCategory(buSelect, apiUrl, function(o){
                            if (args) {
                                var buId = args[0].id || args[0].val;
                                $(this).val(buId);
                                getCategory(categorySelect, apiUrl, {bu:buId}, function(o){
                                    if (args[1]){
                                        var plId = args[1].id || args[1].val;
                                        $(this).val(plId);
                                        getCategory(leafSelect, apiUrl, {pl:plId}, function(){
                                            if (args[2]){
                                                var leafId = args[2].val;
                                                $(this).val(leafId);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        //��bu select change �¼�
                        buSelect.change(function(){
                            var buId = $(this).val();
                            categorySelect.val('');
                            leafSelect.val('');
                            getCategory(categorySelect, apiUrl, {bu:buId});
                            leafSelect.html(tempHtml);
                        });
                        //��Ʒ�� select change �¼�
                        categorySelect.change(function(){
                            var plId = $(this).val();
                            leafSelect.val('');
                            getCategory(leafSelect, apiUrl, {pl:plId});
                        })
                        //add by pingchun.yupc 2011-11-22 ֻƥ����Ҫƫ��
                        if (that){
                             onlyPrimary();
                        } else {
                            onlyPrimary(select);
                        }
                        
                        if (!that && select){
                            $(select).html('').append(span).append(buSelect).append(categorySelect).append(leafSelect);
                        } else {
                            that.parent().html('').append(span).append(buSelect).append(categorySelect).append(leafSelect);
                        }
                        formValid.valid($('#dcms-terms-cperotion'));
                        //html = p.html();
                        break;
                    //�û�����
                    case 'member_level':
                        var tempHtml = '<option value="FREE">��ͨ��Ա</option><option value="TP">TP��Ա</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //�Ƿ������ʵ����
                    case 'is_real_price':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //�Ƿ����ϱ�
                    case 'is_credit':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //��Ա�Ƿ��й�˾�� add by pingchun.yupc 2011-12-05
                    case 'is_company':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //��Ա�Ƿ�ͨ��ʵ����֤ add by pingchun.yupc 2011-12-05
                    case 'is_auth_approved':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //��Ӫģʽ
                    case 'biz_mode':
                        var tempHtml = '<option value="1">�����ӹ�</option><option value="2">��������</option><option value="3">���̴���</option><option value="4">��ҵ����</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //�Ƿ��������
                    case 'is_domain':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //�Ƿ����ͨ��Ա
                    case 'is_tp':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     case 'is_login_ba_30d':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    case 'biz_dpt':
                        var tempHtml = '<option value="C">�ɹ�</option><option value="P">����</option>';
                        singleSelect(tempHtml);
                        break;
                    case 'last_grade_change_type':
                      	var tempHtml = '<option value="U">����</option><option value="D">����</option>';
                        singleSelect(tempHtml);
                        break;
                    case 'grade_sort':
                        var tempHtml = '<option value="1">1</option><option value="2">2</option>';
                        tempHtml += '<option value="3">3</option><option value="4">4</option>';
                         tempHtml += '<option value="5">5</option>';
                        singleSelect(tempHtml);
                        break;                        
                    //��Ӫ��ҵ
                    case 'offer_category_2_attr':
                        var tempHtml = '<option value="">��ѡ��</option>',
                        apiUrl = cmsdomain + '/position/ajaxCatalog.html',
                        //p = pObj.clone(),
                        span = createSpan(name, txt),
                        select1 = createSelect('category_id_1', tempHtml),
                        select2 = createSelect('category_id_2', tempHtml);
                        getCategory(select1, apiUrl, function(){
                            if (args){
                                $(this).val(args[0].val);
                                getCategory(select2, apiUrl, {ca:args[0].val}, function(){
                                    if (args[1]){
                                        $(this).val(args[1].val);
                                    }
                                });
                            }
                            $(this).change(function(){
                                select2.val('');
                                var cat2 = $(this).val();
                                getCategory(select2, apiUrl, {ca:cat2});
                            });
                        });
                        if (that){
                             onlyPrimary();
                        } else {
                            onlyPrimary(select);
                        }
                        if (!that&&select){
                            $(select).html('').append(span).append(select1).append(select2);
                        } else {
                            that.parent().html('').append(span).append(select1).append(select2);
                        }
                        formValid.valid($('#dcms-terms-cperotion'));
                        //html = p.html();
                        break;
                        
                    case 'template_no':
                        var span = createSpan(name, txt),
                        input = createInput(name, '������ģ������');
                        if (!that && select){
                            $(select).html('').append(span).append(input);
                            input.val(args);
                        } else {
                            that.parent().html('').append(span).append(input);
                        }
                        break;

                    // �Ƿ�P4P��ֵ�ͷ�
                    case 'is_p4p_exchange':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;

                    case 'bu_attr':
                        var tempHtml = '<option value="">��ѡ��</option>',
                        apiUrl = cmsdomain + '/position/ajaxBuPinLei.html',
                        span = createSpan(name, txt),
                        buSelect = createSelect('bu_attr', tempHtml);
                        getCategory(buSelect, apiUrl, function(o){
                            if (args) {
                                var buId = args[0].id || args[0].val;
                                $(this).val(buId);
                            }
                        });
                        if (that){
                             onlyPrimary();
                        } else {
                            onlyPrimary(select);
                        }
                        if (!that && select){
                            $(select).html('').append(span).append(buSelect).append(categorySelect).append(leafSelect);
                        } else {
                            that.parent().html('').append(span).append(buSelect).append(categorySelect).append(leafSelect);
                        }
                        formValid.valid($('#dcms-terms-cperotion'));
                        break;
		     //������Ϣ�Ƿ�����
                    case 'is_personal_full':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // ��˾��Ϣ�Ƿ����ƣ���˾����<8/��ְλ��
 		    case 'is_company_full':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		     // �ֻ��Ƿ��
		    case 'is_mobile_binded':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // �Ƿ���������¼
		    case 'is_alitalk_login':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // �Ƿ��֧����
		    case 'is_alipay':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
 		    // ��ǩ���Ƿ�������
		    case 'is_renew':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
	       // �Ƿ���ȡ��P4P���
		    case 'is_p4p_present':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
            // iP4P����Ƿ����������
		    case 'is_p4p_present_use':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			
			
			//add by hongfeng.wanghf
			case 'member_name_auth':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_phone_bind':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_mail_bind':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_info_complete':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'company_is_company':
                        var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'wp_has_wp':
			case 'is_mobile_full':
			case 'is_phone_full':
            case 'is_handsel':
			case 'is_miyoshi_pass':
			case 'is_growth_pass':
			            var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'credit_onsite_verified':
			            var tempHtml = '<option value="Y">��</option><option value="N">��</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;	
			
		    case 'member_biz_role':
                        var tempHtml = '<option value="buyer">���</option><option value="supplier">����</option><option value="both">��������</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			    case 'status_order':
                        var tempHtml = '<option value="SYNC_AV_STATUS">��֤��</option><option value="SYNC_AV_ERROR">��֤�쳣</option><option value="WAIT_CONFIRM_AV">�ݽ���֤����</option><option value="WAIT_SEND_AUTH">������֤</option><option value="FAILURE">��֤ʧ��</option><option value="WAIT_AUDIT">�ȴ������Ȩ��</option><option value="UPLAD_AUTHORIZE">�ϴ���Ȩ��</option><option value="SUCCESS">��֤�ɹ�</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;				
			 case 'ordered_app':
                        var span = createSpan(name, txt),
                        input = createInput(name, '�������Ѷ���APP');
                        if (!that && select){
                            $(select).html('').append(span).append(input);
                            input.val(args);
                        } else {
                            that.parent().html('').append(span).append(input);
                        }
                        break;
             case 'status_renewal':
                        var tempHtml = '<option value="payment_none">δ����</option><option value="payment_part">���ֽ���</option><option value="payment_success">�������</option><option value="payment_use">��ʹ�ø���</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    case 'biz_ov_flow_node':
                var tempHtml = '<option value="ORDER_CREATE">�µ�</option><option value="INVITE">��Լ</option><option value="EVIDENCE">ȡ֤</option><option value="AUTH">��֤</option><option value="AUTH_RESULT">��֤���</option>';
                singleSelect(tempHtml);
                break;	
                    default:
                        createDefaultHtml(name, txt, select, args, op);
                        formValid.valid($('#dcms-terms-cperotion'));
                        break;
                }
                function singleSelect(tempHtml){
                    var span = createSpan(name, txt),
                    typeSelect = createSelect('', tempHtml);
                    if (!that&&select){
                        $(select).html('').append(span).append(typeSelect);
                        if (args){
                            typeSelect.val(args);
                        }
                    } else {
                        that.parent().html('').append(span).append(typeSelect);
                    }
                    formValid.valid($('#dcms-terms-cperotion'));
                }
                /**
                 * ֻƥ����Ҫƫ��
                 * add by pingchun.yupc
                 * modify by hongss on 2011.12.04
                 */
                function onlyPrimary(el) {
                    var termContent = (el) ? $(el) : that.parent(); 
                  
                    if(termContent&&termContent.prev()){
                        var _termCode = termContent.prev().html();
                        var oHtml = "<span><input class='only-primary' type='checkbox' id='"+_termCode+"' name='"+_termCode+"'/>ֻƥ����Ҫƫ��</span>";
                        if (opCheck && 'true'==opCheck){
                            oHtml = "<span><input class='only-primary' type='checkbox' checked=true id='"+_termCode+"' name='"+_termCode+"'/>ֻƥ����Ҫƫ��</span>";
                        }
                        termContent.after(oHtml);
                    }//
                }
                //return html;
            }
            
            //ƫ����Ŀ����Ӫ���ݽӿڵ���
            function getCategory(select, url, params, callback) {
                if ($.isFunction(params)) {
                    callback = params;
                    params = undefined;
                }
                $.ajax({
                    url: url,
                    data: params,
                    dataType: 'jsonp',
                    success: function(data){
                        if (data){
                            var optionHtml = '<option value="">��ѡ��</option>';
                            select.val('');
                            for (var i=0, l=data.length; i<l; i++) {
                                optionHtml += '<option value="'+data[i].id+'">'+data[i].name+'</option>';
                            }
                            select.html(optionHtml);
                            if (callback && $.isFunction(callback)) {
                                callback.call(select, data);
                            }
                        }
                    }
                });
            }
            function createDefaultHtml(name, txt, container, args, op){
                var html = '<option value=">">&gt;</option><option value=">=">&ge;</option><option value="<">&lt;</option>'
                         + '<option value="<=">&le;</option><option value="==">=</option>',
                span = createSpan(name, txt),
                select = createSelect('op', html),
                input = createInput(name);
                input.attr('autocomplete', 'off');
                if (!that && container){
                    $(container).html('').append(span).append(select).append(input);
                    input.val(args);
                    select.val(op);
                } else {
                    that.parent().html('').append(span).append(select).append(input);
                    that.parent().html('').append(span).append(select).append (input)

                }
            }
            function createSelect(name, html){
                var obj = selectObj.clone();
                obj.addClass('dcms-term');
                obj.attr('autocomplete', 'off');
                if (name) {
                    obj.data('key', name);
                }
                if (html) {
                    obj.html(html);
                }
                return obj;
            }
            function createSpan(name, txt){
                var obj = spanObj.clone();
                obj.addClass('dcms-choose-term');
                obj.data('key', name);
                obj.text(txt);
                return obj;
            }
            function createInput(name, holder){
                var obj = inputObj.clone(),
                holder = holder || '��������ֵ';
                obj.addClass('dcms-term');
                obj.attr('placeholder', holder);
                return obj;
            }
            
        },
        
        //add by arcthur on 4.13
        function checkRule() {
            $('#checkBtn').click(function () {
                if (confirm('���ǰ����Ԥ��������ҳ��λ�á������ҳ��λ���ѹ���ҳ�棬����Ԥ���������Ԥ����ȷ�������ٵ�����ͨ����ť')){
                    $('#checkRule').attr('name', 'event_submit_do_auditRule');
                    $('#putRuleForm').submit();
                }
                
            });
        },
        /**
         * modify by hongss on 2011.11.28
         */
        function(){
            //D.popTree('dgPopTree','admin/catalog.html'); //'selcategoryName','selcategoryName','selCategoryId',
            var popTree = new D.PopTree(),
            categoryIdEl = $('#selCategoryId'),
            categoryEl = $('#selcategoryName');
            popTree.show(categoryEl, categoryEl, categoryIdEl, false);
            categoryEl.click(function(e){
                popTree.show(categoryEl, categoryEl, categoryIdEl);
            });
            $('#selcategoryNameTpl').click(function(e){  
                var el = $(this);
                popTree.show(el, el, $('#selCategoryIdTpl'));
            });
        }
     ];
     
     $(function(){
         for (var i=0, l=readyFun.length; i<l; i++) {
             try {
                 readyFun[i]();
             } catch(e) {
                 if ($.log) {
                     $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                 }
             } finally {
                 continue;
             }
         }
     });
    
 })(dcms, FE.dcms);
