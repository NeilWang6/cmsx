(function($, D) {
    var readyFun = [
    function() {
        $('#gmtCreate').one('focus', function() {
            var self = $(this);
            $.use('ui-datepicker, util-date', function() {
                self.datepicker({
                    triggerType : 'focus',
                    select : function(e, ui) {
                        self.val(ui.date.format()).datepicker('hide');
                    }
                }).triggerHandler('focus');
            });
        });
    },
    function() {
        //全选
        $('#allId').bind('mousedown', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var that = this, $self = $(this);
            //console.log(that.checked);
            if(!that.checked) {
                $('.apply-id').each(function(index, obj) {
                    obj.checked = true;
                });
                that.checked = true;
            } else {
                $('.apply-id').each(function(index, obj) {
                    obj.checked = false;
                });
                that.checked = false;
            }
        });
        $('.apply-id').bind('mousedown', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var that = this;
            if (that.checked){
                that.checked = false;
            } else {
                that.checked = true;
            }
        });
        $('a.apply-pass').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), _id = $self.data('id');
            $.post(D.domain + '/admin/audit_apply_permission.html?_input_charset=UTF8', {
                'id' : _id
            }, function(json) {
                if(json) {
                    if(json.status === 'success') {
                        alert('保存成功！');
                        window.location.reload();
                    } else {
                        alert('提交失败！');
                    }

                }
            }, 'json');

        });
        $('#js-apply-check-btn').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var _id = '';
            $('.apply-id').each(function(index, obj) {
                var $self = $(this);
                if (obj.checked){
                    _id += $self.val() + ',';
                }
            });
            $.post(D.domain + '/admin/audit_apply_permission.html?_input_charset=UTF8', {
                'id' : _id
            }, function(json) {
                if(json) {
                    if(json.status === 'success') {
                        alert('保存成功！');
                        window.location.reload();
                    } else {
                        alert('提交失败！');
                    }

                }
            }, 'json');

        });
        $('a.apply-unpass').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), _id = $self.data('id'), $applyAudit = $('#apply_unaudit');
            $applyAudit.show();
            $applyAudit.data('id', _id);
            $('.dep-name').html($self.parent().parent().data('dep'));
            $applyAudit.offset({
                'top' : $self.offset().top,
                'left' : $self.offset().left
            });
        });
        $('#btn_close').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), $applyAudit = $('#apply_unaudit');
            $applyAudit.hide();
        });
        $('#btn_submit').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), $applyAudit = $('#apply_unaudit');
            var $remarks = $('#remarks'), _id = $applyAudit.data('id');
            if(!$remarks.val().trim()) {
                alert('请输入原因！');
                return;
            }
            $.post(D.domain + '/admin/un_audit_apply_permission.html?_input_charset=UTF8', {
                id : _id,
                remarks : $remarks.val()
            }, function(json) {
                if(json) {
                    if(json.status === 'success') {
                        alert('保存成功！');
                        $applyAudit.hide();
                        window.location.reload();
                    } else {
                        alert('提交失败！');
                    }

                }
            }, 'json');

        });
        $('a.view-remarks').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), $viewUnaudit = $('#view_apply_unaudit');
            $viewUnaudit.html($self.attr('title'));
            $viewUnaudit.show();
            $viewUnaudit.offset({
                'top' : $self.offset().top,
                'left' : $self.offset().left
            });
        });
        $('#js-dcmscontent').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#view_apply_unaudit').hide();
            $('#apply_unaudit').hide();
        });
    },
    function() {
        $('#js-apply-search-btn').bind('click', function(event) {
            $('#js-search-apply-form').submit();
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
