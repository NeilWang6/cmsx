/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/15/12
 * Time: 12:32 PM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

(function ($) {
    jQuery.namespace("FE.sys.webww.luckydraw");
    FE.sys.webww.luckydraw.LuckyDrawConfig = {
        // 活动的ID
        promotionId: "cls0c8glvynmw7l0b91e",

        // 公共抽奖活动的服务地址
        luckyDrawServer: "http://luckydraw.china.alibaba.com",
        // 抽奖接口
        doLuckyDraw: Hogan.compile("{{{luckyDrawServer}}}/home/draw.json?p={{{promotionId}}}"),
        // 查询我的中奖记录接口
        queryDrawResult: Hogan.compile("{{{luckyDrawServer}}}/home/resultAjax.json?promotionId={{{promotionId}}}"),
        // 录入会员联系方式
        updateContacts: Hogan.compile("{{{luckyDrawServer}}}/home/update_contact_ajax.json?promotionId={{{promotionId}}}&resultId={{{resultId}}}&contactName={{{contactName}}}"),

        // 总抽奖次数
        totalChances: 2
    }
})(jQuery);