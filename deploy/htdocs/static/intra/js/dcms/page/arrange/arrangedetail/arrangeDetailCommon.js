/**
 * 排期detail共用js
 * 提供显式排期detail、保存排期detail
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-11-21
 */

;(function($, D) {
	// 定义全局变量
    g_blockId=0;
    g_arrangeId=0;

    var readyFun = [
	function(){
        var $oStartTime = $('#start-time'), $oEndTime = $('#end-time');
        $oStartTime.one('focus', function() {
            var $self = $(this);
            $.use('ui-datepicker-time,util-date', function() {
                $self.datepicker({
                    triggerType : 'focus',
                    showTime : true,
                    closable : true,
                    pages : 1,
                    beforeShow : function() {
                        $(this).datepicker({
                            maxDate : Date.parseDate($oEndTime.val())
                        });
                        return true;
                    },
                    select : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss'));

                    },
                    timeSelect : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss')).datepicker('hide');
                    }
                }).triggerHandler('focus');
            });
        });
        $oEndTime.one('focus', function() {
            var $self = $(this);
            $.use('ui-datepicker-time, util-date', function() {
                $self.datepicker({
                    triggerType : 'focus',
                    closable : true,
                    showTime : true,
                    pages : 1,
                    beforeShow : function() {
                        $(this).datepicker({
                            minDate : Date.parseDate($oStartTime.val())
                        });
                        return true;
                    },
                    select : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss'));

                    },
                    timeSelect : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss')).datepicker('hide');
                    }
                }).triggerHandler('focus');
            });
        });
	},

    function() {
        $('#newArrange,.modify-arrange-detail').bind('click', function(event) {
            event.preventDefault();
			// 清全局变量
			g_blockId=0;
			g_arrangeId=0;
			var $self = $(this);
			var data={}
            // 获取预埋在列表中的值
			params = ($self.data('params'));
            if($self.hasClass('modify-arrange-detail')) {
				//修改
            	data.event_submit_do_show_update_block_detail = "true";
				data.blockDetailId = params.sid;
				// 缓存全局变量
				g_arrangeId = data.blockDetailId ;
            } else {
				//新建
				data.blockId =params.blockId;
				// 缓存全局变量
				g_blockId = data.blockId ;
				data.event_submit_do_show_insert_block_detail = "true";
            }
        	$.get(D.domain + '/page/arrange/detailOffer.htm?action=ArrangeAction', data, showSetting, 'text');    	


        });

    }];

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
	
    /*
     * 显示新建、修改内容
     */
    var showSetting = function(text){
    	$('#popDiv1').html(text);
    	var oDialog = $('#popDiv1');
        jQuery.ui.dialog.zIndex = 100;
        $.use('ui-dialog', function() {
            oDialog.dialog({
                modal : true,

                draggable : {
                    handle : 'div.dialog-body',
                    containment : 'body'
                },
                shim : true,
                center : true,
                fadeOut : true
            });
        }); 
		//初始化detai页面
		initDetailUi();
		
        $('.close-btn, .cancel-btn', oDialog).live('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            $self.closest('div.dcms-dialog').dialog('close');
        });	
    }
	//初始化detai页面
    var initDetailUi = function() {
        var $oStartTimeH = $('#start-time-h');
        $oStartTimeH.one('focus', function() {
            var $self = $(this);
			var dt = new Date(),
			dateString = dt.format("yyyy-MM-dd hh:mm:ss");
            $.use('ui-datepicker-time, util-date', function() {
                $self.datepicker({
                    triggerType : 'focus',
                    closable : true,
                    showTime : true,
                    pages : 1,
                    beforeShow : function() {
                        $(this).datepicker({
                            minDate : Date.parseDate(dateString)
                        });
                        return true;
                    },
                    select : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss'));

                    },
                    timeSelect : function(e, ui) {
                        $(this).val(ui.date.format('yyyy-MM-dd hh:mm:ss')).datepicker('hide');
                    }
                }).triggerHandler('focus');
            });
        });

		//  编辑模板
		$('#btnEditTemplate').click(function e(){
		    var templateName =$('#templateCode').val();
			window.open(D.domain + '/page/editTemplate.html?templateName='+templateName);
		})
		
		// 模板修改，需要根据模板中预埋的参数初始化数据源参数
		$('#templateCode').bind('change', templateCodeChange) ;
		// offer数据源的特殊处理
		if( 3 ==$('#ctype').val() ){
			initOfferUi();
		}
		// 数据源的初始化公共函数，如mlr等设置。
		initDsEvent();
		
		/*缩放样式控制*/
		$('.description').click(function(e){
            e.preventDefault();
            var self = $(this), _sVal = self.data('boptions'), selfParent = self.parent();
            if(selfParent.hasClass('selected')) {
            	selfParent.removeClass('selected');
            	$('#' + _sVal).hide();
                return;
            }
			
			$('.selected').removeClass('selected');
            selfParent.addClass('selected');
			$('.attr').hide();
            $('#' + _sVal).show();

		});
		// 默认展开基本信息
		$("'.description[data-boptions='attr_basic_field']").click();

    };
	// offer数据源的初始化
	var initOfferUi = function (){
		// 数据源的高级功能
        $('#highGrade').bind('click', function(e) {
         	 $('#offerParam').toggle();
        });

		// 把时间间隔移位置
		_tmp = $('#salesChangeInterval');
		//$('#salesChangeInterval').parent().remove();
		//$('#lbl_salesChangeInterval').append(_tmp);
		
		// 初始化隐藏动销时间
		changeSortType();
		$('#sortType').change(changeSortType);
		

	}
	// 模板修改，需要根据模板中预埋的参数初始化数据源参数
	var templateCodeChange = function(){
		var code = $('#templateCode').val();
		if (code == ""){
			return;
		}
        $.ajax({
            url: D.domain + '/page/appCommand.htm?action=ArrangeAction&event_submit_do_fetch_ds_param_from_template=true&code='+code,
            type: "POST",
            async: false
        }).done(function(o){
            if (o) {
                var _data = dcms.parseJSON(o);
                if (_data.sucess) {
					// 循环数据源参数，设置默认值
					for (var i =0 ;i< _data.dataSourceParamList.length;i++){
						var _jsonTmp = _data.dataSourceParamList[i];
						if (_jsonTmp.value) {					
							var _id = "#"+_jsonTmp.dataSourceParam;
							$(_id).val(_jsonTmp.value);
						}							
					}
                }
            }
        }).fail(function(){
            alert('系统错误，请联系管理员');
        });
	}
	var initCommonDsUi = function (){
		// 数据源的高级功能
        $('#highGrade').bind('click', function(e) {
         	 $('#offerParam').toggle();
        });
	}
	function changeSortType(){
		var $self = $('#sortType');
		// 如果是动销排序，显式设置动销时间间隔
		if ($self.val() == "sales_change"){
			$('#salesChangeInterval').parent().parent().show();
		}else{
			$('#salesChangeInterval').parent().parent().hide();
			$('#salesChangeInterval').val("");
		}
	}
    function setDate(startEl, endEl) {
        arrDate = D.getDate(startEl, endEl);
        beginDate = arrDate[0];
        endDate = arrDate[1];
    }


	var checkValid = function (){
        var sDate = document.getElementById('start-time-h').value;
        var tCode = document.getElementById('templateCode').value;
        if(sDate == "") {
            alert("请选择开始时间");
            return false;
        }

        if(tCode == "") {
            alert("请填写区块名");
			$('#templateCode').focus();
            return false;
        }

        //
        var urlStr = D.domain + '/page/arrange/verifyTemplateAjax.html';
		var _rst = true;
        $.ajax({
            url : urlStr,
            dataType : "text",
			async:false,
            data : {
                code : tCode,
                sDate: sDate,
                blockId:g_blockId,
                arrangeId:g_arrangeId
            },
            success : function(o) {
            	var msg = o.trim();
                if(msg == 'haveTime') {
                   alert('相同时间的排期已经存在！');
				   _rst = false;
            	}else if(msg == 'false') {
                   alert('区块名不存在！');
				   $('#templateCode').focus();
				   _rst = false;
                }else if(msg == 'containTemplate') {
                   alert('资源位的模板内容中不能嵌套模板、资源位、TDP！');
				   $('#templateCode').focus();
				   _rst = false;
                }else if(msg && msg !='true'){
                	alert('资源位的模板内容中不能嵌套模板、资源位、TDP！不支持的表达式:\n' + msg);
 				    $('#templateCode').focus();
 				    _rst = false;
                }
            },
            error : function() {
                alert('区块名不存在!!!');
				$('#templateCode').focus();
				_rst = false;
            }
        });
		if (_rst == false){
			return false;
		}
		return true;
	}
	// 保存代码模式
	saveDetailTdp = function (){
		if (!checkValid()){
			return false;
		}

		saveForm();
	};

    // 保存offer数据源模式
    saveDetailOffer = function() {
		if (!checkValid()){
			return false;
		}

		// 如果是动销排序，判断是否设置间隔时间
		if ($('#sortType').val() == "sales_change"){
			if ( $('#salesChangeInterval').val() <= 0 ){
				alert("请设置动销检查的时间段");
				$('#salesChangeInterval').focus();
				return false;
			}
		}

		saveForm();

    };
	

    // 保存通用数据源模式
    saveCommonDs = function() {
		if (!checkValid()){
			return false;
		}
		saveForm();
    };
	// 保存表单
	var saveForm = function(){
		// 获取所有参数
		var selectSValue = getValue();
		$('#selectSValue').val(selectSValue);

		
		$.ajax({
		    url: D.domain + '/page/arrange/dd.htm?action=ArrangeAction',
		    type: "POST",
			async:false,
			data : $('#checkForm').serialize(),
		})
		.done(function(o) {
	            if(o) {
					var _data = dcms.parseJSON(o);
	                if(_data.message ) {
	                    alert(_data.message);
	                }else{
	                	window.location.reload();
	                }
	            }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
		});

	}
})(dcms, FE.dcms);




