/**
 * �Ա� Session �������
 * @author hua.qiuh
 * @version 1.0
 *
 */

/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * �ƹ���Ŀ������B2B���Ա���Աϵͳ�Ѿ���ͨ
 * �Ա���B2B�û������Ա���¼����������վֻ��Ҫ
 * ��¼һ�Σ�����ʵ�����߶��ܵ�¼��
 *
 * ����֮��������һ�����⣺���û���¼�󣬳�ʱ��
 * ��B2B���û�з����Ա����ᵼ���Ա�cookie��
 * �ڣ��Ӷ���Ҫ���µ�¼B2B��B2B���Ӧ�û���Ա�
 * ȡ��¼״̬�����Ա���
 *
 * ������ͨ�����ڷ����Ա����ҳ�棬�ӳ��Ա���
 * cookie��Ч��
 *
 * ʹ�÷�ʽ:
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

            //������� touch ��Ч����� 1/2
            //�����ȣ�����setInterval����������������
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