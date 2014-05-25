/**
 * 淘宝 Session 保持组件
 * @author hua.qiuh
 * @version 1.0
 *
 */

/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * 云归项目发布后，B2B和淘宝会员系统已经打通
 * 淘宝、B2B用户都从淘宝登录，在两个网站只需要
 * 登录一次，即可实现两边都能登录。
 *
 * 但随之而来产生一个问题：当用户登录后，长时间
 * 在B2B活动而没有访问淘宝，会导致淘宝cookie过
 * 期，从而需要重新登录B2B（B2B后端应用会从淘宝
 * 取登录状态）和淘宝。
 *
 * 这个组件通过定期访问淘宝后端页面，延长淘宝的
 * cookie有效期
 *
 * 使用方式:
 *    
 *    jQuery.getScript('http://style.c.aliimg.com/sys/js/session-keeper/session-keeper.js');
 *
 */
define('sys/session-keeper/session-keeper-amd',['jquery','lofty/alicn/subcookie/1.0/subcookie'],function($,SC){
	var self;
	var main = {
		config: {
            target: 'http://tbskip.taobao.com/cbu.htm',
            interval: 45 * 60 //seconds
        },

        touch: function() {
            var subCookie = SC.get( 'touch_tb_at' ),
                lastTouchAt = new Date(Number(subCookie)),
                now = new Date;

            if(!subCookie || isExpired(lastTouchAt) ) {

                self._sendTouchRequest();
				SC.set('touch_tb_at', now.valueOf());
            }
        },

        _sendTouchRequest: function() {
            (new Image).src = this.config.target + '?' + (new Date).valueOf();
        },

        startTrigger: function() {
            self.stopTrigger();

            //检查间隔是 touch 有效间隔的 1/2
            //如果相等，由于setInterval的误差，容易引起误判
            self.interval = setInterval( self.touch, self.config.interval * 500 );

            self.touch();
        },

        stopTrigger: function() {
            var intv = self.interval;
            if(intv) {
                clearInterval( intv );
            }
        },

        init: function() {
            $(function(){
                if( !isAutoRunDisabled() ) {
                    self.startTrigger();
                }
            });
        }
	}
	function isExpired(last) {
        return (new Date).valueOf() > last.valueOf() + main.config.interval*1000;
    }

    function isAutoRunDisabled() {
        var autoStart = $('div.fd-session-keeper').data('auto-start');
        return /^false$/i.test(autoStart);
    }
	self = main;
	main.init();
	return null;
})