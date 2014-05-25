/**
 * @author chuangui.xiecg
 * @version 0.0.3
 * @date 2010-5-19
 * @desc 针对webIM定义一套新的科斯打点方案
 */
if (typeof ALIWW_COASE == "undefined" || !ALIWW_COASE) {
	var ALIWW_COASE = {};
}

/**
 * 定义科斯通用配置参数
 */
ALIWW_COASE.API_CONFIG={
	'api':'http://ctr.1688.com/ctr.html'
};
ALIWW_COASE.Utils = {
	getPageId:function(){
		return typeof window.dmtrack_pageid=='undefined' ? -1 : window.dmtrack_pageid;
	},
	coaseClick:function(paramString){
		var s = ALIWW_COASE.API_CONFIG.api+'?'+paramString,
		d  = new Date().getTime();
		if(document.images){
			(new Image()).src = s+"&t="+d;
		}
		return true;
	},
	end:0
};
ALIWW_COASE.Ao=function(config){
	var _this=this;
	if(!(_this instanceof arguments.callee)){
		return new arguments.callee(config);
	}
	if(typeof config != 'object') return;
	var aParam  = [];
	aParam.push('ctr_type='+(config.ctr_type||1));
	aParam.push('page_area='+(config.page_area||4));
	aParam.push('page_id='+ALIWW_COASE.Utils.getPageId());
	aParam.push('category_id='+(config.category_id||''));
	aParam.push('object_type='+(config.object_type||'offer'));
	aParam.push('object_ids='+(config.object_ids||''));
	aParam.push('keyword='+(config.keyword||''));
	aParam.push('page_size=');
	aParam.push('page_no=');
	aParam.push('refer='+escape(document.location.href));
	ALIWW_COASE.Utils.coaseClick(aParam.join('&'));
};


