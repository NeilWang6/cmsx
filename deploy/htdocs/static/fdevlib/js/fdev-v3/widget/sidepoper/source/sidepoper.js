/**
 * FD.widget.SidePoper
 *
 * �߽縡����
 * ���ƣ�
 * 		1�������������viewport�߽總���ĸ�������ȥ
 * 		2���������js/core/fdev.js(������js/core/yui/animation.js)
 * 		3�����δ�ṩ��Ҫ��css���ã�������ʽ������Ҫ����css/widget/sidepoper.css�ļ�
 * ���÷�����
		FD.widget.SidePoper.init('SidePop-1','http://blog.1688.com/misc/pop/searchPop.html?keywords=mp3',{dockSide:0,baseline:1,bias:300,expandDir:0,initWidth:353,initHeight:280,remainArea:26});
		FD.widget.SidePoper.init('SidePop-2','<div>...</div>',{dockSide:0,baseline:1,bias:300,expandDir:0,initWidth:353,initHeight:280,remainArea:26});
 *
 *
 * @author 	balibell
 * @link    http://www.fdev-lib.cn/
 */

FD.widget.SidePop = function (id,cont,cfg){	
	this.init(id,cont,cfg);
}

/* Ĭ�ϲ������� */ 
FD.widget.SidePop.defConfig = {
	position : null,				/* �����λ�ã�Ĭ�� insertBefore �ķ�ʽ���뵽body ������ */
	originWidth : null,						/* ����������ȫ��� */
	originHeight : null,					/* ����������ȫ�߶� */
	initWidth : null,						/* ���������ʼ��� */
	initHeight : null,						/* ���������ʼ�߶� */
	remainArea : 32,						/* ����󣬱����������� */
	initTop : null,							/* �����ʼ��topֵ Ĭ��Ϊnullֵ����£����baseline==1 �򸡳�����ӵײ�����*/
	btnset : 3,								/* ���ù��ܰ�ť 0-�� 1-�йرչ��� 2-��չ����С���� 3-��ǰ����������*/
	scroll : 1,								/* �Ƿ������������  0-��   1 ����Ĺ�������  2 �����أ�������������ʾ*/
	hideTime : .2,							/* ��scroll ����Ϊ2 ʱ�����������ػ���ʾ�����Ĺ���ʱ�� */
	initExe : 0,							/* ��ʼ�����ִ�еķ��� 0-��ִ���κη��� 1-ִ��maxIt() 2-ִ��minIt() 3-ִ��close()*/
	exeDelay : 0,							/* ��ʼ�����ִ�еķ��� �ӳ�ִ�� msΪ��λ*/
	doAfterClose : null,					/* �رպ�ִ�� */
	dockSide : 1,							/* ͣ������ 0-���ͣ��  >1-�ұ�ͣ��*/
	departure : 0,							/* ƫ��ͣ���ߵľ��� ֵΪcenterʱ ����*/
	baseline : 0,							/* 0:�ϻ���-viewport�ϱ߽磻1:�»���-viewport�±߽磻2:�ϻ��ߣ�ԭλ�ö���֮�¿�ʼ������������3:�ϻ��ߣ�ԭλ�ö���֮�Ͽ�ʼ���������� */
	popregion : 300,
	isFixed : 0,							/* �Ƿ�ʹ��position:fixed ����*/
	bias :0,								/* ƫ����ߵľ��� ֵΪmiddleʱ ����*/	
	expandDir : 0,							/* չ������ 0-���� 1-����*/
	expandSpeed : 0.1,						/* չ������ȥ���ٶ� */
	floatSpeed : 0.2,						/* ����������ٶ� */
	defaultShell : 0,						/* 0-����� 1-ʹ��Ĭ�ϵ���� */
	shellBlank : 8,							/* ��defaultShell ��Чʱ���˲�����ʾ�������ݼ��չ�������ϵ����� */
	zIndex : 1000							/* ������zindex */
};


//SidePop�� purge �������ɸ��ݶ���id purge �����ȫ�� purge 
FD.widget.SidePop.purge = function (id){
	//ʵ���������purge ����
	var p = new FD.widget.SidePop('sidePop-purge','',{});
	var i = p.registry.length;
	while( i-- > 0 ){
		if(id && p.registry[i].obj.id == id ){ //�������id ���ҵ���Ӧ����
			p.registry[i].close(); //Ŀ�����ر�
			p.close();	//purge ����ر�
			
			p.registry.pop(); //����ע�����鵯�� purge ����
			p.registry[i] = p.registry[p.registry.length-1]; //Ŀ������û�������ע������β��
			p.registry.pop();//����Ŀ�����
			return;
		}else if(!id){
			p.registry[i].close(); //���û�д����ض�id��ѭ���ر����ж���
		}
	}	
	p.close();//purge ����ر�
	if( id && i == 0 ){					
		p.registry.pop(); //�д���id����δѰ����id��Ӧ�Ķ�����ִ�� ����ע�����鵯�� purge ����
	}else{
		p.registry = []; //δ����id����ն���ע�����顣 ����һ�������������id������Ѱ�ҵ�������֮�� return ��ȥ��
	}
}

FD.widget.SidePop.prototype = {
	registry : [],
	init: function (id,cont,cfg){
		this.config = FD.common.applyIf(cfg||{}, FD.widget.SidePop.defConfig);
		
		var _t = this,c = _t.config

		/*************************
		�������ַ�������
		*************************/
		var btns = ['none','none','none'];
		//����btnset ���ù�������ť
		if(c.btnset == 1){
			btns[2] = '';
		}else if(c.btnset == 2){
			btns[0] = '';
		}else if(c.btnset > 2){
			btns[2] = '';
			btns[0] = '';
		}
		//�����������ַ������ṩ�رա���С������ԭ���ܣ�������ʽ
		var strBar = ['<div id="',id,'-bar" class="f-sidebar"><a id="',id,'-min" class="f-sidemin" style="display:',btns[0],'" href="javascript:void(0)" target="_self"></a><a id="',id,'-res" class="f-sideres" style="display:',btns[1],'" href="javascript:void(0)" target="_self"></a><a id="',id,'-close" class="f-sideclose" style="display:',btns[2],'" href="javascript:void(0)" target="_self"></a></div>'].join('');
		/*************************/

		
		/*************************
		��������ڵ�
		*************************/
		//�������id�����ڣ��½�div��Ϊ�����������div����������id
		if(!(_t.obj = FYG(id))){
			//���δ���ó�ʼ���ߣ��ȣ���ȡֵ100
			c.initWidth = c.initWidth || 0;
			c.initHeight = c.initHeight || 0;
			c.originWidth = c.originWidth || c.initWidth;			
			c.originHeight = c.originHeight || c.initHeight;

			_t.obj = document.createElement('div');
			_t.obj.id = id;

			//ҳ����ض���  
			var pob = FYG(c.position) || document.body;
			if(!pob) return;
			pob.insertBefore(_t.obj,FYD.getFirstChild(pob));

			var d = c.defaultShell;
			var strShellTop = d ? '<div class="f-sidepop"><div class="tt f-sidepop-tt"><div class="ttl"></div><div class="ttr"></div><div class="ttc">'+d+'<p></p></div><div class="ttr"></div></div><div class="f-sidepop-cont"><div class="f-sidepop-contin">' : '';
			var strShellBot =  d ? '' : '</div></div></div>'

			var s = d ? c.expandDir == 0 ? [c.shellBlank,c.remainArea] : [c.remainArea,c.shellBlank] : [0,0];
			var cw = [];
			cw[0] = c.expandDir == 1 && d ? c.initWidth : c.originWidth;
			cw[1] = c.expandDir == 0 && d ? c.initHeight : c.originHeight; 

			//���������ַ��� strCont
			//���1������cont Ϊurl��ַ������ iframe ģʽ
			//���2������cont Ϊhtml���룬���÷� iframe ģʽ
			var strCont = cont.match(/^http:\/\//g) ?
				/*  iframe ģʽ*/['<iframe id="',id,'-cont" src="',cont,'" allowTransparency="true" frameborder="0" scrolling="no" width="',cw[0] - s[0],'" height="',cw[1]  - s[1],'" ></iframe>'].join('') : 
				/*��iframe ģʽ*/['<div id="',id,'-cont" style="width:',cw[0] - s[0],'px;height:',cw[1] - s[1],'px;">',cont,'</div>'].join('');
			
			//װ�����ݣ����������ַ��� + �����������ַ���
			_t.obj.innerHTML = [strShellTop,strCont,strShellBot,strBar].join('');			
		}else{
			if(YAHOO.lang.isString(cont) && cont && FYG(id+'-cont')){
				if(cont.match(/^http:\/\//g)){
					//iframe ģʽ
					FYG(id+'-cont').src = cont;  
				}else{
					//��ͨ����ģʽ
					FYG(id+'-cont').innerHTML = cont;
				}				
			}
		
			_t.obj.style.display = 'block';
			//���δ���ó�ʼ���ߣ��ȣ���ȡֵoffsetWidth��offsetHeight��
			var w =  parseInt(0 + FYD.getStyle(_t.obj,'borderLeftWidth')) + parseInt(0 + FYD.getStyle(_t.obj,'borderRightWidth'))
			c.initWidth = c.initWidth || _t.obj.offsetWidth - w;
			c.initHeight = c.initHeight || _t.obj.offsetHeight - w;

			c.originWidth = c.originWidth || c.initWidth;
			c.originHeight = c.originHeight || c.initHeight;
			//Ϊ�Ѵ��ڵĶ�����ӹ���������С������ԭ���رգ�
			var barobj = document.createElement('span');
			barobj.innerHTML = strBar;
			_t.obj.appendChild(barobj);
		}


		_t.expandObj = d ? FYG(id+'-cont') : _t.obj;
		/*************************/


		var o = _t.obj,os = o.style;
		
		/*************************
		���������������
		*************************/
		os.position = 'absolute';
		os.overflow = 'hidden';
		os.zIndex = c.zIndex;	
		os.width = c.initWidth + 'px';		
		os.height = c.initHeight + 'px';

			/**** config�������� ****/
			
		c.departure = c.departure == 'center' ? ( FYD.getViewportWidth() - o.offsetWidth )/2 : c.departure;
		c.bias = c.bias == 'middle' ? ( FYD.getViewportHeight() - o.offsetHeight )/2 : c.bias;		
		
		//������ԭʼ�� bias ����
		c.obias = c.bias; 
		if(YAHOO.env.ua.ie == 6 && c.baseline == 0 || YAHOO.env.ua.ie == 7 && c.baseline == 1 || YAHOO.env.ua.opera && c.baseline == 0){
			c.bias += 2
		}else if(YAHOO.env.ua.ie == 6 && c.baseline == 1 || YAHOO.env.ua.opera && c.baseline == 1){
			c.bias -= 2
		}
		os.left = c.dockSide ? 'auto' : c.departure + 'px';
		os.right = c.dockSide ? c.departure + 'px' : 'auto';
		/*************************/
		



		/*************************
		��������ť�¼���
		*************************/
		//�رհ�ť�¼���
		FYE.on(o.id+'-close','click',function (){
			_t.close();
			_t.doAfterClose();
			return false;
		});
		//��С����ť�¼���
		FYE.on(o.id+'-min','click',function (){
			_t.minIt();
			return false;
		});
		//�ָ���ť�¼���
		FYE.on(o.id+'-res','click',function (){
			_t.maxIt();
			return false;
		});
		/*************************/	



		/*************************
		�����������Ĳ����趨
		*************************/
		//���ó�ʼ״̬��top ֵ��֮ǰ�����ù� position:absolute;
		FYD.setStyle(o,'top',(c.initTop == null ? c.baseline == 0 ? 0 : FYD.getViewportHeight() + FYD.getDocumentScrollTop() : c.initTop) + 'px');

		_t.firstScroll = _t.lastScroll = -c.bias; //firstScroll lastScroll �� scrollWidth ������ʹ��
		if(c.baseline >= 2){//��� baseline == 2|3|4 �����������������ԭ��λ�õ��·�����ʼ��Ч����
			FYD.setStyle(o,'top',0);
			FYD.setStyle(o,'position','relative');
			//this is new
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				_t.firstLeftX = FYD.getX(o);
				var vhold = document.createElement('div');
				o.parentNode.insertBefore(vhold,o);
				vhold.appendChild(o);
				FYD.setStyle(vhold,'height',o.offsetHeight + 'px');
			}
			///////////////////
		}else if(c.baseline == 1){//��� baseline == 1 ����Ϊviewport �ײ�����ʱbias Ϊ����ײ��ĸ߶�
			_t.lastScroll = o.offsetHeight - FYD.getViewportHeight() -  FYD.getDocumentScrollTop();
			_t.firstScroll = _t.lastScroll - c.bias;
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				FYD.setStyle(o,'position','fixed');
				FYD.setStyle(o,'top','auto');
				FYD.setStyle(o,'bottom',c.bias + 'px');
			}
		}else if(c.baseline == 0){//��� baseline == 0 ����Ϊviewport ��������ʱbias Ϊ���붥���ĸ߶�
			if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
				FYD.setStyle(o,'position','fixed');
				FYD.setStyle(o,'top',c.bias + 'px');
				FYD.setStyle(o,'bottom','auto');
			}
		}
		_t.aTop =  FYD.getY(o);
		_t.abTop = _t.aTop;
		/*************************/		

		
		//timer������������С�����ָ�ԭ״������������
		_t.expandTimer = null;
		//timer���������ڹ������������������
		_t.scrollTimer = null;

		//this.expandObj ����ǰ�ߣ����ȣ�����ʾ����ȥ�����иı䣬�����߶�ʵʱ����һ��
		//��defaultShell ��Чʱ��this.expandObj ָ�����ݶ��󣬲��������		
		if(c.expandDir == 0){ //��ֱ����չ����£
			_t.size = d ? c.initHeight - c.remainArea : c.initHeight;
		}else if(c.expandDir == 1){//ˮƽ����չ����£		
			_t.size = d ? c.initWidth - c.remainArea : c.initWidth;
		}

		//����initExe����ִ����ط���
		if(c.initExe == 1){
			setTimeout(function (){
				_t.maxIt();
			},c.exeDelay)			
		}else if(c.initExe == 2){
			setTimeout(function (){
				_t.minIt();
			},c.exeDelay)				
		}else if(c.initExe == 3){
			setTimeout(function (){
				if(FYD.getStyle(o,'display') == 'none'){return}
				_t.close();
				_t.doAfterClose();
			},c.exeDelay)
		}

		//����scroll����ִ����ط���
		if(c.scroll){
			_t.scrollWith();		
		}

		_t.registry.push(_t) //���¶��� push �����ע�����飬��ע���¶���
	},
	/*
	���㵱ǰ�ľ�̬top ֵ
	*/
	getFinalTop : function (){
		var _t = this,c = _t.config,o = _t.obj;

		var a = c.baseline;
		var dscrtop = FYD.getDocumentScrollTop();
		var fall = o.offsetHeight - FYD.getViewportHeight();
		fall =  fall < 0 ? 0 : fall;
		if(a == 0){//baseline == 0 ��viewport ����Ϊ����
			return dscrtop + c.obias - fall;
		}else if(a == 1){//baseline == 1  ��viewport �ײ�Ϊ����
			return dscrtop + FYD.getViewportHeight() - o.offsetHeight - c.obias;
		}else if(a == 2){//baseline == 2 ���⴦�� ��viewport ����Ϊ���� ���·�
			var sb = dscrtop - _t.aTop + c.obias - fall;
			return sb > 0  ? sb : 0;
		}else if(a == 3){//baseline == 3 ���⴦�� ��viewport ����Ϊ���� ���Ϸ�
			var sb = dscrtop - _t.aTop + c.obias - fall;
			return sb < 0  ? sb : 0;
		}else if(a == 4){//baseline == 4 ���⴦�� ��viewport ����Ϊ���� ������
			var sb = dscrtop - _t.aTop + c.obias - fall;
			if(popregion > 0){
				return sb > 0 ? sb < popregion ? sb : popregion : 0;
			}else{
				return sb < 0 ? sb > popregion ? sb : popregion : 0;
			}
		}
	},
	/*
	����������֮ �رչ���
	*/
	close: function (){
		var _t = this,o = _t.obj;
		//�������timer
		clearTimeout(_t.expandTimer);
		clearInterval(_t.scrollTimer);		
		FYE.purgeElement(o.id+'-res')
		FYE.purgeElement(o.id+'-min')
		FYE.purgeElement(o.id+'-close')
		//��������Ϊ����
		FYD.setStyle(o,'display','none');

		var tmp;
		if(tmp=FYG(o.id+'-bar')){
			FYG(o.id+'-bar').parentNode.removeChild(tmp)
		}		
	},
	/*
	�رչ��ܸ������رպ�ִ��
	*/
	doAfterClose: function (){
		var _t = this,c = _t.config
		if(YAHOO.lang.isFunction(c.doAfterClose)){
			c.doAfterClose();
		}
	},
	/*
	����������֮ ��С������
	*/
	minIt: function (){
		var _t = this,c = _t.config,o = _t.obj;
//		if(FYU.Anim){
//			var an = c.expandDir ? new FYU.Anim(o,{
//				width : { from : _t.size , to : c.remainArea }
//			},2*c.expandSpeed) : new FYU.Anim(o,{
//				height : { from : _t.size , to : c.remainArea }
//			},2*c.expandSpeed)
//			an.animate();
//			an.onComplete.subscribe(function (){
//				//������С�����ָ��ȹ�������ť״̬
//				FYD.setStyle(o.id+'-min','display','none');
//				FYD.setStyle(o.id+'-res','display','block');
//			});
//			an.onTween.subscribe(function (){			
//				_t.size = c.expandDir ? parseInt(o.style.width) : parseInt(o.style.height);
//			});
//		}else{
			//��С�����̺������ݹ���������������������ݹ�
			(function _minIt(){	
				var theRemain = c.defaultShell ? 0 : c.remainArea;
				var condition = [_t.size <= theRemain];			

				//�������������ݹ飬����1������ǰ�߶�С�ڵ��ڶ���Ԥ���ߣ����ȣ�����ʾ����״̬��
				if(condition[0]){
					window.clearTimeout(_t.expandTimer);
					//������С�����ָ��ȹ�������ť״̬
					FYD.setStyle(o.id+'-min','display','none');
					FYD.setStyle(o.id+'-res','display','block');

					//innerCall(0);
					//�����ݹ�
					return;
				}
				//����ÿ��λʱ�����ƶ��ľ��룬��ֵ����α���ʳ��Զ���ǰ�߶�
				var len = c.expandSpeed * _t.size;
				len = len < 1 ? 1 : len;
				//����ǰ�߶���ֵ���㣬��������1����ֵ���ڶ���Ԥ���ߣ����ȣ�����������1����ֵ�Լ�len
				_t.size = _t.size - len <= theRemain ? theRemain : _t.size - len;
				

				//���ö���߶�
				if( c.expandDir ){					
					_t.expandObj.style.width = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.width = _t.size + c.remainArea + 'px'
					}
				}else{
					_t.expandObj.style.height = _t.size + 'px';	
					if( c.defaultShell ){						
						o.style.height = _t.size + c.remainArea + 'px'
					}
				}			
				
				//�ݹ��������
				_t.expandTimer = window.setTimeout(_minIt,10);
			})();
//		}
		
	},
	/*
	����������֮ ��ԭ����
	*/
	maxIt: function (){
		var _t = this,c = _t.config,o = _t.obj;
//		if(FYU.Anim){
//			var an = c.expandDir ? new FYU.Anim(o,{
//				width : { from : _t.size , to : c.originWidth }
//			},2*c.expandSpeed) : new FYU.Anim(o,{
//				height : { from : _t.size , to : c.originHeight }
//			},2*c.expandSpeed);
//			an.animate();
//			an.onComplete.subscribe(function (){
//				//������С�����ָ��ȹ�������ť״̬
//				FYD.setStyle(o.id+'-min','display','block');
//				FYD.setStyle(o.id+'-res','display','none');
//			});
//			an.onTween.subscribe(function (){
//				_t.size = c.expandDir ? parseInt(o.style.width) : parseInt(o.style.height);
//			});
//		}else{
			//��С�����̺������ݹ���������������������ݹ�
			(function _maxIt(){
				var theOrigin = c.expandDir ?  c.originWidth : c.originHeight;
				theOrigin -= c.defaultShell ? c.remainArea : 0; 
				var condition = [_t.size >= theOrigin]

				//�������������ݹ飬����1������ǰ�߶ȴ��ڵ��ڶ���ԭʼ�߶ȣ���ȫ��ʾ״̬��
				if(condition[0]){
					window.clearTimeout(_t.expandTimer);
					//������С�����ָ��ȹ�������ť״̬
					FYD.setStyle(o.id+'-min','display','block');
					FYD.setStyle(o.id+'-res','display','none');
//					FYD.setStyle(o,'visibility','hidden');
//					FYD.setStyle(o,'visibility','visible');					
					//�����ݹ�
					return;
				}
				//����ÿ��λʱ�����ƶ��ľ��룬��ֵ����α���ʳ��Զ���ԭʼ�߶ȣ�Ϊ����
				var len = c.expandSpeed * theOrigin;
				len = len < 1 ? 1 : len;

				_t.size = _t.size + len >= theOrigin ? theOrigin : _t.size + len;
				//���ö���߶�
				if( c.expandDir ){
					_t.expandObj.style.width = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.width = _t.size + c.remainArea + 'px'
					}
				}else{
					_t.expandObj.style.height = _t.size + 'px';
					if( c.defaultShell ){						
						o.style.height = _t.size + c.remainArea + 'px'
					}
				}

				//�ݹ��������
				_t.expandTimer = window.setTimeout(_maxIt,10);
			})();		
//		}		
	},
	/*
	������������������
	*/
	scrollWith : function(){
		var _t = this,c = _t.config,o = _t.obj;
		//this is new
		if(YAHOO.env.ua.ie != 6 && c.baseline < 2  && c.isFixed == 1){
			FYD.setStyle(o,'position','fixed');
			return;
		}

		if( c.scroll == 1 ){
			//////////////
			_t.scrollTimer = window.setInterval(function (){
				var dscrtop = FYD.getDocumentScrollTop();
				var dscrwitdh = FYD.getDocumentScrollLeft();
				var a = c.baseline;
				var perlen,perwidth;
				var lastpos = 0;
				var fall = o.offsetHeight - FYD.getViewportHeight();
				fall  = fall < 0 ? 0 : fall; 

				//���ֺ���λ�õ���ȷ��
				if(c.dockSide == 1){
					perwidth = FYD.getViewportWidth() - o.offsetWidth + dscrwitdh - c.departure;
					FYD.setStyle(o,'left',perwidth + 'px');
				}else if(c.dockSide == 0){
					perwidth = dscrwitdh + c.departure;
					FYD.setStyle(o,'left',perwidth + 'px');
				}
				////

				if(a == 0){//baseline == 0 ��viewport ����Ϊ����
					perlen = c.floatSpeed*(dscrtop - _t.lastScroll - _t.aTop - fall); 
				}else if(a == 1){//baseline == 1  ��viewport �ײ�Ϊ����
					perlen = c.floatSpeed*(- _t.lastScroll  + _t.firstScroll + FYD.getViewportHeight() + dscrtop - o.offsetHeight - _t.aTop ); 
				}else if(a == 2 || a == 3 ){//baseline == 2|3 ���⴦�� ��viewport ����Ϊ����
					//this is new
					var tmpsp = c.floatSpeed*(dscrtop - _t.aTop - _t.lastScroll - fall);
					var cdtion;
					if(a == 2){
						cdtion = dscrtop - _t.aTop > 0 || (FYD.getY(o)) > _t.aTop;
					}else if(a == 3){
						cdtion = dscrtop - _t.aTop < 0 || (FYD.getY(o)) < _t.aTop
					}
					
					if(cdtion){
						if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
							perlen = 0;
							FYD.setStyle(o,'position','fixed');
							FYD.setStyle(o,'left',_t.firstLeftX + 'px');
						}else{
							perlen = tmpsp;
						}
					}else{
						if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
							perlen = 0;
							FYD.setStyle(o,'position','relative');
							FYD.setStyle(o,'left',0);
						}else{
							perlen = 0;
						}
					}
					//////////////
				}else if(a == 4){
					//this is new
					var tmpsp = c.floatSpeed*(dscrtop - _t.abTop - _t.lastScroll - fall);

					if(YAHOO.env.ua.ie != 6 && c.isFixed == 1){
						perlen = 0;
						FYD.setStyle(o,'position','fixed');
						FYD.setStyle(o,'left',_t.firstLeftX + 'px');
					}else{
						perlen = tmpsp;
					}
					//////////////
				}

				if( perlen > -0.2 && perlen < 0.2 ){
					return
				}else{
					perlen = perlen>0 ? Math.ceil(perlen) : perlen=Math.floor(perlen)
				}
				
				o.style.top = parseInt(o.style.top) + perlen + "px";
				if( a == 2 && parseInt(o.style.top) <= 0 || a == 3 && parseInt(o.style.top) >=0 ){//baseline == 2|3 ���⴦�� ��viewport ����Ϊ����
					o.style.top = 0;
					_t.lastScroll = _t.firstScroll;
				}else if(a == 4){
					if(c.popregion > 0 && parseInt(o.style.top) <= 0 ){
						o.style.top = 0;
						_t.abTop = _t.aTop;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion > 0 && parseInt(o.style.top) >= c.popregion ){
						o.style.top = c.popregion + 'px';
						_t.abTop = _t.aTop + c.popregion;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion < 0 && parseInt(o.style.top) >= 0 ){
						o.style.top = 0;
						_t.abTop = _t.aTop;
						_t.lastScroll = _t.firstScroll;
					}else if(c.popregion < 0 && parseInt(o.style.top) <= c.popregion ){
						o.style.top = c.popregion + 'px';
						_t.abTop = _t.aTop + c.popregion;
						_t.lastScroll = _t.firstScroll;
					}else{
						_t.lastScroll += perlen;
					}
				}else{
					_t.lastScroll += perlen;
				}
				
			},10);
		}else if( c.scroll == 2 ){ // scroll Ϊ 2 ʱ
			//ע�⴫�ݵĲ��� FYD.getStyle(o,'visibility') �ѳ�ʼʱ��� visibility ���ݳ�ȥ
			FYE.addListener(window,'scroll',_t.scrollHandler,[FYD.getStyle(o,'visibility')],_t);
			o.style.top = _t.getFinalTop() + 'px';
		}
	},
	scrollHide : function (f){
		var _t = this,c = _t.config,o = _t.obj, f = f ? 1 : 0, vf = f ? 0 : 1;
		if(_t.ishiding) return;
		if(FYU.Anim){
			if(f)FYD.setStyle(o,'visibility', 'visible');
			_t.ishiding = 1;
			var aniHide = new FYU.Anim(o,{
				opacity : { to : f }
			},c.hideTime, YAHOO.util.Easing.easeIn);
			aniHide.animate();
			aniHide.onComplete.subscribe(function (){
				_t.ishiding = 0;
			});
		}else{
			FYD.setStyle(o,'visibility', f ? 'visible' : 'hidden');
		}
	},
	scrollHandler : function (e,vibi){
		var _t = this,c = _t.config,o = _t.obj;
		
		//��baseline Ϊ 2 ʱ���ж��Ƿ񵽴�ԭʼλ��
		var a = c.baseline;
		var dscrtop = FYD.getDocumentScrollTop();
		var fall = o.offsetHeight - FYD.getViewportHeight();
		fall =  fall < 0 ? 0 : fall;
		var cdt = dscrtop - _t.aTop + c.obias - fall < 0 ;
		
		window.clearTimeout(_t.scrollTimer);
		if( a == 2  && cdt || a == 3 && !cdt ){
			FYD.setStyle(o,'visibility',vibi); // baseline Ϊ 2 ����£��ص�ԭʼλ�ú������� visibility style ����ֵ
			return;
		}
		//���ض���
		_t.scrollHide();
		
		_t.scrollTimer = window.setTimeout(function (){
			o.style.top = _t.getFinalTop() + 'px';
			//��ʾ����
			_t.scrollHide(1);
		},500)

	}
}

/**
 * SidePoper �ķ�װ��������ͬ�� SidePop ����
 */
FD.widget.SidePoper = new function() {
	this.init = function(id,cont,cfg) {
		return new FD.widget.SidePop(id,cont,cfg);
	}	
}