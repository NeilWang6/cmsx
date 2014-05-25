/**
 * @author chuangui.xiecg
 * @version 0.0.3
 * @date 2009-2-12
 */
/**
 * ��ֹCOASE.modulesδ�������׳�����
 */
if(typeof COASE.modules=='undefined'){
	throw new Error('Error:coaseClass is undefined!');
}
/**
 * ����ҳ�����ķַ��࣬���������ݴ���ĵ�һ������������ִ���Ǹ�����,Ŀǰ����search,detial��������
 * @method specificSpider
 * @param {String} type ҳ������ Ŀǰ����search�Ĳ�Ʒ����,��˾����,����������detail
 * @param {Object} ���� һ��Json����
 * @static
 */
COASE.modules.specificSpider=function(type,p){
	isCoaseCompleted = true;
	type = type||'';
	p = p || {};
	switch(type){
		case 'offer': specificSpiderClass.offer(p);break;
		case 'company': specificSpiderClass.company(p);break;
		case 'detail': specificSpiderClass.detail(p);break;
		default:break;
	}
}
/**
 * ����ҳ���ץȡ��,����_doClick��_goldAds��Ϊ˽�к������ڲ���������
 */
var specificSpiderClass={
	_doClick:function(r,s,type){
		var C = COASE;
		var coaseParam = new C.getUrlParams(r);
		coaseParam.page_id = C.util.getPageId();
		coaseParam.refer = escape(document.location.href);
		s = s || {};
		coaseParam = C.lang.merge(coaseParam,s);
		var tempUrl = C.util.substitute(C.coaseConfig.api,coaseParam);
		C.coaseClick(tempUrl);	
	},
	offer:function(o){
		var s = {
			'ctr_type':'2',
			'page_area':'1',
			'object_type':'offer'
		};
		if(o.isCoaseOut){return;}
		this._doClick(o,s);
		if(o.isHasGoldAds){
			this._goldAds(o);
		}
	},
	company:function(o){
		var s = {
			'ctr_type':'2',
			'page_area':'1',
			'object_type':'company'
		};
		if(o.isCoaseOut){return;}
		this._doClick(o,s);
		if(o.isHasGoldAds){
			this._goldAds(o,'company');
		}
	},
	detail:function(o){
		if(o.isCoaseOut) return;
		var s = {
			'ctr_type':'3',
			'object_type':'offer'
		};
		this._doClick(o,s);
	},
	profile:function(o){
		if(o.isCoaseOut) return;
		var s = {
			'ctr_type':'2',
			'page_area':'1',
			'object_type':'company'
		};
		this._doClick(o,s);
	},
	_goldAds:function(o,type){
		o.object_ids = o.gold_ad_ids;
		type = type||'company';
		var s = {
			'ctr_type':'2',
			'page_area':'3',
			'object_type':type,
			'page_size':'',
			'page_no':''
		};
		this._doClick(o,s);
	}
};
