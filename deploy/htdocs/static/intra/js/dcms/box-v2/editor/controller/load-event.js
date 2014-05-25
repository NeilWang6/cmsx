/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.29
 * @rely �����ļ��������������ļ���д����
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    
    var handlerList = $.Callbacks('stopOnFalse'),
        isLoad = false, qdoc, qobjDropInpage,
        loadHandler = {
        add : function(fn){ 
            if ( isLoad === true ){
                fn.call(handlerList, qdoc, qobjDropInpage);
            }
            handlerList.add(fn);
            
        },
        fire : function(doc, objDropInpage){
            isLoad = true;
            qdoc = doc;
            qobjDropInpage = objDropInpage;
            
            handlerList.fire(doc, objDropInpage);
        }
    };
    
    ED.loadHandler = loadHandler;
})(dcms, FE.dcms, FE.dcms.box.editor);
