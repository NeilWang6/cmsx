/**
 * @author shanshan.hongss
 * @userfor html�����﷨��֤
 * @date  2014.02.07
 */

if (!FE || !FE.orange){
    jQuery.namespace('FE.orange');
}

;(function($, O, undefined){
    var ValidGhtml = {
        //JSON�ṹ��֤
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
        //��ʼ��ǩ��������ǩ�����֤
        label: function(str){
            var msg = true,
                startLabel = str.match(/<[^\/!][^<]*>/g),  //��ʼ��ǩ
                startLabelLen = (startLabel) ? startLabel.length : 0,
                selfLabel = str.match(/<[^<]+\/>/g),  //�Ապϱ�ǩ
                selfLabelLen = (selfLabel) ? selfLabel.length : 0,
                endLabel = str.match(/<\/[^<]+>/g),  //������ǩ
                endLabelLen = (endLabel) ? endLabel.length : 0;
            
            if (startLabelLen>(endLabelLen+selfLabelLen)){
                msg = '�б�ǩû�бպ�';
                console.error(msg);
            } else if (startLabelLen<(endLabelLen+selfLabelLen)){
                msg = 'ȱ����ʼ��ǩ';
                console.error(msg);
            }
            return msg;
        }
    };
    
    FE.orange.ValidGhtml = ValidGhtml;
})(jQuery, FE.orange);