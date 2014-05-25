/**
 * App autowire°ó¶¨
 *
 * @author qijun.weiqj
 */
define('butterfly/context/lazyAutowire', ['jquery','util/datalazyload/1.0','butterfly/context/lazyMod'], function($,DataLazyLoad,lazyModWrapper) {

	'use strict'
	var modIdIndex = 0;
	var elemIdIndex = 0;
	var lazyAutowireWrapper = function(type,config,elem){
		var lazyConfig = config.lazyConfig;
		if(!lazyConfig) return type;
		if(!$(elem).attr('id')){
			$(elem).attr('id','_exposure-elem-id_' + elemIdIndex)
			elem = '_exposure-elem-id_' + elemIdIndex;
			elemIdIndex++;
		} else {
			elem = $(elem).attr('id');
		} 
		
		var deps = lazyConfig.deps || {};
		if(deps.js){
			if(typeof deps.js === "string"){
				deps.js = [deps.js];
			}
			deps.js.push(type);
		} else {
			deps.js = [type]
		}		
		var currentIdx = modIdIndex++;
		define('butterfly/context/autowireWrapper' + currentIdx,function(){
			var rtnObj = {
				lazyConfig:{
					'elem':lazyConfig.elem || '#' + elem,
					'event':lazyConfig.event,
					'threshold':lazyConfig.threshold,
					'deps':deps
				}
			}
			return lazyModWrapper(rtnObj);
		})
		return 'butterfly/context/autowireWrapper' + currentIdx;
	}

	return lazyAutowireWrapper;
});
