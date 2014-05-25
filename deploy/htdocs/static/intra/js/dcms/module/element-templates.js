/**
 * DomÔªËØÄ£°å¿â
 * @author : yu.yuy,
 * @createTime : 2011-03-14
 */
(function($, D){
    var doc = document;
    D.ElementTemplate = {
        Templates : {},
        get : function(name){
            var that = this,
            template = that.Templates[name],
            newTemplate;
            if(template){
                return template;
            }
            newTemplate = that.addByTagName(name);
            //that.Templates[name] = newTemplate;
            return newTemplate;
        },
        addByTagName : function(tagName){
            var that = this,
            el;
            if(tagName==='fragment'){
                el = doc.createDocumentFragment();
            }
            else{
                el = doc.createElement(tagName);
            }
            that.Templates[tagName] = el;
            return el;
        },
        addOther : function(name, el){
            var that = this;
            that.Templates[name] = el;
        }
    };
})(dcms,FE.dcms);