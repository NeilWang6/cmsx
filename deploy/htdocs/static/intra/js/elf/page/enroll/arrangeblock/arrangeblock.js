/**
 * @package FE.app.elf.enroll.arrangeblock
 * @author: qinming.zhengqm
 * @Date: 2013-02-22
 */
;(function($, T) {
	var domain=$('#domain_cmsModule').val();
	$.use('ui-tabs', function(){
		//�������� ��ʼ����ѯ ���� arrange_block.htm?topic_id=115800&dt=1362639437896#tab=rules&blockId=11101
        var hash = window.location.hash.split('#');
        var defaultSelected=0;
        var defaultBlockId=0;
        if(hash.length === 2) {
            if(hash[1].search('tab=rules') !== -1) {
            	defaultSelected = 1;
            	//defaultBlockId
            }else if(hash[1].search('tab=page') !== -1) {
            	defaultSelected = 2;
            }
        }
		var blockIdExpr = /blockId=([0-9]+)/;
		if(blockIdExpr.test(hash)){
			var blockIdMatch = blockIdExpr.exec(hash);
			defaultBlockId = blockIdMatch[1];
		}

        $('#arrange-tabs-1').tabs({
			isAutoPlay: false,
			event: 'click',
			titleSelector: '.list-tabs-t li.tabli',
			boxSelector: '.tab-a-box',
			selected: defaultSelected,
			select: function(e,data){
				if(data.box.hasClass('js-arg-ruletabbox')){
					var items = data.box.find('.blockitem');
					if(items.size()>0){
						var showItem = items[0];
						if(defaultBlockId!=0){
							for(var i=0; i<items.size();i++){
								if($(items[i]).data("blockid")==defaultBlockId){
									showItem = items[i];
									break;
								}
							}
						}
						showrule($(showItem));
					}
				}
            }
		});
	});

	/*�����������*/
	//����������������¼����������ѣ���ʾ��������
	$("#createbtn").click(function(e){
		$("#createbtn").parent().parent().addClass('display-none');
		$("#area,#bt-save").removeClass('display-none');
		new FE.tools.AddDelMove({
			container:'#arrblock .form-vertical',
			operateEl:'.block-operate',
			afterAdd: function(addEl){
				addEl.find('.blockId').val(0);
				addEl.find('.blockState').val('Y');
				addEl.find('.blockName').val('');
			}
		});
	});
	//������޸����顱��area�µ�����disabled��Ԫ��enable����ɾ�ƶ�ͼ����ʾ���޸İ�ť���أ����水ť��ʾ
	$("#bt-modify").click(function(e){
		$("#area .disabl").each(function(i, el){
			$(el).prop("disabled",false);
		});
		$("#area .icon-admm").each(function(i, el){
			$(el).removeClass("display-none");
		});
		new FE.tools.AddDelMove({
			container:'#arrblock .form-vertical',
			operateEl:'.block-operate',
			afterAdd: function(addEl){
				addEl.find('.blockId').val(0);
				addEl.find('.blockState').val('Y');
				addEl.find('.blockName').val('');
				addEl.find('.blockType').prop("disabled",false);
			}
		});
		$("#bt-modify").addClass('display-none');
		$("#bt-save").removeClass('display-none');
	});
	function saveMsg(){
		var validEls = $('.block-operate [data-valid]').not(':hidden');
		var validDemo1 = new FE.ui.Valid(validEls, {
			onValid : function(res, o) {
				var tip = $(this).closest('.item-form').find('.validator-tip'), msg = '';
				if (res==='pass'){
					tip.removeClass('validator-error');
				} else {
					switch(res){
						case 'required':
							msg = o.key+' ����Ϊ��';
							break;
						case 'max' :
							msg = o.key+'��󳤶Ȳ��ܴ���'+o.max;
                            break;
                        case 'fun' :
                            msg = o.msg;
                            break;
                        default:
                            msg = '����д��ȷ������';
                            break;
					}
					tip.text(msg);
					tip.addClass('validator-error');
				}

			}
		});
		var isValid = validDemo1.valid();
		if(isValid){
			var arrValues = [],objValue = {};
			$('#arrblock .block-operate').each(function(i, el){
				el = $(el);
				var value = {};
				value['id'] = $('.blockId', el).val();
				value['name'] = $('.blockName', el).val();
				value['type'] = $('.blockType', el).val();
				value['state'] = $('.blockState', el).val();
				if(value['name']!=""){
					arrValues.push(value);
				}
			});

			objValue['value'] = arrValues;
			$('#area_value').val(JSON.stringify(objValue));

			if(arrValues == ''){
				alert("�㻹û�н����������ã����Ƚ������������ٱ��棡");
			}else{
				$('#blockForm').submit();
			}
		}
	}
	$('#bt-save').click(function(e){
		saveMsg();
	});
	T.confirmNext = function (success,toUrl,errorCode,next){
		if(success && toUrl){
			$.use('ui-dialog', function(){
				//���ж�������㣬�����ID��class
				var dialog = $('#savemsg.dialog-basic').dialog({
					center: true,
					fixed:true,
					timeout: 1000,
					beforeClose: function(){
						window.location.href=toUrl;
					}
				});
			});
		}else{
			if(errorCode == 'checkURL'){
				alert("��url�ѱ�ʹ�ã������¸���url�ٱ���!");
			}else{
				alert("����ʧ�ܡ�errorCode="+errorCode);
			}
		}
	};
	/*���ڹ���*/
	//��֤����
	T.offerIdsReg = /^\d+([ ]*[\,|��][ ]*\d+)*$/;
	T.validSalesChange = function(){
		var salesChangeE = $(this);
		var sortTypeE = salesChangeE.closest(".item-form").parent().find(".sortType");
		if(sortTypeE.val()=="sales_change"){
			var sci = salesChangeE.val();
			if(sci!=""){
				return true;
			}
		}
		return '��ѡ��������ʱ���';
	};
	//��֤��Ʒoffer������ұ���������+","�ĸ�ʽ��
	T.validOfferIdsBasic = function(){
		var offerIds = $(this).val();
		if(offerIds==""){
			return "����дOfferIds"
		}
		if(T.offerIdsReg.test(offerIds)){
			return true;
		}
		return "OfferIds��д��ʽ����";
	};
	//��֤����offer��memberId����;offerIds�����ұ���������+","�ĸ�ʽ��
	T.validMbrOfferIdsBasic = function(){
		var mbroffE = $(this);
		var mbrE = mbroffE.closest('.rulebox').find(".membersID");
		if(mbrE.val()==""){
			return "����дָ��memberID"
		}
		if(mbroffE.val()==""){
			return "����дofferIDs"
		}
		if(T.offerIdsReg.test(mbroffE.val())){
			return true;
		}
		return "offerIDs��ʽ����";
	};
	//�߼���֤��ͬһ�����в��ܳ�����ͬofferid
	T.validOfferIdsAdv = function(){
		var msg = "";
		$(".rule-container .rulebox").each(function(i, el){
			var offerIdsMap = {};
			var offerIds = $(el).find(".offerIds").val();
			var beginDate = $(el).find(".beginDate").val();
			offerIds = offerIds.replace("��",",").replace(" ","");
			var offerIdArr = offerIds.split(",");
			for(var j=0; j<offerIdArr.length;j++){
				var tmp = offerIdArr[j].trim();
				if(offerIdsMap[tmp] && offerIdsMap[tmp]!=""){
					//�����ظ�
					msg = "����["+beginDate+"]���ܳ�����ͬofferId["+tmp+"]��";
					break;
				}
				offerIdsMap[tmp]=tmp;
			}
		});

		if(msg!=""){
			return msg;
		}
		return true;
	};
	//�߼���֤��ͬһ�����е�ͬһ���ڲ��ܰ����ظ�memberid; ͬһmemberid�����ڲ�ͬ�����г���
	T.validMbrOfferIdsAdv = function(){

		return true;
	};
	T.afterIFrameReload = function (jsonstr){
		try{
			var jsonobj = $.parseJSON(jsonstr) || {};
			var succ = jsonobj.success || false;
			var eventname = jsonobj.eventname || "check";
			if(eventname=="check"){ //����У�����
				if(succ){
					T.doAfterCheckRuleData(jsonobj, function(){
						$('#event_submit_name').prop("name","event_submit_do_add_or_update_block_rule");
						$('#moveOffer').val(true);
						$('#ruleForm').submit();
					}, function(){
						$('#event_submit_name').prop("name","event_submit_do_add_or_update_block_rule");
						$('#moveOffer').val(false);
						$('#ruleForm').submit();
					});
				}else{
					alert("����У��ʧ�ܡ����Ժ����ԡ�");
				}
			}else{ //�������
				if(succ){
					var toUrl = jsonobj.toUrl || "";
					$.use('ui-dialog', function(){
						//���ж�������㣬�����ID��class
						var dialog = $('#savemsg.dialog-basic').dialog({
							center: true,
							fixed:true,
							timeout: 1000,
							beforeClose: function(){
								if(toUrl!=""){
									window.location.href=toUrl;
								}
							}
						});
					});
				}else{
					alert("���ݸ���ʧ�ܡ����Ժ����ԡ�");
				}
			}
		}catch(e){
			alert(e);
		}
	};
	function saverules(){
		var validEls = $('.rule-container [data-valid]').not(':hidden');
		var validDemo1 = new FE.ui.Valid(validEls, {
			onValid : function(res, o) {
				var tip = $(this).closest('.item-form').find('.validator-tip'), msg = '';
				if (res==='pass'){
					tip.removeClass('validator-error');
				} else {
					switch(res){
						case 'required':
							msg = o.key+' ����Ϊ��';
							break;
                        case 'int' :
                            msg = '��������ȷ������';
                            break;
						case 'max' :
							if(o.type=='string'){
								msg = o.key+'��󳤶Ȳ��ܴ���'+o.max;
							}else if(o.type=='int'){
								msg = o.key+'���ֵ���ܴ���'+o.max;
							}
                            break;
                        case 'min' :
                        	if(o.type=='string'){
								msg = o.key+'��С���Ȳ���С��'+o.min;
							}else if(o.type=='int'){
	                            msg = '���������0������';
							}
                            break;
                        case 'fun' :
                            msg = o.msg;
                            break;
                        default:
                            msg = '����д��ȷ������';
                            break;
					}
					tip.text(msg);
					tip.addClass('validator-error');
				}

			}
		});
		var isValid = validDemo1.valid();
		var hasArrange = false;
		if(isValid){
			//��ʼʱ�������һ�������ڵ�ǰʱ��ġ�
			var hasEarlyDate = false;
			$('.rule-container .beginDate').each(function(i, el){
				hasArrange = true;
				var $this = $(el);
				var nowtime = $.util.date.now();
				var bdStr = $this.val();
				var bd = Date.parseDate(bdStr,"yyyy-MM-dd hh:mm:ss");
				if($.util.date.isBefore(nowtime, bd)){
					hasEarlyDate = true;
				}
			});
			if(hasArrange && !hasEarlyDate){
				T.doShowAlertDialog("Ϊ����������ֿհף�ÿ��������������һ������ʱ����Ҫ���ڵ�ǰʱ�䣬�������ڿ�ʼʱ�䣡");
				isValid = false;
			}
		}
		if(isValid){
			var blockType = $("#rules_blockType").val();
			if(blockType=="pin"){
				var msg = T.validOfferIdsAdv();
				if (typeof msg === 'string') {
					isValid = false;
					alert(msg);
				}
			}else{
				
			}
		}
		if(isValid){
			var blockType = $("#rules_blockType").val();
			var blockId = $("#rules_blockId").val();
			var arrValues = [],objValue = {}, offersValue="";
			$('#rule-container .rulebox').each(function(i, el){
				el = $(el);
				if($('.beginDate', el).val()!=""){
					var value = {};
					value['id'] = $('.datailId', el).val();
					value['blockId'] = blockId;
					value['argDataId'] = $('.argDataId', el).val();
					value['showNum'] = $('.showNum', el).val();
					value['beginDate'] = $('.beginDate', el).val();
					var paramObj = {};
					paramObj['showNum'] = $('.showNum', el).val();
					paramObj['beginDate'] = $('.beginDate', el).val();
					if(blockType=="pin"){
						paramObj['offerIds'] = $('.offerIds', el).val().replace("��",",");
						paramObj['sortType'] = $('.sortType', el).val();
						paramObj['salesChangeInterval'] = $('.salesChangeInterval', el).val();
						if(offersValue==""){
							offersValue = paramObj['offerIds'];
						}else{
							offersValue = offersValue + "," + paramObj['offerIds'];
						}
					}else{
						var members = [];
						el.find('.member-operate').each(function(i, el){
							var mbrobj = {};
							mbrobj["membersID"] = $.trim($(el).find(".membersID").val());
							mbrobj["offerIDs"] = $(el).find(".mbrOfferIDs").val().replace("��",",");
							members.push(mbrobj);
							if(offersValue==""){
								offersValue = mbrobj["offerIDs"];
							}else{
								offersValue = offersValue + "," + mbrobj["offerIDs"];
							}
						});
						paramObj['members'] = members;
					}
					value["params"] = JSON.stringify(paramObj);
					arrValues.push(value);
				}
			});

			objValue['value'] = arrValues;
			$('#rules_value').val(JSON.stringify(objValue));
			$('#offers_value').val(offersValue);
			$('#event_submit_name').prop("name","event_submit_do_check_block_rule");
			$('#ruleForm').submit();
		}

	}
	function showrule(blockobj){
		$('#arg-rule .block-arg-rule .current').removeClass("current");
		blockobj.addClass("current");
		//�ȼ������ڹ���, �ж�����������Ʒ�������̣�ѭ���������ģ�崴�����������û����Ĭ����ʾһ����������
		//
		var loading = $('#arg-rule .loading');
		var ruleContainer = $('#rule-container');
		ruleContainer.addClass('display-none');
        loading.removeClass('display-none');
        $('#rule-container .ruleblock').each(function(i, el){
			$(el).remove();
		});

        var url = blockobj.data("url");
        var blockid= blockobj.data("blockid");
        $("#currentBlockName").val(blockobj.data("blockname"));
        $("#rules_blockId").val(blockid);
        $.ajax({
            url : url + "?_input_charset=UTF-8",
            type : "post",
            data : {blockid: blockid},
            error : function(jqXHR, textStatus, errorThrown) {
                searchEnable = true;
                var msg = 'ҳ�泬ʱ����ˢ������';
                if(jqXHR.status === 0) {
                    msg = 'ûȨ�ޣ�'
                }
                alert(msg);
                ruleContainer.removeClass('display-none');
                loading.addClass('display-none');
                $('#bt-save-rule').addClass('display-none');
                return;
            },
            success : function(rs, textStatus, jqXHR) {
                searchEnable = true;
                ruleContainer.removeClass('display-none');
                loading.addClass('display-none');
                if(!rs.success) {
                    alert("ҳ�泬ʱ����ˢ������");
                    $('#bt-save-rule').addClass('display-none');
                    return;
                }else{
                    $('#bt-save-rule').removeClass('display-none');
                	renderArrangeRules(rs);
                }
            }
        });
	}
	/*��ɾ���ڰ�ť*/
	$.ruleAddDel = {};
	$.ruleAddDelCfg = {
			container:'#rule-container',
			operateEl:'.ruleblock',
			add:'.icon-add-rule',  //���Ӵ����ѡ����(selector)
	        del:'.icon-delete-rule',  //ɾ�������ѡ����(selector)
	        moveup:'.icon-moveup-rule',  //���ƴ����ѡ����(selector)
	        movedown:'.icon-movedown-rule',  //���ƴ����ѡ����(selector)
	        allowDelAll:true,
			afterAdd: function(addEl){
				addEl.find(".datailId").val(0);
				addEl.find(".argDataId").val(0);
				addEl.find(".showNum").val("");
				addEl.find(".beginDate").val("");

				var blockType = $("#rules_blockType").val();
				if(blockType=="pin"){
					addEl.find(".offerIds").val("");
					addEl.find(".sortType").val("");
					addEl.find(".salesChangeInterval").val("");
					renderArrangeRulesOffer(addEl, null);
				}else{
					var box = addEl.find(".rulebox");
					box.removeClass(box.prop("id"));
					addEl.find(".member-operate").each(function(i, el){
						$(el).remove();
					});
					addEl.find(".member-operate").each(function(i,el){
						$(el).find(".membersID").each(function(j, el2){
							$(el2).val("");
						});
						$(el).find(".mbrOfferIDs").each(function(j, el2){
							$(el2).val("");
						});
					});
		        	renderArrangeRulesMember(addEl, null);
				}
				$.use('ui-datepicker-time, util-date', function() {
					initRuleDatePicker(addEl);
				});
			}
		};
	function initAddDel(){
		$.ruleAddDel = new FE.tools.AddDelMove($.ruleAddDelCfg);
	}
	function reInitAddDel(){
		$.ruleAddDel._setFirstAddLastStyle($.ruleAddDelCfg);
	}
	/*��ɾ���̲�����ť*/
	function initMemberAddDel(clsid){
		var ruleMemberAddDelCfg = {
				container:'#rule-container .'+clsid,
				operateEl:'.member-operate',
				add:'.icon-add',  //���Ӵ����ѡ����(selector)
		        del:'.icon-delete',  //ɾ�������ѡ����(selector)
		        moveup:'.icon-moveup',  //���ƴ����ѡ����(selector)
		        movedown:'.icon-movedown',  //���ƴ����ѡ����(selector)
				afterAdd: function(addEl){
					$(addEl).find(".membersID").val("");
					$(addEl).find(".mbrOfferIDs").val("");
				}
			};
		new FE.tools.AddDelMove(ruleMemberAddDelCfg);
	}
	//���ڿؼ�
	function initRuleDatePicker(addEl){
		$.use('ui-datepicker-time, util-date', function() {
			addEl.find('.js-select-date').datepicker({
				showTime : true,
				closable : true,
				select : function(e, ui) {
					var date = ui.date.format('yyyy-MM-dd hh:mm:ss');
					$(this).val(date);
				},
	            timeSelect : function(e, ui) {
	                $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss')).datepicker('hide');
	            }
			});
		});
	}
	//��Ⱦ��Ʒ����, datailId,argDataId��ʼΪ0
	function renderArrangeRulesOffer(cloneEl, mainRec){
		if(mainRec!=null){
			cloneEl.find(".datailId").val(mainRec.id);
			cloneEl.find(".argDataId").val(mainRec.argDataId);
			if(mainRec.argDataId>0&&mainRec.argParamDO){
				var argParam = (mainRec.argParamDO.bigParam ||"");
				if(argParam && argParam!=""){
					var argParamObj = JSON.parse(argParam);
					cloneEl.find(".showNum").val(argParamObj.showNum);
					cloneEl.find(".beginDate").val(argParamObj.beginDate);

					var offerIds = argParamObj.offerIds;
					var sortType = (argParamObj.sortType ||"");
					var salesChangeInterval = (argParamObj.salesChangeInterval||"");
					cloneEl.find(".offerIds").val(offerIds);
					cloneEl.find(".sortType").val(sortType);
					cloneEl.find(".salesChangeInterval").val(salesChangeInterval);
				}
			}
		}

		var sorttypeEl = cloneEl.find(".sortType");
		var salesChangeIntervalEl = cloneEl.find(".salesChangeInterval");
		if(sortType == "sales_change"){
			salesChangeIntervalEl.parent().parent().show();
		}else{
			salesChangeIntervalEl.parent().parent().hide();
		}

		sorttypeEl.change(function(el){
			var $self = $(this);
			// ����Ƕ���������ʽ���ö���ʱ����
			if ($self.val() == "sales_change"){
				salesChangeIntervalEl.parent().parent().show();
			}else{
				salesChangeIntervalEl.parent().parent().hide();
				salesChangeIntervalEl.val("");
			}
		});

	}
	$.mbrBlockCount = 0;
	//��Ⱦ��������, datailId,argDataId��ʼΪ0
	function renderArrangeRulesMember(outerCloneEl, mainRec){
		var sample = $(".member-operate-sample");
		$.mbrBlockCount = $.mbrBlockCount +1;
		var clsid = "addDelArea_"+$.mbrBlockCount;
		outerCloneEl.find(".rulebox").addClass(clsid);
		outerCloneEl.find(".rulebox").prop("id",clsid);
		if(mainRec==null){
			var cloneEl = sample.clone();
			cloneEl.removeClass("member-operate-sample").removeClass("display-none");
			var beforemember =outerCloneEl.find(".beforemember");
			beforemember.after(cloneEl);
			initMemberAddDel(clsid);
		}else{
			//��Ⱦmemberʱ��̬����initMemberAddDel
			outerCloneEl.find(".datailId").val(mainRec.id);
			outerCloneEl.find(".argDataId").val(mainRec.argDataId);
			if(mainRec.argDataId>0&&mainRec.argParamDO){
				var argParam = (mainRec.argParamDO.bigParam ||"");
				if(argParam && argParam!=""){
					var argParamObj = JSON.parse(argParam);
					if(argParamObj){
						outerCloneEl.find(".showNum").val(argParamObj.showNum);
						outerCloneEl.find(".beginDate").val(argParamObj.beginDate);
						var argParamObjMbrs = argParamObj.members;
						if(argParamObjMbrs && argParamObjMbrs.length>0){
							var prembr = outerCloneEl.find(".beforemember");
							for(var i=0;i<argParamObjMbrs.length;i++){
								var cloneEl = sample.clone();
								cloneEl.find(".membersID").val(argParamObjMbrs[i].membersID);
								cloneEl.find(".mbrOfferIDs").val(argParamObjMbrs[i].offerIDs);
								prembr.after(cloneEl);
								cloneEl.removeClass("member-operate-sample").removeClass("display-none");
								prembr = cloneEl;
							}
						}else{
							var cloneEl = sample.clone();
							cloneEl.removeClass("member-operate-sample").removeClass("display-none");
							var beforemember =outerCloneEl.find(".beforemember");
							beforemember.after(cloneEl);
						}
						initMemberAddDel(clsid);

					}
				}
			}
		}
	}
	//��Ⱦ����
	function renderArrangeRules(data){
		var ruleContainer = $('#rule-container');
		var cloneEl = null;
		$("#rules_blockType").val(data.blockType);
		//����¼
		if(data.blockType=="pin"){
			var sample = $(".offer-rule-sample");
			if(data.count==0){
				//��ʾ������Ʒ
				cloneEl = sample.clone();
				ruleContainer.append(cloneEl);
				initRuleDatePicker(cloneEl);
				cloneEl.removeClass('display-none');
				cloneEl.addClass('ruleblock');
				reInitAddDel();
				var sorttypeEl = cloneEl.find(".sortType");
				var salesChangeIntervalEl = cloneEl.find(".salesChangeInterval");
				salesChangeIntervalEl.parent().parent().hide();
				sorttypeEl.change(function(el){
					var $self = $(this);
					// ����Ƕ���������ʽ���ö���ʱ����
					if ($self.val() == "sales_change"){
						salesChangeIntervalEl.parent().parent().show();
					}else{
						salesChangeIntervalEl.parent().parent().hide();
						salesChangeIntervalEl.val("");
					}
				});
				return;
			}
	        for(var i = 0; i < data.list.length; i++) {
	        	var mainRec = data.list[i];
	        	cloneEl = sample.clone();
	        	renderArrangeRulesOffer(cloneEl, mainRec);
	        	ruleContainer.append(cloneEl);
				initRuleDatePicker(cloneEl);
				cloneEl.removeClass('display-none');
				cloneEl.addClass('ruleblock');
	        }
	        reInitAddDel();
		}else{
			var sample = $(".member-rule-sample");
			if(data.count==0){
				//��ʾ��������
				cloneEl = sample.clone();
				ruleContainer.append(cloneEl);
				initRuleDatePicker(cloneEl);
	        	renderArrangeRulesMember(cloneEl, null);
				cloneEl.removeClass('display-none');
				cloneEl.addClass('ruleblock');
				reInitAddDel();
				return;
			}
	        for(var i = 0; i < data.list.length; i++) {
	        	var mainRec = data.list[i];
	        	cloneEl = sample.clone();
	        	ruleContainer.append(cloneEl);
	        	initRuleDatePicker(cloneEl);
	        	renderArrangeRulesMember(cloneEl, mainRec);
				cloneEl.removeClass('display-none');
				cloneEl.addClass('ruleblock');
	        }
	        reInitAddDel();
    	}
	}

   //ҳ�������ʼ��
	var readyFun = [
	        		function(){
	        			if($('#pageid').val()){
	    	        		$('#bt-modify-page').removeClass("display-none");
	    	        		$('#bt-modify-page').click(function(e){
	    	        			$('#domainName').prop("disabled",false);
	    	        			$('#rePageUrl').prop("disabled",false);
	    	        			$('#bt-save-page').removeClass("display-none");
	    	        			$('#bt-modify-page').addClass("display-none");
	    	        		});
    	    				$.post(domain + '/page/query_page_attr.html?_input_charset=utf-8', {pageId: $('#pageid').val()},
    	    				function(json) {
    	    					if(json.status == 'success') {
    	    						$('#domainName').val(json.data.domain);
    	    						$('#domainId').val(json.data.domainId);
    	    						$('#rePageUrl').val(json.data.specialUrl);
    	    						$('#domainUrl').html("http://"+json.data.domain);
    	    					}else{
    	    						var _oTip = $('#domainUrl-tip');
    	    						_oTip.html("����ҳ���ѯʧ�ܣ���ȷ��pageId="+$('#pageid').val()+"��ҳ���Ƿ񻹴��ڡ�");
    	    						_oTip.show();
    	    					}
    	    				}, 'jsonp');

	        			}else{
	        				$('#rePageUrlbox .relatpagew').removeClass("display-none");
    	        			$('#domainName').prop("disabled",false);
    	        			$('#rePageUrl').prop("disabled",false);
	        				$('#bt-save-page').removeClass("display-none");
	        			}
    	        		$('#bt-save-page').click(function(e){
    	        			var domainUrlTip = $('#domainUrl-tip');
    	        			var domainTip = $('#domain-tip');
    	        			if($('#domainId').val()!="" && $('#rePageUrl').val()!=""){
    	        				jQuery.post(domain + '/page/query_page_id.html?_input_charset=utf-8', {domainId: $('#domainId').val(),pageUrl:$.trim($('#rePageUrl').val())},
    	        				function(json) {
    	        					if(json.status == 'success') {
    	        						$('#pageid').val(json.data.pageId);
    	        						$('#relatePageForm').submit();
    	        					}else{
    	        						domainUrlTip.html("������ѡ������ҳ��URLû�в��ҵ���Ӧҳ�棬��ȷ���Ƿ���д��ȷ��");
    	        						domainUrlTip.show();
    	        					}
    	        				}, 'jsonp');
    	        			}else{
    	        				var domainId = $('#domainId').val();
    	        				var pageUrl = $('#rePageUrl').val();
    	        				if(domainId==""){
    	        					domainTip.html("��ѡ����������");
    	        					domainTip.show();
    	        				}else{
    	        					domainTip.hide();
    	        				}
    	        				if(pageUrl==""){
    	        					domainUrlTip.html("����дҳ��URL");
        	        				domainUrlTip.show();
    	        				}else{
    	        					domainUrlTip.hide();
    	        				}
    	        			}
    	        		});
    	        		$('#bt-save-rule').click(function(e){
    	        			saverules();
    	        		});

	        		},
	        		function(){
	        			$('#arg-rule .blockitem').click(function(e){
	        				var item = $(e.currentTarget);
		        			showrule(item);
	        			});
	        			if($("#pageid").val()==""){
		        			$(".js-previewbtn").click(function(e){
		        				alert("Ԥ���༭ǰ���Ȱ󶨹���ҳ��");
		        				$("#tab-relateurl").trigger("click");
		        				return false;
		        			});
	        			}

	        		},
	        		function(){
	        			initAddDel();
	        		}
	];
	$(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });

	$.use('ui-datepicker-time, util-date', function() {
		$('.js-select-date').datepicker({
			showTime : true,
			closable : true,
			select : function(e, ui) {
				var date = ui.date.format('yyyy-MM-dd hh:mm:ss');
				$(this).val(date);
			}
		});
	});
	$('#domainName').change(function(e){
		$('#domainUrl').text($('#domainName').val());
	});
	$("#ruleSaveFrame").bind('load', function(e){
		try {
            if (this.contentWindow.location.href === '#' || this.contentWindow.location.host !== location.host) {
                return;
            }
            else {
            	//�����¼� domain/crossdomain.xml#{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true,"eventname":"check"}
            	var hashstr = this.contentWindow.location.hash;
            	//����˲���utf-8���루���hash�в�����{}�����⣩��js��Ҫ����
            	hashstr=unescape(decodeURI(hashstr));
            	if(hashstr.indexOf("#")>=0){
                	hashstr = hashstr.substr(1, hashstr.length-1);
                	T.afterIFrameReload(hashstr);
            	}
            }
        }
        catch (ev) {
        	alert("�ű��쳣��"+ev);
        }
	});
})(jQuery, FE.tools);