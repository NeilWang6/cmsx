/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

/**
 * @module lofty/ui/placeholder
 * @from modify from 928990115@qq.com
 * @author wb_sijun.lisj
 * @date 20130812
 * */
 
define( 'lofty/ui/placeholder/1.0/placeholder', ['lofty/lang/class', 'lofty/lang/base', 'jquery'], function(Class, Base, $) {
    'use strict';

	var Placeholder = Class(Base, {
		options: {
			shield: false, //shield设置为true，表示所有浏览器都使用该组件模拟；默认为false，只在不支持placeholder属性的浏览器中使用
			color: '#A9A9A9', //color用来设置中间层中的提示语字体颜色，默认为#A9A9A9
			zIndex: 2 //zIndex用来设置中间层垂直高度，默认为2
		},

		init: function(config) {
			Base.prototype.init.call(this, config || {});
			_initSetPos({
				elemArr: this.get('elemArr'),
				shield: this.get('shield'),
				color: this.get('color'),
				zIndex: this.get('zIndex')
			}, false);
		},
		reset: function(config) {
			var newConfig = $.extend({}, {
				elemArr: this.get('elemArr'),
				shield: this.get('shield'),
				color: this.get('color'),
				zIndex: this.get('zIndex')
			}, config);
			
			_initSetPos(newConfig, true);
		}
	});

	function _initSetPos(config, reset) {
		if (!config.shield) {
			var input = document.createElement('input');
			if ('placeholder' in input) return;
		}

		var _IE = (function(){
		    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		    while (
		        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		        all[0]
		    );
		    return v > 4 ? v : false ;
		}());

		for (var i=0, count=config.elemArr.length; i<count; i++) {
			var $e = $(config.elemArr[i]),
				nodeName = $e[0].nodeName.toLowerCase();

			if (!reset) {
				var placeholder = $e.attr('placeholder'),
					$tip = $('<div class="pld-tip">'+placeholder+'</div>');
			}
			else {
				$tip = $('.pld-tip').eq(i);
			}

			if (config.shield && !reset) {
				$e[0].removeAttribute('placeholder');
			}

			if($e.val() == '') {
				if (!reset) {
					document.body.appendChild($tip[0]);
				}

				var borderTop = parseInt($e.css('border-top-width')),
					borderRight = parseInt($e.css('border-right-width')),
					borderBottom = parseInt($e.css('border-bottom-width')),
					borderLeft = parseInt($e.css('border-left-width')),

					offset = $e[0].getBoundingClientRect(),
					top = offset.top+$(window).scrollTop(),
					left = offset.left+borderLeft+$(window).scrollLeft(),

					paddingTop = parseInt($e.css('padding-top')),
					paddingRight = parseInt($e.css('padding-right')),
					paddingBottom = parseInt($e.css('padding-bottom')),
					paddingLeft = parseInt($e.css('padding-left'))+2,

					width = $e.outerWidth()-paddingLeft-paddingRight-borderLeft-borderRight,
					height = $e.outerHeight()-paddingTop-paddingBottom,

					lineHeight = $e.css('line-height'),
					
					fontSize = $e.css('font-size'),
					fontFamily = $e.css('font-family'),
					overflowY = 'hidden';

				if (nodeName == 'textarea') {
					overflowY = 'auto';
					top += borderTop;
					height -= borderTop+borderBottom;
					lineHeight = 1.2;
				}

				if (nodeName == 'input') {
					lineHeight = height+'px';
				}

				left = (_IE==6 || _IE==7) ? left-2 : left;
				top = (_IE==6 || _IE==7) ? top-2 : top;

				$tip.css({
					'position': 'absolute',
					'top': top+'px',
					'left': left+'px',
					'padding-top': paddingTop+'px',
					'padding-right': paddingRight+'px',
					'padding-bottom': paddingBottom+'px',
					'padding-left': paddingLeft+'px',
					'width': width + 'px',
					'height': height + 'px',
					'line-height': lineHeight,
					'word-wrap': 'break-word',
					'overflow-x': 'hidden',
					'overflow-y': overflowY,
					'cursor': 'text',
					'color': config.color,
					'font-size': fontSize,
					'font-family': fontFamily,
					'z-index': config.zIndex
				}).attr('contenteditable', true);

				_initEvnt($tip, $e);
			}
			else {
				_setCursor($e[0], $e.val().length);
			}
		}
	}

	function _initEvnt($tip, $e) {
		$tip.on('focus', function() {
			if($e.val() == '') {
				_setCursor($e[0], 0);
			}
		});

		$e.on('keyup', function(e) {
			if($e.val() != '') {
				$tip.hide();
			}
			
			if(e.keyCode == 8){
				if($e.val() == '') {
					$tip.show();
				}
			}
		}).on('input', function(e) {
			if($e.val() != '') {
				$tip.hide();
			}
			else {
				$tip.show();
			}
		}).on('propertychange', function(e) {
			if($e.val() != '') {
				$tip.hide();
			}
			else {
				$tip.show();
			}
		});
	}

	function _setCursor(elem, pos) {
	    elem.focus();

	    if(elem.setSelectionRange) { //W3C
	        elem.setSelectionRange(pos, pos);
	    }
	　　else if(elem.createTextRange) { //IE
	        var range = elem.createTextRange();

	        range.moveStart('character', pos);
	        range.collapse(true);
	        range.select();
	    }  
	}
	
	return Placeholder;
});