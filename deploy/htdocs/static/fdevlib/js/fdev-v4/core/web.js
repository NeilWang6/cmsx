/**
 * Baseed on gears
 * @Author: Denis 2011.01.31
 * @update: Denis 2011.07.22	优化对JSON模块的利用
 * @update: Denis 2011.11.18    优化用户状态获取方式
 * @update: Denis 2011.12.14    提供figo配置的占位
 * @update: Denis 2012.02.06    对不支持console的浏览器，提供console.info和console.log的定义
 * @update: Denis 2012.04.17    提供对jasmine的支持
 * @update: Denis 2012.06.08    用户loginId和lastLoginId都采用UTF8解码
 * @update: qijun.weiqj 2012.07.12 添加FU.getLastMemberId方法，用于从cookie取得lastMemberId, 168字段last_mid
 * @update: hua.qiuh 2012.08.14 云归项目添加跨站登录信息同步的方法
 * @update: Edgar 2013.05.26    同步淘宝登录信息时增写cookie last_mid
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
  //当前登录的ID
  FU.LoginId = function(){
    var loginId = cookie('__cn_logon_id__', {
      raw: true
    });
    return loginId && decodeURIComponent(loginId);
  };
  FU.loginId = FU.LoginId();
  //当前是否有登录用户
  FU.IsLogin = function(){
    return (FU.LoginId() ? true : false);
  };
  FU.isLogin = FU.IsLogin();
  //上一次登录的ID
  FU.LastLoginId = function(){
    var lastLoginId = cookie('__last_loginid__', {
      raw: true
    });
    return lastLoginId && decodeURIComponent(lastLoginId);
  };
  FU.lastLoginId = FU.LastLoginId();

  // 取得上一次登录的memberId
  FU.getLastMemberId = function() {
    var lastMemberId = cookie('last_mid', {
      raw: true
    });
    return lastMemberId && decodeURIComponent(lastMemberId);
  };

  /**
   * 从阿里集团的各个网站同步登录信息
   * 打通帐号登录
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
   * 这个方法目前没有做任何判断操作，将来
   * 可能会发起一个jsonp请求，这样在每个不
   * 同域名下面都可以获取在B2B登录的帐号。
   */
  FU.updateLoginInfoFromB2b = function() {
      var dfd = new $.Deferred;
      dfd.resolve();
      return dfd.promise();
  };

  /**
   * 从淘宝同步登录信息
   */
  FU.updateLoginInfoFromTaobao = function() {

      var dfd = new $.Deferred;

      FU.getLoginInfoFromTaobao().always(function(data){

          var name = data['__cn_logon_id__'],
            mid = data['__last_memberid__'];
            
          if(name){
              name = encodeURIComponent(name);

              /**
               * TODO: 框架核心不应该依赖于某一个widget
               *       将util-cookie迁移到框架核心中，代替原来只读的$.util.cookie
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
   * 云归项目添加
   * 有些id是系统自动生成的
   */
  FU.isLoginIdAutoGen = function() {
      return /^b2b-.+/.test(FU.LoginId());
  };

  //跳转函数
  /**
   * 新开窗口或者当前窗口打开(默认新开窗口),解决IE下referrer丢失的问题
   * @param {String} url
   * @argument {String} 新开窗口or当前窗口 _self|_blank
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
	* 判断当前页面是否为1688域
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
  //判断浏览器是否支持JSON，从而注册模块
  if ($support.JSON) {
    $.add('util-json');
  }
  //兼容console
  if (!window.console) {
    window.console = {};
    console.log = console.info = $.log;
  }
  
  $(function(){
    $.DEBUG = /debug=true/i.test(location.search);
    if ($.DEBUG) {
      $.use('util-debug');
    }
    //启用Jasmine测试脚本
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
  //figo动态配置项
  FE.test = {};
})(jQuery);
