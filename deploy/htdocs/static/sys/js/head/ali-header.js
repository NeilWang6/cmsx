/*
ͷ��ͨ��js
ҳ��ṹ�ο���ҳ
xudan
2010.3.2
*/

(function() {

    var Ali = {
        isDebug: false, 				/*�Ƿ�������ģʽ*/
        memberId: '��ӭ��������Ͱ�', /*���ĵ�¼id*/
        isSigned: false				/*�Ƿ��ѵ�¼*/
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
		    //$D.setStyle($('lead-loading'),'display','none');
		    if (FD.common.lastLoginId) {    //���û�
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
    * ������ʼ��
    * @method initSearch
    */
		function initSearch() {
		    var tabList = $('search-nav').getElementsByTagName('a'),
                timer;

		    //tab�л�
		    $E.on(tabList, 'click', function(e) {
		        clearTimeout(timer);
		        $E.preventDefault(e);
		        $D.removeClass($D.getElementsByClassName('current', 'li', 'search-nav'), 'current');
		        $D.addClass(this.parentNode, 'current');
		        $D.removeClass($('search-input'), 'gray');
		        //form action����
		        switch (this.id.toString()) {
		            case 's-cp':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/offer_search.htm';
		                $D.setStyle($('search-history'), 'display', 'block');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		            case 's-gs':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/company_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'block');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		            case 's-syj':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/wiki_answer_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		            case 's-pf':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/business_search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		            case 's-qg':
		                document.forms['alisearch'].action = 'http://s.1688.com/search/search.htm';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		            case 's-xy':
		                document.forms['alisearch'].action = 'http://trust.china.alibaba.com/athena/trustsearch.html';
		                $D.setStyle($('search-history'), 'display', 'none');
		                $D.setStyle($('company-all'), 'display', 'none');
		                $('search-submit').innerHTML = '��һ��';
		                break;
		        }
		        $('search-input').focus();
		    });

		    //������focus����ʾ�İ���suggesttion
		    $E.on($('search-input'), 'focus', function() {
		        if (this.value == ''|| this.value == '�������Ʒ����' || this.value == '����������ؼ���' || this.value == '�������Ʒ��˾����' || this.value == '�����빫˾����') {
		            this.value = '';
		            $D.removeClass(this, 'gray');
		        }
		    });

		    //������blur����ʾ�İ�
		    $E.on($('search-input'), 'blur', function() {
		        if (this.value != '') return;
		        setInputTip();
		    });

		    //��������֤
		    $E.on(document.forms['alisearch'], 'submit', function(e) {
		        clearTimeout(timer);
		        var input = $('search-input');
		        var value = input.value;
                value = FD.common.trim(value);
		        if (value == '' || value == '�������Ʒ����' || value == '����������ؼ���' || value == '�������Ʒ��˾����' || value == '�����빫˾����') {
		            $E.preventDefault(e);
		            setInputTip();
		            $('search-submit').blur();
		            return false;
		        }
                input.value = value;
		    });
		    $('search-input').focus();

		    //��ʾ������ʾ�İ�
		    function setInputTip() {
		        var input = $('search-input'),
                    cur = $D.getElementsByClassName('current', 'li', 'search-nav')[0].getElementsByTagName('a')[0];
		        $D.addClass(input, 'gray');
                
                if (cur.id == 's-syj') {
		            timer = setTimeout(function() {
		                input.value = '����������ؼ���';
		            }, 100);
		        } else if (cur.id == 's-gs') {
		            timer = setTimeout(function() {
		                input.value = '�������Ʒ��˾����';
		            }, 100);
		        } else if (cur.id == 's-xy') {
		            timer = setTimeout(function() {
		                input.value = '�����빫˾����';
		            }, 100);
		        } else {
		            timer = setTimeout(function() {
		                input.value = '�������Ʒ����';
		            }, 100);
		        }
		    }
            
		},

    /**
    * No.2
    * ������¼��ȡ
    * @method initSearchHistory
    */
        function initSearchHistory() {
            if ($('search-history')) {
                var keyStr = unescape(earlyFunc.getCookie('h_keys'));
                if (keyStr != '') {
                    if (keyStr.length > 10) {
                        //���ȴ���
                        keyStr = keyStr.substring(0, 10);
                        keyStr = keyStr.substring(0, keyStr.lastIndexOf('#'));
                    }
                    var keyArray = keyStr.split('#');
                    var HTMLStr = '���������';
                    for (var i = 0, len = keyArray.length; i < len; i++) {
                        HTMLStr += '<a target="_blank" href="http://s.1688.com/selloffer/' + keyArray[i] + '.html">' + keyArray[i] + '</a> ';
                    }
                    $('search-history').innerHTML = HTMLStr;
                }
            }
        },

    /**
    * No.3
    * ����topnav��ʾ�����ص��л�
    * @method topToggle
    */
		function topToggle() {
		    var timeInId, //������붨ʱ��
			timeOutId, 	//����Ƴ���ʱ��
			trigger=$D.getElementsByClassName('top-trigger'); 		//��һ�δ�����box����
		    //�������
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //�������뿪����ʱ�����δִ�о�ȡ�������¼�
		        var self = this;
		        // �������ȥ��������ʱ
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');					
		        }, 300);
		    });
		    // ����ƿ�
		    $E.on(trigger, 'mouseout', function(e) {
		        clearTimeout(timeInId); //�������������ʱ�����δִ�о�ȡ����ʾ�¼�
		        timeOutId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');//������д����������ʾ�¼��������������һ������ᴥ�������¼�
		        }, 300);
		    });
		},

    /**
    * No.4
    * ҳ��jsЧ����ʼ��
    * @method intWidget
    */
         function intWidget() {
			// ���°�������ʼ��
			online=null;
			var alitalklist=FYS('[alitalk]');
			var alitalkobject = new FD.widget.Alitalk(alitalklist);
         },
		 
		 function intnavData(){
			var navList=FYG("nav-list");
			var temp="";
			try{
				for(i=0;i<navdata.length;i++){temp+=navdata[i].type;}
				for(i=0;i<navdata.length;i++){
					var pm = ['<li ','','><a ','title="','" href="','">','</a></li>'];
					if(i==temp.lastIndexOf(0)&&navdata[i].type==0){
						pm[1]=navdata[i].current?'class="current last"':'class="last"';
					}else if(navdata[i].type==0){
						pm[1]=navdata[i].current?'class="current"':'';
					}else if(navdata[i].type==1){
						pm[1]='class="rnav"';
					}
					switch(navdata[i].icon){
						case 0:
							break;
						case 1:
							pm[2]+='class="new-icon" ';
							break;
						case 2:
							pm[2]+='class="hot-icon" ';
							break;
						default:
							break;
					}
					pm[3]+=navdata[i].text;
					pm[4]+=navdata[i].link;
					pm[5]+=navdata[i].text;
					navList.innerHTML+=pm.join('');
				}
			}catch(e){}
			
			var timeInId, //������붨ʱ��
			timeOutId, 	//����Ƴ���ʱ��
			trigger=$D.getElementsByClassName('more-trigger'); 		//��һ�δ�����box����
		    //�������
		    $E.on(trigger, 'mouseover', function(e) {
		        clearTimeout(timeOutId); //�������뿪����ʱ�����δִ�о�ȡ�������¼�
		        var self = this;
		        // �������ȥ��������ʱ
		        timeInId = setTimeout(function() {
					$D.removeClass(trigger, 'cur');
					$D.addClass(self, 'cur');					
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
