/**
 * DCMS自定义表单验证集
 * @author : yu.yuy
 * @createTime : 2011-03-18
 */
(function($, D){
    var cmsdomain = location.protocol+'//'+location.host;
    D.Verification = {
        verifyByAjax : function(url, map, callback){
            var that = this;
            $.ajax(url,{
				async : false,
                dataType: "jsonp",
                data : map,
                success: function(o){
                    callback.call(that,o);
                },
                error : function(){
                }
            });
        },
        uniqueness : function(){
            
        },
        effectiveness : function(){
            
        },
        category : function(){
            var that = this,
            categoryTwoId = $(that).val(),
            ret;
            if(categoryTwoId){
                ret = true;
            }
            else{
                ret = '请选择二级类目';
            }
            return ret;
        },
        verifyPositionName : function(config, handle){
            var that = this,
            v = D.Verification,
            url = cmsdomain + '/position/verify.html',
            name = $(that).val(),
            map = {
                id : $('#id').val(),
                name : encodeURIComponent(name)
            },
            opt=config['opt'],
            cfg=config['cfg'];
            if(!/^[a-z0-9\u0391-\uFFE5_-]+$/i.test(name)){
                handle.call(that,'nameFormatIsWrong',opt);
                return;
            }
            v.verifyByAjax(url, map, function(o){
                var isExisted = o['isExisted'];
                if(isExisted === true){
                    handle.call(that,'nameisExisted',opt);
                }
                else{
                    cfg.isValid=true;
                    handle.call(that,'pass',opt);
                }
            });
        },
        verifyRuleName : function(config, handle){
            var that = this,
            v = D.Verification,
            url = cmsdomain + '/position/verify.html',
            name = $(that).val(),
            map = {
                rid : $('#ruleId').val(),
                rname : encodeURIComponent(name)
            },
            opt=config['opt'],
            cfg=config['cfg'];
            if(!/^[a-z0-9\u0391-\uFFE5_-]+$/i.test(name)){
                handle.call(that,'nameFormatIsWrong',opt);
                return;
            }
            v.verifyByAjax(url, map, function(o){
                var isExisted = o['isExisted'];
                if(isExisted === true){
                    handle.call(that,'nameisExisted',opt);
                }
                else{
                    cfg.isValid=true;
                    handle.call(that,'pass',opt);
                }
            });
        },
        verifyPositionQuoteName : function(config, handle){
            var that = this,
            v = D.Verification,
            url = cmsdomain + '/position/verify.html',
            quoteName = $(that).val(),
            map = {
                code : quoteName
            },
            opt=config['opt'],
            cfg=config['cfg'];
            if(!/^[a-z0-9_]+$/i.test(quoteName)){
                handle.call(that,'quoteNameFormatisWrong',opt);
                return;
            }
            v.verifyByAjax(url, map, function(o){
                var isExisted = o['isExisted'];
                if(isExisted === true){
                    handle.call(that,'quoteNameisExisted',opt);
                }
                else{
                    cfg.isValid=true;
                    handle.call(that,'pass',opt);
                }
            });
        },
        verifyTemplateName : function(config, handle){
            var that = this,
                v = D.Verification,
                url = cmsdomain + '/position/verify.html',
                templateName = $(that).val(),
                map = {
                    templateName : templateName
                },
                opt = config['opt'],
                cfg = config['cfg'];
            v.verifyByAjax(url, map, function(o){
                var isEffective = o['isEffective'],
                isExisted = o['isExisted'];
                if(isEffective === true && isExisted===false){
                    cfg.isValid=true;
                    handle.call(that,'pass',opt);
                } else {
                    handle.call(that,'templateNameIsWrong',opt);
                }
            });
        },
        verifyDefaultRuleName : function(config, handle){
            var that = this,
                v = D.Verification,
                url = cmsdomain + '/position/verify.html',
                templateName = $(that).val(),
                name = $(that).val(),
                map = {
                    rname : encodeURIComponent(name)
                },
                opt = config['opt'],
                cfg = config['cfg'];
            v.verifyByAjax(url, map, function(o){
                var isExisted = o['isExisted'],
                    isEffective = o['isEffective'];
                if(isExisted === true && isEffective === false){
                    //opt.isValid = true;
                    cfg.isValid = true;
                    handle.call(that, 'pass', opt);
                } else {
                    handle.call(that,'defaultRuleNameIsWrong',opt);
                }
            });
        }
    }
})(dcms,FE.dcms);
