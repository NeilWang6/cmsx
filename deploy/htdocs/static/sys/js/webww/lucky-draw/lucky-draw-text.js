/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/15/12
 * Time: 10:57 AM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

(function ($) {
    jQuery.namespace("FE.sys.webww.luckydraw");
    FE.sys.webww.luckydraw.LuckyDrawText = {
        mismatchConditionTitle: "亲，你现在暂时不能抽奖哦！",
        mismatchConditionText: "可能的原因是:<ul><li>1.现在用中文站帐号登录旺旺了吗？</li><li>2.今天的2次抽奖机会用完了吗？用完的话，明天还能来！</li></ul>",
        badLucks: [
            {
                title: "很遗憾!",
                text: "很遗憾，下次一定要好运啊！"
            },
            {
                title: "很遗憾!",
                text: "这次没有中奖,但不代表下次没有中奖!加油!"
            },
            {
                title: "很遗憾!",
                text: "没有中奖哦~很遗憾!"
            }
        ],
        badLucksKeywords: "没有中奖",
        goodLuckTitle: "恭喜你!",
        goodLuckText: Hogan.compile("你获得的奖品是:{{{name}}}!9月10日前,旺仔女超人(taokafei)会用旺旺主动联系您!")
    }
})(jQuery);