/**
 * ����ģ�������
 * @author : yu.yuy
 * @createTime : 2011-9-24
 * @modifyTime : 2012-05-08
 */
(function($ns){
    $ns.moduleManager = function(){
        var G = $ns.globals,
        DOC = G.doc,
        _tools = $ns.tools,
        //ģ��洢��
        _modules = {},
        //��ȡJS������·��
        _getJsUrl = function(id){
            var relativePath = G.jsUrlHash[id];
            return relativePath ? G.jsUrlRoot+relativePath : null;
        },
        //JS������
        _jsLoader = function(){
            var loadScriptDomElement = function(url,onload){
                var existingScript,
                domScript = DOC.createElement('script');
                domScript.src = url;
                if(onload){
                    domScript.onload = domScript.onreadystatechange = function(){
                        if(!this.readyState || 'loaded' === domScript.readyState || 'complete'===domScript.readyState){
                            //IE9��operaͬʱ֧��onload��onreadystatechange�¼�
                            domScript.onload = domScript.onreadystatechange = null;
                            onload();
                        }
                    }
                }
                //��ȡҳ���еĵ�һ��script��ǩԪ��
                existingScript = DOC.getElementsByTagName('script')[0];
                existingScript.parentNode.insertBefore(domScript, existingScript);
            };
            return {
                load : loadScriptDomElement
            }
        }();
        return {
            //ģ��ע��
            register : function(id,module,isImmediate){
                var that = this;
                //��ֻ֤ע��һ��
                if(that.hasRegistered(id)){
                    return;
                }
                //�Ƿ�����ִ�У��������ִ���򱣴�ģ�����ִ�к�Ľ�����󣬷�֮��ֻ����ģ����뵽��Ҫ��ʱ����ִ�У��ñ�ʶ����ڲ�ģ��ʹ��
                _modules[id] = isImmediate?module.call($ns):module;
            },
            //��ȡģ��
            require : function(id,fn){
                var module = _modules[id],
                jsUrl;
                //���ģ����д洢��ֻ��ģ����룬��ִ�иô��룬�ҽ�ִ����Ľ���滻��ԭ��ģ����ж�Ӧ��ֵ��Ȼ�󷵻ء�
                if(_tools.isFunction(module)){
                    return _modules[id] = module.call($ns);
                }
                //���ģ����д洢����ģ�����ִ�н��������ֱ�ӷ��ظý������
                else if(module){
                    return module;
                }
                jsUrl = _getJsUrl(id);
                
                /*
                 * BUGFIX: ��ҳ��load���ʱ������ض����ͬ��js�ļ�
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
                    //�첽����ģ���Ӧ��JS�ļ�
                    _jsLoader.load(jsUrl,function(){
                        //��ģ�����ִ�н���������ģ�����
                        _modules[id] = _modules[id].call($ns);
                        //ִ�лص�����
                        (fn || _tools.emptyFunction).call(null,_modules[id]);
                    });
                }
                return null;
            },
            //���ָ��ģ���Ƿ��ѱ�ע��
            hasRegistered : function(id){
                return !!_modules[id];
            },
            //���ģ����д洢��ָ��ģ���Ƿ�Ϊִ�к�Ľ������
            hadUsed : function(id){
                var module = _modules[id];
                return module && !_tools.isFunction(module);
            }
        }
    }();
})(MAGNETO);