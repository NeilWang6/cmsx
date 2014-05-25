/**
 * 提醒通知中心
 * @author xuping.nie
 * 用法：
 var nc = FE.sys.webww.ui.notificationCenter()
 var not = nc.notify( {
 title       :   "My Notification" ,
 text        :   "I am notification body" ,
 timeout   :   10000
 });
 *
 */

jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    /**
     * 提醒通知
     * @param {Object} options
     * {
     *     title : 提醒的标题
     *     html :  提醒内容，html格式
     *     text :  提醒内容，纯文本格式
     *     timeout : 提醒显示的时间，超时自动消失，并自动销毁该提醒对象
     * }
     */
    FE.sys.webww.ui.notification = function (options) {

        options = options || {};

        var element = document.createElement("li"),
            title = document.createElement("div"),
            content = document.createElement("div");
        this.titleElement = title;
        this.element = element;
        this.contentElement = content;
        this.isDestoryed = false;

        element.className = "webatm-notification";
        content.className = "notification-content";
        if (options.title) {
            title.className = "notification-title";
            this.title(options.title);
            element.appendChild(title);
        }

        if (!options.html) {
            this.text(options.text);
        } else {
            this.html(options.html);
        }
        element.appendChild(content);

        this._addCloseButton();

        this.close(options.timeout);

        return this;
    }

    FE.sys.webww.ui.notification.prototype = {

        title:function (text) {
            var title = this.titleElement;
            if (!text) {
                return title.textContent || title.innerText;
            }
            if (typeof title.textContent != 'undefined') {
                title.textContent = text;
            } else {
                title.innerText = text;
            }
            return true;
        },

        text:function (text) {
            var content = this.contentElement;
            if (!text) {
                return content.textContent || content.innerText;
            }
            if (typeof content.textContent != 'undefined') {
                content.textContent = text;
            } else {
                content.innerText = text;
            }
            return true;
        },

        html:function (html) {
            if (!html) {
                return this.contentElement.innerHTML;
            }
            this.contentElement.innerHTML = html;
            return true;
        },
        reset:function (options) {
            if (options.title) {
                this.title(options.title);
            }
            if (!options.html) {
                this.text(options.text);
            } else {
                this.html(options.html);
            }
            this.close(options.timeout);
        },

        show:function () {
            this.element.style.display = "block";
            return null;

        },
        hide:function () {
            this.element.style.display = "none";
            return null;
        },
        destroy:function () {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        },
        _addCloseButton:function () {
            var closeButton = document.createElement("span");
            closeButton.className = "notification-close-button";
            closeButton.innerHTML = "&times;";

            closeButton.onmouseover = function () {
                this.style.color = "#888";
            }

            closeButton.onmouseout = function () {
                this.style.color = "#aaa";
            }
            var self = this;
            closeButton.onmousedown = function () {
                self.close();
            }
            this.element.appendChild(closeButton);
        },
        close:function (timeout) {
            var self = this;
            this.closeTimer && clearTimeout(this.closeTimer);
            if (timeout > 0) {
                this.closeTimer = setTimeout(function () {
                    $(self.element).slideUp(function () {
                        self.destroy();
                    });
                }, timeout);
            } else {
                $(self.element).slideUp(function () {
                    self.destroy();
                });
            }
        }
    }

    /**
     * 提醒通知中心
     */
    FE.sys.webww.ui.notificationCenter = function (options) {
        options = options || {};
        var element = document.createElement("ul");
        element.className = "webatm-notification-center";
        document.body.appendChild(element);

        if ($.util.ua.ie6) {
            $('.webatm-notification-center').css('position', 'absolute');
        }
        this.notify = function (options) {
            var n = new FE.sys.webww.ui.notification(options);
            if (!this.element().firstChild) {
                this.element().appendChild(n.element);
            } else {
                this.element().insertBefore(n.element, this.element().firstChild);
            }

            if (options.fadein == true) {
                $(n.element).fadeIn();
            }
            return n;
        }
        this.element = function () {
            return element;
        }
    }
})(jQuery);