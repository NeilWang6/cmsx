/**
 * Baseed on gears
 * @Author: Denis 2011.01.31
 * @update: Denis 2011.07.22	�Ż���JSONģ�������
 * @update: Denis 2011.11.18    �Ż��û�״̬��ȡ��ʽ
 * @update: Denis 2011.12.14    �ṩfigo���õ�ռλ
 * @update: Denis 2012.02.06    �Բ�֧��console����������ṩconsole.info��console.log�Ķ���
 * @update: Denis 2012.04.17    �ṩ��jasmine��֧��
 * @update: Denis 2012.06.08    �û�loginId��lastLoginId������UTF8����
 * @update: qijun.weiqj 2012.07.12 ���FU.getLastMemberId���������ڴ�cookieȡ��lastMemberId, 168�ֶ�last_mid
 * @update: hua.qiuh 2012.08.14 �ƹ���Ŀ��ӿ�վ��¼��Ϣͬ���ķ���
 * @update: Edgar 2013.05.26    ͬ���Ա���¼��Ϣʱ��дcookie last_mid
 */
(function($){
  if (window.FE && FE.sys) {
    return;
  }

  function getTestConfig(key) {
      return FE.test && FE.test[key];
  }

  $.namespace('FE.sys', 'FE.util.jasmine', 'FE.ui');
  
  var FU = FE.util, cookie = $.util.cookie, $support = $.support;
  //��ǰ��¼��ID
  FU.LoginId = function(){
    var loginId = cookie('__cn_logon_id__', {
      raw: true
    });
    return loginId && decodeURIComponent(loginId);
  };
  FU.loginId = FU.LoginId();
  //��ǰ�Ƿ��е�¼�û�
  FU.IsLogin = function(){
    return (FU.LoginId() ? true : false);
  };
  FU.isLogin = FU.IsLogin();
  //��һ�ε�¼��ID
  FU.LastLoginId = function(){
    var lastLoginId = cookie('__last_loginid__', {
      raw: true
    });
    return lastLoginId && decodeURIComponent(lastLoginId);
  };
  FU.lastLoginId = FU.LastLoginId();

  // ȡ����һ�ε�¼��memberId
  FU.getLastMemberId = function() {
    var lastMemberId = cookie('last_mid', {
      raw: true
    });
    return lastMemberId && decodeURIComponent(lastMemberId);
  };

  /**
   * �Ӱ��Ｏ�ŵĸ�����վͬ����¼��Ϣ
   * ��ͨ�ʺŵ�¼
   * @example FE.util.updateLoginInfo({ source: ['b2b', 'taobao'] })
   */
  FU.updateLoginInfo = function(config) {
      config = $.extend({ source: ['b2b', 'taobao']}, config);

      var dfd = new $.Deferred,
          sources = config.source,
          current = 0;

      tryFromSrc( sources[current] );

      function tryFromSrc( src ) {
          var handler = FU['updateLoginInfoFrom' + src.substr(0,1).toUpperCase() + src.substr(1)];

          if($.type(handler) === 'function') {
              $.when( handler(dfd) ).always(function(){
                  if( FU.IsLogin() ) {
                      dfd.resolve();
                  } else {
                      tryNextSource();
                  }
              });
          } else {
              $.log(src + ' is not a function');
              tryNextSource();
          }
      }

      function tryNextSource() {
          if(++current < sources.length) {
              tryFromSrc( sources[current] );
          } else {
              dfd.resolve();
          }
      }

      return dfd;
  };

  /**
   * �������Ŀǰû�����κ��жϲ���������
   * ���ܻᷢ��һ��jsonp����������ÿ����
   * ͬ�������涼���Ի�ȡ��B2B��¼���ʺš�
   */
  FU.updateLoginInfoFromB2b = function() {
      var dfd = new $.Deferred;
      dfd.resolve();
      return dfd.promise();
  };

  /**
   * ���Ա�ͬ����¼��Ϣ
   */
  FU.updateLoginInfoFromTaobao = function() {

      var dfd = new $.Deferred;

      FU.getLoginInfoFromTaobao().always(function(data){

          var name = data['__cn_logon_id__'],
            mid = data['__last_memberid__'];
            
          if(name){
              name = encodeURIComponent(name);

              /**
               * TODO: ��ܺ��Ĳ�Ӧ��������ĳһ��widget
               *       ��util-cookieǨ�Ƶ���ܺ����У�����ԭ��ֻ����$.util.cookie
               */
              $.use('util-cookie', function(){
                  var cfg = { raw: true };

                  if(/\balibaba\.com$/.test(location.hostname)) {
                      cfg.domain = 'alibaba.com';
                      cfg.path = '/';
                  }else if(/\b1688\.com$/.test(location.hostname)){
					  cfg.domain = '1688.com';
                      cfg.path = '/';
				  
				  }

                  $.util.cookie('__cn_logon_id__', name, cfg );
                  $.util.cookie('__last_loginid__', name, $.extend({expires:30}, cfg) );
                  $.util.cookie('__cn_logon__', true, cfg );
                  mid && $.util.cookie('last_mid', encodeURIComponent(mid), cfg );

                  FU.loginId = name;
                  FU.isLogin = true;

                  dfd.resolve( data );
              });

          } else {
              dfd.resolve( data );
          }

      });

      return dfd.promise();
  }

  FU.getLoginInfoFromTaobao = function() {
      var url = getTestConfig('style.logintaobao.sync.url') || 'http://b2bsync.taobao.com/tbc';
      return $.ajax({
          url: url,
          dataType: 'jsonp'
      }).promise();
  };

  /**
   * �ƹ���Ŀ���
   * ��Щid��ϵͳ�Զ����ɵ�
   */
  FU.isLoginIdAutoGen = function() {
      return /^b2b-.+/.test(FU.LoginId());
  };

  //��ת����
  /**
   * �¿����ڻ��ߵ�ǰ���ڴ�(Ĭ���¿�����),���IE��referrer��ʧ������
   * @param {String} url
   * @argument {String} �¿�����or��ǰ���� _self|_blank
   */
  FU.goTo = function(url, target){
    var SELF = '_self';
    target = target || SELF;
    if (!$.util.ua.ie) {
      return window.open(url, target);
    }
    var link = document.createElement('a'), body = document.body;
    link.setAttribute('href', url);
    link.setAttribute('target', target);
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    if (target !== SELF) {
      setTimeout(function(){
        try {
          body.removeChild(link);
        } catch (e) {
        }
      }, 200);
    }
    return;
  };
  
  /**
	* �жϵ�ǰҳ���Ƿ�Ϊ1688��
	* 
	*/
  
  FU.is1688 = function(){
	var hostname = window.location.hostname,
		reg = /\b1688\.com$/;
	
	return reg.test(hostname);
	
  };
  
  
  
  var FUJ = FU.jasmine, jasmineReady;
  $.extend(FUJ, {
    stack: [],
    add: function(specUrl){
      if (jasmineReady) {
        $.getScript(specUrl);
      } else {
        FUJ.stack.push(specUrl);
      }
    }
  });
  //�ж�������Ƿ�֧��JSON���Ӷ�ע��ģ��
  if ($support.JSON) {
    $.add('util-json');
  }
  //����console
  if (!window.console) {
    window.console = {};
    console.log = console.info = $.log;
  }
  
  $(function(){
    $.DEBUG = /debug=true/i.test(location.search);
    if ($.DEBUG) {
      $.use('util-debug');
    }
    //����Jasmine���Խű�
    $.JASMINE = /jasmine=true/i.test(location.search);
    if ($.JASMINE) {
      $.add('ext-jasmine-specs', {
        requires: ['ext-jasmine'],
        js: FUJ.stack
      });
      $.use('ext-jasmine-specs', function(){
        $.use('ext-jasmine-html, ext-jasmine-jquery', function(){
          FUJ.Env = jasmine.getEnv();
          var trivialReporter = new jasmine.TrivialReporter();
          
          FUJ.Env.addReporter(trivialReporter);
          FUJ.Env.specFilter = function(spec){
            return trivialReporter.specFilter(spec);
          };
          //$.jasmineEnv.execute();
          jasmineReady = true;
        });
      });
    }
  });
  //figo��̬������
  FE.test = {};
})(jQuery);
