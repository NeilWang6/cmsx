/*
ͷ��ͨ��js
ҳ��ṹ�ο���ҳ
leijun.wul
2010.6.24
*/
(function() {

    var Ali = {
        isDebug: false, 				/*�Ƿ�������ģʽ*/
        memberId: '��ӭ��������Ͱ�', /*���ĵ�¼id*/
        isSigned: false				/*�Ƿ��ѵ�¼*/
    };
	/**
	 * requestM: ���������
	 */
    var requestM = {
        alitalkUrl:'http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js',
        isAlitalkLoad:false,
        isAlitalkLoad1:false
       
    };
    var earlyFunc = {
        /**
        * ��ȡcookie
        * @method getCookie
        */
        getCookie: function(name) {
            var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            return value ? unescape(value[1]) : '';
        }
    };

    /**
    * �����ڳ�ʼ��ʱ��Ҫִ�еľ�̬��������
    */
    var readyFunc = [

    /**
    * No.0
    * ��ʾҳ�涥���ĵ�¼��Ϣ
    * @method showTopLogin
    */
		function showTopLogin() {
			try{
				$('nosigned').getElementsByTagName('a')[0].href = 'http://exodus.1688.com/member/signin.htm?Done=' + location.href;	
			}catch(e){}
		    //$D.setStyle($('lead-loading'),'display','none');
		    if (FD.common.lastLoginId) {//���û�
		        Ali.memberId = FD.common.lastLoginId || '��ӭ��������Ͱ�';
		        if (earlyFunc.getCookie('__cn_logon__') && earlyFunc.getCookie('__cn_logon__') === 'true') {
		            $D.removeClass($('signed'), 'hide');
		            $D.addClass($('nosigned'), 'hide');
		            Ali.isSigned = true;
		        }
		    }

		    $('memberId2').innerHTML = '����, ' + Ali.memberId + '&nbsp;';
		    $('memberId1').innerHTML = '����, ' + Ali.memberId + '&nbsp;';
		},
		
    /**
    * No.1
    * ����Ч����ʼ��
    * @method initTrigger
    */
	
		function initTrigger() {
		    var timeInId, //������붨ʱ��
			timeOutId, 	//����Ƴ���ʱ��
			trigger=$D.getElementsByClassName('nav-trigger'); 		//��һ�δ�����box����
		    //�������
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //�������뿪����ʱ�����δִ�о�ȡ�������¼�
		        var self = this;
		        // �������ȥ��������ʱ
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');
					if(self.id == 'top-cxt'){
						//����ͨ��������ʼ������
						if(requestM.isAlitalkLoad1){
							return;
						}else{
									new FD.widget.Alitalk($$('a[alitalk]','top-cxt'));
								
						}
					}
		        }, 300);
		    });
		    // ����ƿ�
		    $E.on(trigger, 'mouseout', function(e) {
		        clearTimeout(timeInId); //�������������ʱ�����δִ�о�ȡ����ʾ�¼�
		        timeOutId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');//������д����������ʾ�¼��������������һ������ᴥ�������¼�
		        }, 300);
		    });
		}
	];

    //Dom��������Ϻ�ʼִ��
    $E.onDOMReady(function() {
        //��̬��������
        for (var i = 0, len = readyFunc.length; i < len; i++) {
            try {
                readyFunc[i]();
            } catch (e) {
                if (Ali.isDebug) {	//��firebug�µ���
                    console.info('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            };
        }
    });
})();
