/**
 * iframe�߶ȼ���
 */
;(function($, D) {
    /**
     * ����iframe�߶�
     */
    D.previewIframe = function() {
        /**
         * window����
         */
        var $win = $(window), winHeight = $win.height(), winWidth = $win.width();
        var $header = $('.pre-template-header'), headerHeight = $header.outerHeight(true);
        var $veiwPage = $('#dcms-view-page');
        $veiwPage.css('height', winHeight - headerHeight);

    };
})(dcms, FE.dcms);
