/**
 * @author shanshan.hongss
 * @usefor 专场报名工具一 —— 右浮窗的到顶部等
 * @date   2012.09.12
 * @help http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=85721377
 */
 
;(function($, T){
    T.toTop = function(elem, opts){
        var defConfig = {
            fixed: {},  //右浮的参数，参考fixedRight方法参数
            top: '.top',  //回顶部的元素selector
            prev: '.prev',  //上一个元素selector
            next: '.next',   //下一个元素selector
            hashEls: '.items',  //需要加上锚点ID的元素集的selector
            prefixId: 'hash-item'  //ID的前缀，用于给上一个、下一个加锚点
        },
            config = $.extend(true, {}, defConfig, opts),
            top = $(config.top, elem),
            prev = $(config.prev, elem),
            next = $(config.next, elem),
            hashEls = $(config.hashEls),
            doc = $(document),
            hashTop = {};   //存储锚点ID及起所在页面中的offset[top]的对象
        
        //初始化右浮窗
        FE.tools.fixedRight(elem, config.fixed);
        
        //初始化时隐藏回顶部
        (doc.scrollTop()>0) ? top.show() : top.hide();
        
        doc.scroll(function(e){
            ($(this).scrollTop()>0) ? top.show() : top.hide();
        });
        top.click(function(e){
            e.preventDefault();
            location.hash = 'tttttttttttttttttt';
            location.hash = '#';
        });
        
        //给hashEls加上用于锚点的ID
        hashEls.each(function(i, el){
            var el = $(el);
            el.attr('id', config.prefixId+'-'+i);
            hashTop[i] = el.offset()['top'];
        });
        prev.click(function(e){
            e.preventDefault();
            var currentHashId = getCurrentHashId(doc.scrollTop(), hashTop),
                prevId = (currentHashId===-1 || currentHashId===0) ? 0 : currentHashId-1;
            location.hash = '';
            location.hash = config.prefixId+'-'+prevId;
        });
        next.click(function(e){
            e.preventDefault();
            var currentHashId = getCurrentHashId(doc.scrollTop(), hashTop),
                nextId = (currentHashId===-1) ? 0 : currentHashId+1;
            location.hash = '';
            location.hash = config.prefixId+'-'+nextId;
        });
    };
    function getCurrentHashId(currentTop, hashTop){
        var currentHashId = 0;
        for (var i in hashTop){
            i = parseInt(i);
            if (parseInt(hashTop[i])>currentTop && i===0){
                currentHashId = -1;
                break;
            }
            if (parseInt(hashTop[i])<currentTop && parseInt(hashTop[i+1])>currentTop){
                currentHashId = (currentTop-hashTop[i]>hashTop[i+1]-currentTop) ? i+1 : i;
                break;
            }
            if (parseInt(hashTop[i])===currentTop){
                currentHashId = i;
                break;
            }
        }
        return currentHashId;
    }
})(jQuery, FE.tools);