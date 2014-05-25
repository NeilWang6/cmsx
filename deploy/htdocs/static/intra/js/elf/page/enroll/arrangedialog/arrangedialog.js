/**
 * @package FE.app.elf.enroll.arrangedialog
 * @author: qinming.zhengqm
 * @Date: 2013-02-28
 */
;(function($, T) {
	var domain=$('#domain_cmsModule').val();

	T.loadRuleData = function(jsonobj){
		//��Ⱦ����
		function renderArrangeRules(data){
			var ruleContainer = $('#dialog-rule-container');
			var cloneEl = null;
			var blockId = $("#rules_blockId").val();

			$("#rules_blockType").val(data.blockType);
			$("#currentBlockName").val(data.blockName);
			$(".dialog-blocktitle span").text(data.blockName);
			//�����ruleContainer
			ruleContainer.children().each(function(i, el){
				$(el).remove();
			});
			//����¼
			if(data.blockType=="pin"){
				var sample = $(".offer-rule-sample");
				if(data.count==0){
					return;
				}
		        for(var i = 0; i < data.list.length; i++) {
		        	var mainRec = data.list[i];
		        	cloneEl = sample.clone();
		        	renderArrangeRulesOffer(cloneEl, mainRec);
		        	ruleContainer.append(cloneEl);
					initRuleDatePicker(cloneEl);
					cloneEl.removeClass('display-none').addClass('ruleblock');
					cloneEl.find(".ruletitle .previewlnk").prop("data-arrangeId", mainRec.id);
					cloneEl.find(".ruletitle .previewlnk").click(function(){
						$('.js-rule-dialog .close').trigger("click");
						FE.dcms.box.datasource.YunYing.previewArrangeBlock("{\"blockId\":\""+ blockId +"\", \"arrangeId\":\""+$(this).prop("data-arrangeId")+"\"}");
					});
                    //չ����һ��
                    if (i===0){
                        cloneEl.removeClass("hiderule").addClass("showrule");
                    }
		        }
			}else{
				var sample = $(".member-rule-sample");
				if(data.count==0){
					return;
				}
		        for(var i = 0; i < data.list.length; i++) {
		        	var mainRec = data.list[i];
		        	cloneEl = sample.clone();
		        	ruleContainer.append(cloneEl);
		        	initRuleDatePicker(cloneEl);
		        	renderArrangeRulesMember(cloneEl, mainRec);
					cloneEl.removeClass('display-none').addClass('ruleblock');
					cloneEl.find(".ruletitle .previewlnk").prop("data-arrangeId", mainRec.id);
					cloneEl.find(".ruletitle .previewlnk").click(function(el){
						$('.js-rule-dialog .close').trigger("click");
						FE.dcms.box.datasource.YunYing.previewArrangeBlock("{\"blockId\":\""+ blockId +"\", \"arrangeId\":\""+$(this).prop("data-arrangeId")+"\"}");
					});
                    //չ����һ��
                    if (i===0){
                        cloneEl.removeClass("hiderule").addClass("showrule");
                    }
                }
	    	}
			$("#dialog-rule-container .rule-hide-icon").click(function(e){
	            e.preventDefault();
	            var el = $(this);
	            var operateEl = el.closest(".ruleblock");
	            if(operateEl.hasClass("hiderule")){
	            	$("#dialog-rule-container .showrule").removeClass("showrule").addClass("hiderule");
	            	operateEl.removeClass("hiderule").addClass("showrule");
	            }else{
	            	operateEl.removeClass("showrule").addClass("hiderule");
	            }
	        });

	        var loading = $('#dialog-arg-rule .loading');
			ruleContainer.removeClass('display-none');
	        loading.addClass('display-none');
		}

		/*��ɾ���̲�����ť*/
		function initMemberAddDel(clsid){
			var ruleMemberAddDelCfg = {
					container:'#dialog-rule-container .'+clsid,
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
					zIndex:5000,
					triggerType: 'focus',
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
			cloneEl.find(".ruletitle span.titletext").text("��ʼʱ��:"+mainRec.beginDateStr);
			cloneEl.find(".datailId").val(mainRec.id);
			cloneEl.find(".argDataId").val(mainRec.argDataId);
			cloneEl.find(".js-previewId").val(mainRec.id);
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
				outerCloneEl.find(".ruletitle span").text("��ʼʱ��:"+mainRec.beginDateStr);
				outerCloneEl.find(".datailId").val(mainRec.id);
				outerCloneEl.find(".argDataId").val(mainRec.argDataId);
				outerCloneEl.find(".js-previewId").val(mainRec.id);
				//outerCloneEl.find(".showNum").val(mainRec.shownum);
				//outerCloneEl.find(".beginDate").val(mainRec.beginDateStr);
				if(mainRec.argDataId>0&&mainRec.argParamDO){
					var argParam = (mainRec.argParamDO.bigParam ||"");
					if(argParam && argParam!=""){
						var argParamObj = JSON.parse(argParam);
						if(argParamObj){
							outerCloneEl.find(".showNum").val(argParamObj.showNum);
							outerCloneEl.find(".beginDate").val(argParamObj.beginDate);

							var prembr = outerCloneEl.find(".beforemember");
							var argParamObjMbrs = argParamObj.members;
							if(argParamObjMbrs.length>0){
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
		renderArrangeRules(jsonobj);
	};
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
	//��֤��Ʒoffer������ұ���������+","�ĸ�ʽ����֤offerIds�Ƿ���ڣ���֤�Ƿ��й��ڵ�offer;
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
	//�߼���֤��ͬһ�����е�ͬһ���ڲ��ܰ����ظ�memberid; ͬһmemberid�����ڲ�ͬ�����г���
	T.validMbrOfferIdsAdv = function(){
		return true;
	};
	//�߼���֤��
	T.validOfferIdsAdv = function(){
		return true;
	};
	T.afterIFrameReload = function (jsonstr){
		//{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true}
		try{
			var jsonobj = $.parseJSON(jsonstr) || {};
			var succ = jsonobj.success || false;
			var eventname = jsonobj.eventname || "check";
			if(eventname=="check"){ //����У�����
				if(succ){
					T.doAfterCheckRuleData(jsonobj, function(){
						submitRuleForm(true);
					}, function(){
						submitRuleForm(false);
					});
				}else{
					alert("����У��ʧ�ܡ����Ժ����ԡ�");
				}
			}else{ //�������
				if(succ){
					//���ѡ����Ԥ��radio����ʾ����ɹ�������ֱ��Ԥ��
					var selectId = jsonobj.next || "";
					alert("����ɹ�!");
					$('.js-rule-dialog .close').trigger("click");
					if(selectId!=""){
						//Ԥ������
						FE.dcms.box.datasource.YunYing.previewArrangeBlock(selectId);
					}
				}else{
					alert("���ݸ���ʧ�ܡ����Ժ����ԡ�");
				}
			}
		}catch(e){
			alert(e);
		}
	};
	function submitRuleForm(moveOffer){
		$('#moveOffer').val(moveOffer);
		$('#event_submit_name').prop("name","event_submit_do_add_or_update_block_rule");
		$('#ruleForm').submit();
	};
	/*���ڹ���*/
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
		if(isValid){
			//��ʼʱ�������һ�������ڵ�ǰʱ��ġ�
			var hasEarlyDate = false;
			$('.rule-container .beginDate').each(function(i, el){
				var $this = $(el);
				var nowtime = $.util.date.now();
				var bdStr = $this.val();
				var bd = Date.parseDate(bdStr,"yyyy-MM-dd hh:mm:ss");
				if($.util.date.isBefore(nowtime, bd)){
					hasEarlyDate = true;
				}
			});
			if(!hasEarlyDate){
				alert("Ϊ����������ֿհף�ÿ��������������һ������ʱ����Ҫ���ڵ�ǰʱ�䣬�������ڿ�ʼʱ�䣡");
				isValid = false;
			}
			//��֤
		}
		if(isValid){
			var blockType = $("#rules_blockType").val();
			var blockId = $("#rules_blockId").val();
			var arrValues = [],objValue = {}, offersValue="";
			$('#dialog-rule-container .rulebox').each(function(i, el){
				el = $(el);
				if($('.beginDate', el).val()!=""){
					var value = {};
					value['id'] = $('.datailId', el).val();
					value['blockId'] = blockId;
					value['argDataId'] = $('.argDataId', el).val();
					value['beginDate'] = $('.beginDate', el).val();
					value['showNum'] = $('.showNum', el).val();
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
	function showrule(){
		//�ȼ������ڹ���, �ж�����������Ʒ�������̣�ѭ���������ģ�崴�����������û����Ĭ����ʾһ����������
		var loading = $('#dialog-arg-rule .loading');
		var ruleContainer = $('#dialog-rule-container');
		ruleContainer.addClass('display-none');
        loading.removeClass('display-none');

        $('#dialog-rule-container .ruleblock').each(function(i, el){
			$(el).remove();
		});

        var url = $("#dialog-arg-rule input[name='rules_url']").val();
        var blockid= $("#dialog-arg-rule input[name='rules_blockId']").val();
        $.ajax({
            url:url + "?callback=FE.tools.loadRuleData&_input_charset=UTF-8&blockid="+blockid,
            dataType:"jsonp",
            type : "post",
            jsonp:"FE.tools.loadRuleData"
       	  });
	}

	$('.js-bt-save-rule').click(function(e){
		saverules();
	});

	$.use('ui-datepicker-time, util-date', function() {
		$('#dialog-arg-rule .js-select-date').datepicker({
			showTime : true,
			closable : true,
			zIndex:5000,
			select : function(e, ui) {
				var date = ui.date.format('yyyy-MM-dd hh:mm:ss');
				$(this).val(date);
			}
		});
	});
	$("#ruleSaveFrame").bind('load', function(e){
		try {
            if (this.contentWindow.location.href === '#' || this.contentWindow.location.host !== location.host) {
                return;
            }
            else {
            	//�����¼� domain/crossdomain.xml#{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true}
            	var hashArr = this.contentWindow.location.hash.split('#');
            	if(hashArr.length === 2) {
            		T.afterIFrameReload(hashArr[1]);
            	}
            }
        }
        catch (ev) {
        	alert("�ű��쳣��"+ev);
        }
	});
	$(function() {
		showrule();
	});
})(jQuery, FE.tools);