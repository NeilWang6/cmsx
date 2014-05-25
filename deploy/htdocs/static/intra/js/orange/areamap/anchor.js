/*
 * @Author      changbin.wangcb
 * @Date        2014-02-19
 * @Description 热区生成工具
 */

if (!FE || !FE.orange){
    jQuery.namespace('FE.orange');
}
(function($, Tools){
	"use strict";

		var	defaults = {
				disable: false,
                doc: $(document)
			},
			config   = {},
			anchor   = null,
			model    = [],
			zooms 	 = [],
			html     = '',
			win      = $(window),
			doc      = $(document),
			emptyArea= {
				title  : '',
				href   : '',
				target : '',
				width  : 0,
				height : 0,
				left   : 0,
				top    : 0
			};

	function Anchor(elem, options, data){
		if( !elem ){
			return;
		}

		if( $.type(options) === 'array' ){
			data = options;
			options = {};
		}

		config = $.extend(true, {}, defaults, options);

		// 单一模式
		if( anchor ){
			// 如果不是同一个容器，先清空数据再设置
			if( elem[0] !== anchor.elem[0] ){
				model.length = 0;
				zooms.length = 0;

				anchor.container.empty();
				anchor.elem = elem;
				anchor.pos();

				if( data ){
					anchor.setModel(data);
				}
			}

			return anchor;
		}else{
			anchor = new Anchor.prototype.init(elem);

			if( data ){
				anchor.setModel(data);
			}

			return anchor;
		}
	}

	Anchor.prototype = {
		constructor: Anchor,
		init: function(elem){
			this.elem = elem;
			this.render();
			this.pos();
			this.bindEvent();
		},
		render: function(){
			this.container = $('<div>', {
				class: 'anchor-editting-wrap',
				css: {
					position  : 'absolute',
					top       : 0,
					left      : 0,
					zIndex    : 1000
				}
			}).appendTo(config.doc.find('body'));

			this.setting = $('<div id="anchor-setting" class="dialog-basic ext-width">\
					            <div class="dialog-b">\
					                <header>\
					                    <a href="#" class="close">关闭</a>\
					                    <h5>属性设置</h5>\
					                </header>\
					                <section>\
					                    <style type="text/css">\
					                        #anchor-setting section {\
					                            padding: 15px;\
					                        }\
					                        #anchor-setting .item-form dt {\
					                            width: 120px;\
					                        }\
					                        #anchor-setting .item-form dd {\
					                            padding-left: 130px;\
					                        }\
					                    </style>\
					                    <div class="form-vertical">\
					                        <dl class="item-form">\
					                            <dt class="topic must-fill">设置链接：</dt>\
					                            <dd>\
					                                <input type="text" name="link-href" id="link-href" />\
					                            </dd>\
					                        </dl>\
					                        <dl class="item-form">\
					                            <dt class="topic must-fill">设置title：</dt>\
					                            <dd>\
					                                <input type="text" name="link-title" id="link-title" />\
					                            </dd>\
					                        </dl>\
					                        <dl class="item-form">\
					                            <dt class="topic must-fill">target属性：</dt>\
					                            <dd>\
					                                <select name="attr-select">\
					                                    <option value="-1" selected="">请选择</option>\
					                                    <option value="_blank">新窗口</option>\
					                                    <option value="_self">当前页</option>\
					                                </select>\
					                            </dd>\
					                        </dl>\
					                    </div>\
					                </section>\
					                <footer>\
					                    <button type="button" class="btn-basic btn-blue btn-submit">确 定</button>\
					                </footer>\
					            </div>\
					        </div>').appendTo($('body'));
		},
		// 定位
		pos: function(){
			var ofs = this.elem.offset();

			this.container.css({
				top    : ofs.top,
				left   : ofs.left,
				width  : this.elem.width(),
				height : this.elem.height()
			});
		},
		bindEvent: function(){
			var self = this,
				href = $('#link-href'),
				title = $('#link-title'),
				target = $('select[name=attr-select]', self.setting),
				settingIdx = 0;

			this.container.on('mousedown.paint', $.proxy(paint, this));

			// 关闭锚点
			this.container.on('click.delete', 'span.del', function(){
				var areas = $('a.area', this.container),
					that = $(this).closest('a.area'),
					idx = areas.index(that);

				that.remove();
				model.splice(idx, 1);
			});

			// 属性设置
			this.container.on('dblclick', 'a.area', function(e){
				var areas = $('a.area', self.container),
					that = $(this),
					item = null;
                
				e.preventDefault();
                
				settingIdx = areas.index(that);
				item = model[settingIdx];

				$.use('ui-dialog', function(){
				    self.setting.dialog({
				    	center: true,
				    	shim: true
				    });
                    
				    href.val($.util.escapeHTML(item.href));
				    title.val(item.title);
				    target.val(item.target);
				});
			});

			self.setting.on('click', 'header > a.close', function(e){
		    	e.preventDefault();

		    	self.setting.dialog('close');
		    }).on('click', 'footer button.btn-submit', function(e){
		    	var item = model[settingIdx],
		    		hrefVal = href.val().trim(),
		    		titleVal = title.val().trim(),
		    		targetVal = target.val();
		    		
		    	if( hrefVal !== '' ){
		    		item.href = $.util.unescapeHTML(hrefVal);
		    	}

		    	if( titleVal !== '' ){
		    		item.title = titleVal;
		    	}

		    	if( targetVal !== '-1' ){
		    		item.target = targetVal;
		    	}

		    	self.setting.dialog('close');
		    });
		},
		// disable or enable 同步锚点拖拽和拉伸的disable
		disable: function(toggle){
			config.disable = toggle;

			$.each(zooms, function(i, zoom){
				zoom.disable(toggle);
			});

			this.container.toggle(!toggle);
		},
		// 返回数据
		getModel: function(){
			var arr = model.concat();

			return arr;
		},
		// 根据数据，渲染锚点
		setModel: function(data){
			var i = 0, 
				len = data.length, 
				item = null,
				a = null;

			if( !len ){
				return;
			}

			for( ; i < len; i++){
				item = data[i];

				a = $('<a>', {
					class : 'area',
					css: {
						position   : 'absolute',
						left       : item.left,
						top        : item.top,
						width      : item.width,
						height     : item.height,
						boxSizing  : 'border-box',
						background : 'rgba(64, 131, 169, 0.3)'
					}
				}).appendTo(this.container);

				add(a, this.container, item);
			}
		}
	};

	Anchor.prototype.init.prototype = Anchor.prototype;

	// 锚点绘制
	function paint(e){
        var container = this.container,
			ops = container.offset(),
			isMove = false,
			posX, posY,
			startX, startY,
			item = null;

		e.preventDefault();

		if( e.which !== 1 || e.target !== container[0] ){
			return;
		}

		if( config.disable ){ return; }

		// 当浏览器失去焦点时触发mouseup事件
		if( container.setCapture ){
			container.on('losecapture', mouseup);
			container[0].setCapture();
		}else if( window.captureEvents ){
			win.on('blur', mouseup);
		}

		startX = e.pageX;
		startY = e.pageY;
		posX = startX - ops.left;
		posY = startY - ops.top;

		config.doc.on('mousemove.paint', mousemove);
		config.doc.on('mouseup.paint', mouseup);

		function mousemove(e){
            var moveX = e.pageX - startX,
				moveY = e.pageY - startY,
				MaxX = container.width(),
				MaxY = container.height(),
				left, top,
				width, height;

			// 当有拖拽距离时才绘制
			if( moveX !== 0 && moveY !== 0 ){
				isMove = true;

				left = moveX > 0 ? posX : e.pageX - ops.left;
				top = moveY > 0 ? posY : e.pageY - ops.top;
				
				left = left > 0 ? left : 0;
				top = top > 0 ? top : 0;

				if( left !== 0 ){
					width = Math.abs(moveX);
					width = left + width < MaxX ? width : MaxX - left;
				}

				if( top !== 0 ){
					height = Math.abs(moveY);
					height = top + height < MaxY ? height : MaxY - top;
				}

				if( item ){ 
					item.css({
						left   : left,
						top    : top,
						width  : width,
						height : height
					});
				}else{
					item = $('<a>', {
						class : 'area',
						css: {
							position   : 'absolute',
							left       : left,
							top        : top,
							width      : width,
							height     : height,
							boxSizing  : 'border-box',
							background : 'rgba(64, 131, 169, 0.3)'
						}
					}).appendTo(container);
				}
			}
		}

		function mouseup(e){
			config.doc.off('mousemove.paint', mousemove);
			config.doc.off('mouseup.paint', mouseup);

			if( container.releaseCapture ){
				container.off('losecapture', mouseup);
				container[0].releaseCapture();
			}

			if( window.releaseEvents ){
				win.off('blur', mouseup);
			}

			if( !isMove ){
				return;
			}

			if( item ){
				add(item, container);	
			}

			isMove = false;
			item = null;
		}
	}

	// 添加锚点，绑定dragzoom事件
	function add(item, container, data){
		var area = null,
			zoom = null;

		if( data ){
			area = $.extend(true, {}, emptyArea, data);
		}else{
			area = $.extend(true, {}, emptyArea, {
				top    : parseInt(item.css('top')),
				left   : parseInt(item.css('left')),
				width  : item.width()+'px',
				height : item.height()+'px'
			});
		}

		$('<span>', {
			class: 'del',
			css: {
				position   : 'absolute',
				right      : -18,
				top        : 0,
				width      : '14px',
				height     : '14px',
				border     : '2px solid #ec680c',
				cursor     : 'pointer',
				textAlign  : 'center',
				lineHeight : '14px',
				color      : '#ec680c'
			}
		}).text('X').appendTo(item);

		model.push(area);

		zoom = Tools.DragZoom(item, {
            doc: config.doc,
			container: container,
			dragStart: function(){

			},
			dragMove: function(){

			},
			dragUp: function(){
				area.top = parseInt(this.elem.css('top'));
				area.left = parseInt(this.elem.css('left'));
			},
			zoomStart: function(){

			},
			zoomMove: function(){

			},
			zoomUp: function(){
				area.top = parseInt(this.elem.css('top'));
				area.left = parseInt(this.elem.css('left'));
				area.width = parseInt(this.elem.width());
				area.height = parseInt(this.elem.height());
			}
		});

		zooms.push(zoom);
	}

	Tools.Anchor = Anchor;
})(jQuery, FE.orange);