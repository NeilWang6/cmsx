/**
 * FD.widget.Marquee
 * @link    http://fd.aliued.cn/fdevlib/
 */
 
FD.widget.Marquee = function(container,config){
	this._init(container,config);
}

/** Ĭ������ **/
FD.widget.Marquee.defConfig = {
	isAutoPlay:	true,				// �Ƿ��Զ����й��� 
	timeDelay:	3,					// �Զ�������ʱ���� 
	speed:		0.5,				// ÿ�ι�����ʱ�� 
	liLength:	null,				// ÿ��li�Ŀ�ȣ�һ�㲻��Ҫ�ƶ�����������margin��ʱ����ָ�� 
	direction:	'left',				// �Զ��������� left,right,up,down
	preItem:	1,					// ÿ�ι������� 
	loopType: 	'loop',				// ����ѭ����ʽ����loop��fill���ַ�ʽ,Ĭ��Ϊloop��ʽ
	easing:		'easeInStrong',		// �����Ķ�����ʽ(��easeInStrong:�ȿ����,easeNone:����,easeOutStrong:�����������)
	scrollOffset: 0,                // ������ԭʼ�����ϣ�scrollƫ����
	onNextEnd:  function(){},		//(��ѭ��״̬��)��һ���������ʱִ�еķ���(��������Ϊ��ǰ��marqueeʵ��)
	onPreEnd:	function(){},		//(��ѭ��״̬��)��һ���������ʱִ�еķ���
	onNextRs:	function(){},		//(��ѭ��״̬��)��һ�����������ִ�еķ���
	onPreRs:	function(){}		//(��ѭ��״̬��)��һ���������ʱִ�еķ���
}

FD.widget.Marquee.prototype = {
	_init: function(container,config){
		/** ������ȡ **/
		this.container = $(container);
		this.config = FD.common.applyIf(config || {}, FD.widget.Marquee.defConfig);
		this.isH = (this.config.direction == 'up' || this.config.direction == 'down') ? false : true; 	//�ж���ˮƽ���Ǵ�ֱ����
		
		/** ��ȡ��������������Ϣ **/
		var scrollUl = $D.getFirstChild(this.container);  //��ȡul�б�(���ݴ���Ƭ�ε�Ҫ����Ҫ������ÿ��li��������container��һ����Ԫ��ul)
		if (scrollUl.tagName.toLowerCase() != 'ul') return; //ȷ��ul��container�ĵ�һ����Ԫ��
		
		var scrollLi = FYD.getChildren(scrollUl),	// ��ȡ��Ҫ������li(ul�б����li��������������Ƕ��li)
			scrollLen = scrollLi.length;
		var preLength = this.config.liLength || (this.isH ? scrollLi[0].offsetWidth : scrollLi[0].offsetHeight) ; 
		this.preDistance = preLength * (this.config.preItem > scrollLen ? this.config.preItem % scrollLen : this.config.preItem); //��ȡÿ�ι����ľ���
		this.ulLength = preLength * scrollLen; //ʵ��ul�ĳ���
		/**����ȷ�������Ķ�����ʽ **/
		if(['easeInStrong','easeNone','easeOutStrong'].contains(this.config.easing)){
			var oe = this.config.easing;
			this.easing = $Y.Easing.oe;
		}else{
			this.easing = $Y.Easing.easeInStrong;
		}

		/*����Ϊ���ؼ��*/
		this.isScrolling = false;  //�Ƿ��ڹ���������(���������г������°�ť��Ч)
		this.nextButtonAble = true;	   //��һ�鰴ť�Ƿ���Ч

		/**���ݹ�����ѭ����ʽ�趨ul�ĳ�(��)��**/
		if(this.config.loopType == 'loop'){	//loop״̬������ul��֤�޷�
			this.preButtonAble = true;	   //(ѭ��״̬)��һ�鰴ť�Ƿ���Ч	
			scrollUl.innerHTML += scrollUl.innerHTML;
			$D.setStyle(scrollUl, this.isH ? 'width': 'height', this.ulLength*2+'px'); 	//�߶�*2
		}else{
			this.preButtonAble = false;	   //��ѭ��״̬��Ĭ���ڹ�����ʼ������ǰ��һ�鰴ť�Ƿ���Ч
			var showItemNum = Math.round(this.container[this.isH ? 'offsetWidth' : 'offsetHeight']/preLength );	//����ʱ��ʾ��item����
			if(scrollLen % showItemNum){
				this.scrollAbleLen = this.ulLength+ (showItemNum-scrollLen % showItemNum)*preLength //�ɹ����ľ���   
			}else{
				this.scrollAbleLen = (scrollLen - (scrollLen % showItemNum))* preLength; //�ɹ����ľ��� 
			}
			$D.setStyle(scrollUl, this.isH ? 'width': 'height', this.ulLength+ (showItemNum-scrollLen % showItemNum)*preLength +'px');
		}
        //���FF��ˢ���Ժ�scrollLeft����scrollTopû�����õ�bug -- yongming.baoym@alibaba-inc.com & leijunwlj@alibaba-inc.com -- 20101223
        this.container[this.isH ? 'scrollLeft':'scrollTop'] = this.config.scrollOffset;
		/** �Զ������������ **/
		if(this.config.isAutoPlay){
			this.autoDirection = ( this.config.direction == 'left' || this.config.direction == 'up') ? 'next' : 'pre';	//�Զ������ķ���
			this._autoPlay();
			this._addMouseover(); //�����������ͣ�������Ƴ�����������
		} 
	},

	/**
	 * �Զ������¼�
	 * @method _autoPlay
	 */		
	_autoPlay: function(){
		var _self = this;
		this.autoTimeId = setTimeout(function(){	//���������id
			_self._getItem(_self.autoDirection);
		},this.config.timeDelay*1000);
	},

	/**
	 * ��������Ƴ��¼�
	 * @method _addMouseover
	 */	
	_addMouseover: function(){
		$E.on(this.container, 'mouseenter',function(){	//����ƶ���������,��ͣ����
			clearTimeout(this.autoTimeId);
		},this,true);
		$E.on(this.container, 'mouseleave',function(){	//����Ƴ������㣬��������
			this._autoPlay();
		},this,true);
	},
		
	/**
	 * ��������
	 * @method _getItem
	 * @param {pre|next} direction ���ι����ķ���(��|��)
	 */
	_getItem:function(direction){
		if(this.isScrolling) return; 	//������ڹ������������˳�������
		this.isScrolling = true;	
		clearTimeout(this.autoTimeId);	//ȡ���Զ�����
		
		
		var step = direction == 'next'  ?  this.preDistance : -this.preDistance;	//�趨��������(����)
			
		/** �趨�������� **/
		var _self = this;
		if(_self.isH){
			var scrollC = {scroll: { by: [ step, 0] }};
		}else{
			var scrollC = {scroll: { by: [ 0, step] }};
		}
		var myAnim = new $Y.Scroll(
			this.container, 
			scrollC, 
			this.config.speed, 
			this.easing
		);
		
		/** ѭ��״̬ʱ **/
		if(this.config.loopType == 'loop'){
			/** ���¹�����ʼǰ�������� **/
			myAnim.onStart.subscribe(function(){
				if( direction == 'pre' && _self.container[_self.isH ? 'scrollLeft':'scrollTop'] <= _self.preDistance){	
					_self.container[_self.isH ? 'scrollLeft':'scrollTop'] +=  _self.ulLength;//����Ѿ��Ƕ����������λ����һ�鸴��liͷ���ý��л��˲���(���׺����������״̬)
				}
			});
			/** ���¹����������������� **/
			myAnim.onComplete.subscribe(function(){
				_self.isScrolling = false;	//��������־��Ϊfalse
				if( direction == 'next' &&  _self.container[_self.isH ? 'scrollLeft':'scrollTop'] >= _self.ulLength){
					_self.container[_self.isH ? 'scrollLeft':'scrollTop'] -=  _self.ulLength;
				}
				if( _self.config.isAutoPlay ) _self._autoPlay();	//ԭ�Ⱦ����Զ������Ļָ��Զ�����
			});	
		}else{ //��ѭ��״̬
			myAnim.onComplete.subscribe(function(){
				_self.isScrolling = false;	//��������־��Ϊfalse
				var nowScroll = _self.container[_self.isH ? 'scrollLeft':'scrollTop'];
				/*���½����ٽ��ж�,��ѭ��״̬��nowscroll����Ϊ��*/
				if(direction == 'next'){
					if(!_self.preButtonAble){	//��һ�鼤��
						_self.config.onPreRs.call(_self) 
						_self.preButtonAble = true;
					}
					if((nowScroll+step) >= _self.scrollAbleLen){ //��һ��ʧЧ
						_self.config.onNextEnd.call(_self); 
						_self.nextButtonAble = false;
					}
				}else{
					if(!_self.nextButtonAble){	//��һ�鼤��
						 _self.config.onNextRs.call(_self) 
						 _self.nextButtonAble = true;
					}
					if(nowScroll <= 0){	//��һ��ʧЧ
						_self.config.onPreEnd.call(_self) ;
						_self.preButtonAble = false;
					}
				}
			});				
		}	
		myAnim.animate();	//��ʼ����
	},
		
	/**
	 * ��ǰ����
	 * @method getPre
	 */	
	getPre: function(){
		if(this.preButtonAble) this._getItem('pre');
	},

	/**
	 * ������
	 * @method getNext
	 */		
	getNext: function(){
		if(this.nextButtonAble) this._getItem('next');
	},

	/**
	 * ��ͣ����
	 * @method pause
	 */	
	pause: function(){
		clearTimeout(this.autoTimeId);
	},
		
	/**
	 * (����)��ʼ����
	 * @method start
	 */	
	start: function(){
		if(!this.config.isAutoPlay){
			this.config.isAutoPlay = true;
			this._addMouseover(); 
			if(!this.autoDirection) this.autoDirection = ( this.config.direction == 'left' || this.config.direction == 'up') ? 'next' : 'pre';
		}
		this._getItem(this.autoDirection);
	},
		
	/**
	 * �趨�Զ������ķ���
	 * @method 	setAutoDirection
	 */	
	setAutoDirection: function(d){
		if(d == 'pre' || d == 'next') this.autoDirection = d;
	}
}

