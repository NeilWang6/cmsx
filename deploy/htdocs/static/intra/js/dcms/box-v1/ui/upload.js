/**
 * @author springyu
 * @userfor  ʹ��html5ʵ�� ajax�ϴ�ͼƬ ���
 * @date  2012-12-24
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

(function($) {
    /**
     * �ϴ���ť
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
    //ʵ���ϴ�����
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

                    if(s.progress) {//���ؽ������¼�
                        xhr.addEventListener("progress", s.progress, false);
                    }
                    if(s.upload && s.upload.load) {//���������ʱ�Ż�
                        xhr.upload.addEventListener("load", s.upload.load, false);
                    }

                    if(s.upload && s.upload.loadstart) {//������ʼʱ�Ż�
                        xhr.upload.addEventListener("loadstart", s.upload.loadstart, false);
                    }
                    if(s.upload && s.upload.loadend) {//���������,load֮��ʱ�Ż�
                        xhr.upload.addEventListener("loadend", s.upload.loadend, false);
                    }
                    if(s.upload && s.upload.progress) {//�ϴ��������¼�
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
             * �ϴ�������Ĭ�Ϸ���
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

