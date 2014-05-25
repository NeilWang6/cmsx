/**
 * iframe高度计算
 */
;(function($, D) {
    /**
     * 计算iframe高度
     */
    D.previewIframe = function() {
        /**
         * window窗口
         */
        var $win = $(window), winHeight = $win.height(), winWidth = $win.width();
        var $header = $('.pre-template-header'), headerHeight = $header.outerHeight(true);
        var $veiwPage = $('#dcms-view-page');
        $veiwPage.css('height', winHeight - headerHeight);

    };
})(dcms, FE.dcms);
