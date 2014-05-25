/**
 * ����detail����js
 * �ṩ��ʽ����detail����������detail
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-11-21
 */

;(function($, D) {
	// ����ȫ�ֱ���
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
			// ��ȫ�ֱ���
			g_blockId=0;
			g_arrangeId=0;
			var $self = $(this);
			var data={}
            // ��ȡԤ�����б��е�ֵ
			params = ($self.data('params'));
            if($self.hasClass('modify-arrange-detail')) {
				//�޸�
            	data.event_submit_do_show_update_block_detail = "true";
				data.blockDetailId = params.sid;
				// ����ȫ�ֱ���
				g_arrangeId = data.blockDetailId ;
            } else {
				//�½�
				data.blockId =params.blockId;
				// ����ȫ�ֱ���
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
     * ��ʾ�½����޸�����
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
		//��ʼ��detaiҳ��
		initDetailUi();
		
        $('.close-btn, .cancel-btn', oDialog).live('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            $self.closest('div.dcms-dialog').dialog('close');
        });	
    }
	//��ʼ��detaiҳ��
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

		//  �༭ģ��
		$('#btnEditTemplate').click(function e(){
		    var templateName =$('#templateCode').val();
			window.open(D.domain + '/page/editTemplate.html?templateName='+templateName);
		})
		
		// ģ���޸ģ���Ҫ����ģ����Ԥ��Ĳ�����ʼ������Դ����
		$('#templateCode').bind('change', templateCodeChange) ;
		// offer����Դ�����⴦��
		if( 3 ==$('#ctype').val() ){
			initOfferUi();
		}
		// ����Դ�ĳ�ʼ��������������mlr�����á�
		initDsEvent();
		
		/*������ʽ����*/
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
		// Ĭ��չ��������Ϣ
		$("'.description[data-boptions='attr_basic_field']").click();

    };
	// offer����Դ�ĳ�ʼ��
	var initOfferUi = function (){
		// ����Դ�ĸ߼�����
        $('#highGrade').bind('click', function(e) {
         	 $('#offerParam').toggle();
        });

		// ��ʱ������λ��
		_tmp = $('#salesChangeInterval');
		//$('#salesChangeInterval').parent().remove();
		//$('#lbl_salesChangeInterval').append(_tmp);
		
		// ��ʼ�����ض���ʱ��
		changeSortType();
		$('#sortType').change(changeSortType);
		

	}
	// ģ���޸ģ���Ҫ����ģ����Ԥ��Ĳ�����ʼ������Դ����
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
					// ѭ������Դ����������Ĭ��ֵ
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
            alert('ϵͳ��������ϵ����Ա');
        });
	}
	var initCommonDsUi = function (){
		// ����Դ�ĸ߼�����
        $('#highGrade').bind('click', function(e) {
         	 $('#offerParam').toggle();
        });
	}
	function changeSortType(){
		var $self = $('#sortType');
		// ����Ƕ���������ʽ���ö���ʱ����
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
            alert("��ѡ��ʼʱ��");
            return false;
        }

        if(tCode == "") {
            alert("����д������");
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
                   alert('��ͬʱ��������Ѿ����ڣ�');
				   _rst = false;
            	}else if(msg == 'false') {
                   alert('�����������ڣ�');
				   $('#templateCode').focus();
				   _rst = false;
                }else if(msg == 'containTemplate') {
                   alert('��Դλ��ģ�������в���Ƕ��ģ�塢��Դλ��TDP��');
				   $('#templateCode').focus();
				   _rst = false;
                }else if(msg && msg !='true'){
                	alert('��Դλ��ģ�������в���Ƕ��ģ�塢��Դλ��TDP����֧�ֵı��ʽ:\n' + msg);
 				    $('#templateCode').focus();
 				    _rst = false;
                }
            },
            error : function() {
                alert('������������!!!');
				$('#templateCode').focus();
				_rst = false;
            }
        });
		if (_rst == false){
			return false;
		}
		return true;
	}
	// �������ģʽ
	saveDetailTdp = function (){
		if (!checkValid()){
			return false;
		}

		saveForm();
	};

    // ����offer����Դģʽ
    saveDetailOffer = function() {
		if (!checkValid()){
			return false;
		}

		// ����Ƕ��������ж��Ƿ����ü��ʱ��
		if ($('#sortType').val() == "sales_change"){
			if ( $('#salesChangeInterval').val() <= 0 ){
				alert("�����ö�������ʱ���");
				$('#salesChangeInterval').focus();
				return false;
			}
		}

		saveForm();

    };
	

    // ����ͨ������Դģʽ
    saveCommonDs = function() {
		if (!checkValid()){
			return false;
		}
		saveForm();
    };
	// �����
	var saveForm = function(){
		// ��ȡ���в���
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
			alert('ϵͳ��������ϵ����Ա');
		});

	}
})(dcms, FE.dcms);




