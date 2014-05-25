/**
 * @author raywu
 * @userfor ��߹���
 * @date 2012.05.30
 */
;(function($, D, undefined){
    //Ĭ��������
    var defConfig = {
        dragEls: null,           //����ק��Ԫ�ؼ�
        axis: 'xy',           //Լ����ק�Ķ���ֻ����X���Y����ִ�У���ѡֵ��'xy','x','y��Ĭ��y
		originOpacity:1,	//��ֹ״̬��͸����
		moveOpacity:0.8,	//�ƶ������е�͸����
		xZone:'center',		//x����뷽ʽ,left,right,center��ѡ��Ĭ��center
		xOffset:0,	//x��ƫ�ƾ���
		yZone:'top',		//y����뷽ʽ,top,middle,bottom��ѡ��Ĭ��top
		yOffset:108,	//y��ƫ�ƾ���
		zIndex:3000,	//��߲������
		iFrameFix:false //�����iframeʱ���¼������쳣ʱ�ɿ�����������iframe����ʧЧ
    };
	function initRuler(el,config){
		config = $.extend({}, defConfig, config);
		//el������
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
	 * @methed _resize ������������£���߶�λ,ҳ����������λ��
	 */
	function _resize(el,config){
		$(window).bind('resize.ruler',function(){
			_setPosition(el,config);
		});
	};
	/**
	 * @methed _setPosition ��λ�������
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
	 * @methed _dragMove Ԫ����קʱ��
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
	 * @methed _arrowMove ���ݼ��̼�ͷ�����ƶ�
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