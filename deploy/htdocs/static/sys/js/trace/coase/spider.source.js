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
 * ��ͨҳ�����ķַ���,���������ݴ���ĵ�һ������������ִ���Ǹ�����,Ŀǰ����ֻ��һ������common
 * @param {String} type ��������,Ŀǰֻ��һ��common
 * @param {Object} p ��������
 */
COASE.modules.spider=function(type,p){
	isCoaseCompleted = true;
	type = type||'';
	p = p || {};
	switch(type){
		case 'common': spiderClass.common(p);break;
		default:break;
	}
}
/**
 * ������,����offer,company����������б��Լ���Ӧ�Ļ�������ĺ���
 */
COASE.regExp = {
	regs:{/*offer������ʽ,֧������url���ͣ������뿴UC*/
		'offerRegs':[
			/^.*offerdetail\/([\w\/\-]+\-)?(\d+)\.html/i
		],
		'companyRegs':[
			/^http:\/\/(\s+)?(\w+).cn.1688.com(\/)(\?.*)?$/i,
			/^.+\.alibaba\.com\/(company\/detail)\/([\w\d]+)\.html/i
		]
	},
	/**
	 * ��ȡoffer������ʽ������
	 * @method getOfferRegs
	 * @param {String} type
	 * @static
	 */
	getOfferRegs : function(type){
		return {
			'a':[COASE.regExp.regs.offerRegs[0]]
		}[type||'']||[];
	},
	/**
	 * ��ȡoffer������ʽ������
	 * @method getCompanyRegs
	 * @param {String} type
	 * @static
	 */
	getCompanyRegs:function(type){
		return {
			'a':[COASE.regExp.regs.companyRegs[0]],
			'b':[COASE.regExp.regs.companyRegs[1]],
			'c':[COASE.regExp.regs.companyRegs[0],COASE.regExp.regs.companyRegs[1]]
		}[type||''] || [];
	}
};
var spiderClass={
	_doClick:function(r,s){
		var C = COASE;
		var coaseOfferParam = new C.getUrlParams(r);
		coaseOfferParam.page_id = C.util.getPageId();
		coaseOfferParam.refer = escape(document.location.href);
		s = s || {};
		coaseOfferParam = C.lang.merge(coaseOfferParam,s);
		var tempUrl = C.util.substitute(C.coaseConfig.api,coaseOfferParam);
		C.coaseClick(tempUrl);
	},
	common:function(o){
		if(o.ctrType){
			o['ctr_type']=o.ctrType.toString();
		}
		var _self = this;
		this._company(o);
		setTimeout(function(){
			_self._offer(o);
		},150)
		
	},
	_company:function(o){
		if(o.isCompanyCoaseOut||o.isCoaseOut){return;}
		var companyRange = o.companyRange||['document'];
		o.companyRegType = o.companyRegType||'c';
		var companyRegArray = COASE.regExp.getCompanyRegs(o.companyRegType)||[];
		var memberIds = this._getLinksIds(companyRange,companyRegArray,5,true,o.filterTag);
		if(memberIds!=''){
			memberIds+=';';
		}else{
			return;
		}
		var s = {
			'object_ids':memberIds,
			'object_type':'company'
		};
		this._doClick(o,s);
	},
	_offer:function(o){
		if(o.isOfferCoaseOut||o.isCoaseOut){return;}
		var offerRange = o.offerRange||['document'];
		o.offerRegType = o.offerRegType||'a';
		var offerRegArray = COASE.regExp.getOfferRegs(o.offerRegType)||[];
		var offerIds = this._getLinksIds(offerRange,offerRegArray,5,true,o.filterTag);
		if(offerIds!=''){
			offerIds+=';';
		}else{
			return;
		}
		var s = {
			'object_ids':offerIds,
			'object_type':'offer'
		};
		this._doClick(o,s);
	},
	_getLinksIds:function(scope,reg,object_type,isFilter,filterTag){
		var tempLinkArray = [];
		var cacheLinkArray = [];
		var tempIdArray = [];
		var util = COASE.util;
		var tempId;
		for(var i=0,l = scope.length;i<l;i++){
			if(util.get(scope[i])==null) continue;
			tempLinkArray = util.get(scope[i]).getElementsByTagName('a');
			for(var j = 0,objsLength= tempLinkArray.length;j<objsLength;j++){
				if(tempLinkArray[j].getAttribute(filterTag) || (!tempLinkArray[j].getAttribute('href',2)) ||  tempLinkArray[j].getAttribute('href',2)== '#'){continue;}
				for(var k=0,regLen = reg.length;k<regLen;k++){
					if(isFilter){
						var m = reg[k].exec(tempLinkArray[j].href)||[];
						tempId = m[2];
						if(!tempId) continue;
						if(util._arrayLastIndexOf(cacheLinkArray,tempId,cacheLinkArray.length-1)==-1){
							cacheLinkArray[cacheLinkArray.length] = tempId;
							tempIdArray[tempIdArray.length] = tempId+','+object_type;
						}
					}else{
						!!reg[k].exec(tempLinkArray[j].href)?tempIdArray[tempIdArray.length]=(RegExp.$2+','+object_type):'';
					}
					
				}
			}
		}
		cacheLinkArray = null;
		tempLinkArray = null;
		return tempIdArray.join(';');
	}
};
