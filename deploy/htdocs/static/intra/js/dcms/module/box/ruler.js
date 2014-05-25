/**
 * @author raywu
 * @userfor 标尺功能
 * @date 2012.05.30
 */
;(function($, D, undefined){
    //默认配置项
    var defConfig = {
        dragEls: null,           //被拖拽的元素集
        axis: 'xy',           //约束拖拽的动作只能在X轴或Y轴上执行，可选值：'xy','x','y，默认y
		originOpacity:1,	//静止状态的透明度
		moveOpacity:0.8,	//移动过程中的透明度
		xZone:'center',		//x轴对齐方式,left,right,center可选，默认center
		xOffset:0,	//x轴偏移距离
		yZone:'top',		//y轴对齐方式,top,middle,bottom可选，默认top
		yOffset:108,	//y轴偏移距离
		zIndex:3000,	//标尺层叠属性
		iFrameFix:false //如果有iframe时，事件捕获异常时可开启，但部分iframe可能失效
    };
	function initRuler(el,config){
		config = $.extend({}, defConfig, config);
		//el不存在
		if (!el){return;}
		el.css('z-index',config.zIndex);
		el.css('opacity',config.originOpacity);
		
		switch(config.yZone){
			case 'bottom':
				el.css('bottom',config.yOffset);
				break;
			case 'middle':
				el.css('top',Math.round(($(window).height()+config.yOffset-el.outerHeight())/2));
				break;
			case 'top':
			default:
				el.css('top',config.yOffset);
				break;
		}
		_setPosition(el,config);
		_arrowMove(el,config);
		_dragMove(el,config);
		_resize(el,config);
		
	};
	/**
	 * @methed _resize 窗口缩放情况下，标尺定位,页面缩放重置位置
	 */
	function _resize(el,config){
		$(window).bind('resize.ruler',function(){
			_setPosition(el,config);
		});
	};
	/**
	 * @methed _setPosition 定位相关运算
	 */
	function _setPosition(el,config){
		switch(config.xZone){
			case 'right':
				el.css('right',config.xOffset);
				break;
			case 'left':
				el.css('left',config.xOffset);
				break;
			case 'center':
			default:
				el.css('left',Math.round(($(window).width()+config.xOffset-el.outerWidth())/2));
				break;
		}
	};
	/**
	 * @methed _dragMove 元素拖拽时间
	 */
    function _dragMove(el,config){
		$.use('ui-draggable', function(){
			el.draggable({
				axis:config.axis,
				opacity:config.moveOpacity
			});
		});
	};
	/**
	 * @methed _arrowMove 根据键盘箭头方向移动
	 */
	function _arrowMove(el,config){
		if(config.iFrameFix){
			$(document).find('iframe').each(function(index,node){
				var iFrame=$(this).get(0),
					f=iFrame.contentDocument || iFrame.contentWindow.document;
				$(f).ready(function(){
					_keyHandler(f,el,config);
				});
			});
		}
		_keyHandler(document,el,config);
	};
	function _keyHandler(target,el,config){
		$(target).keydown(function(e){
			_keydown(e,el,config);
		});
		$(target).keyup(function(e){
			_keyup(el,config);
		});
	};
	function _keydown(e,el,config){
		if(e.ctrlKey){
			e.preventDefault();
			el.css('opacity',config.moveOpacity);
			switch(e.which){
				case 38:
					el.css('top',el.position().top-1);
					break;
				case 40:
					el.css('top',el.position().top+1);
					break;
				case 39:
					el.css('left',el.position().left+1);
					break;
				case 37:
					el.css('left',el.position().left-1);
					break;
			}
		}
	};
	function _keyup(el,config){
		el.css('opacity',config.originOpacity);
	};
	function _destory(el){
		el.hide();
		$(window).unbind('resize.ruler');
	};
	function _show(el){
		el.show();
	};
	function _hide(el){
		el.hide();
	};
	D.Ruler = initRuler;
	D.Ruler.destory = _destory;
	D.Ruler.show = _show;
	D.Ruler.hide = _hide;
})(dcms, FE.dcms);