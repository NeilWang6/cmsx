/**
 * FD.widget.Marquee
 * @link    http://fd.aliued.cn/fdevlib/
 */
 
FD.widget.Marquee = function(container,config){
	this._init(container,config);
}

/** 默认配置 **/
FD.widget.Marquee.defConfig = {
	isAutoPlay:	true,				// 是否自动进行滚动 
	timeDelay:	3,					// 自动滚动的时间间隔 
	speed:		0.5,				// 每次滚动的时间 
	liLength:	null,				// 每个li的宽度，一般不需要制定，在设置了margin的时候需指定 
	direction:	'left',				// 自动滚动方向 left,right,up,down
	preItem:	1,					// 每次滚动几个 
	loopType: 	'loop',				// 滚动循环方式，有loop、fill两种方式,默认为loop方式
	easing:		'easeInStrong',		// 滚动的动画方式(分easeInStrong:先快后慢,easeNone:匀速,easeOutStrong:先慢后快三种)
	scrollOffset: 0,                // 滚动的原始的左（上）scroll偏移量
	onNextEnd:  function(){},		//(不循环状态下)下一组滚动到底时执行的方法(宿主对象为当前的marquee实例)
	onPreEnd:	function(){},		//(不循环状态下)上一组滚动到底时执行的方法
	onNextRs:	function(){},		//(不循环状态下)下一组滚动重新有执行的方法
	onPreRs:	function(){}		//(不循环状态下)上一组滚动到底时执行的方法
}

FD.widget.Marquee.prototype = {
	_init: function(container,config){
		/** 参数获取 **/
		this.container = $(container);
		this.config = FD.common.applyIf(config || {}, FD.widget.Marquee.defConfig);
		this.isH = (this.config.direction == 'up' || this.config.direction == 'down') ? false : true; 	//判断是水平还是垂直方向
		
		/** 获取组件的相关容器信息 **/
		var scrollUl = $D.getFirstChild(this.container);  //获取ul列表(根据代码片段的要求，需要滚动的每个li必须属于container第一个子元素ul)
		if (scrollUl.tagName.toLowerCase() != 'ul') return; //确保ul是container的第一个子元素
		
		var scrollLi = FYD.getChildren(scrollUl),	// 获取需要滚动的li(ul列表的子li，不包含里面内嵌的li)
			scrollLen = scrollLi.length;
		var preLength = this.config.liLength || (this.isH ? scrollLi[0].offsetWidth : scrollLi[0].offsetHeight) ; 
		this.preDistance = preLength * (this.config.preItem > scrollLen ? this.config.preItem % scrollLen : this.config.preItem); //获取每次滚动的距离
		this.ulLength = preLength * scrollLen; //实际ul的长度
		/**以下确定滚动的动画方式 **/
		if(['easeInStrong','easeNone','easeOutStrong'].contains(this.config.easing)){
			var oe = this.config.easing;
			this.easing = $Y.Easing.oe;
		}else{
			this.easing = $Y.Easing.easeInStrong;
		}

		/*以下为开关检查*/
		this.isScrolling = false;  //是否在滚动过程中(滚动过程中出发上下按钮无效)
		this.nextButtonAble = true;	   //下一组按钮是否有效

		/**根据滚动的循环方式设定ul的长(高)度**/
		if(this.config.loopType == 'loop'){	//loop状态，复制ul保证无缝
			this.preButtonAble = true;	   //(循环状态)上一组按钮是否有效	
			scrollUl.innerHTML += scrollUl.innerHTML;
			$D.setStyle(scrollUl, this.isH ? 'width': 'height', this.ulLength*2+'px'); 	//高度*2
		}else{
			this.preButtonAble = false;	   //非循环状态，默认在滚动初始化操作前上一组按钮是否无效
			var showItemNum = Math.round(this.container[this.isH ? 'offsetWidth' : 'offsetHeight']/preLength );	//滚动时显示的item个数
			if(scrollLen % showItemNum){
				this.scrollAbleLen = this.ulLength+ (showItemNum-scrollLen % showItemNum)*preLength //可滚动的距离   
			}else{
				this.scrollAbleLen = (scrollLen - (scrollLen % showItemNum))* preLength; //可滚动的距离 
			}
			$D.setStyle(scrollUl, this.isH ? 'width': 'height', this.ulLength+ (showItemNum-scrollLen % showItemNum)*preLength +'px');
		}
        //解决FF等刷新以后，scrollLeft或者scrollTop没有重置的bug -- yongming.baoym@alibaba-inc.com & leijunwlj@alibaba-inc.com -- 20101223
        this.container[this.isH ? 'scrollLeft':'scrollTop'] = this.config.scrollOffset;
		/** 自动播放相关设置 **/
		if(this.config.isAutoPlay){
			this.autoDirection = ( this.config.direction == 'left' || this.config.direction == 'up') ? 'next' : 'pre';	//自动滚动的方向
			this._autoPlay();
			this._addMouseover(); //鼠标移入是暂停滚动，移出后重启滚动
		} 
	},

	/**
	 * 自动滚动事件
	 * @method _autoPlay
	 */		
	_autoPlay: function(){
		var _self = this;
		this.autoTimeId = setTimeout(function(){	//分配滚动的id
			_self._getItem(_self.autoDirection);
		},this.config.timeDelay*1000);
	},

	/**
	 * 鼠标移入移出事件
	 * @method _addMouseover
	 */	
	_addMouseover: function(){
		$E.on(this.container, 'mouseenter',function(){	//鼠标移动到滚动层,暂停滚动
			clearTimeout(this.autoTimeId);
		},this,true);
		$E.on(this.container, 'mouseleave',function(){	//鼠标移出滚动层，继续滚动
			this._autoPlay();
		},this,true);
	},
		
	/**
	 * 滚动函数
	 * @method _getItem
	 * @param {pre|next} direction 本次滚动的方向(上|下)
	 */
	_getItem:function(direction){
		if(this.isScrolling) return; 	//如果还在滚动过程中则退出不滚动
		this.isScrolling = true;	
		clearTimeout(this.autoTimeId);	//取消自动滚动
		
		
		var step = direction == 'next'  ?  this.preDistance : -this.preDistance;	//设定滚动距离(方向)
			
		/** 设定滚动对象 **/
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
		
		/** 循环状态时 **/
		if(this.config.loopType == 'loop'){
			/** 以下滚动开始前做的事情 **/
			myAnim.onStart.subscribe(function(){
				if( direction == 'pre' && _self.container[_self.isH ? 'scrollLeft':'scrollTop'] <= _self.preDistance){	
					_self.container[_self.isH ? 'scrollLeft':'scrollTop'] +=  _self.ulLength;//如果已经是顶部则把它定位到下一组复制li头，好进行回退操作(到底后继续滚动的状态)
				}
			});
			/** 以下滚动结束后做的事情 **/
			myAnim.onComplete.subscribe(function(){
				_self.isScrolling = false;	//将滚动标志设为false
				if( direction == 'next' &&  _self.container[_self.isH ? 'scrollLeft':'scrollTop'] >= _self.ulLength){
					_self.container[_self.isH ? 'scrollLeft':'scrollTop'] -=  _self.ulLength;
				}
				if( _self.config.isAutoPlay ) _self._autoPlay();	//原先就是自动滚动的恢复自动滚动
			});	
		}else{ //非循环状态
			myAnim.onComplete.subscribe(function(){
				_self.isScrolling = false;	//将滚动标志设为false
				var nowScroll = _self.container[_self.isH ? 'scrollLeft':'scrollTop'];
				/*以下进行临界判断,不循环状态下nowscroll不会为负*/
				if(direction == 'next'){
					if(!_self.preButtonAble){	//上一组激活
						_self.config.onPreRs.call(_self) 
						_self.preButtonAble = true;
					}
					if((nowScroll+step) >= _self.scrollAbleLen){ //下一组失效
						_self.config.onNextEnd.call(_self); 
						_self.nextButtonAble = false;
					}
				}else{
					if(!_self.nextButtonAble){	//下一组激活
						 _self.config.onNextRs.call(_self) 
						 _self.nextButtonAble = true;
					}
					if(nowScroll <= 0){	//上一组失效
						_self.config.onPreEnd.call(_self) ;
						_self.preButtonAble = false;
					}
				}
			});				
		}	
		myAnim.animate();	//开始滚动
	},
		
	/**
	 * 向前滚动
	 * @method getPre
	 */	
	getPre: function(){
		if(this.preButtonAble) this._getItem('pre');
	},

	/**
	 * 向后滚动
	 * @method getNext
	 */		
	getNext: function(){
		if(this.nextButtonAble) this._getItem('next');
	},

	/**
	 * 暂停滚动
	 * @method pause
	 */	
	pause: function(){
		clearTimeout(this.autoTimeId);
	},
		
	/**
	 * (重新)开始滚动
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
	 * 设定自动滚动的方向
	 * @method 	setAutoDirection
	 */	
	setAutoDirection: function(d){
		if(d == 'pre' || d == 'next') this.autoDirection = d;
	}
}

