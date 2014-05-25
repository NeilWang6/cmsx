/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.29
 * @rely 依赖文件，如果依赖多个文件请写多行
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
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
