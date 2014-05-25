/**
 * FD.widget.FlodList
 *
 * �۵�list
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://fd.aliued.cn/fdevlib/
 */

FD.widget.FoldList = function(container,config) {
	this._init(container,config);
}

FD.widget.FoldList.defConfig = {
	triggerClass:	'f-trigger', 	//�����className
	contentClass:	'f-content',	//չ��|�۵������ݵ�className
	expandClass: 	'f-expand',		//��չ��ʱ�����className
	collapseClass:	'f-collapse',	//���۵�ʱ�����className
	showType:		'block',		//չ��|�۵�������display���ԣ�Ĭ��Ϊblock��Ҳ������inline,table-cell������
	multiExpand: 	true  			// true:����ͬʱչ�����  false��ͬһʱ��ֻ����չ��һ��
}

FD.widget.FoldList.prototype = {
	_init: function(container,config){
		this.container = $(container);
		this.config = FD.common.applyIf(config || {}, FD.widget.FoldList.defConfig);
		//��ȡ���е�trigger
		this.triggers = $D.getElementsByClassName(this.config.triggerClass, '*', container);
		
		var _self = this;
		/*��Ӧ�۵�|չ���¼�*/
		$E.on(this.triggers, 'click', function(e) {
			if($E.getTarget(e) === this){
				_self[($D.hasClass(this, _self.config.collapseClass))? 'expand' : 'collapse'](this);	
			}
		});
	},

	/**
	 * չ������
	 * @method expand 
	 * @param {Object} trigger ��������Ķ���
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
	 * �۵�����
	 * @method collapse 
	 * @param {Object} trigger ��������Ķ���
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
	 * ȫ��չ��
	 * @method expandAll 
	 */	
	expandAll: function(){
		var _self = this;
		this.triggers.forEach(_self.expand, _self);
	},

	/**
	 * ȫ���۵�
	 * @method expandAll 
	 */	
	collapseAll: function(){
		var _self = this;
		this.triggers.forEach(_self.collapse, _self);
	},

	/**
	 * չ��ĳ���ƶ��Ĳ˵�
	 * @method getFlag 
	 * @param {String} flag ָ���˵���data-flag����
	 */		
	getFlag: function(flag){
		//�����۵����еĲ˵�
		var _self = this;
		this.triggers.forEach(_self.collapse, _self);
		//��ȡ��Ҫ�۵��Ķ���
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
