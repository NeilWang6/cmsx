/**
 * 报名工具查询数据和生成页面接口
 */
;(function($, D) {
    var readyFun = [
    function() {
        //ar categoryIdEl = $('#catalogId'), categoryEl = $('#catalogName'), popTree = new D.PopTree({
        //modify : function() {
        //formValid.valid(categoryEl);
        // }
        //});

        // popTree.show(categoryEl, categoryEl, categoryIdEl, false);
        // categoryEl.click(function() {
        //popTree.show(categoryEl, categoryEl, categoryIdEl);
        // });

        //console.log(9999);
    },
    function() {
        var domain = $('#domain_cmsModule').val();
        //站点接口
        $('#siteName').ajaxTree(domain + '/admin/site.html?_input_charset=UTF8', {
        	//$('#siteName').ajaxTree(domain + '/admin/catalog.html?_input_charset=UTF8', {
            hiddenId : 'siteId',
            rootId : 0,
            rootName : '',
            onleychecked : true
        });
        $('#catalogName').ajaxTree(domain + '/admin/catalog.html?_input_charset=UTF8', {
            //$('#siteName').ajaxTree(domain + '/admin/catalog.html?_input_charset=UTF8', {
            hiddenId : 'catalogId',
            rootId : 0,
            rootName : '',
            para: {"siteId":"siteId"},
            allCanChecked: true
        });
        var siteNameValue = ""
        $('#siteName').closest('.item-form').on('click','input[name=checkboxmmTree]',function(){
            var newsiteNameValue = $('#siteName').val();
            if(siteNameValue !== newsiteNameValue) {
                $('#catalogName').val('');
                $('#catalogId').val('');

                $('#pageHeadName').val('');
                $('#pageHeadId').val('');

                $('#domainName').val('');
                $('#domainId').val('');
            }
            siteNameValue = newsiteNameValue;
        })
        // $('#catalogName').on('click',function(){
        // 	//类目接口
        //     $('#catalogName').ajaxTree(domain + '/admin/catalog.html?_input_charset=UTF8&siteId='+$('#siteId').val(), {
        //         hiddenId : 'catalogId',
        //         rootId : 0,
        //         rootName : ''
        //     });
        // });
        $("#domainName").autocomplete(domain + '/page/get_page_domain.html?_input_charset=UTF8', {
            minChars : 0, //最少输入几个字符
            width : 200,
            hidden : "domainId",
            mustMatch : false,
			scroll:true,
            param:{'siteId':'siteId'},
            cachemodule: true,
            formatItem : function(data, i, n, value) {
                return data.name;
            },
            formatResult : function(data, value) {

                return data.name;
            },
            formatHidden : function(data, value) {
                $('#domainUrl').html('http://' + data.name);
                return data.code;
            }
        });    
        //域名接口
        //$("#domainName").on('click',function(){
	        // $.get(domain + '/page/get_page_domain.html?_input_charset=UTF8&siteId=110223', function(json) {
	        //     if(json && json.status === 'success') {
	        //     	$('select#domainId').html("")
	        //         var oSelect = $('select#domainId');
	        //         if(oSelect && oSelect.length > 0) {
	        //             var options = '<option>请选择</option>';
	        //             for(var i = 0; i < json.data.length; i++) {
	        //                 options += '<option value="' + json.data[i].code + '">' + json.data[i].name + '</option>';
	        //             }
	        //             oSelect.append(options);
	        //         }
	        //     }
	
	        // }, 'jsonp');
        //});
        
        $("#pageHeadName").autocomplete(domain + '/page/get_page_head.html?_input_charset=UTF8', {
            minChars : 0, //最少输入几个字符
            width : 200,
            hidden : "pageHeadId",
            mustMatch : false,
			scroll:true,
            param:{'siteId':'siteId'},
            cachemodule: true,
            formatItem : function(data, i, n, value) {
                return data.name;
            },
            formatResult : function(data, value) {
                return data.name;
            },
            formatHidden : function(data, value) {
                return data.code;
            }
        });
        //标准头接口
       // $("#pageHeadName").on('click',function(){
	        // $.get(domain + '/page/get_page_head.html?_input_charset=UTF8&siteId=110223', function(json) {
	        //     if(json && json.status === 'success') {
	        //     	$('select#pageHeadId').html("");
	        //         var oSelect = $('select#pageHeadId');
	        //         if(oSelect && oSelect.length > 0) {
	        //             var options = '<option selected>请选择</option>';
	        //             for(var i = 0; i < json.data.length; i++) {
	        //                 options += '<option value="' + json.data[i].code + '">' + json.data[i].name + '</option>';
	        //             }
	
	        //             oSelect.append(options);
	        //         }
	        //     }
	
	        // }, 'jsonp');
        //});
        //url 验证

        $('#pageUrl').live('blur', function(event) {
            event.preventDefault();
            var self = $(this), val = self.val(), domainId = '';
            var oDomainId = $('#domainId');
            if(oDomainId.is('select')) {
                oDomainId = $('#domainId option:selected');

                domainId = oDomainId.val();
            } else {
                domainId = oDomainId.val();
            }
            var _param = $.param({
                'specialUrl' : val,
                'domainId' : domainId
            });
            $.get(domain + '/page/Check_Special_Url.html?_input_charset=UTF8&' + _param, function(json) {
                var _oTip = $('#domainUrl-tip');
                if(json && json.status === 'success') {
                    //console.log(json);
                    if(json.data.id !== 3) {
                        _oTip.html(json.msg);
                        _oTip.show();
                        return;
                    } else {
                        _oTip.html('');
                        _oTip.hide();
                        return;
                    }
                } else {
                    _oTip.html(json.msg);
                    _oTip.show();
                    return;
                }
            }, 'jsonp');
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
})(dcms, FE.dcms);
