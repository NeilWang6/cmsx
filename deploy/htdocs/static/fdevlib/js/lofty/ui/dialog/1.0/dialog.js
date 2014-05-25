/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/dialog
 * @author wb_wanli.hewl
 * @date 20130813
 * */
 
define( 'lofty/ui/dialog/1.0/dialog', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget','lofty/ui/dragdrop/1.0/dragdrop','jquery'], function(Class, Widget, Dragdrop, $) {
    'use strict';

	 var Dialog = Class ( Widget, {
			options: {
				zindex:1688,
				isModal:false
			},
			
			_create:function (){
				var outerBox=this.get('el');

				//设置外框的默认属性
				outerBox.css({
					'position':'absolute',
					'z-index':this.get('zindex'),
					'display':'none'
				});
			},

			//锁屏
			modal:function(config){
				var maskConfig={//modal的默认属性
						maskColor:'#000',
						maskOpacity:"0.3",
						maskOutTime:0
					},
					maskElment=this.get('maskElment'),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style;

				//合并自定义配置和默认配置
				$.extend(true, maskConfig, config);
				//如果用于遮罩的元素不存在则创建该元素，并初始化其基本style属性；如果存在则使用已经存在的元素
				if(!maskElment){
			  		maskElment=$('<div></div>');
			  		maskElment.css({
			  			'position':'absolute',
			  			'top' : '0px',
			  			'left' : '0px',
			  			'display':'none'
			  		});
			  		//把创建出来的元素添加到body中
			  		maskElment.appendTo('body');

			  		//把当前为udefined的maskElment元素设置为刚创建出来的maskElment元素
			  		this.set('maskElment',maskElment);
		  		};
		  		//只有在屏幕未锁定的情况下才能锁定屏幕
		  		if(maskElment.is(":hidden")){
		  			//设置高
					maskElment.height($(document).height());
					maskElment.width($(document.body).outerWidth(true));
			  		//设置用户配置的属性
			  		maskElment.css({
				  			'z-index':this.get('zindex')-1,
				  			'background':maskConfig.maskColor,
				  			'display':'block'
				  		}).animate({
				  			opacity:maskConfig.maskOpacity
				  		},maskConfig.maskOutTime);
				}
				//处理ie6下遮罩无法遮盖选择框的bug
				//解决方案设置既然是锁屏状态，索性就让所有select元素不可见
				if(ie6){
					$('select').css({
						'visibility': 'hidden'
					});
				}

				//阻止默认事件
				maskElment.on('mousedown',_predf);
				maskElment.on('mouseup',_predf);
				maskElment.on('selectstart',_predf);
			},

			//解锁
			unModal:function(){

				var maskElment=this.get('maskElment'),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style;
				if(!!maskElment&&maskElment.is(":visible")){
					maskElment.hide(0);
					$(window).off('resize',this.resize);
				}

				//处理ie6下遮罩无法遮盖选择框的bug
				//解锁后设置还原selcet元素可见
				if(ie6){
					$('select').css({
						'visibility': 'visible'
					});
				}

				//解除阻止默认
				maskElment.off('mousedown',_predf);
				maskElment.off('mouseup',_predf);
				maskElment.off('selectstart',_predf);
			},

			//移除动态创建的元素
			remove:function(){

				var maskElment=this.get('maskElment'),
					outerBox=this.get('el');

				//移除遮罩
				if(!maskElment&&maskElment.is(":hidden")){
					maskElment.remove();
					this.set('maskElment',null);
				}

				if(!outerBox&&outerBox.is(":hidden")){
					outerBox.remove();
				}
			},

			show:function(contentObj){
				if(this.get("isShow")) return;
				var outerBox=this.get('el'),
					that=this,
					content=this.get("content"),
					ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style,
					timers=this.get('timers'),
					area=[],
					buttons=this.get('buttons');

				//注册buttons事件
				if(buttons!==undefined){
					(function(){
						for(var i=0 ;i<buttons.length;i++){
							(function(i){
								var button=buttons[i];
								outerBox.on(buttons[i].event,buttons[i].selector,function(event){
									_predf(event);
									button.callback.call(that,button.paramObj);
								});
							})(i)
						}
					})();
				}

				if(this.get('isModal')===true){
					this.modal(this.get('maskAttr'));
				}

				if(!content){
					outerBox.appendTo('body');

					if(contentObj!==undefined){
						if(contentObj.txt!==undefined){
							content=$(contentObj.txt);
						}else if(contentObj.selector!==undefined){
							content=$(contentObj.selector);
						}else{
							throw new Error("Dialog Show方法的参数传入不合法");
						}
					}else{
						throw new Error("Dialog Show方法的参数传入不合法");
					}

					content.show(0);

					if(ie6){//恶心的ie6,select下拉框的问题
						content.css({'position': 'relative','z-index': '2'});
						$("<iframe></iframe>").css({
							'position':'absolute',
							'top':'0px',
							'left':'0px',
							'z-index':'0',
							'border':'none'
						}).height(content.height()).width(content.width()).appendTo(outerBox);
					}
					this.set('content',content);
					outerBox.html(content);
				}
				
				outerBox.show(0);
				outerBox.height(content.height()).width(content.width());
				this.position();//设置dialog的位置
				if(this.get('isModal')===true){
					area=[	
						0,
						$(document.body).outerWidth(true)-outerBox.width()>0?$(document.body).outerWidth(true)-outerBox.width():0,
						0,
						$(document).height()-outerBox.height()>0?$(document).height()-outerBox.height():0
					]
				}
				//设置拖放
				if(this.get('dragAble')&&!this.get('dragObject')){
					this.set('dragObject',new Dragdrop({
							target:outerBox.eq(0)[0],
							bridgeSelector:this.get('dragSelector'),
							area:area
						}));
				}

				//注册timers回调
				if(timers!==undefined){
					(function(){
						for(var i=0 ;i<timers.length;i++){
							(function(i){
								var timer=timers[i];
								setTimeout(function(){
										timer.callback.call(that,timer.paramObj);
									},timer.time);
							})(i)
						}
					})();
				}

				//设置展示状态
				this.set("isShow",true)
			},

			hide:function(){
				if(!this.get("isShow")) return;
				var outerBox=this.get('el'),
				ie6=$.browser.msie && ($.browser.version == "6.0") && !$.support.style,
				buttons=this.get('buttons');

				outerBox.hide(0);
				this.unModal();
				this.set("isShow",false);

				//移出buttons事件
				if(buttons!==undefined){
					(function(){
						for(var i=0 ;i<buttons.length;i++){
							(function(i){
								var button=buttons[i];
								outerBox.off(buttons[i].event,buttons[i].selector);
							})(i)
						}
					})();
				}
			},

			position:function(config){
				var top=this.get('y'),
					left=this.get('x'),
					win=$(window),
					outerBox=this.get('el'),
					content=this.get('content'),
					centerTop=(win.height()-content.height())/2+win.scrollTop(),
					centerLeft=(win.width()-content.width())/2+win.scrollLeft();

				outerBox.height(content.height()).width(content.width()).css({'position':'absolute'});

				centerTop=centerTop>0?centerTop:0;
				centerLeft=centerLeft>0?centerLeft:0;

				if(!!config){
					top = (typeof config.y) != "undefined"?config.y:top;
					left = (typeof config.x) != "undefined"?config.x:left;
					this.set('y',top);
					this.set('x',left);
				};

				(typeof top) != "undefined"?
					outerBox.css({'top': top}):
					outerBox.css({'top': centerTop+'px'});
				(typeof left) != "undefined"?
					outerBox.css({'left': left}):
					outerBox.css({'left': centerLeft +'px'});
			},
			//组件默认事件
			events:{
			   'window':{
			   		'resize': 'resize'
				}
			},
		  	resize:function(e){

			   	var maskElment=this.get('maskElment'),
			   		outerBox=this.get('el');

				if(!!maskElment&&maskElment.is(":visible")){
					maskElment.height($(document).height());
					maskElment.width($(document).width());
					if(this.get('dragAble')&&this.get('dragObject')&&!this.get('x')&&!this.get('y')){
						this.get('dragObject').setArea(
							[	
								0,
								$(document).width()-outerBox.width()>0?$(document).width()-outerBox.width():0,
								0,
								$(document).height()-outerBox.height()>0?$(document).height()-outerBox.height():0
							]
						);
					}
				}
				
				if(outerBox.is(":visible")){
					this.position();
				}
			}
		  });

	 return Dialog;

	 //===================下面为内部私有方法=================//
	 //阻止默认行为
	 function _predf(e){
	  	e.preventDefault();
	 };
});
