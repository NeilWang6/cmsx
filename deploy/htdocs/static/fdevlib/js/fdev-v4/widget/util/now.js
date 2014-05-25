/**
 * author shiwei.dengsw
 * date 2013-10-09
 * 取服务器时间相关，旨在统一维护管理类似的逻辑
 */
;(function ($) {
  'use strict';

  $.namespace('jQuery.util.now');

  var API = 'http://wholesale.1688.com/json/get_server_time.jsx';

  $.util.now = {
    /**
     * 【异步方法】获取服务器当前时间
     * @param {Function} callback(serverTimeMillis) 成功获取时间后的供回调的函数，函数仅接受一个参
     * 数 serverTimeMillis ，它是Number型，是服务器当前时间的毫秒表示形式，如果获取时间失败，则
     * serverTimeMillis 为 null 。
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

    // 暴露一个只读的api真实地址给用户，以备特殊情况个性化使用
    getAPI: function () {
      return API;
    }

  };

  $.add('util-now');

})(jQuery);