/**
 * FD.widget.Tab
 *
 * Tab�л���
 * ���ƣ�
 * 		1��Ҫ�󴥵�title������box���ֵ�˳�򱣳�һ��
 * 		2���������js/core/fdev.js
 * ���÷�����
 * 		����
 *		<div id="tab1">
 *			<ul class="clr">
 *				<li class="f-tab-t current">tab1</li>
 *				<li class="f-tab-t">tab2</li>
 *				<li class="f-tab-t">tab3</li>
 *				<li class="f-tab-t">tab4</li>
 *			</ul>
 *			<div class="f-tab-b">a</div>
 *			<div class="f-tab-b">b</div>
 *			<div class="f-tab-b">c</div>
 *			<div class="f-tab-b">d</div>
 *		</div>
 *		����
 *		<script type="text/javascript">
 *			FD.widget.Tab.init('tab1',{});
 *		</script>
 *
 * @author 	yaosl<happyyaosl@gmail.com>
 * @link    http://www.fdev-lib.cn/
 * 
 * ˵����hongss�������������ܣ�2011.01.06����
 * 	 1��lazy loading(������)
 * 	 2��callback (�ص�����)
 */

FD.widget.Tab = function(container,config){
	this.init(container,config);
}

/**
 * Ĭ������
 */
FD.widget.Tab.defConfig = {
	isAutoPlay: true,			/* �Ƿ��Զ������л� */
	timeDelay:	3,				/* �Զ��л���ʱ���� */
	eventType:  'mouse',		/* �л���ʱ�䴥������ mouse:onmouseover������click����������� */
	showType:	'block',		/* box��������ʾ���ͣ�block:��״Ԫ�ء�inline:����Ԫ��,����table-cell�������֧�ֵ�display���� */
	currentClass:	'current',	/* ��ǰtab�Ĵ�����ʽ */
	tabTitleClass:	'f-tab-t',	/* �����class�� */
	tabBoxClass:	'f-tab-b',	/* ����box��class */
	startItem:	0,				/* ���ó�ʼ��ʱ�ڼ�������Ϊ��ǰ״̬ */
	isLazy: false,              //33�ӣ�false����ʹ��lazy loading, true��ʹ��lazy loading�� Ĭ��false
	lazyImg: 'data-lazyimg',    //33�ӣ�lazy loading ʱ���õ���ר������
	callback: null              //33�ӣ��ص�����
}

FD.widget.Tab.prototype = {
	init: function(container,config){
		this.container = $(container);
		this.config = FD.common.applyIf(config||{}, FD.widget.Tab.defConfig);
		//��ȡtitle�б�
		this.tabTitles = FD.common.toArray($D.getElementsByClassName(this.config.tabTitleClass,'*',this.container));
		this.tabBoxs =  FD.common.toArray($D.getElementsByClassName(this.config.tabBoxClass,'*',this.container));
		//�������Ϊ0����title��box�����������ֱ���˳�
		if(this.tabTitles.length == 0 || this.tabTitles.length != this.tabBoxs.length) return;
		
		this.pause = false;
		this.delayTimeId = null;
		this.autoPlayTimeId = null;
		
		//��ʼ����һ����ʾ������
		$D.setStyle(this.tabBoxs,'display','none');
		$D.removeClass(this.tabTitles,this.config.currentClass);
		this.setTab(this.config.startItem,false);
		
		//box��������ƶ���ȥ����ͣ�任
		$E.on(this.tabBoxs, 'mouseover', function(){ this.pause = true; }, this, true);
		$E.on(this.tabBoxs, 'mouseout', function(){ this.pause = false; }, this, true);
		//title���㶯������
		if (this.config.eventType == 'mouse') {
			$E.on(this.tabTitles, 'mouseover' ,this.mouseHandler, this, true);
			$E.on(this.tabTitles, 'mouseout' ,function(){
				clearTimeout(this.delayTimeId);
				this.pause = false;
			}, this, true);
		}else{
			$E.on(this.tabTitles, 'click' ,this.clickHandler, this, true);
		}
		
		if(this.config.isAutoPlay) this.autoPlay();
		
	},

	/**
	 * ����¼�����
	 * @method clickHandler
	 * @param {Object} e Event ����
	 */		
	clickHandler: function(e){
		var t = this.getTabTitleTarget(e);
		var idx = this.tabTitles.indexOf(t);
		this.setTab(idx,'true');
	},
	
	/**
	 * ��������¼�����
	 * @method mouseHandler
	 * @param {Object} e Event ����
	 */
	 mouseHandler: function(e){
	 	var t = this.getTabTitleTarget(e);
	 	var idx = this.tabTitles.indexOf(t);
	 	var self = this;
	 	this.delayTimeId = setTimeout(function(){
	 		self.pause = true;
	 		self.setTab(idx,'true');
	 	},.1*1000)
	 },
     
     /**
	 * ��ȡtab�����¼�Ŀ��
	 * @method getTabTitleTarget
	 * @param {Object} e Event ����
	 */
	 getTabTitleTarget: function(e){
	 	var t = $E.getTarget(e);
	 	while (this.tabTitles.indexOf(t) == -1){
            t = t.parentNode;
        }
        return t;
	 },

	/**
	 * ��ʾָ����box����
	 * @method setTab
	 * @param {Object} n ��ţ�Ҳ���Ǵ�������ֵ
	 * @param {Object} flag ���flag=true�������û������ģ���֮��Ϊ�Զ�����
	 */	 
	 setTab: function(idx, flag){
		if (idx == this.curId) return;	//������ǵ�ǰ����ֱ���˳�
		var curId = this.curId >= 0 ? this.curId : 0;
		if (flag && this.autoPlayTimeId) clearTimeout(this.autoPlayTimeId);
		//ȡ��ԭ�ȵ�����
		$D.removeClass(this.tabTitles[curId],this.config.currentClass);
		$D.setStyle(this.tabBoxs[curId],'display','none');
		//�Ը�����idx���������
		$D.addClass(this.tabTitles[idx],this.config.currentClass);
		$D.setStyle(this.tabBoxs[idx],'display',this.config.showType);
		this.curId = idx;
		
		if (flag && this.config.isAutoPlay)	this.autoPlay();
		
		if (this.config.isLazy===true) {     //hongss�ӣ�lazy loading
			this._imgLoad(this.tabBoxs[idx]); 
		}
		
		if (this.config.callback !== null) {   //hongss�ӣ� callback
			this.config.callback.call(this, idx, this.tabTitles[idx], this.tabBoxs[idx]);  //��������������idx, title EL, box EL
		}
	},
		
	/**
	 * �Զ�����
	 * @method autoPlay
	 */		
	autoPlay: function(){
		var curId = this.curId >= 0 ? this.curId : 0;
		var self = this;
		this.autoPlayTimeId = setTimeout(function(){
			if ( !self.pause ) {
				var n = curId + 1;
				if( n == self.tabTitles.length ) n=0;		
				self.setTab(n, false);
			}
			self.autoPlay();		
		}, this.config.timeDelay * 1000);
	},
	/**
	 * lazy loading - img load
	 * @method _imgLoad
	 * add by hongss on 2011.01.06
	 */	
	_imgLoad: function(box) {
		var imgs = $$('img['+this.config.lazyImg+']', box);
		if (imgs!==[]) {
			for (var i=0, l = imgs.length; i<l; i++) {
				$D.setAttribute( imgs[i], 'src', $D.getAttribute(imgs[i], this.config.lazyImg) );
				imgs[i].removeAttribute(this.config.lazyImg);
			}
		}
	}
}

/**
 * ��Ӿ�̬����init��ʼ��
 * @method init
 * @param {Object} container �������
 * @param {Object} config ���ò���
 */
FD.widget.Tab.init = function(container, config) {
	return new FD.widget.Tab(container, config);
};
