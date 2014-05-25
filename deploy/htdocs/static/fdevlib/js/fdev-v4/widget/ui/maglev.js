/**
 * jQuery UI Maglev 1.0
 * 
 * by raywu 2012.10.24
 * Depends:
 *	jquery.ui.core.js
 * @update who date done
 */
('maglev' in jQuery.fn) ||
(function($, undefined){
    var ie6 = $.util.ua.ie6,win=$(window),dom=$(document);
    $.widget('ui.maglev', {
        options: {
			align:'left',//横向对齐方式，默认left，可选right
			valign:'top',//纵向对齐方式，默认top，可选bottom
			xOffset:0,//横向偏移
			yOffset:0,//纵向偏移
			yOffsetFixed:true,//纵向偏移时，若偏移距离+悬浮物件高度大于屏幕所示，则停留在反方向的边缘，保证其出现
			topLimitShow:null,//顶部行为，可选阈值为'top'(首屏消失),length(偏移距离，单位px),目标节点(selector、jQueryObject、element)
			bottomLimitShow:null,//底部行为，可选阈值为'bottom'(最后一屏消失),length(偏移距离，单位px),目标节点(selector、jQueryObject、element)
			isWing:false,//启动主体内容两翼悬浮
			isAlwaysShow:true,//屏幕可视区小于主体内容区+悬浮物件对称双倍宽度时，是否开启遮盖主体内容，默认开启遮盖
			contentWidth:990,//默认主体内容区域宽度，一般和栅格内容一栏宽度一致
			end:0
        },
        _create: function(){
			var self=this,
				o=self.options;
			self._setPosition();
			if(ie6){
				self._ie6Fixed();
			}
			if(o.isWing){
				self._wing();
			}
			if(o.isAlwaysShow){
				self._limitShow();
				win.scroll(function(){
					self._limitShow();
				});
				win.resize(function(){
					self._limitShow();
				});
			}else{
				self._isAlwaysShow();
			}
        },
		_isAlwaysShow: function(){
			var self=this;
			self._isAlwaysShowPositionFixed();
			win.scroll(function(){
				self._isAlwaysShowPositionFixed();
			});
			win.resize(function(){
				self._isAlwaysShowPositionFixed();
			});
		},
		_isAlwaysShowPositionFixed: function(){
			var self=this,
				el=self.element,
				o=self.options,
				sl=dom.scrollLeft(),
				ww=win.width(),
				ew=el.outerWidth(),
				cw=o.contentWidth;
			if(ww-cw>=2*(ew+o.xOffset)){
				self._limitShow();
			}else{
				self._hide();
			}			
		},
		_wing: function(){
			var self=this;
			self._wingPositionFixed();
			win.scroll(function(){
				self._wingPositionFixed();
			});
			win.resize(function(){
				self._wingPositionFixed();
			});
		},
		_wingPositionFixed: function(){
			var self=this,
				el=self.element,
				o=self.options,
				sl=dom.scrollLeft(),
				ww=win.width(),
				ew=el.outerWidth(),
				cw=o.contentWidth;
			if(o.align==='right'){
				if(ww>=cw+2*(ew+o.xOffset)){
					el.css('left',(ww+cw)/2+o.xOffset);
				}else if(ie6){
					el.css('left',ww-ew+sl);
				}else{
					el.css('left',ww-ew);
				}
				el.css('right','auto');
			}else{
				if(ww>=cw+2*(ew+o.xOffset)){
					el.css('left',(ww-cw)/2-ew-o.xOffset);
				}else if(ie6){
					el.css('left',sl);	
				}else{
					el.css('left',0);	
				}
			}
		},
		_ie6Fixed: function(){
			var self=this,
				el=self.element;
			el.css('position','absolute');	
			self._ie6PositionFixed();
			win.scroll(function(){
				self._ie6PositionFixed();
			});
			win.resize(function(){
				self._ie6PositionFixed();
			});
		},
		_ie6PositionFixed: function(){
			var self=this,
				el=self.element,
				o=self.options,
				st=dom.scrollTop(),
				wh=win.height(),
				eh=el.outerHeight(),
				sl=dom.scrollLeft(),
				ww=win.width(),
				ew=el.outerWidth();
			if(o.valign==='bottom'){
				if(!o.yOffsetFixed||wh>=eh+o.yOffset){
					el.css('top',wh-eh+st-o.yOffset);
				}else{
					el.css('top',st);
				}
				el.css('bottom','auto');
			}else{
				if(!o.yOffsetFixed||wh>=eh+o.yOffset){
					el.css('top',st+o.yOffset);
				}else{
					el.css('top',st+wh-eh);
				}
			}
			if(o.align==='right'){
				el.css('left',ww-ew+sl-o.xOffset);
				el.css('right','auto');
			}
			if(o.align==='left'){
				el.css('left',sl+o.xOffset);
			}
		},
		_setPosition: function(){
			var self=this,
				el=self.element,
				o=self.options,
				wh=win.height(),
				eh=el.outerHeight(),
				ww=win.width(),
				ew=el.outerWidth();
			el.css('position','fixed');
			if(o.align==='right'){
				el.css('right',o.xOffset);
				el.css('left','auto');
			}else{
				el.css('left',o.xOffset);
				el.css('right','auto');
			}
			if(o.valign==='bottom'){
				if(!o.yOffsetFixed||wh>=eh+o.yOffset){
					el.css('bottom',o.yOffset);
					el.css('top','auto');
				}else{
					el.css('top',0);
				}
			}else{
				if(!o.yOffsetFixed||wh>=eh+o.yOffset){
					el.css('top',o.yOffset);
					el.css('bottom','auto');
				}else{
					el.css('bottom',0);
				}
			}
		},
		_limitShow: function(){
			var self=this,
				isLimitShow=self._isLimitShow();
			if(!isLimitShow){
				self._show();
			}else{
				self._hide();	
			}
		},
		_isLimitShow: function(){
			var self=this,
				el=self.element,
				o=self.options,
				tl=$.type(o.topLimitShow),
				bl=$.type(o.bottomLimitShow),
				dh=dom.height(),
				st=dom.scrollTop(),
				wh=win.height(),
				eh=el.outerHeight();
			if(tl!=='null'){
				if(o.topLimitShow==='top'){
					if(st<=0){
						return true;
					}
				}else if(tl==='number'){
					if(st<=o.topLimitShow){
						return true;
					}
				}else if($(o.topLimitShow).length>0){
					if(st<=$(o.topLimitShow).offset().top){
						return true;	
					}
				}
			}
			if(bl!=='null'){
				if(o.bottomLimitShow==='bottom'){
					if(st+wh>=dh){
						return true;
					}
				}else if(bl==='number'){
					if(st+wh+o.bottomLimitShow>=dh){
						return true;
					}
				}else if($(o.bottomLimitShow).length>0){
					if(st+wh>=$(o.bottomLimitShow).offset().top){
						return true;	
					}
				}
			}
			return false;
		},
		_show : function(){
			var self=this,
				el=self.element,
				o=self.options;
			el.show();
		},
		_hide : function(){
			var self=this,
				el=self.element,
				o=self.options;
			el.hide();
		},
		end:0
    });
    $.add('ui-maglev');
})(jQuery);
