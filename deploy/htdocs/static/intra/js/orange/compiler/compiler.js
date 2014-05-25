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
        // 循环
        markLoopStart: /<!--\s*TDP循环开始\s*-->/g,
        markLoopEnd: /<!--\s*TDP循环结束\s*-->/g,
        restLoopStart: '#foreach($row in $dataTable)',
        restLoopEnd: '#end',
        restLoopVarSet: '',

        // 标准TDP字段
        restFieldPrefix: '$row.getFieldValue("',
        restFieldSuffix: '")',
        fields: {
            '价格': 'PUREPRICE',
            'detail': 'URL',
            '图片': 'OFFERPICURL',
            '单位': 'PRICEUNIT',
            '交易笔数': 'BOOKEDCOUNT',
            '销量': 'totalStatSale',
            '高价': 'highPrice',
            '标题': 'TITLE',
            'offerid': 'RESOURCEID',
            'memberid': 'MEMBERID',
            '公司地址': 'COMPANYURL',
            '市': 'city',
            '省': 'province',
            '公司名': 'COMPANY',
            '收藏数': 'FAVORITECOUNT',
            '勋章等级': 'medalGradeSort'
        },

        // 特殊TDP字段
        // 特殊字段是指需要做预处理的字段，例如回头率，整数、小数价格等
        // '回头率': { 字段占位
        //     varSet: '#set($returnRates=$row.getFieldValue("returnOrdRate3m002")*100 + 0.0)', 预处理代码，插入循环的最前面
        //     res: '$webUtil.formatNumberToStr("$returnRates","00.00")%' 插入html的结果
        // }
        specials: {
            '回头率': {
                varSet: '#set($returnRates=$row.getFieldValue("returnOrdRate3m002")*100 + 0.0)',
                res: '$webUtil.formatNumberToStr("$returnRates","00.00")%'
            },
            '整数价格': {
                varSet: '#set($lowestPrice=$row.getFieldValue("PUREPRICE")) \n#set($footestStr=$webUtil.formatNumberToStr($lowestPrice,"###.00")) \n#set($integer=$webUtil.substring(0,$footestStr.indexOf("."))) \n#set($decimal=$webUtil.substring($footestStr.indexOf("."),$footestStr.length()))',
                res: {
                    '整数价格': '$integer',
                    '小数价格': '$decimal'
                }
            }
        },

        // 图片
        img: {
            '64x64': 'OFFERPICURL64',
            '100x100': 'OFFERPICURL100',
            '150x150': 'OFFERPICURL',
            '220x220': 'OFFERPICURL220',
            '310x310': 'OFFERPICURL310'
        },

        // TDP字段：第一种写法{{价格}}
        markFieldPrefix: '{{\\s*',
        markFieldSuffix: '\\s*}}',

        // TDP字段：第二种写法 <!-- 价格 -->100.00<!-- /价格 -->
        // /<!--\s*价格\s*-->.+<!--\s*\/价格\s*-->/g
        markFieldStart: '<!--\\s*',
        markFieldMiddle: '\\s*-->.+<!--\\s*\\\/',
        markFieldEnd: '\\s*-->',

        // 自定义字段
        markUserDefined: /{{\s*自定义\w\s*}}/g,
        getUserDefined: function(num){
            return '#if($row.isExistField("tdf_value_'+ num +'")&&!$row.isEmpty("tdf_value_'+ num +'")) $row.getFieldValue("tdf_value_'+ num +'") #else 自定义'+ num +' #end';
        }
    }

    String.prototype.replaceAll = function(a, b){
        if(typeof a === 'string'){
            a = eval('/' + a + '/g');
        }
        return this.replace(a, b);
    }

    // 标准TDP字段
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

    // 特殊字段处理
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

    // 自定义字段
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

    // 图片
    function compileImg(source){
        var reg;
        for(var i in tdp.img){
            reg = eval('/"http:\\/\\/\\S*' + i +'\\S*"?/g');
            source = source.replaceAll(reg, '"' + tdp.restFieldPrefix + tdp.img[i] + tdp.restFieldSuffix + '"');
        }

        return source;
    }

    // 循环
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