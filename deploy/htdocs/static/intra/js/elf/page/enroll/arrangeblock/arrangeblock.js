/**
 * @package FE.app.elf.enroll.arrangeblock
 * @author: qinming.zhengqm
 * @Date: 2013-02-22
 */
;(function($, T) {
	var domain=$('#domain_cmsModule').val();
	$.use('ui-tabs', function(){
		//解析参数 初始化查询 例如 arrange_block.htm?topic_id=115800&dt=1362639437896#tab=rules&blockId=11101
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

	/*排期区块管理*/
	//点击“立即创建”事件：隐藏提醒，显示新增区块
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
	//点击“修改区块”：area下的所有disabled的元素enable，增删移动图标显示，修改按钮隐藏，保存按钮显示
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
							msg = o.key+' 不能为空';
							break;
						case 'max' :
							msg = o.key+'最大长度不能大于'+o.max;
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
				alert("你还没有进行区块设置，请先进行区块设置再保存！");
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
				//如有多个浮出层，请另加ID或class
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
				alert("该url已被使用，请重新更换url再保存!");
			}else{
				alert("保存失败。errorCode="+errorCode);
			}
		}
	};
	/*排期规则*/
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
	//验证推品offer：必填；且必须是数字+","的格式；
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
	//高级验证：同一区块中不能出现相同offerid
	T.validOfferIdsAdv = function(){
		var msg = "";
		$(".rule-container .rulebox").each(function(i, el){
			var offerIdsMap = {};
			var offerIds = $(el).find(".offerIds").val();
			var beginDate = $(el).find(".beginDate").val();
			offerIds = offerIds.replace("，",",").replace(" ","");
			var offerIdArr = offerIds.split(",");
			for(var j=0; j<offerIdArr.length;j++){
				var tmp = offerIdArr[j].trim();
				if(offerIdsMap[tmp] && offerIdsMap[tmp]!=""){
					//存在重复
					msg = "排期["+beginDate+"]不能出现相同offerId["+tmp+"]。";
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
	//高级验证：同一区块中的同一排期不能包含重复memberid; 同一memberid不能在不同区块中出现
	T.validMbrOfferIdsAdv = function(){

		return true;
	};
	T.afterIFrameReload = function (jsonstr){
		try{
			var jsonobj = $.parseJSON(jsonstr) || {};
			var succ = jsonobj.success || false;
			var eventname = jsonobj.eventname || "check";
			if(eventname=="check"){ //数据校验完成
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
					alert("数据校验失败。请稍候重试。");
				}
			}else{ //保存完成
				if(succ){
					var toUrl = jsonobj.toUrl || "";
					$.use('ui-dialog', function(){
						//如有多个浮出层，请另加ID或class
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
					alert("数据更新失败。请稍候重试。");
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
		var hasArrange = false;
		if(isValid){
			//开始时间必须有一个是早于当前时间的。
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
				T.doShowAlertDialog("为避免区块出现空白，每个区块中至少有一个排期时间需要早于当前时间，请检查排期开始时间！");
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
	function showrule(blockobj){
		$('#arg-rule .block-arg-rule .current').removeClass("current");
		blockobj.addClass("current");
		//先加载排期规则, 判定该区块是推品还是推商，循环规则根据模板创建，如果规则没有则默认显示一个新增界面
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
                var msg = '页面超时，请刷新重试';
                if(jqXHR.status === 0) {
                    msg = '没权限！'
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
                    alert("页面超时，请刷新重试");
                    $('#bt-save-rule').addClass('display-none');
                    return;
                }else{
                    $('#bt-save-rule').removeClass('display-none');
                	renderArrangeRules(rs);
                }
            }
        });
	}
	/*增删排期按钮*/
	$.ruleAddDel = {};
	$.ruleAddDelCfg = {
			container:'#rule-container',
			operateEl:'.ruleblock',
			add:'.icon-add-rule',  //增加触点的选择器(selector)
	        del:'.icon-delete-rule',  //删除触点的选择器(selector)
	        moveup:'.icon-moveup-rule',  //上移触点的选择器(selector)
	        movedown:'.icon-movedown-rule',  //下移触点的选择器(selector)
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
	/*增删推商参数按钮*/
	function initMemberAddDel(clsid){
		var ruleMemberAddDelCfg = {
				container:'#rule-container .'+clsid,
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
	//渲染排期
	function renderArrangeRules(data){
		var ruleContainer = $('#rule-container');
		var cloneEl = null;
		$("#rules_blockType").val(data.blockType);
		//主记录
		if(data.blockType=="pin"){
			var sample = $(".offer-rule-sample");
			if(data.count==0){
				//显示新增推品
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
					// 如果是动销排序，显式设置动销时间间隔
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
				//显示新增推商
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

   //页面载入初始化
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
    	    						_oTip.html("关联页面查询失败，请确认pageId="+$('#pageid').val()+"的页面是否还存在。");
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
    	        						domainUrlTip.html("根据所选域名和页面URL没有查找到对应页面，请确认是否填写正确。");
    	        						domainUrlTip.show();
    	        					}
    	        				}, 'jsonp');
    	        			}else{
    	        				var domainId = $('#domainId').val();
    	        				var pageUrl = $('#rePageUrl').val();
    	        				if(domainId==""){
    	        					domainTip.html("请选择所属域名");
    	        					domainTip.show();
    	        				}else{
    	        					domainTip.hide();
    	        				}
    	        				if(pageUrl==""){
    	        					domainUrlTip.html("请填写页面URL");
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
		        				alert("预览编辑前需先绑定关联页面");
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
            	//处理事件 domain/crossdomain.xml#{"invalidList":[""],"mbrOfferList":[],"expiredList":[],"warnList":[],"success":true,"eventname":"check"}
            	var hashstr = this.contentWindow.location.hash;
            	//服务端采用utf-8编码（解决hash中不能有{}的问题），js需要解码
            	hashstr=unescape(decodeURI(hashstr));
            	if(hashstr.indexOf("#")>=0){
                	hashstr = hashstr.substr(1, hashstr.length-1);
                	T.afterIFrameReload(hashstr);
            	}
            }
        }
        catch (ev) {
        	alert("脚本异常："+ev);
        }
	});
})(jQuery, FE.tools);