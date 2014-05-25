/**
 * @package
 * @author: quxiao
 * @Date: 2012-08-27
 */

;(function($, D) {
    var searchPageForm = $('#addForm'), pageNum = $('#js-page-num'), readyFun = [
    /**
     * �л�����Nҳ
     */
    function() {
        $('.pages').live('click', function(e) {
            e.preventDefault();
            var n = $(this).text();
            setPageNum(n);
        });
    },
    /**
     * ��һҳ����һҳ
     */
    function() {
        $('.dcms-page-btn').live('click', function(e) {
            e.preventDefault();
            var n = $(this).data('pagenum');
            setPageNum(n);
        });
    },
    /**
     * �����ڼ�ҳ
     */
    function() {
        $('#js-jumpto-page').click(function(e) {
            var n = $('#js-jump-page').val();
            setPageNum(n);
        });
    },
    function() {
        $("#btnQuery").click(function() {
            if("" == $("#js-search-page #qryBlockId").val() && "" == $("#js-search-page #qryPageId").val()) {
                alert("��ѯ��������Ϊ��");
                return false;
            }
            $("#js-search-page").get(0).submit();
        })
    },
    function() {
        var oDialog = $('#popDiv1');
        $('#new-template,.mod-res').bind('click', function(event) {
            event.preventDefault();

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
        });
        $('.close-btn, .cancel-btn', oDialog).bind('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            $self.closest('div.dcms-dialog').dialog('close');
        });

    },
    function() {
        var oDialog = $('#popDiv2');
        $('.fetch-tdp-code').bind('click', function(event) {
            event.preventDefault();
            var $self = $(this), blockId = $self.data("block-id"), blockName = $self.data("block-name");

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
            // ��html��ע�ͣ���<!--������Դλ:9999,����:test��ͨҳ��-->$arrange.invoke("9999")
            var _tdpCode = '<!--������Դλ:' + blockId + ',����:' + blockName + '-->\n$arrange.invoke("' + blockId + '")';
            $("#txtTdpCode").text(_tdpCode);

            $("#txtTdpCode").focus().select();

        });
        $('.close-btn, .cancel-btn', oDialog).live('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            $self.closest('div.dcms-dialog').dialog('close');
        });
    },
    function() {
        $.use('ui-flash-clipboard', function() {
            var styleObj = 'clipboard{text:��������;color:#ffffff;fontSize:13;font-weight:bold;font: 12px/1.5 Tahoma,Arial,"����b8b\4f53",sans-serif;}';
            $('#btnCopyTdpCode').flash({
                module : 'clipboard',
                width : 64,
                height : 23,
                flashvars : {
                    style : encodeURIComponent(styleObj)
                }
            }).on("swfReady.flash", function() {
                //debugStr("#debug_1", "swfReady");
            }).on("mouseDown.flash", function() {
                $(this).flash("setText", $("#txtTdpCode").val());
            }).on("complete.flash", function(e, data) {
            //debugStr("#debug_1", "copy text:" + data.text);
             });
        });
    },
		//  �༭ģ��
	$('#btnEditTemplate').click(function e(){
	    var templateName =$('#captureTemplate').val();
		window.open(D.domain + '/page/editTemplate.html?templateName='+templateName);
	})
		
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
    function setPageNum(n) {
        pageNum.val(n);
        searchPageForm.submit();
    }

})(dcms, FE.dcms);

(function($, D) {
    // ����ǰ׼������
    prepareForAdd = function() {
        // ��id����Ϊ��
        $('#addForm #id').val("");
		$('#addForm #name').val("");
        // ��������
        for(var i = 0; i < $('#addForm .content-type').size(); i++) {
            $('#addForm .content-type').get(i).checked = false;
        }
        // ���ó����ӵķ���������action��add
        document.getElementById("event_submit_do_method").name = "event_submit_do_add_arrange_block";
        
    };
    // �޸�ǰ׼������
    prepareForUpdate = function(id, name, contentType,captureTemplate) {
        // ���ó����ӵķ���������action��add
        document.getElementById("event_submit_do_method").name = "event_submit_do_update_arrange_block";
        // ����id
        $('#addForm #id').val(id);
        // ��������
        $('#addForm #name').val(name);
		$('#addForm #captureTemplate').val(captureTemplate);
        // ��������
        for(var i = 0; i < $('#addForm .content-type').size(); i++) {
            if($('#addForm .content-type').get(i).value == contentType) {
                $('#addForm .content-type').get(i).checked = true;
            }
        }

    };

    // ɾ��ǰ׼������
    prepareForDelete = function(id) {
        if(!window.confirm("ɾ���󽫲����һأ�ȷ����Ҫɾ����")) {
            return false;
        }
        // ����id
        $('#addForm #id').val(id);
        // ���ó����ӵķ���������action��add
        document.getElementById("event_submit_do_method").name = "event_submit_do_delete_arrange_block";
        var form1 = document.getElementById("addForm");
        form1.submit();

    };

    // ����
    saveArrangeBlock = function() {
        var form1 = document.getElementById("addForm");
        var vaname = form1.elements["name"].value;
        if(vaname == "") {
            alert("��������Դλ����");
            form1.elements["name"].focus();
            return false;
        }
        var bSelected = false;
        for(var i = 0; i < $('#addForm .content-type').size(); i++) {
            if($('#addForm .content-type').get(i).checked) {
                bSelected = true;
            }
        }
        if(!bSelected) {
            alert("��ѡ������");
            return false;
        }
		$.ajax({
		    url: D.domain + '/page/appCommand.htm?action=ArrangeAction&_input_charset=UTF-8',
		    type: "POST",
			async:false,
			data : $('#addForm').serialize(),
		})
		.done(function(o) {
	            if(o) {
					var _data = dcms.parseJSON(o);
	                if(!_data.sucess  ) {
						if (_data.code== "templateExsit"){
	                    	alert("�ݴ�ģ�岻���ڣ�");
						}else if(_data.code == "containTemplate"){
	                    	alert("�ݴ�ģ�����ݲ���Ƕ������ģ�壡");
						}
	                }else{
	                	window.location.reload();
	                }
	            }
		})
		.fail(function() {
			alert('ϵͳ��������ϵ����Ա');
		});
    };
	
	$('#btnAdd').click(saveArrangeBlock);
	


}
)(dcms, FE.dcms);

