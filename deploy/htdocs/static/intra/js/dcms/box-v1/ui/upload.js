/**
 * @author springyu
 * @userfor  使用html5实现 ajax上传图片 组件
 * @date  2012-12-24
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

(function($) {
    /**
     * 上传按钮
     */
    $.fn.browseElement = function(data) {
        var accept = 'image/*', multiple = false, element = $(this);
        if(data && data.accept) {
            accept = data.accept;
        }
        if(data && data.multiple) {
            multiple = true;
        }
        var input = $("<input class='box-html5-upload-input' type='file' accept='" + accept + "'>");
        if(multiple) {
            input.attr('multiple', 'multiple');
        }

        input.css({
            "position" : "absolute",
            "z-index" : 9999,
            "cursor" : "pointer",
            "-moz-opacity" : "0",
            "filter" : "alpha(opacity: 0)",
            "opacity" : "0"

        });

        input.mouseout(function() {
            input.detach();

        });
        input.mouseleave(function() {
            input.detach();
        });
        element.mouseover(function() {
            input.offset(element.offset());
            input.width(element.outerWidth());
            input.height(element.outerHeight());
            $("body").append(input);
        });
        element.mouseenter(function() {
            input.offset(element.offset());
            input.width(element.outerWidth());
            input.height(element.outerHeight());
            $("body").append(input);
        });

        return input;
    };
    //实现上传功能
    $.ajaxTransport("+*", function(s) {
        var xhr;
        if(s.useXHR2)
            return {
                send : function(headers, complete) {
                    xhr = s.xhr();
                    xhr.open(s.type, s.url, s.async);

                    // This needs to be dynamically for the correct multipart boundary
                    delete headers["Content-Type"];
                    headers["X-Requested-With"] = "XMLHttpRequest";

                    for(i in headers ) {
                        xhr.setRequestHeader(i, headers[i]);
                    }

                    var callback = function(e) {
                        var responses = {
                            xml : xhr.responseXML,
                            text : xhr.responseText
                        };
                        complete(xhr.status, xhr.statusText, responses, xhr.getAllResponseHeaders());
                    };

                    xhr.addEventListener("load", callback, false);
                    xhr.addEventListener("error", callback, false);

                    if(s.progress) {//下载进度条事件
                        xhr.addEventListener("progress", s.progress, false);
                    }
                    if(s.upload && s.upload.load) {//在请求完成时才会
                        xhr.upload.addEventListener("load", s.upload.load, false);
                    }

                    if(s.upload && s.upload.loadstart) {//在请求开始时才会
                        xhr.upload.addEventListener("loadstart", s.upload.loadstart, false);
                    }
                    if(s.upload && s.upload.loadend) {//在请求结束,load之后时才会
                        xhr.upload.addEventListener("loadend", s.upload.loadend, false);
                    }
                    if(s.upload && s.upload.progress) {//上传进度条事件
                        xhr.upload.addEventListener("progress", s.upload.progress, false);
                    }

                    xhr.send(s.data);
                },

                abort : function() {
                    if(xhr) {
                        xhr.abort();
                    }
                }
            };
    });
    var defaults = {
        processData : false,
        contentType : false,
        type : "POST",
        useXHR2 : true,
        async : true,
        upload : {
            loadstart : function(evt) {

                var that = this, $win = $(window), width = $win.width();
                $('body').append('<div class="upload-progress"><div class="progress-holder"><span id="progress"></span></div><span class="percents"></span></div>');
                that.uploadProgress = $('.upload-progress');

                that.uploadProgress.css('left', (width - $('.progress-holder', that.uploadProgress).width()) / 2);
                that.progress = $('#progress', that.uploadProgress);
                that.percents = $('.percents', that.uploadProgress);
                that.uploadProgress.show(100);
            },
            loadend : function(evt) {
                var that = this;
                setTimeout(function() {
                    if(that.uploadProgress) {
                        that.uploadProgress.remove();
                    }
                }, 2000);

            },
            /**
             * 上传进度条默认方法
             * @param {Object} evt
             */
            "progress" : function(evt) {
                var that = this;
                if(evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total) + '%';
                    that.progress.css('width', percentComplete);
                    that.percents.html(percentComplete);
                    that.percents.data('value', percentComplete);

                }
            },
            "load" : function(evt) {
                var that = this;
                if(that.percents.data('value') !== '100%') {
                    that.progress.css('width', '100%');
                    that.percents.html('100%');
                }
            }
        }
    };

    $.upload = function(url, data, settings) {
        // Last argument can be success callback
        if( typeof settings == "function") {
            settings = {
                success : settings
            };
        }
        settings.url = url;
        settings.data = data;
        settings = $.extend({}, defaults, settings);

        return $.ajax(settings);
    };
})(dcms);

