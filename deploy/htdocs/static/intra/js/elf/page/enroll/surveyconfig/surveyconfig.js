/**
 * @author: lusheng.linls
 * @Date: 2013-06-26
 */

;
(function($, T) {
	//id自增因子
	var idFactor = 1;
	var tid=$('#tid').val();
	var TIPS = {
		ERROR: '<i class="tui-icon-36 icon-fail"></i>出错了',
		ADD_NEW_ITEM: '<i class="tui-icon-36 icon-message"></i>您还没设置过表单，请点击“<i class="nav-pointer-additem"></i>添加控件”开始设置！'
	}
	var custCollectUrl = $('#custCollectUrl').val();
	var configView = $('#configView');
	var configList = $('#configList');
	var configDetail = $('#configDetail');
	var configOpt = $('#configOpt');

	var globalMsg = $('#globalMsg');
	var jsAdd = $('#js-add');
	var jsSave = $('#js-save');
	var jsClose = $('#js-close');
	//表单数据模型
	var formModel;
	var isChange=false;
	var isSubmiting=false;
	var readyFun = [

	function() {
		init();
	},


	/** 事件 */

	function() {
		//校验
		configView.delegate('input[name=item-base-name]','blur',function(){
			var thisEl=$(this);
			var invalidMsg=thisEl.siblings('.invalid-msg');
			var valueByUser=$.trim(thisEl.val());
			if(countLen(valueByUser)>128){
				invalidMsg.text('最大长度128，1个汉字相当于2');
				return;
			}
			if(valueByUser==''){
				invalidMsg.text('请填写');
				return;
			}
			invalidMsg.text('');
		});
		configView.delegate('input[name=item-base-maxLen]','blur',function(){
			var thisEl=$(this);
			var invalidMsg=thisEl.siblings('.invalid-msg');
			var valueByUser=$.trim(thisEl.val());

			
			if(valueByUser!=''){
				var maxLenReg = /[^0-9]/;
				if(maxLenReg.test(valueByUser)){
					invalidMsg.text('请填写1到512之间的整数');
					return;
				}
				if(valueByUser<1 || valueByUser>512){
					invalidMsg.text('请填写1到512之间的整数');
					return;
				}
			}
			invalidMsg.text('');
		});
		configView.delegate('input[name=item-base-format-filenum]','blur',function(){
			var thisEl=$(this);
			var invalidMsg=thisEl.siblings('.invalid-msg');
			var valueByUser=$.trim(thisEl.val());
			if(valueByUser==''){
				invalidMsg.text('请填写');
				return;
			}
			var maxLenReg = /[^0-9]/;
			if(maxLenReg.test(valueByUser)){
				invalidMsg.text('请填写1到5之间的整数');
				return;
			}
			if(valueByUser<1 || valueByUser>5){
				invalidMsg.text('请填写1到5之间的整数');
				return;
			}
			invalidMsg.text('');
		});

		//新增控件选项
		configDetail.delegate('.js-item-meta-add','click',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			thisEl.after('<input type="text" class="js-item-meta-editing-new" title="回车试试!!"/>');
			itemValueEl.find('.js-item-meta-editing-new').focus();
		});
		configDetail.delegate('.js-item-meta-editing-new','keyup',function(event){
			if (event.which == 13) {
			    $('.js-item-meta-add').trigger('click');
			  }
		});
		configDetail.delegate('.js-item-meta-editing-new','blur',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			var optionValue=$.trim(thisEl.val());
			thisEl.remove();
			if(optionValue==''){
				return;
			}
			if(!validMeta(itemValueEl,itemValueEl.find('.invalid-msg'),optionValue)){
				return;
			}
			itemValueEl.append(newOption(optionValue));
		});
		configDetail.delegate('.js-item-meta-editing','blur',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			var optionValue=$.trim(thisEl.val());
			if(optionValue==''){
				thisEl.remove();
				return;
			}
			validMeta(itemValueEl,itemValueEl.find('.invalid-msg'),optionValue)
			thisEl.replaceWith(newOption(optionValue));
		});
		configDetail.delegate('.js-item-meta-editing','keyup',function(event){
			if (event.which == 13) {
			    $(this).trigger('blur');
			  }
		});

		configDetail.delegate('.js-item-meta-option','click',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			var metaOptionEl=thisEl.closest('.meta-option');
			metaOptionEl.replaceWith('<input type="text" class="js-item-meta-editing" value="'+thisEl.text()+'" style="width:'+metaOptionEl.css('width')+';" />');
			itemValueEl.find('.js-item-meta-editing').focus().select();
		});
		configDetail.delegate('.js-item-meta-remove','click',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			thisEl.closest('.meta-option').remove();
			validMeta(itemValueEl,itemValueEl.find('.invalid-msg'),'');
		});
		
		var jsDetailCheckboxAndRadio = $('#js-detail-checkbox,#js-detail-radio');
		jsDetailCheckboxAndRadio.delegate('.meta-option','mouseenter',function(){
			var thisEl=$(this);
			var jsItemMetaOther=thisEl.find('.js-item-meta-other');
			if(jsItemMetaOther.length<1){
				$(newMetaOther('')).insertBefore(thisEl.find('.js-item-meta-remove'));
			}
		});
		jsDetailCheckboxAndRadio.delegate('.meta-option','mouseleave',function(){
			var thisEl=$(this);
			var jsItemMetaOther=thisEl.find('.js-item-meta-other');
			if(!jsItemMetaOther.prop('checked')){
				jsItemMetaOther.remove();
			}
		});
		jsDetailCheckboxAndRadio.delegate('.js-item-meta-other','click',function(){
			var thisEl=$(this);
			var itemValueEl=thisEl.closest('.item-value');
			validMeta(itemValueEl,itemValueEl.find('.invalid-msg'),'');
		});

		//添加/修改控件
		configDetail.delegate('.js-add-item','click',function(){
			var valid=true;
			var thisJsAddItem = $(this);
			var subDetail = thisJsAddItem.closest('.sub-detail');
			subDetail.find('.must-fill').each(function(index){
				var thisEl=$(this);
				var inputEl=thisEl.siblings('.item-value').find('input');
				var invalidMsg=thisEl.siblings('.item-value').find('.invalid-msg');
				if(''==$.trim(inputEl.val())){
					invalidMsg.text('请填写');
					valid=false;
				}else if(invalidMsg.text()=='请填写'){
					invalidMsg.text('');
				}
			});
			if(subDetail.find('.invalid-msg').text()!=''){
				valid=false;
			}
			if(!valid){
				$('#configDetail').animate({scrollTop:0},200);
				return;
			}
			updateFormModel();
			thisJsAddItem.text('更新');
			var curConfid = subDetail.find('input[name=item-conf-id]').val();
			var curItemInList = configList.find('li[data-confid='+curConfid+']').find('.js-detail-edit');
			curItemInList.click();
			curItemInList.focus();
		});
		//添加控件
		jsAdd.click(function() {
			configDetail.find('.sub-detail').hide();
			var jsSdetailAdd = configDetail.find('#js-sdetail-add');
			globalMsg.hide();
			jsSdetailAdd.show();
			configView.show();
		});

		//修改控件
		configList.delegate('.js-detail-edit', 'click', function() {
			var thisEl = $(this);
			var itemData = formModelFindByConfId(thisEl.closest('li').data('confid'));
			var curType = configDetail.find('#js-detail-' + itemData.base.ctrlType);
			configDetail.find('.sub-detail').hide();
			configList.find('.detail-editing').removeClass('detail-editing');
			thisEl.addClass('detail-editing');
			renderDetail(itemData,itemData.base.ctrlType,curType);
			curType.find('.invalid-msg').text('');
			curType.show();
		});

		//删除控件
		configList.delegate('.js-remove', 'click', function() {
			var thisEl = $(this);
			formModelDelByConfId(thisEl.closest('li').data('confid'));
		});

		//上移控件
		configList.delegate('.js-up', 'click', function() {
			var thisEl = $(this);
			switchPosByConfId(thisEl.closest('li').data('confid'),'up');
		});

		//下移控件
		configList.delegate('.js-down', 'click', function() {
			var thisEl = $(this);
			switchPosByConfId(thisEl.closest('li').data('confid'),'down');
		});

		//选择添加哪种类型的控件
		$('#new-item-base-ctrlType').change(function() {
			var elthis = $(this);
			var selectedType = elthis.find("option:selected").val();
			var curType = configDetail.find('#js-detail-' + selectedType);
			configDetail.find('.sub-detail').hide();
			renderDetail(null,selectedType,curType);
			curType.find('.invalid-msg').text('');
			curType.show();
			elthis.find("option:selected").prop('selected', false);
			elthis.get(0).options[0].selected = true;
		});

		//生效并预览 
		jsSave.click(function() {
			var submitBtn=$(this);
			//预览
			if(!isChange){
				window.open($('#previewUrl').val());
				return;
			}
            if(isSubmiting){
                return;
            }
            var item551Val = $(top.document).find('#item-topic-1-551').val();
            if(item551Val==''||item551Val==undefined||item551Val==custCollectUrl){
            	checkPromotionTimeAndSave();
            }else{
            	T.Msg.confirm({
	                title : '提示',
	                body : '<i class="tui-icon-36 icon-warning"></i>当前专场已经配置了某个特殊表单，继续操作<span class="warn">该特殊表单将被替换掉</span>，请确认？</i>',
	                success : function(){
						checkPromotionTimeAndSave();
	                }
	            });
            }
		});
		//关闭
		jsClose.click(function(){
			if(isChange){
				T.Msg.confirm({
	                title : '不保存？',
	                body : '<i class="tui-icon-36 icon-warning"></i>您对报名表单做了修改，但是还没保存，确定不保存吗？',
	                success : function(){
	                	parent.window.FE.tools.closeSurveyFrame();
	                }
	            });
	            return;
			}
			parent.window.FE.tools.closeSurveyFrame();
		});
	}];
	function checkPromotionTimeAndSave(){
		if(isSubmiting){
                return;
            }
        var msgForChangingTime='';
        if(formModel.base.promotionBegin){//这个判读是为了兼容自动化专场流程，流程进来的时候没设置报名时间
        	var nowTimeWhenSave=new Date();
	        var promotionBegin= new Date(formModel.base.promotionBegin.time);
	        if(formModel.base.promotionBegin.time<nowTimeWhenSave.getTime() && nowTimeWhenSave.getTime()<formModel.base.promotionEnd.time){
	        	msgForChangingTime='正在接受报名';
	        }else if(formModel.base.promotionBegin.time<nowTimeWhenSave.getTime()+3600000 && nowTimeWhenSave.getTime()+3600000<formModel.base.promotionEnd.time){
	        	msgForChangingTime='在1小时内将开始接受报名';
	        }
        }
        if(msgForChangingTime==''){
        	save();
        }else{
        	$.use(['ui-dialog', 'ui-draggable'], function(){
				var dialogEl=$('.js-dialog-basic-2');
				dialogEl.find('section').html('<i class="tui-icon-36 icon-warning"></i>当前专场'+msgForChangingTime+'，继续操作将<span class="warn">自动修改为1小时后才能报名</span><br/>您可以利用这段时间预览并测试报名表单，请确认？</i>');
                var dialog = dialogEl.dialog({
                    center: true,
                    draggable : true,
                    fixed:true
                });
                dialogEl.find('.close,.btn-cancel').click(function(){
                    dialog.dialog('close');
                });
                dialogEl.find('.btn-submit').click(function(){
                	save();
                	dialog.dialog('close');
                });
            });
        }
	}
	function save(){
		if(isSubmiting){
                return;
            }
		var submitBtn=jsSave;
		//保存并预览
        isSubmiting=true;
        submitBtn.prop('disabled',true);
        submitBtn.text('处理中...');
        var formModelStr='';
        $.use('util-json', function(){
		    formModelStr=JSON.stringify(formModel);
		});
		$.ajax({
            type: 'post',
            cache: false,
            url: T.domain+'/enroll/v2012/survey_config_save.json?_input_charset=UTF-8',
			data: 'tid=' + tid+'&formModel='+formModelStr,
            complete: function(jqXHR, textStatus){
                        isSubmiting=false;
                        submitBtn.text('生效并预览');
                        submitBtn.prop('disabled',false);
                    },
            success: function(rs){
                        if(!rs.success){
                        	var errorMsg=TIPS.ERROR;
                            T.Msg.alert({
				                title : '保存失败',
				                body : errorMsg
				            });
                            return;
                        }
                        isChange=false;
                        $(top.document).find('#item-topic-1-551').val(custCollectUrl);
                        window.open($('#previewUrl').val());
                        init();
                    },
            error: function(){
            	T.Msg.alert({
	                title : '保存失败',
	                body : TIPS.ERROR
	            });
                return;
            }
        });
	}
	function init(){
		showGlobalMsg('载入中...');
		//表单查询
		$.ajax({
			type: 'post',
			cache: false,
			url: T.domain + '/enroll/v2012/survey_config_load.json',
			data: 'tid=' + tid,
			success: function(rs) {
				if(!rs.success) {
					if(!rs.model) {
						showGlobalMsg(TIPS.ERROR);
						jsAdd.hide();
						jsSave.hide();
						configOpt.show();
					} else {
						var spliteIndex = rs.model.search(':');
						var errorMsg = rs.model.slice(spliteIndex + 1);
						var errorCode = rs.model.cut(spliteIndex);
						if(spliteIndex == -1) {
							showGlobalMsg(rs.model);
						} else {
							//自定义提示文案
							switch(errorCode) {
							case 'NOT_ALLOW_REASON_NOT_EXIST':
								showGlobalMsg(TIPS.ADD_NEW_ITEM);
								configOpt.show();
								return;
							}
							if(errorMsg) {
								showMsg(errorMsg);
							} else {
								showMsg(errorCode);
							}
						}
					}
					return;
				}
				formModel = rs.model;
				if(formModel && formModel.base){
					configView.find('.survey-title').text(formModel.base.name);
				}
				if(!formModel || !formModel.base || !formModel.items || formModel.items.length == 0) {
					showGlobalMsg(TIPS.ADD_NEW_ITEM);
					configOpt.show();
					return;
				}
				build(formModel);
			},
			error: function() {
				showGlobalMsg(TIPS.ERROR);
				jsAdd.hide();
				jsSave.hide();
				configOpt.show();
			}
		});
	}
	/** 渲染控件 */
	var renderFN = {
		html: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setDefaultValue(item, curType);

		},
		text: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setMaxLen(item, curType);
			setIsNeed(item, curType);
		},
		textarea: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setMaxLen(item, curType);
			setIsNeed(item, curType);
		},
		select: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setIsNeed(item, curType);
			setMeta(item, curType);
		},
		checkbox: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setIsNeed(item, curType);
			setMeta(item, curType);
		},
		radio: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setIsNeed(item, curType);
			setMeta(item, curType);
		},
		uploadimg: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setIsNeed(item, curType);
			setFileReq(item, curType);
		},
		uploadfile: function(item, curType) {
			setConfId(item, curType);
			setName(item, curType);
			setIsNeed(item, curType);
			setFileReq(item, curType);
		},
		custom: function(item, curType) {}
	};

	function renderDetail(itemData,ctrlType,curType){
		if(renderFN[ctrlType]) {
			renderFN[ctrlType](itemData, curType);
		}
		if(ctrlType=='custom'){
			return;
		}
		curType.find('.js-add-item').remove();
		var buttonText='更新';
		if(itemData==null){
			buttonText='添加';
		}
		curType.append('<button type="button" class="btn-basic btn-gray icon-left js-add-item">'+buttonText+'</button>');
	}

	/** 保存控件到数据模型 */
	var saveRenderFN = {
		html: function(item, curType) {
			if(item == null) {
				item = newItem('html', 2,'','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveDefaultValue(item, curType);
			item.conf.isNeed = 'n';
		},
		text: function(item, curType) {
			if(item == null) {
				item = newItem('text', 1,'','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveMaxLen(item, curType);
			saveIsNeed(item, curType);
		},
		textarea: function(item, curType) {
			if(item == null) {
				item = newItem('textarea', 1,'','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveMaxLen(item, curType);
			saveIsNeed(item, curType);
		},
		select: function(item, curType) {
			if(item == null) {
				item = newItem('select', 1,'meta','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveIsNeed(item, curType);
			saveMeta(item, curType);
		},
		checkbox: function(item, curType) {
			if(item == null) {
				item = newItem('checkbox', 1,'meta','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveIsNeed(item, curType);
			saveMeta(item, curType);
		},
		radio: function(item, curType) {
			if(item == null) {
				item = newItem('radio', 1,'meta','');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveIsNeed(item, curType);
			saveMeta(item, curType);
		},
		uploadimg: function(item, curType) {
			if(item == null) {
				item = newItem('uploadimg', 1,'','img');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveIsNeed(item, curType);
			saveFileReq(item, curType);
		},
		uploadfile: function(item, curType) {
			if(item == null) {
				item = newItem('uploadfile', 1,'','img');
				saveConfId(item, curType);
			}
			saveName(item, curType);
			saveIsNeed(item, curType);
			saveFileReq(item, curType);
		},
		custom: function(item, curType) {}
	};

	//itemType 参考 com.alibaba.magma.biz.topic.enums.survey.ItemTypeEnum
	//ctrlSourceType 参考 com.alibaba.magma.biz.topic.enums.survey.CtrlSourceTypeEnum
	function newItem(ctrlType, itemType,ctrlSourceType,attribute) {
		var item = {
			base: {
				id: genId(),
				ctrlType: ctrlType,
				itemType: itemType,
				ctrlSourceType: ctrlSourceType,
				attribute: attribute
			},
			conf: {},
			meta: [],
			relations: [],
			value: '',
			conf_state: 'new' //标志item状态是new/change/空
		};
		addItemToFormModel(item);
		return item;
	} 

	function newOption(optionValue){
		return '<span class="meta-option"><a title="修改" class="js-item-meta-option">'+optionValue+'</a><i class="icon-remove-2 js-item-meta-remove" title="移除选项">&nbsp</i></span>';
	}

	function newMetaOther(checked){
		return '<input '+checked+' class="js-item-meta-other" type="checkbox" title="用户选中后，在选项后面会出现一个必填输入框供用户补充信息！输入框最多可以输入30个字符" />';
	}

	function setConfId(item, curType) {
		var confid = curType.find('input[name=item-conf-id]');
		if(item != null) {
			confid.val(item.conf.id);
			return;
		}
		confid.val(genId());
	}

	function setName(item, curType) {
		var name = curType.find('input[name=item-base-name]');
		if(item != null) {
			name.val(item.base.name);
			return;
		}
		name.val('');
	}

	function setDefaultValue(item, curType) {
		var defaultValue = curType.find('textarea[name=item-conf-defaultValue]');
		if(item != null) {
			defaultValue.val(item.conf.defaultValue);
			return;
		}
		defaultValue.val('');
	}

	function setMaxLen(item, curType) {
		var maxLen = curType.find('input[name=item-base-maxLen]');
		if(item != null) {
			if(item.base.maxLen != '0') {
				maxLen.val(item.base.maxLen);
				return;
			}
		}
		maxLen.val('');
	}

	function setIsNeed(item, curType) {
		var isNeed = curType.find('input[name=item-conf-isNeed]');
		if(item != null) {
			if(item.conf.isNeed == 'Y' || item.conf.isNeed == 'y') {
				isNeed.prop('checked', true);
				return;
			}
		}
		isNeed.prop('checked', false);
	}

	function setMeta(item, curType) {
		var itemValue=curType.find('.js-item-meta-add').closest('.item-value');
		itemValue.find('.meta-option').remove('.meta-option');
		itemValue.find('.js-item-meta-editing-new').remove('.js-item-meta-editing-new');
		itemValue.find('.js-item-meta-editing').remove('.js-item-meta-editing');
		if(item!=null){
			if(item.meta==undefined||item.meta==''||item.meta==[]){
				return;
			}
			for(var i=0;i<item.meta.length;i++){
				var metaValue=item.meta[i].value;
				var isMetaOther=metaValue&&metaValue.lastIndexOf(':')==metaValue.length-1;
				if(isMetaOther){
					metaValue=metaValue.substr(0,metaValue.length-1);
				}
				var newOp = $(newOption(metaValue));
				if(isMetaOther){
					$(newMetaOther('checked')).insertBefore(newOp.find('.js-item-meta-remove'));
				}
				itemValue.append(newOp[0].outerHTML);
			}
		}
	}

	function setFileReq(item, curType){
		var fileopt=curType.find('select[name=item-base-format-fileopt]');
		var filenum=curType.find('input[name=item-base-format-filenum]');
		var allOptions=fileopt.find('option');
		allOptions.prop('selected',false);
		if(item==null){
			$(allOptions[0]).prop('selected',true);
			filenum.val('1');
		}else{
			var formatStrs=item.base.format.split('|||');
			if(formatStrs.length!=2){
				return;
			}
			switch(formatStrs[0].substr(0,2)){
				case '==':
					$(allOptions[0]).prop('selected',true);
					filenum.val(formatStrs[0].substr(2));
					break;
				case '>=':
					$(allOptions[1]).prop('selected',true);
					filenum.val(formatStrs[0].substr(2));
					break;
				case '<=':
					$(allOptions[3]).prop('selected',true);
					filenum.val(formatStrs[0].substr(2));
					break;
				default:
					switch(formatStrs[0].substr(0,1)){
						case '=':
							$(allOptions[0]).prop('selected',true);
							filenum.val(formatStrs[0].substr(1));
							break;
						case '>':
							$(allOptions[2]).prop('selected',true);
							filenum.val(formatStrs[0].substr(1));
							break;
						case '<':
							$(allOptions[4]).prop('selected',true);
							filenum.val(formatStrs[0].substr(1));
							break;
						default:
							$(allOptions[0]).prop('selected',true);
							filenum.val('1');
					}

			}
		}
	}


	//计算字符串长度
	function countLen(str){
		return str.match(/[^ -~]/g) == null ? str.length : str.length + str.match(/[^ -~]/g).length;
	}

	function saveConfId(item, curType) {
		item.conf.id = curType.find('input[name=item-conf-id]').val();
	}

	function saveName(item, curType) {
		var inputNameEl=curType.find('input[name=item-base-name]');
		var inputName=$.trim(inputNameEl.val());
		item.base.name = inputName;
	}

	function saveDefaultValue(item, curType) {
		item.conf.defaultValue = $.trim(curType.find('textarea[name=item-conf-defaultValue]').val());
	}

	function saveMaxLen(item, curType) {
		var inputMaxLenEL = curType.find('input[name=item-base-maxLen]');
		if(inputMaxLenEL.val()) {
			item.base.maxLen = $.trim(inputMaxLenEL.val());
		} else {
			//0表示不限制
			item.base.maxLen = 0;
		}
	}

	function saveIsNeed(item, curType) {
		var checked = curType.find('input[name=item-conf-isNeed]').prop('checked');
		if(checked) {
			item.conf.isNeed = 'y';
		} else {
			item.conf.isNeed = 'n';
		}
	}

	function saveMeta(item, curType) {
		var metaList=[];
		curType.find('.js-item-meta-option').each(function(index){
			var thisEl=$(this);
			var optionByUser=$.trim(thisEl.text());
			if(thisEl.siblings('.js-item-meta-other:checked').length>0){
				optionByUser=optionByUser+':';
			}
			metaList.push({
				metadataKey:optionByUser,
				value:optionByUser,
				orderNum:index
			});
		});
		item.meta=metaList;
	}

	function saveFileReq(item, curType){
		var selectOption=curType.find('select[name=item-base-format-fileopt] option:selected');
		var filenum=curType.find('input[name=item-base-format-filenum]');
		item.base.format=selectOption.val()+filenum.val()+'|||请上传'+selectOption.text()+filenum.val()+'个文件';
	}

	function validMeta(itemValueEl,invalidMsg,optionValue){
		invalidMsg.text('');
		if(optionValue.indexOf(',')!=-1){
			invalidMsg.text('不能用"," 建议用"，"代替');
			return false;
		}
		if(optionValue.indexOf(':')!=-1){
			invalidMsg.text('不能用":" 建议用"："代替');
			return false;
		}
		if(optionValue.length>30){
			invalidMsg.text('单个选项的长度不能超过30');
			return false;
		}
		var allOptions=[];
		if(optionValue&&optionValue!=''&&optionValue!=undefined){
			allOptions=[optionValue];
		}
		var keyConflict=false;
		itemValueEl.find('.js-item-meta-option').each(function(index){
			var opValue=$.trim($(this).text());
			if(allOptions.indexOf(opValue)!=-1){
				keyConflict=true;
			}
			allOptions.push(opValue);
		});
		if(keyConflict){
			invalidMsg.text('不能有内容完全相同的选项');
			return false;
		}
		var overLen=allOptions.join(',').length+itemValueEl.find('.js-item-meta-other:checked').length*32-512;

		if(overLen>0){
			invalidMsg.text('选项内容过多，请减少'+overLen);
			return false;
		}
		return true;
	}

	//把页面上的设置保存/更新到数据模型中,如果有需要同时回显到视图中

	function updateFormModel() {
		//检查detail部分
		var curDetail = $('.sub-detail:visible');
		if(curDetail.prop('id') && curDetail.prop('id').indexOf('js-detail-') == 0) {
			//保存当前正在设置的控件到数据模型
			var curConfid = curDetail.find('input[name=item-conf-id]').val();
			var curDataModel = formModelFindByConfId(curConfid);
			var curCtrlType = curDetail.find('input[name=item-base-ctrlType]').val();
			if(saveRenderFN[curCtrlType]) {
				if(curDataModel&&(curDataModel.conf_state==undefined||curDataModel.conf_state=='')){
					curDataModel.conf_state='change';
				}
				saveRenderFN[curCtrlType](curDataModel, curDetail);
			}
			//更新控件列表视图
			itemInList = configList.find('li[data-confid=' + curConfid + '] .item-name');
			if(itemInList.size() == 0) {
				var curConfidNew = curDetail.find('input[name=item-conf-id]').val();
				var curDataModelNew = formModelFindByConfId(curConfidNew);
				//新控件
				configList.find('ul').append(itemInConfigListHtml(curDataModelNew));
			} else {
				itemInList.text(curDataModel.base.name);
			}
			isChange=true;
		}
	}

	function build(model) {
		var items = model.items;
		var configListUl=configList.find('ul');
		configListUl.empty();
		for(var i = 0; i < items.length; i++) {
			if(!items[i] || !items[i].base || !items[i].conf) {
				continue;
			}
			configListUl.append(itemInConfigListHtml(items[i]));

		};
		globalMsg.hide();
		configView.show();
		configOpt.show();

	}
	function genId() {
		return '-' + new Date().getTime() + '' + (++idFactor);
	}

	function itemInConfigListHtml(item) {
		if(item.base.ctrlType=='custom'){
			//自定义控件暂时先隐藏删除按钮
			return '<li data-confid="' + item.conf.id + '"><a class="item-name js-detail-edit" href="javascript:void(0);">' + item.base.name + '</a><i style="visibility: hidden;" class="icon-remove js-remove" title="删除">&nbsp</i><i class="icon-up js-up" title="上移">&nbsp</i><i class="icon-down js-down" title="下移">&nbsp</i></li>';
		}else{
			return '<li data-confid="' + item.conf.id + '"><a class="item-name js-detail-edit" href="javascript:void(0);">' + item.base.name + '</a><i class="icon-remove js-remove" title="删除">&nbsp</i><i class="icon-up js-up" title="上移">&nbsp</i><i class="icon-down js-down" title="下移">&nbsp</i></li>';
		}
		
	}

	function addConfigListItem(item) {
		configList.append('html');
	}
	//显示一个全局的提示信息

	function showGlobalMsg(msg) {
		globalMsg.html(msg);
		globalMsg.show();
		configView.hide();
	}

	function switchPosByConfId(confId,state) {
		var items = formModel.items;
		for(var i = 0; i < items.length; i++) {
			if(!items[i] || !items[i].base || !items[i].conf) {
				continue;
			}
			if(confId == items[i].conf.id) {
				if(state=='up'){
					if(i==0){
						return;
					}
					var tmpItem=items[i-1];
					items[i-1]=items[i];
					items[i]=tmpItem;
					isChange=true;
				}else if(state=='down'){
					if(i==items.length-1){
						return;
					}
					var tmpItem=items[i+1];
					items[i+1]=items[i];
					items[i]=tmpItem;
					isChange=true;
				}

				var curItemEl = configList.find('li[data-confid=' + confId + ']');
				if(state=='up'){
					var prevItemEl=curItemEl.prev();
					if(prevItemEl.size()!=0){
						curItemEl=curItemEl.detach();
						curItemEl.insertBefore(prevItemEl);
					}
				}else if(state=='down'){
					var nextItemEl=curItemEl.next();
					if(nextItemEl.size()!=0){
						curItemEl=curItemEl.detach();
						curItemEl.insertAfter(nextItemEl);
					}
				}
				break;
			}
		};
		
			
	}

	function formModelFindByConfId(confId) {
		var items = formModel.items;
		for(var i = 0; i < items.length; i++) {
			if(!items[i] || !items[i].base || !items[i].conf) {
				continue;
			}
			if(confId == items[i].conf.id) {
				return items[i];
			}
		};
	}

	function formModelDelByConfId(confId){
		var items = formModel.items;
		for(var i = 0; i < items.length; i++) {
			if(!items[i] || !items[i].base || !items[i].conf) {
				continue;
			}
			if(confId == items[i].conf.id) {
				if(items[i].conf_state!='new'){
					if(formModel.conf_confIdForDel==null){
						formModel.conf_confIdForDel=[];
					}
					formModel.conf_confIdForDel.push(items[i].conf.id);
				}
				formModel.items.splice(i,1);
				var curLi=configList.find('li[data-confid=' + confId + ']');
				if(curLi.find('.detail-editing').size()>0){
					configDetail.find('.sub-detail').hide();
				}
				curLi.remove();
				isChange=true;
				break;
			}
		};
	}

	function addItemToFormModel(item) {
		formModel.items.push(item);
	}
	function log(e) {
		console.log(e);
	}
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
})(jQuery, FE.tools);