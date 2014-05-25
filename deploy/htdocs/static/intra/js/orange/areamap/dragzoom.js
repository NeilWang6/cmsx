/*
 * @Author      changbin.wangcb
 * @Date        2014-02-19
 * @Description 拖拽拉伸组件
 */	

if (!FE || !FE.orange){
    jQuery.namespace('FE.orange');
}
(function($, Tools){
	"use strict";

	var defaults = {
			disable: false,
            doc: $(document)
		},
		win = $(window),
		doc = $(document),
		isMove = true,
		isZoom = true;

	function DragZoom(elem, options){
		if( !elem ){
			return;
		}

		return new DragZoom.prototype.init(elem, options);
	}

	DragZoom.prototype = {
		constructor: DragZoom,
		init: function(elem, options){
			this.elem = elem;
			this.config = $.extend(true, {}, defaults, options);
			this.render();
			this.bindEvent();
		},
		render: function(){
			var elem = this.elem;

			$('<span>', {
				class: 'lt zoom',
				css: {
					position        : 'absolute',
					top             : 0,
					left            : 0,
					width           : '5px',
					height          : '5px',
					backgroundColor : '#eb6100',
					cursor          : 'nw-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'ct zoom',
				css: {
					position  : 'absolute',
					top       : 0,
					left      : 5,
					right     : 5,
					height    : '4px',
					borderTop : '1px dashed #eb6100',
					cursor    : 'n-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'rt zoom',
				css: {
					position        : 'absolute',
					top             : 0,
					right           : 0,
					width           : '5px',
					height          : '5px',
					backgroundColor : '#eb6100',
					cursor          : 'ne-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'lb zoom',
				css: {
					position        : 'absolute',
					bottom          : 0,
					left            : 0,
					width           : '5px',
					height          : '5px',
					backgroundColor : '#eb6100',
					cursor          : 'ne-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'cb zoom',
				css: {
					position     : 'absolute',
					bottom       : 0,
					left         : 5,
					right        : 5,
					height       : '4px',
					borderBottom : '1px dashed #eb6100',
					cursor       : 'n-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'rb zoom',
				css: {
					position        : 'absolute',
					bottom          : 0,
					right           : 0,
					width           : '5px',
					height          : '5px',
					backgroundColor : '#eb6100',
					cursor          : 'nw-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'lc zoom',
				css: {
					position   : 'absolute',
					top        : 5,
					bottom     : 5,
					left       : 0,
					width      : '4px',
					borderLeft : '1px dashed #eb6100',
					cursor     : 'w-resize'
				}
			}).appendTo(elem);

			$('<span>', {
				class: 'rc zoom',
				css: {
					position    : 'absolute',
					top         : 5,
					bottom      : 5,
					right       : 0,
					width       : '4px',
					borderRight : '1px dashed #eb6100',
					cursor      : 'w-resize'
				}
			}).appendTo(elem);
		},
		bindEvent: function(){
			this.elem.on('mousedown.drag', $.proxy(drag, this));
			this.elem.on('mousedown.zoom', 'span.zoom', $.proxy(zoom, this));
		},
		disable: function(toggle){
			this.config.disable = toggle;
		}
	};

	DragZoom.prototype.init.prototype = DragZoom.prototype;

	// 拖拽
	function drag(e){
		var self = this,
			config = this.config,
			elem = this.elem,
			ops = elem.position(),
			isMove = false,
			diffX, diffY,
			cursor = elem.css('cursor'),
			container = config.container;

		e.preventDefault();

		if( config.disable ){ return; }

		if( elem.setCapture ){
			elem.on('losecapture', dragUp);
			elem[0].setCapture();
		}else if( window.captureEvents ){
			win.on('blur', dragUp);
		}

		diffX = e.pageX - ops.left;
		diffY = e.pageY - ops.top;

		this.config.doc.on('mousemove.drag', dragMove);
		this.config.doc.on('mouseup.drag', dragUp);

		function dragMove(e){
			var moveX = e.pageX - diffX,
				moveY = e.pageY - diffY,
				minX = 0, 
				minY = 0,
				maxX, maxY;

			if( (moveX !== 0 || moveY !== 0) && !isMove ){
				isMove = true;
				elem.css({
					position: 'absolute',
					cursor: 'move'
				});
				config.dragStart && config.dragStart.call(self);
			}

			if( container ){
				maxX = container.width() - elem.width();
				maxY = container.height() - elem.height();
			}else{
				maxX = this.config.doc.width() - elem.width();
				maxY = this.config.doc.height() - elem.height();
			}

			moveX = moveX < minX ? minX : moveX;
			moveY = moveY < minY ? minY : moveY;
			moveX = moveX > maxX ? maxX : moveX;
			moveY = moveY > maxY ? maxY : moveY;

			elem.css({
				top: moveY,
				left: moveX
			});

			config.dragMove && config.dragMove.call(self);
		}

		function dragUp(e){
            var doc = $(this);
            doc.off('mousemove.drag', dragMove);
			doc.off('mouseup.drag', dragUp);

			if( elem.releaseCapture ){
				elem.off('losecapture', dragUp);
				elem[0].releaseCapture();
			}

			if( window.releaseEvents ){
				win.off('blur', dragUp);
			}

			if( !isMove ){
				return;
			}

			elem.css('cursor', cursor);
			config.dragUp && config.dragUp.call(self);
		}
	}

	// 伸缩
	function zoom(e){
		var self = this,
			config = this.config,
			elem = $(e.target),
			ops = self.elem.position(),
			container = config.container,
			top = ops.top,
			left = ops.left,
			height = self.elem.height(),
			width = self.elem.width(),
			cWidth = container.width(),
			cHeight = container.height(),
			startX, startY;

		e.preventDefault();
		e.stopPropagation();

		if( config.disable ){ return; }

		if( elem.setCapture ){
			elem.on('losecapture', zoomUp);
			elem[0].setCapture();
		}else if( window.captureEvents ){
			win.on('blur', zoomUp);
		}

		startX = e.pageX;
		startY = e.pageY;

		this.config.doc.on('mousemove.zoom', zoomMove);
		this.config.doc.on('mouseup.zoom', zoomUp);

		function zoomMove(e){
			var moveX = e.pageX - startX,
				moveY = e.pageY - startY,
				minX = 0,
				minY = 0,
				maxX = 0, 
				maxY = 0,
				diffX = 0,
				diffY = 0;

			if( (moveX !== 0 || moveY !== 0) && !isZoom ){
				isZoom = true;
				config.zoomStart && config.zoomStart.call(self);
			}

			// 左上角拉伸
			if( elem.hasClass('lt') ){
				minX = -left;
				minY = -top;
				maxX = width - 6;
				maxY = height - 6;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;
				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.css({
					top: top + diffY,
					left: left + diffX
				}).height(height - diffY).width(width - diffX);
			}

			// 上面拉伸
			if( elem.hasClass('ct') ){
				minY = -top;
				maxY = height - 6;

				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.css('top', top + diffY).height(height - diffY);
			}

			// 右上角拉伸
			if( elem.hasClass('rt') ){
				minX = -width + 6;
				minY = -top;
				maxX = cWidth - width - left;
				maxY = height - 6;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;
				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.css({
					top: top + diffY
				}).height(height - diffY).width(width + diffX);
			}

			// 右侧拉伸
			if( elem.hasClass('rc') ){
				minX = -width + 6;
				maxX = cWidth - width - left;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;

				self.elem.width(width + diffX);
			}

			// 右下角拉伸
			if( elem.hasClass('rb') ){
				minX = -width + 6;
				maxX = cWidth - width - left;
				minY = -height + 6;
				maxY = cHeight - height - top;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;
				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.height(height + diffY).width(width + diffX);
			}

			// 下面拉伸
			if( elem.hasClass('cb') ){
				minY = -height + 6;
				maxY = cHeight - height - top;

				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.height(height + diffY);
			}

			// 左下角拉伸
			if( elem.hasClass('lb') ){
				minX = -left;
				maxX = width - 6;
				minY = -height + 6;
				maxY = cHeight - height - top;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;
				diffY = moveY > maxY ? maxY : moveY < minY ? minY : moveY;

				self.elem.css('left', left + diffX).height(height + diffY).width(width - diffX);
			}

			// 左侧拉伸
			if( elem.hasClass('lc') ){
				minX = -left;
				maxX = width - 6;

				diffX = moveX > maxX ? maxX : moveX < minX ? minX : moveX;

				self.elem.css('left', left + diffX).width(width - diffX);
			}

			config.zoomMove && config.zoomMove.call(self);
		}

		function zoomUp(){
			var doc = $(this);
            doc.off('mousemove.zoom', zoomMove);
			doc.off('mouseup.zoom', zoomUp);

			if( elem.releaseCapture ){
				elem.off('losecapture', zoomUp);
				elem[0].releaseCapture();
			}

			if( window.releaseEvents ){
				win.off('blur', zoomUp);
			}

			if( !isMove ){
				return;
			}

			config.zoomUp && config.zoomUp.call(self);
		}
	}

	Tools.DragZoom = DragZoom;
})(jQuery, FE.orange);