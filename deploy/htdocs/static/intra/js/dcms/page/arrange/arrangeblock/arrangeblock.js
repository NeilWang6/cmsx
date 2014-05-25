/**
 * @package
 * @author: quxiao
 * @Date: 2012-08-27
 */

;(function($, D) {
    var searchPageForm = $('#addForm'), pageNum = $('#js-page-num'), readyFun = [
    /**
     * 切换到第N页
     */
    function() {
        $('.pages').live('click', function(e) {
            e.preventDefault();
            var n = $(this).text();
            setPageNum(n);
        });
    },
    /**
     * 上一页、下一页
     */
    function() {
        $('.dcms-page-btn').live('click', function(e) {
            e.preventDefault();
            var n = $(this).data('pagenum');
            setPageNum(n);
        });
    },
    /**
     * 跳到第几页
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
                alert("查询条件不能为空");
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
            // 有html的注释，如<!--排期资源位:9999,名称:test普通页面-->$arrange.invoke("9999")
            var _tdpCode = '<!--排期资源位:' + blockId + ',名称:' + blockName + '-->\n$arrange.invoke("' + blockId + '")';
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
            var styleObj = 'clipboard{text:拷贝代码;color:#ffffff;fontSize:13;font-weight:bold;font: 12px/1.5 Tahoma,Arial,"宋体b8b\4f53",sans-serif;}';
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
		//  编辑模板
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
    // 增加前准备界面
    prepareForAdd = function() {
        // 把id设置为空
        $('#addForm #id').val("");
		$('#addForm #name').val("");
        // 设置类型
        for(var i = 0; i < $('#addForm .content-type').size(); i++) {
            $('#addForm .content-type').get(i).checked = false;
        }
        // 设置成增加的方法，调用action的add
        document.getElementById("event_submit_do_method").name = "event_submit_do_add_arrange_block";
        
    };
    // 修改前准备界面
    prepareForUpdate = function(id, name, contentType,captureTemplate) {
        // 设置成增加的方法，调用action的add
        document.getElementById("event_submit_do_method").name = "event_submit_do_update_arrange_block";
        // 设置id
        $('#addForm #id').val(id);
        // 设置名称
        $('#addForm #name').val(name);
		$('#addForm #captureTemplate').val(captureTemplate);
        // 设置类型
        for(var i = 0; i < $('#addForm .content-type').size(); i++) {
            if($('#addForm .content-type').get(i).value == contentType) {
                $('#addForm .content-type').get(i).checked = true;
            }
        }

    };

    // 删除前准备界面
    prepareForDelete = function(id) {
        if(!window.confirm("删除后将不能找回，确定需要删除？")) {
            return false;
        }
        // 设置id
        $('#addForm #id').val(id);
        // 设置成增加的方法，调用action的add
        document.getElementById("event_submit_do_method").name = "event_submit_do_delete_arrange_block";
        var form1 = document.getElementById("addForm");
        form1.submit();

    };

    // 保存
    saveArrangeBlock = function() {
        var form1 = document.getElementById("addForm");
        var vaname = form1.elements["name"].value;
        if(vaname == "") {
            alert("请输入资源位名称");
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
            alert("请选择类型");
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
	                    	alert("容错模板不存在！");
						}else if(_data.code == "containTemplate"){
	                    	alert("容错模板内容不能嵌套其他模板！");
						}
	                }else{
	                	window.location.reload();
	                }
	            }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
		});
    };
	
	$('#btnAdd').click(saveArrangeBlock);
	


}
)(dcms, FE.dcms);

