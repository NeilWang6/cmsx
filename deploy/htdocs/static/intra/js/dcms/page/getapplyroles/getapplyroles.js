;(function($, D) {
	var pageElm = $('#js-page-num'), searchForm = $('#js-search-page'), readyFun = [
    function(){
        $('.btn-batch-pass').click(function(e){
            $('#batch-pass').submit();
        });
        
    },
	function() {
		$("#example").treeview();

	},
	function() {
		//$('#js-search-page').submit();
		FE.dcms.doPage();
	},
    //tab切换
    /*function(){
        $.use('ui-tabs',function(){
            $('.js-tab').tabs({
                isAutoPlay:false,
                event:'click',
                titleSelector:'.tab-f',
                boxSelector:'.tab-b'
            });
        });
    },*/
    //全选
    function(){
        var allBtn = $('#js-choose-all');
        allBtn.closest('table').find('input').prop('checked', this.checked);
        
        allBtn.on('change', function(){
            $(this).closest('table').find('input').prop('checked', this.checked);
        });
    },
    //时间控件
    function(){
        $.use('ui-datepicker, util-date', function(){
            var timeStartEl = $('input.time-start');
            timeStartEl.datepicker({
                maxDate:new Date(),
                closable:true,
                triggerType: 'focus',
                select: function(e, ui){
                    $(this).val(ui.date.format('yyyy-MM-dd'));
                    //console.log(timeEnd);
                    //timeEnd.options('minDate', ui.date);
                }
            });
            var timeEnd = $('input.time-end').datepicker({
                maxDate:new Date(),
                closable:true,
                triggerType: 'focus',
                beforeShow: function(){
                    $(this).datepicker({
                        minDate: Date.parseDate(timeStartEl.val())
                    });
                    return true;
                },
                select: function(e, ui){
                    $(this).val(ui.date.format('yyyy-MM-dd'));
                }
            });
        });
    },
    //查看原因
    function(){
        $('.resolved').on('click', '.explain', function(e){
            e.preventDefault();
            $(this).toggleClass('hide');
        });
    },
    //不通过弹框
    function(){
        var htmlStr = '<div class="dcms-form">\
                <div class="form"><form class="no-pass-form" method="post" action="#">\
                    <input type="hidden" name="action" value="ACLGrantAction" />\
                    <input type="hidden" name="event_submit_do_add_roles2_user" value="true" />\
                    <input type="hidden" name="isPass" value="false" />\
                    <input type="hidden" name="isHandle" value="false" />\
					<input type="hidden" name="type" value="0" />\
                    <input type="hidden" name="page" value="" />\
                    <input type="hidden" name="ids" value="" />\
                    <div>\
                        <label for="name">用户名：</label>\
                        <span class="text user-name"></span>\
                    </div>\
                    <div>\
                        <label for="name">所在部门：</label>\
                        <span class="text partment"></span>\
                    </div>\
                    <div>\
                        <label for="name">不通过原因<span class="dcms-red">*</span>：</label>\
                        <textarea name="message"></textarea>\
                    </div>\
                </div></form></div>';
        $('.table-sub').on('click', '.no-pass', function(e){
            e.preventDefault();
            var focusEl = $(this);
            D.Msg['confirm']({
                'title' : '新增菜单',
                'body' : htmlStr,
                'onlymsg':false,
                'success':function(obj){
                    var dialogEl = obj.data.dialog;
                    
                    $('.no-pass-form').submit();
                }
            }, {
                'open':function(){
                    var dialogEl = $(this),
                        result = location.search.match(/page=([^&#]+)($|&|#)/),
                        pageId = (result) ? result[1] : 1;
                    //pageid
                    dialogEl.find('input[name=page]').val(pageId);
                    //id
                    dialogEl.find('input[name=ids]').val(focusEl.data('role-resource'));
                    //用户名
                    dialogEl.find('.user-name').text($('input[name=userName]').val());
                    //部门
                    dialogEl.find();
                }
            });
        });
    },
    //移除权限
    function(){
        $('.table-sub').on('click', '.remove-permisson', function(e) {
            if (confirm('确认是否要移除权限！')) {
                e.preventDefault();
                var $self = $(this), value = {
					action   : 'ACLGrantAction',
                    event_submit_do_add_roles2_user : true,
                    isPass   : false,
				    isHandle : true,
				    message  : 'remove',
				    ids      : $self.data('ids'),
					page     : $self.data('page')
			    };
			    $.post(D.domain + '/admin/json.html?_input_charset=UTF8', value, function(json) {
				    if(json) {
					    if(json.status === 'success') {
						   window.location.reload();
					    } else {
						   alert('失败！');
					    }

				    }
			    }, 'json');
            }
        });
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
})(dcms, FE.dcms);