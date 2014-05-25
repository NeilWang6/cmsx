/**
 * @usefor adding fdlint feature for CMS
 * @author hua.qiuh
 * @date 2012.02.15
 * 
 */
 
(function($, D){
    /**
     * @methed fdlint
     * @param [textarea] optional parameter determinating which 
     *        textarea is the code to check
     *        will use first <textarea> element if not presented.
     */
    D.fdlint = function(textArea){
        var url  = 'http://wd.alibaba-inc.com/fdlint',
            form = $('<form method ="POST" target="_blank" />');
        textArea = $(textArea || 'textarea');

        form.attr('action', url)
            .append($('<textarea name="data" />').val(textArea.val()))
            .append('<input type="hidden" name="type" value="html" />')
            .append('<input type="hidden" name="format" value="html" />')
            .append('<input type="hidden" name="options[check_html_link]" value="1" />')
            .appendTo('body')
            .submit()
            .remove();
    };

})(dcms, FE.dcms);
