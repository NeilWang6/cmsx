/**
 * @author springyu
 */
;(function($, D) {
    var DataIntervention = D.Class();
    DataIntervention.fn.init = function() {
        this.dao = new D.DataInterDao();
    };
    DataIntervention.include({
        /**
         *输入用户提示，当前值发生改变时 元素增加border样式
         * @param {Object} $arg 当前元素
         */
        inputTip : function($arg) {
            var intValue = '', intOldValue = '', _value = $arg.val(), oldValue = $arg.data('oldvalue');

            if(isNaN(_value)) {
                if(!oldValue && _value.trim()) {
                    $arg.addClass('change');
                    $arg.addClass('update');
                    return;
                }
                if(_value && oldValue && _value.trim() !== oldValue.trim()) {
                    $arg.addClass('change');
                    $arg.addClass('update');
                } else {
                    $arg.removeClass('change');
                    $arg.removeClass('update');
                }
            } else {
                intValue = parseFloat(_value);
                intOldValue = parseFloat(oldValue);
                if(intValue !== intOldValue) {
                    $arg.addClass('change');
                    $arg.addClass('update');
                } else {
                    $arg.removeClass('change');
                    $arg.removeClass('update');
                }
            }
        },

        /**
         * 保存干预数据
         * @param {Object} $list
         */
        saveDataInter : function($list) {
            var params = 'blockDetailId=' + $('#blockDetailId').val(), self = this;
            $list.each(function(index, obj) {
                var _oKey = $('.key', $(obj)).serializeArray(), _oChange = $('.update', $(obj)).serializeArray();

                if(_oChange && _oChange.length > 0) {
                    params += '&offer=' + encodeURIComponent(JSON.stringify($.merge($.merge([], _oKey), _oChange)));
                }

            });
           //console.log(params);
            self.dao.saveDataInter(params);
        }
    });
    D.DataIntervention = DataIntervention;
})(dcms, FE.dcms);
