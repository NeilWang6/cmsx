/**
 * FD.widget.FlodList
 *
 * 折叠list
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://fd.aliued.cn/fdevlib/
 */

FD.widget.FoldList = function(container,config) {
	this._init(container,config);
}

FD.widget.FoldList.defConfig = {
	triggerClass:	'f-trigger', 	//触点的className
	contentClass:	'f-content',	//展开|折叠的内容的className
	expandClass: 	'f-expand',		//已展开时触点的className
	collapseClass:	'f-collapse',	//已折叠时触点的className
	showType:		'block',		//展开|折叠的内容display属性，默认为block，也可是是inline,table-cell等属性
	multiExpand: 	true  			// true:允许同时展开多个  false：同一时间只允许展开一个
}

FD.widget.FoldList.prototype = {
	_init: function(container,config){
		this.container = $(container);
		this.config = FD.common.applyIf(config || {}, FD.widget.FoldList.defConfig);
		//获取所有的trigger
		this.triggers = $D.getElementsByClassName(this.config.triggerClass, '*', container);
		
		var _self = this;
		/*响应折叠|展开事件*/
		$E.on(this.triggers, 'click', function(e) {
			if($E.getTarget(e) === this){
				_self[($D.hasClass(this, _self.config.collapseClass))? 'expand' : 'collapse'](this);	
			}
		});
	},

	/**
	 * 展开内容
	 * @method expand 
	 * @param {Object} trigger 点击触发的对象
	 */		
	expand: function(trigger){
		var _self = this;
		if (!_self.config.multiExpand && !arguments[1]) {
			this.triggers.filter(function(o) {
				var c = $D.getNextSibling(o);
				return !($D.hasClass(c, _self.config.contentClass) && $D.isAncestor(c, trigger));
			}).forEach(_self.collapse, _self);
		}
		$D.addClass(trigger, this.config.expandClass);
		$D.removeClass(trigger, this.config.collapseClass);
		var panel = $D.getNextSibling(trigger);
		if ($D.hasClass(panel, this.config.contentClass)) {
			$D.setStyle(panel, 'display', this.config.showType); 
		}
	},

	/**
	 * 折叠内容
	 * @method collapse 
	 * @param {Object} trigger 点击触发的对象
	 */
	collapse: function(trigger) {
		$D.addClass(trigger, this.config.collapseClass);
		$D.removeClass(trigger, this.config.expandClass);
		var panel = $D.getNextSibling(trigger);
		if ($D.hasClass(panel, this.config.contentClass)) {
			$D.setStyle(panel, 'display', 'none');
		}
	},
	
	/**
	 * 全部展开
	 * @method expandAll 
	 */	
	expandAll: function(){
		var _self = this;
		this.triggers.forEach(_self.expand, _self);
	},

	/**
	 * 全部折叠
	 * @method expandAll 
	 */	
	collapseAll: function(){
		var _self = this;
		this.triggers.forEach(_self.collapse, _self);
	},

	/**
	 * 展开某个制定的菜单
	 * @method getFlag 
	 * @param {String} flag 指定菜单的data-flag属性
	 */		
	getFlag: function(flag){
		//首先折叠所有的菜单
		var _self = this;
		this.triggers.forEach(_self.collapse, _self);
		//获取需要折叠的对象
		var flagtrigger = this.triggers.filter(function(o){
			return $D.getAttribute(o,'data-flag') === flag.toString();
		})[0];
		if(flagtrigger){
			do{
				this.expand(flagtrigger, true);
				flagtrigger = $D.getPreviousSibling($D.getAncestorByClassName(flagtrigger, this.config.contentClass));
			}while(flagtrigger && flagtrigger != this.container);
		}
	}
}
