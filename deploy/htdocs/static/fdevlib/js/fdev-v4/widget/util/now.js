/**
 * author shiwei.dengsw
 * date 2013-10-09
 * ȡ������ʱ����أ�ּ��ͳһά���������Ƶ��߼�
 */
;(function ($) {
  'use strict';

  $.namespace('jQuery.util.now');

  var API = 'http://wholesale.1688.com/json/get_server_time.jsx';

  $.util.now = {
    /**
     * ���첽��������ȡ��������ǰʱ��
     * @param {Function} callback(serverTimeMillis) �ɹ���ȡʱ���Ĺ��ص��ĺ���������������һ����
     * �� serverTimeMillis ������Number�ͣ��Ƿ�������ǰʱ��ĺ����ʾ��ʽ�������ȡʱ��ʧ�ܣ���
     * serverTimeMillis Ϊ null ��
     */
    now: function (callback) {
      $.ajax({
        url: API,
        dataType: 'jsonp'
      }).done(function (result) {
        var data;
        var time = null;
        if ( typeof result === 'object' && result && result.success === 'true' ) {
          data = result.data;
          time = +data.serverTimeMillis;
        }
        callback(time);
      }).fail(function () {
        callback(null);
      });
    },

    // ��¶һ��ֻ����api��ʵ��ַ���û����Ա�����������Ի�ʹ��
    getAPI: function () {
      return API;
    }

  };

  $.add('util-now');

})(jQuery);