define('butterfly/context/lazyMod', ['jquery','util/datalazyload/1.0'], function($,DataLazyLoad) {

	'use strict'
	var lazyModWrapper = function(mod){
		var lazyConf = mod.lazyConfig;
		if(!lazyConf) return mod;
		
		var modInit = mod.init || function(){};
		mod.init = function(){
			var args = arguments;
			var self = this;
			var elem = lazyConf.elem,
				event = lazyConf.event,
				threshold = lazyConf.threshold || 200,
				deps = lazyConf.deps;
				
			var handler = function(){
				if(event === 'mouseenter'){
					$(elem).off('mouseenter._modLazyenter_');
					$(elem).off('mouseenter._modLazyleave_');
				}
				if(deps){
					var sourceArr = [];
					if(deps.css){
						if(typeof deps.css === 'string'){
							deps.css = [deps.css];
						}
						sourceArr = deps.css;
					}
					if(deps.js ){
						if(typeof deps.js === 'string'){
							deps.js = [deps.js];
						}
						sourceArr = sourceArr.concat(deps.js);
					}
					define(sourceArr,function(){
						var sourceObjArr = arguments;
						$.each(sourceObjArr,function(idx,obj){
							if(!obj._initialized){
								obj = lazyModWrapper(obj);
								obj._initialized = true;
								if (typeof obj === 'function') {
									new obj(args);
								} else if (obj && obj.init) {
									obj.init.apply(null,args);
								} else if (args.method && obj[method]) {
									obj[method].apply(null,args);
								}
							}
							
						})
						modInit.apply(self,args);
					})
					
				}
				else {
					modInit.apply(self,args );
				}
			}
			
			if(event === 'exposure'){
				var lazy = new DataLazyLoad({
					container : elem,
					autoLoad : false,
					threshold:threshold
				});
				lazy.addCallBack(elem,handler);
				lazy.start();
			} else if(event === 'mouseenter'){
				var timeoutId;
				$(elem).on('mouseenter._modLazyenter_',function(){
					timeoutId = setTimeout(handler,30);
					$(this).on('mouseleave._modLazyleave_',function(){
						clearTimeout(timeoutId);
					})
				})
				
				
			} else {
				$(elem).one(event,handler);
			}
		}
		return mod;
			
	}

	return lazyModWrapper;
});
