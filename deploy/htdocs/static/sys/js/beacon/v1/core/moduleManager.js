/**
 * 简易模块管理器
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.moduleManager = function(){
        var G = $ns.globals,
        DOC = G.doc,
        _tools = $ns.tools,
        //模块存储池
        _modules = {},
        //获取JS的完整路径
        _getJsUrl = function(id){
            var relativePath = G.jsUrlHash[id];
            return relativePath ? G.jsUrlRoot+relativePath : null;
        },
        //JS加载器
        _jsLoader = function(){
            var loadScriptDomElement = function(url,onload){
                var existingScript,
                domScript = DOC.createElement('script');
                domScript.src = url;
                if(onload){
                    domScript.onload = domScript.onreadystatechange = function(){
                        if(!this.readyState || 'loaded' === domScript.readyState || 'complete'===domScript.readyState){
                            //IE9、opera同时支持onload和onreadystatechange事件
                            domScript.onload = domScript.onreadystatechange = null;
                            onload();
                        }
                    }
                }
                //获取页面中的第一个script标签元素
                existingScript = DOC.getElementsByTagName('script')[0];
                existingScript.parentNode.insertBefore(domScript, existingScript);
            };
            return {
                load : loadScriptDomElement
            }
        }();
        return {
            //模块注册
            register : function(id,module,isImmediate){
                var that = this;
                //保证只注册一次
                if(that.hasRegistered(id)){
                    return;
                }
                //是否立即执行，如果立即执行则保存模块代码执行后的结果对象，反之则只保存模块代码到需要的时候再执行，该标识针对内部模块使用
                _modules[id] = isImmediate?module.call($ns):module;
            },
            //获取模块
            require : function(id,fn){
                var module = _modules[id],
                jsUrl;
                //如果模块池中存储的只是模块代码，则执行该代码，且将执行完的结果替换掉原来模块池中对应的值，然后返回。
                if(_tools.isFunction(module)){
                    return _modules[id] = module.call($ns);
                }
                //如果模块池中存储的是模块代码执行结果对象，则直接返回该结果对象
                else if(module){
                    return module;
                }
                jsUrl = _getJsUrl(id);
                
                /*
                 * BUGFIX: 单页面load多次时，会加载多次相同的js文件
                 * edited by arcthur.cheny
                 */
                var hasRepeat = false
                  , head = document.head || document.getElementsByTagName('head')[0]
                  , allUrl = head.getElementsByTagName('script');
                  alert(head.getElementsByTagName('script'))
                for (var i = 0, l = allUrl.length; i < l; i++) {
                    if (allUrl[i].src === jsUrl) {
                        hasRepeat = true;
                    }
                }
                
                if(!hasRepeat && jsUrl !== null){
                    //异步载入模块对应的JS文件
                    _jsLoader.load(jsUrl,function(){
                        //将模块代码执行结果对象存入模块池中
                        _modules[id] = _modules[id].call($ns);
                        //执行回调函数
                        (fn || _tools.emptyFunction).call(null,_modules[id]);
                    });
                }
                return null;
            },
            //检测指定模块是否已被注册
            hasRegistered : function(id){
                return !!_modules[id];
            },
            //检测模块池中存储的指定模块是否为执行后的结果对象
            hadUsed : function(id){
                var module = _modules[id];
                return module && !_tools.isFunction(module);
            }
        }
    }();
})(MAGNETO);