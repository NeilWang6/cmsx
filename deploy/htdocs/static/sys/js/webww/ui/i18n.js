/**
 * i18n
 * 它需要在i18n/i18n.*.js后加载
 */

jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    FE.sys.webww.ui.i18n = {
        init: function() {
            var language = window.navigator.userLanguage || window.navigator.language;
            console.log("language: " + language);
            if (language === "zh-CN") {
                FE.sys.webww.ui.lib.Ri18n.setLocale(language, true);
            }
            else {
                FE.sys.webww.ui.lib.Ri18n.setLocale("en-US", true);
            }
        }
    };

    FE.sys.webww.ui.i18n.init();

})(jQuery);
