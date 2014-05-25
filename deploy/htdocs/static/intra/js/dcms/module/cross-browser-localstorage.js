/**
 * DESC: text storage solution for your pages
 * @author springyu
 */
;(function($, D, window) {
    var readyFun = [
    function() { typeof window.localStorage == 'undefined' && ~ function() {

            var localStorage = window.localStorage = {}, prefix = 'data-userdata', doc = document, attrSrc = doc.body, html = doc.documentElement,

            // save attributeNames to <html>'s
            // data-userdata attribute
            mark = function(key, isRemove, temp, reg) {

                html.load(prefix);
                temp = html.getAttribute(prefix);
                reg = RegExp('\\b' + key + '\\b,?', 'i');
                hasKey = reg.test(temp) ? 1 : 0;
                temp = isRemove ? temp.replace(reg, '').replace(',', '') : hasKey ? temp : temp === '' ? key : temp.split(',').concat(key).join(',');

                html.setAttribute(prefix, temp);
                html.save(prefix);
            };
            // add IE behavior support
            attrSrc.addBehavior('#default#userData');
            html.addBehavior('#default#userData');
            //
            localStorage.getItem = function(key) {
                attrSrc.load(key);
                return attrSrc.getAttribute(key);
            };

            localStorage.setItem = function(key, value) {
                attrSrc.setAttribute(key, value);
                attrSrc.save(key);
                mark(key);
            };

            localStorage.removeItem = function(key) {
                attrSrc.removeAttribute(key);
                attrSrc.save(key);
                mark(key, 1);
            };
            // clear all attributes on <body> that using for textStorage
            // and clearing them from the 'data-userdata' attribute's value of <html>
            localStorage.clear = function() {
                html.load(prefix);
                var attrs = html.getAttribute(prefix).split(','), len = attrs.length;
                for(var i = 0; i < len; i++) {
                    attrSrc.removeAttribute(attrs[i]);
                    attrSrc.save(attrs[i]);
                };
                html.setAttribute(prefix, '');
                html.save(prefix);

            };
        }();
    },

    function() {
        D.storage = function() {
            var localStorage = window.localStorage;
            return {
                getItem : function(key) {
                    return localStorage.getItem(key);
                },
                setItem : function(key, value) {
                    return localStorage.setItem(key, value);
                },
                removeItem:function(key){
                	 return localStorage.removeItem(key);
                },
                load : function(url, callback, data) {
                    $.ajax({
                        url : url,
                        async : false,
                        type:'post',
                        data : data,
                        success : function(o) {
                            var retJson = $.parseJSON(o);
                            callback.call(this, retJson);
                        }
                    });
                    // $.post(url, data, function(o) {
                    //var retJson = $.parseJSON(o);
                    //callback.call(this,retJson);
                    //});
                }
            };
        }
    }];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }

    });
})(dcms, FE.dcms, window);
