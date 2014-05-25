/**
 * @author shanshan.hongss
 * @usefor ר����������һ ���� �Ҹ����ĵ�������
 * @date   2012.09.12
 * @help http://b2b-doc.alibaba-inc.com/pages/viewpage.action?pageId=85721377
 */
 
;(function($, T){
    T.toTop = function(elem, opts){
        var defConfig = {
            fixed: {},  //�Ҹ��Ĳ������ο�fixedRight��������
            top: '.top',  //�ض�����Ԫ��selector
            prev: '.prev',  //��һ��Ԫ��selector
            next: '.next',   //��һ��Ԫ��selector
            hashEls: '.items',  //��Ҫ����ê��ID��Ԫ�ؼ���selector
            prefixId: 'hash-item'  //ID��ǰ׺�����ڸ���һ������һ����ê��
        },
            config = $.extend(true, {}, defConfig, opts),
            top = $(config.top, elem),
            prev = $(config.prev, elem),
            next = $(config.next, elem),
            hashEls = $(config.hashEls),
            doc = $(document),
            hashTop = {};   //�洢ê��ID��������ҳ���е�offset[top]�Ķ���
        
        //��ʼ���Ҹ���
        FE.tools.fixedRight(elem, config.fixed);
        
        //��ʼ��ʱ���ػض���
        (doc.scrollTop()>0) ? top.show() : top.hide();
        
        doc.scroll(function(e){
            ($(this).scrollTop()>0) ? top.show() : top.hide();
        });
        top.click(function(e){
            e.preventDefault();
            location.hash = 'tttttttttttttttttt';
            location.hash = '#';
        });
        
        //��hashEls��������ê���ID
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