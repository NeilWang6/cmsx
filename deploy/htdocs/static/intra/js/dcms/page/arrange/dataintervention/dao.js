/**
 * @author springyu
 */
;(function($, D) {
    var DataInterDao = D.Class();
    /**
     * ��ʼ������
     */
    DataInterDao.fn.init = function() {

    };
    DataInterDao.include({

        saveDataInter : function(params) {
            var len = arguments.length, callback = arguments[len - 1], self = this;

            $.post(D.domain + '/page/arrange/save_data_inter.html?_input_charset=UTF8', params, function(_data) {
                if(_data) {
                    var json = $.parseJSON(_data);
                    if(callback && typeof callback === 'function') {
                        callback.call(self, json);
                        return;
                    } else {
                        if(json.status === 'success') {
                            alert('����ɹ���');
                            return;
                        } else {
                            alert('����ʧ�ܣ�');
                            return;
                        }
                    }

                }
            });
        }
    });
    D.DataInterDao = DataInterDao;
})(dcms, FE.dcms);
