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
         * 目录 下拉框
         */
        function(){
            var ruleCategory = new D.Category($('#ruleCategoryOne'), $('#ruleCategoryTwo'), cmsdomain);
            ruleCategory.reset($('#catalogId').val(),$('#catalogChildId').val());
        },
        /**
         * 表单验证
         */
        function(){

            var formEl = $('#putRuleForm'),
            els = formEl.find('[vg=1]');
            //表单验证组件
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
                                msg = '请填写'+o.key;
                                break;
                            case 'fun':
                                if (o.key==='用户群定义'){
                                    $('#dcms-terms-message').hide();
                                }
                                msg = o.msg;
                                break;
                            case 'nameisExisted' :
                                msg = o.key + '已经存在';
                                break;
                            case 'quoteNameisExisted' :
                                msg = o.key + '已经存在';
                                break;
                            case 'templateNameIsWrong' :
                                msg = o.key + '无效';
                                break;
                            case 'nameFormatIsWrong' :
                                msg = '由字母a~z（不区分大小写）、数字0~9、中文、减号或下划线组成';
                                break;
                                case 'quoteNameFormatisWrong' :
                                msg = '由字母a~z（不区分大小写）、数字0~9或下划线组成';
                                break;
                            default:
                                msg = '请填写正确的内容';
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
            
            //用户群定义信息提示 隐藏/显示 事件
            $('#dcms-terms-message .hide-tag').click(function(e){
                e.preventDefault();
                $('#dcms-terms-message').addClass('hide-message');
            });
            $('#dcms-terms-message .show-tag').click(function(e){
                e.preventDefault();
                $('#dcms-terms-message').removeClass('hide-message');
            });
            
            /**
             * 验证时间的自定义方法
             */
            D.checkTime = function(el, startId, endId) {
                var id = $(el).attr('id'),
                startTime=new Date.parseDate(timeStartEl.val(), dateFormat),
                endTime=new Date.parseDate(timeEndEl.val(), dateFormat); 
                switch (id) {
                    case startId:
                        if (!$('#'+startId).val()) { return '请选择有效开始时间'; }
                        if ($('#'+endId).val()) {
                            if (startTime>endTime) {
                                return '有效开始时间不得大于有效结束时间';
                            }
                        } 
                        break;
                    case endId:
                        if (!$('#'+endId).val()) { return '请选择有效结束时间'; }
                        if ($('#'+startId).val()) {
                            if (startTime>endTime) {
                                return '有效开始时间不得大于有效结束时间';
                            }
                        } else { 
                            return '请先选择有效开始时间';
                        }
                        break;
                }
                return true;
            }
            
            /**
             * 验证用户群定义表达式
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
                        return '请填写正确的表达式';
                    }
                    // 验证扩展表达式
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
	                    	// 统计括号
	                    	c == '(' && n++;
	                    	c == ')' && n--;
	                    	if(!ok){
	                    		return '请填写正确的表达式!';
	                    	}
	                    }
	                    if(n != 0){
	                    	return '表达式中的括号必须成对出现!';
	                    }
                    }
                    
                    termCode = value.match(regCode);
                    termRelator = value.match(regRelator);
                    
                    for (var i=0, l=termCode.length; i<l; i++){
                        var serial = termCode[i].charCodeAt() - 'A'.charCodeAt(), termValue;
                        // 统计条件使用次数
                        letters[serial]++;
                        strRelator = (i===l-1) ? '' :  termRelator[i];
                        termValue = getTermValue(els[serial], termCode[i], strRelator);
                        
                        if (termValue[0]===true){
                        	//保存字母到数字的映射关系
                        	expMapp[termCode[i]] = arrObj.length;
                            arrObj.push(termValue[1]);
                            strHtml += termValue[2];
                        } else {
                            return termValue[1];
                        }
                    }
                    for (var i=0,l=letters.length; i<l; i++){
                        if (letters[i]>1){
                            return '条件不能重复使用';
                        }
                    }
                    obj += arrObj.join()+']';
                    // 生成扩展表达式(如果没有括号保存原来的方式
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
            
            //获取某个条件的value，并返回结果
            function getTermValue(el, termCode, strRelator) {
                var els = $(el).find('.dcms-term-content').children(),
                values = '', strHtml = '', num,
                l = els.length;
                
                if (els.length===1){
                    return [false, '条件'+termCode+'为空'];
                }
                 //add by pingchun.yupc 2011-11-22 只匹配首要偏好
                var primaryCkb = $(el).find('input:checkbox'),
                oChecked = primaryCkb.filter(':checked'),
                onlyPrimary ="false";
                if (oChecked.length){
                    onlyPrimary = "true";
                }
                //values['name'] = $(els[0]).data('key');
                values = '{"name":"'+$(els[0]).data('key')+'","only_primary":"'+onlyPrimary+'", ';  
                strHtml = '<li>'+$(els[0]).text();  //提示信息中的HTML
                //判断是否有比较符
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
                                return [false, '请在'+termCode+'条件中输入正确的数值'];
                            }
                        }
                    } else {
                        return [false, '请在'+termCode+'条件中选择正确的比较符'];
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
                            //如果是select则取select的text，否则取value
                            if (els[1].nodeName.toUpperCase()==='SELECT'){
                                strHtml += els[1].options[els[1].selectedIndex].text;
                            } else {
                                strHtml += val;
                            }
                        } else {
                            return [false, termCode+'条件中的值不能为空'];
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
                            return [false, termCode+'条件中的值为空，请选择'];
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
         * 添加时间控件
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
                        tip.text('请先选择有效期的开始时间');
                        tip.addClass('dcms-validator-error');
                        return false;
                    }
                    var startTime=new Date.parseDate(timeStartEl.val(), dateFormat); 
                    $(this).datepicker('option', 'minDate', startTime);
                }
            });
            
            //当内容模板输入框获得焦点后隐藏第二个时间控件
            $('#templateName').focus(function(){
                timeEndEl.datepicker('hide');
            });
            /**
             * 选择时间或日期后的操作
             */
            function doSelect(el, e, ui) {
                $(el).val(ui.date.format(dateFormat));
                formValid.valid($(e.target));
            }
        },
        /**
         * 弹出层
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
         * 规则关联的页面位置 的浮出层，只有修改页面中才有
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
         * 自定义用户群
         */
        function(){
            var termDialog, that,
            selectObj = $('<select />'),
            inputObj = $('<input />'),
            spanObj = $('<span />'),
            cperotion = $('#cperotion-data').val();
            //如果#cperotion-data有value值
            if (cperotion) {
                cperotion = cperotion.replace(/\\/g, '');
                var objCpe = $.parseJSON(cperotion),
                arrObj = objCpe.obj,
                els = $('.js-user-group .dcms-term-content'),
                strVal = '';
                for (var i=0, l=arrObj.length; i<l && i<els.length; i++){
                    var name = arrObj[i].name,
                    text = getTermText(name),
                     //add by pingchun.yupc 2011-11-22 只匹配首要偏好
                    opCheck =arrObj[i].only_primary;
                    getTermTemplate(name, text, els[i], arrObj[i].value, arrObj[i].op,opCheck);
                    strVal += i + arrObj[i].logic;
                }
                strVal = strVal.replace('0', 'A').replace('1', 'B').replace('2', 'C').replace('3', 'D').replace('4', 'E').replace('5', 'F').replace('6', 'G')
                .replace('7', 'H').replace('8', 'I').replace('9', 'J');
                $('#dcms-terms-cperotion').val(strVal);
                //扩展表达式
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
            //选择用户群条件事件绑定
            $('.dcms-choose-term').live('click', function(){
                var keyName = $(this).data('key'),
                radios = $('#dcms-choose-terms input[type=radio]');
                that = $(this);
                //浮出层
                termDialog = $('#dcms-choose-terms').dialog({
                    //fixed:true,
                    center:true
                });
                //选中当前单选框
                if (keyName) {
                    radios.val([keyName]);
                } else {
                    radios.val(['']);
                }
            });
            
            //条件改变后触发表达式验证
            $('.dcms-term').live('change', function(){
                formValid.valid($('#dcms-terms-cperotion'));
            });
            // //add by pingchun.yupc 2011-11-22 只匹配首要偏好
            $('.only-primary').live('click', function(){
                formValid.valid($('#dcms-terms-cperotion'));
            });
            
            //关闭和取消按钮效果
            $('#dcms-choose-terms .close-btn, #dcms-choose-terms .cancel-btn').click(function(e){
                e.preventDefault();
                termDialog.dialog('close');
            });
            //规则条件中保存事件绑定
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
                        text = '偏好BU与品类：';
                        break;
                    case 'offer_lpv_30d':
                        text = '近四周搜索offer的LPV：';
                        break;
                    case 'company_lpv_30d':
                        text = '近四周搜索公司库的LPV：';
                        break;
                    case 'visit_offer_dpv_30d':
                        text = '近四周浏览offer的DPV：';
                        break;
                    case 'visit_comp_dpv_30d':
                        text = '近四周浏览旺铺的DPV：';
                        break;
                    case 'b_fb_offer_cnt_30d':
                        text = '近四周发出offer反馈数：';
                        break;
                    case 'b_fb_company_cnt_30d':
                        text = '近四周发出公司库反馈数：';
                        break;
                    case 'b_pay_ord_cnt_30d':
                        text = '近四周支付笔数：';
                        break;
                    case 'b_pay_ord_amt_30d':
                        text = '近四周支付金额：';
                        break;
                    case 'valid_cnt':
                        text = '截至当日有效供应offer数：';
                        break;
                    case 'offer_dpv_30d':
                        text = '近四周被浏览的offer的DPV：';
                        break;
                    case 'comp_dpv_30d':
                        text = '近四周被浏览的旺铺的DPV：';
                        break;
                    case 's_fb_offer_cnt_30d':
                        text = '近四周接收offer反馈数：';
                        break;
                    case 's_fb_company_cnt_30d':
                        text = '近四周接收公司反库馈数：';
                        break;
                    case 's_pay_ord_cnt_30d':
                        text = '近四周被支付笔数：';
                        break;
                    case 's_pay_ord_amt_30d':
                        text = '近四周被支付金额：';
                        break;
                     case 'biz_dpt':
                        text = '卖家适用于哪套勋章规则：';
                       break;
                    case 'offer_category_2_attr':
                        text = '卖家主营类目：';
                        break;
                    case 'bu_attr':
                        text = '卖家主营BU：';
                        break;
                    case 'grade_sort':
                        text = '卖家勋章等级';
                        break;
                    case 'last_grade_change_type':
                        text = '卖家勋章等级变化';
                        break;
                    case 'termsProvinceCity':
                        text = '所在城市：';
                        break;
                    case 'member_level':
                        text = '会员类型：';
                        break;                 
                    case 'day_due':
                        text = '诚信通会员到期天数：';
                        break;
                    case 'template_no':
                        text = '模版类别：';
                        break;
                    case 'trust_service_year':
                        text = '诚信通年限：';
                        break;
                    case 'g4_online_cnt':
                        text = '高质量offer数：';
                        break;
                    case 'approved_offer_cnt_30d':
                        text = '近30天发布offer成功数：';
                        break;
                    case 'av_atm_ol_times_30d':
                        text = '近30天日均旺旺在线(分)：';
                        break;
                    case 'login_site_d_cnt_30d':
                        text = '近30天网站登录次数：';
                        break;
                    case 'real_time_info.service_days':
                    	text = '开通诚信通天数：';
                    	break;
                    case 'is_real_price':
                    	text = '是否加入如实报价：';
                    	break;
                    case 'is_credit':
                    	text = '是否加入诚保：';
                    	break;
                    case 'biz_mode':
                    	text = '经营模式：';
                    	break;
                    case 'is_company':
                        text='会员是否有公司库:';
                        break;
                    case 'is_auth_approved':
                         text='会员是否通过实名认证:';
                         break;
                    case 'is_domain':
                    	text = '是否具有旺铺：';
                    	break;
                    case 'realprice_cnt':
                    	text='如实报价offer条数';
                    	break;

		   case 'is_personal_full':
                    	text='个人信息是否完善';
                    	break;
		   case 'is_company_full':
                    	text='公司信息是否完善';
                    	break;
		   case 'is_mobile_binded':
                    	text='手机是否绑定';
                    	break;
		    case 'is_alitalk_login':
                    	text='是否有旺旺登录';
                    	break;
 		    case 'is_alipay':
                    	text='是否绑定支付宝';
                    	break;
 		    case 'is_renew':
                    	text='续签期是否有续费';
                    	break;
		    case 'wp_decoration_score':
                    	text='旺铺装修分数';
                    	break;
		    case 'company_level':
                    	text='公司库星级';
                    	break;
		    case 'forum_post_cnt_30d':
                    	text='30天论坛发帖数';
                    	break;
 		    case 'xp_login_cnt_30d':
                    	text='30天登录询盘管理次';
                    	break;
		  　case 'pm_login_cnt_30d':
                    	text='30天登录精准营销次';
                    	break;
　		   case 'regist_days':
                    	text='注册天数';
                    	break;
           case 'high_quality_cnt':
                    	text='4星以上offer';
                    	break;
           case 'wp_total_score':
                    	text='旺铺总评分';
                    	break;
           case 'is_p4p_present':
                    	text='是否领取过P4P红包';
                    	break;
           case 'is_p4p_present_use':
                    	text='P4P红包是否产生过消耗';
                    	break;
			
			
			
			
			case 'member_name_auth':
			            text='是否实名认证';
						break;
			case 'member_phone_bind':
			            text='是否手机绑定';
						break;
			case 'member_mail_bind':
			            text='是否邮箱绑定';
                        break;
            case 'member_info_complete':
                        text='联系信息是否全';
						break;
			case 'offer_count':
			            text='offer数量';
						break;
			case 'offer_4star_count':
			            text='四星offer数量';
						break;
			case 'company_is_company':
			            text='是否有公司库(company)';
						break;
			case 'company_star_level':
			            text='公司库(分数)星级';
						break;
			case 'wp_has_wp':
			            text='是否有旺铺';
						break;
			case 'wp_score':
			            text='旺铺分数';
						break;
			
			case 'credit_onsite_verified':
			            text='是否实地认证';
						break;
			
			case 'member_biz_role':
			            text='会员贸易角色';
						break;
			case 'is_mobile_full':
	            text='手机是否填写';
				break;
			case 'is_phone_full':
	            text='固话是否填写';
				break;
			case 'is_miyoshi_pass':
	            text='三好包是否完成';
				break;
			case 'is_growth_pass':
	            text='成长包是否完成';
				break;	
			case 'last_tp':
			    text='开通诚信通日期';
				break;
			case 'is_tp':
			    text='是否是诚信通会员';
				break;	
			case 'question_asked_cnt_7d':
	            text='7天内生意经提问次数';
				break;
			case 'question_asked_cnt_30d':
	            text='30天内生意经提问次数';
				break;
			case 'question_answered_cnt_7d':
	            text='7天内生意经回答次数';
				break;
			case 'question_answered_cnt_30d':
	            text='30天内生意经回答次数';
				break;
			case 'publish_thread_cnt_7d':
	            text='7天内论坛发帖次数';
				break;
			case 'publish_thread_cnt_30d':
	            text='30天内论坛发帖次数';
				break;
			case 'publish_article_cnt_30d':
	            text='30天内发博客篇数';
				break;	
		   case 'is_login_ba_30d':
			    text='最近30天登录商机助理';
				break;		
		    case 'status_order':
			    text='认证状态';
				break;	
		    case 'ordered_app':
                text = '已订购APP：';
                break;	
          case 'status_renewal':
                text = '续签状态：';
                break;	
		 case 'tp_period':
                text = '诚信通到期时间：';
                break;	
		 case 'tp_period_day':
                text = '诚信通剩余天数：';
                break;
          case 'is_handsel':
                text = '是否认证免费赠送：';
                break;
          case 'biz_ov_flow_node':
              text = '实地认证进展状态：';
              break;
          case 'pending_count':
              text = '待处理的条数：';
              break;
          case 'offline_count':
              text = '下架的信息数量：';
              break;

          case 'is_p4p_exchange':
              text = '是否P4P充值客户：';
              break;
          case 'p4p_account_balance':
              text = '截至当日P4P帐户余额：';
              break;

          case 'p4p_prod_ol_time':
              text = 'P4P标王最近开始时间：';
              break;

          case 'p4p_daily_max_cost':
              text = 'P4P日消耗上限：';
              break;
          case 'p4p_cost_amt_1d':
              text = '最近1天P4P财务点击消耗：';
              break;    

                }
						
			
                return text;
       }

            /**
             * 获得条件模板
             * name: 必选，字段名
             * txt: 必选，显示的中文说明
            */
            function getTermTemplate(name, txt, select, args, op, opCheck) {
                //var html;
                //add by pingchun.yupc 2011-11-22 只匹配首要偏好
                /*var pLen = arguments.length;
                var opCheck = "false";
                if (pLen==6){
                    opCheck = arguments[5];
                }*/
                //add by hongss on 2011.12.04 只匹配首要偏好
                var containerEl = (select) ? $(select) : that.parent();
                containerEl.next('span').remove();
                opCheck = opCheck || 'false';
                
                switch (name){
                    //所在城市
                    case 'termsProvinceCity':
                        var tempHtml = '<option value="">请选择</option>',
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
                    //偏好类目
                    case 'prefer_category_id':
                        var tempHtml = '<option value="">请选择</option>',
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
                        //绑定bu select change 事件
                        buSelect.change(function(){
                            var buId = $(this).val();
                            categorySelect.val('');
                            leafSelect.val('');
                            getCategory(categorySelect, apiUrl, {bu:buId});
                            leafSelect.html(tempHtml);
                        });
                        //绑定品类 select change 事件
                        categorySelect.change(function(){
                            var plId = $(this).val();
                            leafSelect.val('');
                            getCategory(leafSelect, apiUrl, {pl:plId});
                        })
                        //add by pingchun.yupc 2011-11-22 只匹配首要偏好
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
                    //用户类型
                    case 'member_level':
                        var tempHtml = '<option value="FREE">普通会员</option><option value="TP">TP会员</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //是否加入如实报价
                    case 'is_real_price':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //是否加入诚保
                    case 'is_credit':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //会员是否有公司库 add by pingchun.yupc 2011-12-05
                    case 'is_company':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //会员是否通过实名认证 add by pingchun.yupc 2011-12-05
                    case 'is_auth_approved':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //经营模式
                    case 'biz_mode':
                        var tempHtml = '<option value="1">生产加工</option><option value="2">经销批发</option><option value="3">招商代理</option><option value="4">商业服务</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    //是否具有旺铺
                    case 'is_domain':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     //是否诚信通会员
                    case 'is_tp':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                     case 'is_login_ba_30d':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
                    case 'biz_dpt':
                        var tempHtml = '<option value="C">采购</option><option value="P">批发</option>';
                        singleSelect(tempHtml);
                        break;
                    case 'last_grade_change_type':
                      	var tempHtml = '<option value="U">升级</option><option value="D">降级</option>';
                        singleSelect(tempHtml);
                        break;
                    case 'grade_sort':
                        var tempHtml = '<option value="1">1</option><option value="2">2</option>';
                        tempHtml += '<option value="3">3</option><option value="4">4</option>';
                         tempHtml += '<option value="5">5</option>';
                        singleSelect(tempHtml);
                        break;                        
                    //主营行业
                    case 'offer_category_2_attr':
                        var tempHtml = '<option value="">请选择</option>',
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
                        input = createInput(name, '请输入模板类型');
                        if (!that && select){
                            $(select).html('').append(span).append(input);
                            input.val(args);
                        } else {
                            that.parent().html('').append(span).append(input);
                        }
                        break;

                    // 是否P4P充值客服
                    case 'is_p4p_exchange':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;

                    case 'bu_attr':
                        var tempHtml = '<option value="">请选择</option>',
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
		     //个人信息是否完善
                    case 'is_personal_full':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // 公司信息是否完善（公司名称<8/无职位）
 		    case 'is_company_full':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		     // 手机是否绑定
		    case 'is_mobile_binded':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // 是否有旺旺登录
		    case 'is_alitalk_login':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    // 是否绑定支付宝
		    case 'is_alipay':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
 		    // 续签期是否有续费
		    case 'is_renew':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
	       // 是否领取过P4P红包
		    case 'is_p4p_present':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
            // iP4P红包是否产生过消耗
		    case 'is_p4p_present_use':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			
			
			//add by hongfeng.wanghf
			case 'member_name_auth':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_phone_bind':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_mail_bind':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'member_info_complete':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'company_is_company':
                        var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
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
			            var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			case 'credit_onsite_verified':
			            var tempHtml = '<option value="Y">是</option><option value="N">否</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;	
			
		    case 'member_biz_role':
                        var tempHtml = '<option value="buyer">买家</option><option value="supplier">卖家</option><option value="both">买卖兼有</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
			    case 'status_order':
                        var tempHtml = '<option value="SYNC_AV_STATUS">认证中</option><option value="SYNC_AV_ERROR">认证异常</option><option value="WAIT_CONFIRM_AV">递交认证资料</option><option value="WAIT_SEND_AUTH">待送认证</option><option value="FAILURE">认证失败</option><option value="WAIT_AUDIT">等待审核授权书</option><option value="UPLAD_AUTHORIZE">上传授权书</option><option value="SUCCESS">认证成功</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;				
			 case 'ordered_app':
                        var span = createSpan(name, txt),
                        input = createInput(name, '请输入已订购APP');
                        if (!that && select){
                            $(select).html('').append(span).append(input);
                            input.val(args);
                        } else {
                            that.parent().html('').append(span).append(input);
                        }
                        break;
             case 'status_renewal':
                        var tempHtml = '<option value="payment_none">未结算</option><option value="payment_part">部分结算</option><option value="payment_success">结算完成</option><option value="payment_use">按使用付费</option>';
                        //p = pObj.clone(),
                        singleSelect(tempHtml);
                        //html = p.html();
                        break;
		    case 'biz_ov_flow_node':
                var tempHtml = '<option value="ORDER_CREATE">下单</option><option value="INVITE">邀约</option><option value="EVIDENCE">取证</option><option value="AUTH">认证</option><option value="AUTH_RESULT">认证完成</option>';
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
                 * 只匹配首要偏好
                 * add by pingchun.yupc
                 * modify by hongss on 2011.12.04
                 */
                function onlyPrimary(el) {
                    var termContent = (el) ? $(el) : that.parent(); 
                  
                    if(termContent&&termContent.prev()){
                        var _termCode = termContent.prev().html();
                        var oHtml = "<span><input class='only-primary' type='checkbox' id='"+_termCode+"' name='"+_termCode+"'/>只匹配首要偏好</span>";
                        if (opCheck && 'true'==opCheck){
                            oHtml = "<span><input class='only-primary' type='checkbox' checked=true id='"+_termCode+"' name='"+_termCode+"'/>只匹配首要偏好</span>";
                        }
                        termContent.after(oHtml);
                    }//
                }
                //return html;
            }
            
            //偏好类目、主营数据接口调用
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
                            var optionHtml = '<option value="">请选择</option>';
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
                holder = holder || '请输入数值';
                obj.addClass('dcms-term');
                obj.attr('placeholder', holder);
                return obj;
            }
            
        },
        
        //add by arcthur on 4.13
        function checkRule() {
            $('#checkBtn').click(function () {
                if (confirm('审核前请先预览关联的页面位置。如果该页面位置已关联页面，请先预览，如果已预览，确定无误，再点击审核通过按钮')){
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
