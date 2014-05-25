/**
 * @author shanshan.hongss
 * @userfor html代码语法验证
 * @date  2014.02.07
 */

if (!FE || !FE.orange){
    jQuery.namespace('FE.orange');
}

;(function($, O, undefined){
    var ValidGhtml = {
        //JSON结构验证
        json: function(str){
            var msg = true;
            try {
                $.parseJSON(str);
            } catch (error){
                msg = error.message;
                console.error(str+': '+error.message);
            }
            return msg;
        },
        //开始标签、结束标签配对验证
        label: function(str){
            var msg = true,
                startLabel = str.match(/<[^\/!][^<]*>/g),  //开始标签
                startLabelLen = (startLabel) ? startLabel.length : 0,
                selfLabel = str.match(/<[^<]+\/>/g),  //自闭合标签
                selfLabelLen = (selfLabel) ? selfLabel.length : 0,
                endLabel = str.match(/<\/[^<]+>/g),  //结束标签
                endLabelLen = (endLabel) ? endLabel.length : 0;
            
            if (startLabelLen>(endLabelLen+selfLabelLen)){
                msg = '有标签没有闭合';
                console.error(msg);
            } else if (startLabelLen<(endLabelLen+selfLabelLen)){
                msg = '缺少起始标签';
                console.error(msg);
            }
            return msg;
        }
    };
    
    FE.orange.ValidGhtml = ValidGhtml;
})(jQuery, FE.orange);