jQuery.namespace("FE.sys.webww.ui");
(function ($) {
    if (!FE.sys.webww.ui.clickShow) {
        FE.sys.webww.ui.clickShow = function () {

            var _self = this;
            var defConfig = {
                targetId:"clickShowTargetId", // 相对定位的目标ID
                switchId:"", // 激活事件的目标ID
                contentId:"clickShowContentId",
                bodyClickClose:true, // 点击body关闭的开关
                showOrHidden:true, // content展开状态点击target是否能收起
                needMask:false,
                needXY:true,
                excursion:[0, 0],
                //关闭按钮的className 必须置于content元素内
                closeBtnsClassName:"",
                hide:false, // 是否隐藏

                onInit:function () {
                },
                unInit:function () {
                },
                onShow:function () {
                },
                unShow:function () {
                },
                onHidden:function () {
                },
                unHidden:function () {
                }
            };
            var config;
            var isInited = false;
            var dTarget, dContent, dSwitch, iframeMask;
            var canClose = true;
            _self.init = function (oConfig) {

                if (isInited)return false;
                config = $.extend(defConfig,oConfig );

                config.onInit.apply(_self);
                dTarget = $(config.targetId)[0];
                dContent = $(config.contentId)[0];
                dSwitch = (config.switchId == "" ? dTarget : $(config.switchId));
                dCloseBtns = (config.closeBtnsClassName == "" ? [] : $("." + config.closeBtnsClassName));


                if (!dSwitch)
                    return;
                $(dTarget).bind("click", _self.showDirectly);
                if (config.bodyClickClose) {
                    $(document.body).bind("click", _self.hiddenDirectly);
                }

                if (dCloseBtns) {
                    $(dCloseBtns).bind("click", function () {
                        _self.hiddenDirectly(null, true)
                    });
                }

                $(dSwitch).bind("mouseover", function () {
                    canClose = false;
                });
                $(dContent).bind("mouseover", function () {
                    canClose = false;
                });
                $(dSwitch).bind("mouseout", function () {
                    canClose = true;
                });
                $(dContent).bind("mouseout", function () {
                    canClose = true;
                });

                if (config.needMask) {
                    iframeMask = document.createElement("iframe");
                    iframeMask.className = "maskIframe";
                    iframeMask.style.display = "none";
                    var targetIndex = 0;
                    if (!isNaN($(dContent).css('zIndex'))) {
                        targetIndex = $(dContent).css('zIndex');
                    }
                    iframeMask.style.zIndex = targetIndex - 1;
                    iframeMask.style.top = "0px";
                    iframeMask.style.left = "0px";
//				if(AE.bom.isIE6 && location.protocol == "https:"){
//					iframeMask.src = globalImgServer+"/js/blank.html";
//				}
                    iframeMask.frameBorder = 0;
                    dContent.parentNode.appendChild(iframeMask);
                }
                config.unInit.apply(_self);

                return _self;
            };

            _self.showDirectly = function () {
                if (config.hide) {
                    return false;
                }
                config.onShow.apply(_self);
                if (config.showOrHidden && dContent.style.display != "none" && dContent.style.visibility != "hidden") {
                    canClose = false;
                    _self.hiddenDirectly(null, true);
                    return;
                }

                if (config.needXY) {
                    var xy = $(dTarget).offset();
                    dContent.style.visibility = 'hidden';
                    dContent.style.display = "";
                    parsePos(config.excursion);	//解析字符串坐标值
                    xy.left += config.excursion[0];
                    xy.top += config.excursion[1];
                    dContent.style.visibility = 'visible';
                    $(dContent).offset(xy);
                } else {
                    dContent.style.display = "";
                }

                if (config.needMask) {
                    iframeMask.style.display = "";
                    iframeMask.style.width = dContent.offsetWidth + "px";
                    iframeMask.style.height = dContent.offsetHeight + "px";
                    if (config.needXY) {
                        $(iframeMask).offset(xy);
                    }
                    iframeMask.style.visibility = "visible";
                }
                config.unShow.apply(_self);
            };

            _self.hiddenDirectly = function (ev, force) {
                config.onHidden.apply(_self);
                if (canClose || force) {
                    if (_self.afterHidden) {
                        _self.triggerHandler('afterHidden');
                    }
                    dContent.style.display = "none";
                    if (config.needMask) {
                        iframeMask.style.display = "none";
                    }
                    config.unHidden.apply(_self);
                }
            };

            _self.getConfig = function () {
                return config;
            };

            var parsePos = function (aPos) {
                if (typeof(aPos[0]) == "string") {
                    switch (aPos[0]) {
                        case'center':
                            aPos[0] = parseInt(dTarget.offsetWidth / 2);
                            break;
                        case'right':
                            aPos[0] = (dSwitch.offsetWidth - dContent.offsetWidth);
                            break;
                        default:
                            aPos[0] = 0;
                    }
                }
                if (typeof(aPos[1]) == "string") {
                    switch (aPos[1]) {
                        case'center':
                            aPos[1] = paseInt(dTarget.offsetHeight / 2);
                            break;
                        case'bottom':
                            aPos[1] = dTarget.offsetHeight;
                            break;
                        default:
                            aPos[1] = 0;
                    }
                }
                return aPos;
            }
        };
    }
})(jQuery);