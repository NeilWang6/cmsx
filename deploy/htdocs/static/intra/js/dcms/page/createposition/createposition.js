/**
 * Ͷ��λ����
 * @author: yu.yuy, arcthur.cheny
 * @createTime: 2011-03-03
 * @lastModified: 2011-04-10
 */
(function ($, D) {
    var //cmsdomain = location.protocol + '//' + location.host, 
        cmsdomain = D.domain,
        editTemplateUrl = $('#editTemplateUrl').val(),
        editRuleUrl = $('#editRuleUrl').val(),
        showDataUrl = $('#showDataUrl').val(),
        snapshotUrl = $('#snapshotUrl').val(),
        ruleIds = $('#ruleIds'),
        ruleIdsStr = ruleIds.val().trim(),
        relatedRulesQueue = (ruleIdsStr === '' ? [] : ruleIds.val().split(',')),
        timeId, newRuleId, newRuleRadio, ruleCategory, positionCategory, ruleDialog, defaultRuleDialog, defauleRuleCategory,
        gridOperationsWrap = $('#relatedRulesOperations'),
        doc = document;

     //����Ŀ¼��ʼ��
    positionCategory = new D.Category($('#positionCategoryOne'), $('#positionCategoryTwo'), cmsdomain);
    positionCategory.reset($('#catalogId').val(), $('#catalogChildId').val());

    //����ѡ��Ի����ڵļ���Ŀ¼��ʼ��
    ruleCategory = new D.Category($('#relatedRulesDialog .rule-category-one'), $('#relatedRulesDialog .rule-category-two'), cmsdomain);
    defauleRuleCategory = new D.Category($('#defaultRelatedRulesDialog .rule-category-one'), $('#defaultRelatedRulesDialog .rule-category-two'), cmsdomain);
    
    ruleDialog = new D.RuleDialog($('#relatedRulesDialog'), {
        fixed: true,
        center: true,
        open: function () {
            newRuleId = null;
            newRuleRadio = null;
            ruleDialog.reset();
            //D.popTree('selcategoryNameRule','selcategoryNameRule','selCategoryIdRule','dgRuleTree','admin/catalog.html');
        }
    }, {
        container: $('#relatedRulesDialog tbody'),
        previousBtn: $('#relatedRulesDialog .rule-previous'),
        nextBtn: $('#relatedRulesDialog .rule-next'),
        firstPageBtn: $('#relatedRulesDialog .rule-first-page'),
        cmsdomain: cmsdomain,
        openBtn: $('#chooseRulesBtn'),
        closeBtns: $('#relatedRulesDialog .close-btn, #relatedRulesDialog .cancel-btn'),
        submitBtn: $('#relatedRulesDialog .saveNewRuleBtn'),
        searchBtn: $('#relatedRulesDialog .searchRulesBtn'),
        defaultRuleName: $('#relatedRulesDialog .defaultRuleName'),
        keywordElement: $('#relatedRulesDialog .searchRulesKeyword'),
        categoryTwoElement: $('#selCategoryIdRule'),
        category: ruleCategory,
        validator: myValid,
        relatedRulesQueue: relatedRulesQueue,
        isDefault: ''
    });
    //Ĭ�Ϲ���ѡ��Ի����ڵļ���Ŀ¼��ʼ��
    defaultRuleDialog = new D.RuleDialog($('#defaultRelatedRulesDialog'), {
        fixed: true,
        center: true,
        open: function () {
            newRuleId = null;
            newRuleRadio = null;
            defaultRuleDialog.reset();
            //D.popTree('selcategoryNameDrule','selcategoryNameDrule','selCategoryIdDrule','dgDruleTree','admin/catalog.html');
        }
    }, {
        container: $('#defaultRelatedRulesDialog tbody'),
        previousBtn: $('#defaultRelatedRulesDialog .rule-previous'),
        nextBtn: $('#defaultRelatedRulesDialog .rule-next'),
        firstPageBtn: $('#defaultRelatedRulesDialog .rule-first-page'),
        cmsdomain: cmsdomain,
        openBtn: $('#chooseDefaultRuleBtn'),
        closeBtns: $('#defaultRelatedRulesDialog .close-btn, #defaultRelatedRulesDialog .cancel-btn'),
        submitBtn: $('#defaultRelatedRulesDialog .saveNewRuleBtn'),
        searchBtn: $('#defaultRelatedRulesDialog .searchRulesBtn'),
        defaultRuleName: $('#defaultRelatedRulesDialog .defaultRuleName'),
        keywordElement: $('#defaultRelatedRulesDialog .searchRulesKeyword'),
        categoryTwoElement: $('#selCategoryIdDrule'),
        category: ruleCategory,
        validator: myValid,
        relatedRulesQueue: relatedRulesQueue,
        isDefault: 'ok'
    });
	//add by xutao
	var templateCategory = new D.Category($('#templateCategoryOne'), $('#templateCategoryTwo'), cmsdomain),
	templateDialog = new D.TemplateDialog($('#templatesDialog'),{
		fixed : true,
		center : true,
		open : function(){
			templateDialog.reset();
            //alert(1);
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
		validator : myValid
	});
    //Ĭ�Ϲ���༭
    $('#editDefaultTemplateBtn').mouseenter(function(e){
		//e.preventDefault();
        var templateId = $('#templateId').val();
        $(this).attr('href', editTemplateUrl + templateId);
	});
    $('#editDefaultRuleBtn').mouseenter(function(e){
        var ruleId = $('#ruleId').val();
        //modify by hongss on 2012.08.17 for �ж�����ruleId
        if (ruleId){
            $(this).attr('href', editRuleUrl + ruleId);
        } else {
            $(this).attr('href', D.domain+'/position/create_rule.html');
        }
        
    });    
    $('.related-rules tbody').delegate("tr", "mouseenter", function () {
        var container = $('.last-col', this);
        timeId = window.setTimeout(function () {
            gridOperationsWrap.appendTo(container);
            gridOperationsWrap.fadeIn();
        }, 300);
    });
    $('.related-rules tbody').delegate("tr", "mouseleave", function () {
        if (timeId) {
            window.clearTimeout(timeId);
        }
        gridOperationsWrap.hide();
    });
    gridOperationsWrap.delegate(".move-up-btn", "click", function (e) {
        e.preventDefault();
        var theCurrentTr = $(this).closest('tr'),
            trs = $('.dcms-operational-grid tbody tr'),
            index = $(trs).index(theCurrentTr),
            currentId, previousId;
        if (index !== 0) {
            theCurrentTr.prev().before(theCurrentTr);
            previousId = relatedRulesQueue[index - 1];
            currentId = relatedRulesQueue[index];
            relatedRulesQueue.splice(index - 1, 2, currentId, previousId);
            theCurrentTr.animate({
                backgroundColor: "#D4DBE9"
            }, 600).animate({
                backgroundColor: "#FFFFFF"
            }, 600);
        }
    });
    gridOperationsWrap.delegate(".move-down-btn", "click", function (e) {
        e.preventDefault();
        var theCurrentTr = $(this).closest('tr'),
            trs = $('.dcms-operational-grid tbody tr'),
            length = trs.length,
            index = $(trs).index(theCurrentTr),
            currentId, nextId;
        if (index !== length - 1) {
            theCurrentTr.next().after($(theCurrentTr));
            $('.dcms-grid-operations-wrap', theCurrentTr).hide();
            currentId = relatedRulesQueue[index];
            nextId = relatedRulesQueue[index + 1];
            relatedRulesQueue.splice(index, 2, nextId, currentId);
            theCurrentTr.animate({
                backgroundColor: "#D4DBE9"
            }, 600).animate({
                backgroundColor: "#FFFFFF"
            }, 600);
        }
    });
    gridOperationsWrap.delegate(".edit-template-btn", "mouseenter", function (e) {
        var theCurrentTr = $(this).closest('tr'),
            templateId = $('.template-id', theCurrentTr).val();
        $(this).attr('href', editTemplateUrl + templateId);
    });
    gridOperationsWrap.delegate(".view-data-btn", "mouseenter", function (e) {
        var theCurrentTr = $(this).closest('tr'),
        ruleId = $('.js-rule-id', theCurrentTr).val(),
        positionId = $('#id').val(),
        url = cmsdomain+'/position/top_url.html';
        $(this).attr('href', url+'?rid='+ruleId+'&pid='+positionId);
    });
    gridOperationsWrap.delegate(".remove-btn", "click", function (e) {
        var theCurrentTr = $(this).closest('tr'),
            trs = $('.dcms-operational-grid tbody tr'),
            index = $(trs).index(theCurrentTr);
        e.preventDefault();
        if (confirm('ȷ��Ҫ�Ƴ��ù���������')) {
            gridOperationsWrap.appendTo(doc.body);
            theCurrentTr.remove();
            if (relatedRulesQueue.length === 100) {
                $('#chooseRulesBtn').show();
            }
            relatedRulesQueue.splice(index, 1);
        }
    });
    //
      D.validEsiTemplate = function(config, handle){
        var el = $(this),
        self = this,
        opt = config['opt'],
        cfg = config['cfg'],
        templateInput = $('#templateName'),
        errorTip = templateInput.nextAll('.dcms-validator-tip');
        if (!$.trim(templateInput.val())){
	    //ҳ��λ���޸�������ʷ����ԭ����Ҫ�ſ��������Ʊ�����д
	    if(location.pathname.indexOf("modify_position.html") == -1 || el.val()==='ESI') {
                errorTip.html('�ݴ�ģ�����ѡ��');
                errorTip.addClass('dcms-validator-error');
                handle.call(self,'templateIsError',opt);
		return;
	   }
        } 
	
        errorTip.removeClass('dcms-validator-error');
        opt.isValid=true;
        handle.call(self,'pass',opt);
        
    }
    
    //����֤
    var myValid = new FE.ui.Valid($('.dcms-form .need-verify'), {
        onValid: function (res, o) {
            var tip = $(this).nextAll('.dcms-validator-tip'),
                msg;
            if (res === 'pass') {
                tip.removeClass('dcms-validator-error');
            } else {
                switch (res) {
                case 'required':
                    msg = o.key + '������д';
                    break;
                case 'nameisExisted':
                    msg = o.key + '�Ѿ�����';
                    break;
                case 'quoteNameisExisted':
                    msg = o.key + '�Ѿ�����';
                    break;
                case 'defaultRuleNameIsWrong':
                    msg = o.key + '��Ч';
                    break;
				case 'templateNameIsWrong' :
					msg = o.key + '��Ч';
					break;
                case 'nameFormatIsWrong':
                    msg = '����ĸa~z�������ִ�Сд��������0~9�����ġ����Ż��»������';
                    break;
                case 'quoteNameFormatisWrong':
                    msg = '����ĸa~z�������ִ�Сд��������0~9���»������';
                    break;
                case 'fun':
                    msg = o.msg;
                    break;
                }
                tip.html(msg);
                tip.addClass('dcms-validator-error');
            }
        }
    });
    $('#checkBtn').click(function () { 
		if (confirm('���ǰ����Ԥ��ҳ��λ�á�����ѹ���ҳ�棬����ҳ����Ԥ��ҳ��λ�ã������Ԥ����ȷ�������ٵ�����ͨ����ť')){
            $('#checkPosition').attr('name', 'event_submit_do_auditPosition');
            $('#createBoothForm').submit();
        }
    });
    
    $('#freshSnapshot').click(function () { 
    	$.ajax(snapshotUrl, {
    		dataType : 'jsonp',
    		success: function(msg) {
    			if(msg){
    				alert( msg.status ? '�����ɹ�!' : '����ʧ��!��ȷ�Ϲ����ģ���Ƿ��Ѿ����ͨ��!');
    			}
    		}	
    	})
    });
    
    $('#createBoothForm').submit(function (e) {
        ruleIds.attr('value', relatedRulesQueue.join());
        return myValid.valid()
    });
	//add by xutao
    //var methodEl = $('#method'),
    //templateContainer = $('#templateName').parent('div');
    //	methodEl.change(function(e){
    //		if($(this).val()==='ESI'){
	//		templateContainer.slideDown('fast');
	///	}
	//	else{
	//		templateContainer.slideUp('fast');
	//	}
	//});
    //add by hongss on 2011.11.14
    //if (methodEl.val()==='ESI'){
    //    templateContainer.show();
    //}
  
    //add by zhangfan
    //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
    //modify by hongss on 2011.11.28
    var categoryIdEl = $('#selCategoryId'),
		categoryEl = $('#selcategoryName'),
		popTree = new D.PopTree();
    popTree.show(categoryEl, categoryEl, categoryIdEl, false);
    //ҳ���еġ���Ŀ��ѡ��
    categoryEl.click(function(e){
        popTree.show(categoryEl, categoryEl, categoryIdEl);
    });
    //ģ��ѡ��Ի����еġ���Ŀ��ѡ��
    $('#selcategoryNameTpl').click(function(e){
        var el = $(this);
        popTree.show(el, el, $('#selCategoryIdTpl'));
    });
    //��������ѡ��Ի����еġ���Ŀ��ѡ��
    $('#selcategoryNameRule').click(function(e){
        var el = $(this);
        popTree.show(el, el, $('#selCategoryIdRule'));
    });
    //Ĭ�Ϲ���ѡ��Ի����еġ���Ŀ��ѡ��
    $('#selcategoryNameDrule').click(function(e){
        var el = $(this);
        popTree.show(el, el, $('#selCategoryIdDrule'));
    });

})(dcms, FE.dcms);
