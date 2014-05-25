/**********************************************************************************************************************/
/*                                                   Tips 推广组件                                                    */
/**********************************************************************************************************************/

('tip' in jQuery.fn) ||
(function($){
	
	$.widget('ui.tip',{
		options:{
			/* 当tip类型为气泡时的配置 */
			graveId: 'aissaSimpleTipsBox',  /* 预埋容器id -- */
			isRoundedCorner:true,           /* 是否圆角 --*/
			closeButton: false,             /* 是否有关闭按钮 */
			onCloseButtonClick:$.noop,      /* 当有关闭按钮时,点击关闭按钮时回调的业务的方法*/
			
			txt: 'Message',                 /* 提示文案 -- */
			local: 1,                       /* tips 浮动的相对位置 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom -- */
			arrow: 9,                       /* tips的arrow相对位置 0:null 1:top left 2:top right 3:bottom left 4:bottom right 5:left top 6:left bottom 7:right top 8:right bottom 9:default -- */
			width: 230,                     /* tips 宽度 -- */
			dLeft: 0,                       /* 向左微调坐标 -- */
			dTop: 0,                        /* 向上微调坐标 -- */
			isAnim: true,                   /* 动画弹动效果是否开启 -- */
			isHold: true,                   /* 鼠标经过时是否hold -- */
			tipsHold: true,                 /* 鼠标经过tips固定tips */
			keep: 200,                      /* 显示持续时间，单位毫秒 -- */
			isOnloadShow: false,            /* 页面onload时是否显示 -- */
			onloadHold: 5000,               /* onload时显示持续时间 -- */
			overflowChange: true,           /* 超出边框是否反向处理 -- */
			showListener: 'mouseenter',
			hideListener: 'mouseleave',
			classPrefix : ''
			
		},
		
		_create:function(){
			var t = this;
			t.s = t.options;
			/* 重置 */
			if(t.timeoutId)
			{
				clearTimeout(t.timeoutId);
			}
			t.timeoutId = null;
			t.arrow = 0;
			
		
			/* 判断id是否冲突 */
			if ($(t.s.graveId).length !== 0) {
				//alert('@err - settings.id: ' + t.s.graveId);
				return;
			}
			
			/* 判断组件应用的DOM是否存在 */
			if (!((this.element)[0])) 
			{
				return;
			}
			
			this._createBubbleTip();
			
			
		},
		_createBubbleTip:function(){

			var t = this, grave = null, box = null, html = [], doms = null;
			
			/* 获取组件应用的dom节点 */
			doms = t.element;

			/* 生成预埋容器 */
			grave = document.createElement('div');
			grave.id = t.s.graveId;
			$(grave).css('position', 'relative');
			$(grave).css('width', '0px');
			$(grave).css('height', '0px');
			$(grave).css('overflow', 'hidden');
			document.body.appendChild(grave);
			t.grave = grave;

			/* 生成tips box */
			box = document.createElement('div');
			$(box).addClass(t.widgetBaseClass);
			$(box).css('width', t.s.width + 'px');
			
			var topCorner = "",bottomCorner = "";
			/* 生成tips Dom结构 */
			if(t.s.isRoundedCorner)
			{
				topCorner = '<div class="' + t.widgetBaseClass + '-top"><div class="' + t.widgetBaseClass + '-top-1"></div><div class="' + t.widgetBaseClass + '-top-2"></div><div class="' + t.widgetBaseClass + '-top-3"></div></div>';
				bottomCorner = '<div class="' + t.widgetBaseClass + '-bottom"><div class="' + t.widgetBaseClass + '-bottom-3"></div><div class="' + t.widgetBaseClass + '-bottom-2"></div><div class="' + t.widgetBaseClass + '-bottom-1"></div></div>';
			}
			var closeButtonCls = "",closeButtonHtml = "";
			if(t.s.closeButton)
			{
				closeButtonCls = ' ' + t.widgetBaseClass + '-close ';
				closeButtonHtml = '<a href="#" target="_self" class="' + t.widgetBaseClass + '-closeButton"></a>';
			}
			html.push(topCorner);
			html.push('<div class="' + t.widgetBaseClass + '-center' + closeButtonCls + '">');
			html.push(closeButtonHtml);		
			html.push('<div class="' + t.widgetBaseClass + '-content">');
			html.push(t.s.txt);
			html.push('</div>');
			html.push('</div>');	
			html.push(bottomCorner);
			if (t.s.arrow != 0) {
				t.getArrowNumber(t.s.local);
				html.push('<div class="' + t.widgetBaseClass + '-arrow ' + t.widgetBaseClass + '-arrow-');
				html.push(t.arrowPosition); html.push('">');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-1"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-2"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-3"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-4"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-5"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-6"></i>');
				html.push('<i class="' + t.widgetBaseClass + '-arrow-7"></i>');
				html.push('</div>');
			}
			box.innerHTML = html.join('');

			grave.appendChild(box);
			if(t.s.isRoundedCorner)
			{
				$("#" + t.s.graveId + " ." + t.widgetBaseClass + " ." + t.widgetBaseClass + "-center").css({
					"border-top-width":"0",
					"border-bottom-width":"0"
				});
			
			}
			t.box = box;
			if (t.s.arrow != 0) {
				t.arrow = $("#" + t.s.graveId + " ." + t.widgetBaseClass + " ." + t.widgetBaseClass + "-arrow")[0];
			}

			t.ieBug();
			
			/* 获取box 高宽 */
			t.boxWidth = $(box).outerWidth() + (t.a >= 5 && t.a <= 8 ? 6 : 0);
			t.boxHeight = $(box).outerHeight() + (t.a >= 1 && t.a <= 4 ? 6 : 0);

			/* 添加显示事件 */
			$(doms).on(t.s.showListener,function(){
				t.show(this);
			})
			

			/* 添加隐藏事件 */
			$(doms).on(t.s.hideListener,function(){
				t.hide();
			})
	
			t.onloadShow(doms[0]);

			/* 对应 window resize 事件，重定坐标 */
			$(window).resize(function(){
				t.onloadShow(doms[0]);
			})

			/* 对应mouseenter tips 事件 */
			if (t.s.tipsHold) {
				$(box).on('mouseenter',function(){
					t.isTipsHold();
				})
				$(box).on(t.s.hideListener,function(){
					t.hide();
				})
			}
			
			if(t.s.closeButton)
			{
				$("#" + t.s.graveId + " ." + t.widgetBaseClass + " ." + t.widgetBaseClass + "-closeButton").click(function(){
					t.closeTips();
					t.s.onCloseButtonClick();
				});
			}
		},
		/**
		* 当箭头配置为默认时设置箭头方向
		* @param {int} local 浮动的相对位置
		* @return {null}
		* @author Aissa 2010-1-19
		*/
		getArrowNumber: function (local) {
			var t = this;

			t.a = t.s.arrow;
			if (t.s.arrow != 9) 
			{
				t.getarrowPositionByType();
				return;
			}
			
			switch (local) {
				case 1:
					t.a = 3;
					break;
				case 2:
					t.a = 4;
					break;
				case 3:
					t.a = 1;
					break;
				case 4:
					t.a = 2;
					break;
				case 5:
					t.a = 7;
					break;
				case 6:
					t.a = 8;
					break;
				case 7:
					t.a = 5;
					break;
				case 8:
					t.a = 6;
					break;
			}
			t.getarrowPositionByType();
		},
		getarrowPositionByType : function(arrowType){
			var t = this;
			switch (t.a) {
				case 1:
					t.arrowPosition = 't-l';
					break;
				case 2:
					t.arrowPosition = 't-r';
					break;
				case 3:
					t.arrowPosition = 'b-l';
					break;
				case 4:
					t.arrowPosition = 'b-r';
					break;
				case 5:
					t.arrowPosition = 'l-t';
					break;
				case 6:
					t.arrowPosition = 'l-b';
					break;
				case 7:
					t.arrowPosition = 'r-t';
					break;
				case 8:
					t.arrowPosition = 'r-b';
					break;
			}
		},
		/**
		* 页面加载时事件
		* @param {object} el 组件对应dom节点
		* @return {null}
		* @author Aissa 2010-1-13
		*/
		onloadShow: function (el) {
			var t = this;
			$(t.grave).css('position', 'relative');
			if (t.s.isOnloadShow) {
				t.show(el);
				t.holdTips(t.s.onloadHold);
			}
		},
		/**
		* 显示tips box
		* @param {object} el 组件对应dom节点
		* @return {null}
		* @author Aissa 2010-1-10
		*/
		show: function (el) {
			var t = this, l = 0;

			t.isTipsHold();
			$(t.grave).css('position', 'relative');
			l = t.s.local;

			t.setXY(el, l);

			/* 溢出反转 */
			if (t.s.overflowChange) {
				l = t.inversionIt(el, l);
			}

			if (t.animSto != null) clearTimeout(t.animSto);
			t.animSto = null;
			$(t.box).css('left', t.x + 'px');
			$(t.box).css('top', t.y + 'px');
			$(t.grave).css('position', 'static');

			if (t.s.isAnim) {
				t.count = 0;
				t.animTips(t.x, t.y, l);
			}
			if(t.s.isRoundedCorner)
			{
				if(t.a == 5 || t.a == 7)
				{
					$(t.arrow).css("top","9px");
				}
				else if(t.a == 6 || t.a == 8)
				{
					$(t.arrow).css("bottom","9px");
				}
			}
		},
		/**
		* 溢出反转  
		* @param {object} el 组件对应dom节点
		* @param {int} local 组件显示相对位置
		* @return {int} local 副本
		* @author Aissa 2010-1-27
		*/
		inversionIt: function (el, local) {
			var t = this, wW = 0, wH = 0, sW = 0, sH = 0, dX = 0, dY = 0, _x = 0, x_ = 0, _y = 0, y_ = 0, d = null, w = $(el).outerWidth(), h = $(el).outerHeight();

			d = document.documentElement;
			wW = d.clientWidth;
			wH = d.clientHeight;
			sW = $(document).scrollLeft();
			sH = $(document).scrollTop();

			dY = sH > t.y ? 1 : (sH + wH < t.y + h + t.boxHeight ? 2 : 0);
			dX = sW > t.x ? 6 : (sW + wW < t.x + w + t.boxWidth ? 3 : 0);

			_x = t.eX - sW;
			x_ = sW + wW - t.eX - w;
			_y = t.eY - sH;
			y_ = sH + wH - t.eY - h;

			if (t.s.local > 0 && t.s.local < 5) {
				if (dY == 1 && y_ > _y) {
					local = t.s.local == 1 ? 3 : (t.s.local == 2 ? 4 : local);
				} else if (dY == 2 && _y > y_) {
					local = t.s.local == 3 ? 1 : (t.s.local == 4 ? 2 : local);
				}
			} else if (t.s.local > 4 && t.s.local < 9) {
				if (dX == 6 && x_ > _x) {
					local = t.s.local == 5 ? 7 : (t.s.local == 6 ? 8 : local);
				} else if (dX == 3 && _x > x_) {
					local = t.s.local == 7 ? 5 : (t.s.local == 8 ? 6 : local);
				}
			}

			t.getArrowNumber(local);

			if (t.s.arrow != 0) {
				t.arrow.className = '' + t.widgetBaseClass + '-arrow ' + t.widgetBaseClass + '-arrow-' + t.arrowPosition;
			}

			t.ieBug();
			t.setXY(el, local);

			return local;
		},
		/**
		* ie 6, 7 bug
		* @return {null}
		* @author Aissa 2010-1-27
		*/
		ieBug: function () {
			var t = this;

			if (t.s.arrow != 0) {
				if ($.util.ua.ie6 && (t.a == 3 || t.a == 4)) {
					$(t.arrow).css('top', ($(t.box).outerHeight() - 1) + 'px');
				} else if ($.util.ua.ie6 == 6 && (t.a == 1 || t.a == 2)) {
					$(t.arrow).css('top', '-6px');
				} 
			}
		},
		/**
		* 设置显示坐标
		* @param {object} el 组件对应dom节点
		* @param {int} local box显示的相对位置
		* @return {null}
		* @author Aissa 2010-1-27
		*/
		setXY: function (el, local) {
			var t = this, eX = 0, eY = 0, x = 0, y = 0,cornerHeight = 0, w = $(el).outerWidth(), h = $(el).outerHeight();
			if(t.s.isRoundedCorner)
			{
				cornerHeight = 3;
			}
			/* 获取此节点坐标值 */
			t.eY = eY = $(el).offset().top;
			t.eX = eX = $(el).offset().left;

			switch (local) {
				case 1:
					x = eX;
					y = eY - t.boxHeight - 2;
					break;
				case 2:
					x = eX + w - t.boxWidth;
					y = eY - t.boxHeight - 2;
					break;
				case 3:
					x = eX;
					y = eY + h + 6;
					break;
				case 4:
					x = eX + w - t.boxWidth;
					y = eY + h + 6;
					break;
				case 5:
					x = eX - t.boxWidth - 2;
					y = eY - cornerHeight;
					break;
				case 6:
					x = eX - t.boxWidth - 2;
					y = eY + h - t.boxHeight + cornerHeight;
					break;
				case 7:
					x = eX + w + 6;
					y = eY - cornerHeight;
					break;
				case 8:
					x = eX + w + 6;
					y = eY + h - t.boxHeight + cornerHeight;
					break;
			}

			/* 绑定坐标偏差值 */
			x -= t.s.dLeft;
			y -= t.s.dTop;

			t.x = x;
			t.y = y;
		},
		/**
		* 显示tips box时简单弹动效果
		* @param {int} x 初始x轴坐标值
		* @param {int} y 初始y轴坐标值
		* @param {int} local 相对显示区域
		* @return {null}
		* @author Aissa 2010-1-10
		*/
		animTips: function (x, y, local) {
			var t = this;

			t.animSto = setTimeout(function () {
				switch (local) {
					case 1:
					case 2:
						y += t.count < 4 ? -1 : 1;
						$(t.box).css('top', y + 'px');
						break;
					case 3:
					case 4:
						y += t.count < 4 ? 1 : -1;
						$(t.box).css('top', y + 'px');
						break;
					case 5:
					case 6:
						x += t.count < 4 ? -1 : 1;
						$(t.box).css('left', x + 'px');
						break;
					case 7:
					case 8:
						x += t.count < 4 ? 1 : -1;
						$(t.box).css('left', x + 'px');
						break;
				}
				t.count++;
				if (t.count >= 8) return;
				t.animTips(x, y, local);
			}, 7);
		},
		/**
		* 隐藏tips box        
		* @return {null}
		* @author Aissa 2010-1-10
		*/
		hide: function () {
			var t = this;

			if (t.s.isHold) {
				t.holdTips(t.s.keep);
			} else {
				$(t.grave).css('position', 'relative');
			}

		},
		/**
		* 直接关闭tips box        
		* @return {null}
		* @author Aissa 2010-1-10
		*/
		closeTips: function () {
			$(this.grave).css('position', 'relative');
		},
		/**
		* 去除自动消失
		* @return {null}
		* @author Aissa 2010-1-28
		*/
		isTipsHold: function () {
			var t = this;
			if (t.sto != null) clearTimeout(t.sto);
			t.sto = null;
		},
		/**
		* hold tips box
		* @param {int} keep 持续时间 
		* @return {null}
		* @author Aissa 2010-1-10
		*/
		holdTips: function (keep) {
			var t = this;
			if (t.sto != null) clearTimeout(t.sto);
			t.sto = null;

			t.sto = setTimeout(function () {
				$(t.grave).css('position', 'relative');
			}, keep);
		}
	});
	$.add('ui-tip');
	$.add('fui-tip');
})(jQuery);