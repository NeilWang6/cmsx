/**
 * TDP compiler
 * @date 2014-01-04 15:09:52
 * @author daniel.xud
 */

if (!FE || !FE.orange){
    jQuery.namespace('FE.orange');
}
(function($, Tools){
    'use strict';

    var tdp = {
        // ѭ��
        markLoopStart: /<!--\s*TDPѭ����ʼ\s*-->/g,
        markLoopEnd: /<!--\s*TDPѭ������\s*-->/g,
        restLoopStart: '#foreach($row in $dataTable)',
        restLoopEnd: '#end',
        restLoopVarSet: '',

        // ��׼TDP�ֶ�
        restFieldPrefix: '$row.getFieldValue("',
        restFieldSuffix: '")',
        fields: {
            '�۸�': 'PUREPRICE',
            'detail': 'URL',
            'ͼƬ': 'OFFERPICURL',
            '��λ': 'PRICEUNIT',
            '���ױ���': 'BOOKEDCOUNT',
            '����': 'totalStatSale',
            '�߼�': 'highPrice',
            '����': 'TITLE',
            'offerid': 'RESOURCEID',
            'memberid': 'MEMBERID',
            '��˾��ַ': 'COMPANYURL',
            '��': 'city',
            'ʡ': 'province',
            '��˾��': 'COMPANY',
            '�ղ���': 'FAVORITECOUNT',
            'ѫ�µȼ�': 'medalGradeSort'
        },

        // ����TDP�ֶ�
        // �����ֶ���ָ��Ҫ��Ԥ������ֶΣ������ͷ�ʣ�������С���۸��
        // '��ͷ��': { �ֶ�ռλ
        //     varSet: '#set($returnRates=$row.getFieldValue("returnOrdRate3m002")*100 + 0.0)', Ԥ������룬����ѭ������ǰ��
        //     res: '$webUtil.formatNumberToStr("$returnRates","00.00")%' ����html�Ľ��
        // }
        specials: {
            '��ͷ��': {
                varSet: '#set($returnRates=$row.getFieldValue("returnOrdRate3m002")*100 + 0.0)',
                res: '$webUtil.formatNumberToStr("$returnRates","00.00")%'
            },
            '�����۸�': {
                varSet: '#set($lowestPrice=$row.getFieldValue("PUREPRICE")) \n#set($footestStr=$webUtil.formatNumberToStr($lowestPrice,"###.00")) \n#set($integer=$webUtil.substring(0,$footestStr.indexOf("."))) \n#set($decimal=$webUtil.substring($footestStr.indexOf("."),$footestStr.length()))',
                res: {
                    '�����۸�': '$integer',
                    'С���۸�': '$decimal'
                }
            }
        },

        // ͼƬ
        img: {
            '64x64': 'OFFERPICURL64',
            '100x100': 'OFFERPICURL100',
            '150x150': 'OFFERPICURL',
            '220x220': 'OFFERPICURL220',
            '310x310': 'OFFERPICURL310'
        },

        // TDP�ֶΣ���һ��д��{{�۸�}}
        markFieldPrefix: '{{\\s*',
        markFieldSuffix: '\\s*}}',

        // TDP�ֶΣ��ڶ���д�� <!-- �۸� -->100.00<!-- /�۸� -->
        // /<!--\s*�۸�\s*-->.+<!--\s*\/�۸�\s*-->/g
        markFieldStart: '<!--\\s*',
        markFieldMiddle: '\\s*-->.+<!--\\s*\\\/',
        markFieldEnd: '\\s*-->',

        // �Զ����ֶ�
        markUserDefined: /{{\s*�Զ���\w\s*}}/g,
        getUserDefined: function(num){
            return '#if($row.isExistField("tdf_value_'+ num +'")&&!$row.isEmpty("tdf_value_'+ num +'")) $row.getFieldValue("tdf_value_'+ num +'") #else �Զ���'+ num +' #end';
        }
    }

    String.prototype.replaceAll = function(a, b){
        if(typeof a === 'string'){
            a = eval('/' + a + '/g');
        }
        return this.replace(a, b);
    }

    // ��׼TDP�ֶ�
    function compileTDPField(source){
        var reg1, reg2, res;

        for(var i in tdp.fields){
            reg1 = tdp.markFieldPrefix + i + tdp.markFieldSuffix;
            reg2 = tdp.markFieldStart + i + tdp.markFieldMiddle + i + tdp.markFieldEnd;
            res = tdp.restFieldPrefix + tdp.fields[i] + tdp.restFieldSuffix;
            source = source.replaceAll(reg1, res);
            source = source.replaceAll(reg2, res);
        }

        return source;
    }

    // �����ֶδ���
    function compileSpecialTDPField(source){
        var res;
        for(var i in tdp.specials){
            if(source.match(eval('/' + tdp.markFieldPrefix + i + tdp.markFieldSuffix + '/g'))){
                tdp.restLoopVarSet += '\n' + tdp.specials[i].varSet;
                res = tdp.specials[i].res;
                if(typeof res === 'string'){
                    source = source.replaceAll(tdp.markFieldPrefix + i + tdp.markFieldSuffix, res);
                }else{
                    for(var j in res){
                        source = source.replaceAll(tdp.markFieldPrefix + j + tdp.markFieldSuffix, res[j]);
                    }
                }
            }
        }

        return source;
    }

    // �Զ����ֶ�
    function compileUserDefined(source){
        var ud = source.match(tdp.markUserDefined),
            len, num;

        if(ud){
            len = ud.length;
        }else{
            return source;
        }

        for (var i = 0; i < len; i++) {
            num = ud[i].match(/\d/);
            source = source.replaceAll(ud[i], tdp.getUserDefined(num));
        }

        return source;
    }

    // ͼƬ
    function compileImg(source){
        var reg;
        for(var i in tdp.img){
            reg = eval('/"http:\\/\\/\\S*' + i +'\\S*"?/g');
            source = source.replaceAll(reg, '"' + tdp.restFieldPrefix + tdp.img[i] + tdp.restFieldSuffix + '"');
        }

        return source;
    }

    // ѭ��
    function compileLoop(source){
        source = source.replaceAll(tdp.markLoopStart, tdp.restLoopStart + tdp.restLoopVarSet);
        source = source.replaceAll(tdp.markLoopEnd, tdp.restLoopEnd);

        return source;
    }

    function compileTDP(source){
        tdp.restLoopVarSet = '';
        source = compileSpecialTDPField(source);
        source = compileTDPField(source);
        source = compileImg(source);
        source = compileUserDefined(source);
        source = compileLoop(source);
        
        return source;
    }

    Tools.compileTDP = compileTDP;

})(jQuery, FE.orange);