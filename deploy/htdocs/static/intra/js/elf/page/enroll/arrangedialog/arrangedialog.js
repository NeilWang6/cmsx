/**
 * @package FE.app.elf.enroll.arrangedialog
 * @author: qinming.zhengqm
 * @Date: 2013-02-28
 */
;(function($, T) {
	var domain=$('#domain_cmsModule').val();

	T.loadRuleData = function(jsonobj){
		//渲染排期
		function renderArrangeRules(data){
			var ruleContainer = $('#dialog-rule-container');
			var cloneEl = null;
			var blockId = $("#rules_blockId").val();

			$("#rules_blockType").val(data.blockType);
			$("#currentBlockName").val(data.blockName);
			$(".dialog-blocktitle span").text(data.blockName);
			//先清除ruleContainer
			ruleContainer.children().each(function(i, el){
				$(el).remove();
			});
			//主记录
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
                    //展开第一个
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
                    //展开第一个
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

		/*增删推商参数按钮*/
		function initMemberAddDel(clsid){
			var ruleMemberAddDelCfg = {
					container:'#dialog-rule-container .'+clsid,
					operateEl:'.member-operate',
					add:'.icon-add',  //增加触点的选择器(selector)
			        del:'.icon-delete',  //删除触点的选择器(selector)
			        moveup:'.icon-moveup',  //上移触点的选择器(selector)
			        movedown:'.icon-movedown',  //下移触点的选择器(selector)
					afterAdd: function(addEl){
						$(addEl).find(".membersID").val("");
						$(addEl).find(".mbrOfferIDs").val("");
					}
				};
			new FE.tools.AddDelMove(ruleMemberAddDelCfg);
		}
		//日期控件
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
		//渲染推品排期, datailId,argDataId初始为0
		function renderArrangeRulesOffer(cloneEl, mainRec){
			cloneEl.find(".ruletitle span.titletext").text("开始时间:"+mainRec.beginDateStr);
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
				// 如果是动销排序，显式设置动销时间间隔
				if ($self.val() == "sales_change"){
					salesChangeIntervalEl.parent().parent().show();
				}else{
					salesChangeIntervalEl.parent().parent().hide();
					salesChangeIntervalEl.val("");
				}
			});
		}

		$.mbrBlockCount = 0;
		//渲染推商排期, datailId,argDataId初始为0
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
				//渲染member时动态调用initMemberAddDel
				outerCloneEl.find(".ruletitle span").text("开始时间:"+mainRec.beginDateStr);
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
	//验证排序
	T.offerIdsReg = /^\d+([ ]*[\,|，][ ]*\d+)*$/;
	T.validSalesChange = function(){
		var salesChangeE = $(this);
		var sortTypeE = salesChangeE.closest(".item-form").parent().find(".sortType");
		if(sortTypeE.val()=="sales_change"){
			var sci = salesChangeE.val();
			if(sci!=""){
				return true;
			}
		}
		return '请选择动销检查的时间段';
	};
	//验证推品offer：必填；且必须是数字+","的格式；验证offerIds是否存在；验证是否有过期的offer;
	T.validOfferIdsBasic = function(){
		var offerIds = $(this).val();
		if(offerIds==""){
			return "请填写OfferIds"
		}
		if(T.offerIdsReg.test(offerIds)){
			return true;
		}
		return "OfferIds填写格式有误";
	};
	//验证推商offer：memberId必填;offerIds必填且必须是数字+","的格式；
	T.validMbrOfferIdsBasic = function(){
		var mbroffE = $(this);
		var mbrE = mbroffE.closest('.rulebox').find(".membersID");
		if(mbrE.val()==""){
			return "请填写指定memberID"
		}
		if(mbroffE.val()==""){
			return "请填写offerIDs"
		}
		if(T.offerIdsReg.test(mbroffE.val())){
			return true;
		}
		return "offerIDs格式有误";
	};
	//高级验证：同一区块中的同一排期不能包含重复memberid; 同一memberid不能在不同区块中出现
	T.validMbrOfferIdsAdv = function(){
		return true;
	};
	//高级验证：
	T.validOfferIdsAdv = function(){
		return true;
	};
	T.afterIFrameReload = function (jsonstr){
		//{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true}
		try{
			var jsonobj = $.parseJSON(jsonstr) || {};
			var succ = jsonobj.success || false;
			var eventname = jsonobj.eventname || "check";
			if(eventname=="check"){ //数据校验完成
				if(succ){
					T.doAfterCheckRuleData(jsonobj, function(){
						submitRuleForm(true);
					}, function(){
						submitRuleForm(false);
					});
				}else{
					alert("数据校验失败。请稍候重试。");
				}
			}else{ //保存完成
				if(succ){
					//如果选择了预览radio则不提示保存成功，而是直接预览
					var selectId = jsonobj.next || "";
					alert("保存成功!");
					$('.js-rule-dialog .close').trigger("click");
					if(selectId!=""){
						//预览排期
						FE.dcms.box.datasource.YunYing.previewArrangeBlock(selectId);
					}
				}else{
					alert("数据更新失败。请稍候重试。");
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
	/*排期规则*/
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
							msg = o.key+' 不能为空';
							break;
                        case 'int' :
                            msg = '请输入正确的数字';
                            break;
						case 'max' :
							if(o.type=='string'){
								msg = o.key+'最大长度不能大于'+o.max;
							}else if(o.type=='int'){
								msg = o.key+'最大值不能大于'+o.max;
							}
                            break;
                        case 'min' :
                        	if(o.type=='string'){
								msg = o.key+'最小长度不能小于'+o.min;
							}else if(o.type=='int'){
	                            msg = '请输入大于0的数字';
							}
                            break;
                        case 'fun' :
                            msg = o.msg;
                            break;
                        default:
                            msg = '请填写正确的内容';
                            break;
					}
					tip.text(msg);
					tip.addClass('validator-error');
				}

			}
		});
		var isValid = validDemo1.valid();
		if(isValid){
			//开始时间必须有一个是早于当前时间的。
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
				alert("为避免区块出现空白，每个区块中至少有一个排期时间需要早于当前时间，请检查排期开始时间！");
				isValid = false;
			}
			//验证
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
						paramObj['offerIds'] = $('.offerIds', el).val().replace("，",",");
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
							mbrobj["offerIDs"] = $(el).find(".mbrOfferIDs").val().replace("，",",");
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
		//先加载排期规则, 判定该区块是推品还是推商，循环规则根据模板创建，如果规则没有则默认显示一个新增界面
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
            	//处理事件 domain/crossdomain.xml#{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true}
            	var hashArr = this.contentWindow.location.hash.split('#');
            	if(hashArr.length === 2) {
            		T.afterIFrameReload(hashArr[1]);
            	}
            }
        }
        catch (ev) {
        	alert("脚本异常："+ev);
        }
	});
	$(function() {
		showrule();
	});
})(jQuery, FE.tools);