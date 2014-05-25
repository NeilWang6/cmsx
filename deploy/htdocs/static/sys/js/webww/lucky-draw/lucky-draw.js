/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/15/12
 * Time: 8:46 AM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

(function ($) {

    jQuery.namespace("FE.sys.webww.luckydraw");
    FE.sys.webww.luckydraw.LuckyDraw = {
        newInstance: function() {
            var self = {};
            var luckyDrawText = FE.sys.webww.luckydraw.LuckyDrawText;
            var luckyDrawConfig = FE.sys.webww.luckydraw.LuckyDrawConfig;

            var runTime = null;  // 定时器
            var awardsLength = 11;  // 奖品个数
            var runStart = 0; // 色块的位置
            var curveMotionCurrentTime = 1; // 曲线运动当前时间
            var runSpeed = 60; //速度
            var fadeRunner = null; // 闪烁
            var isRunning = false;

            function getRecords() {
                var todayCounter = 0;
                var today = new Date();
                var todayFormat = today.format("yyyy-MM-dd");

                var url = luckyDrawConfig.queryDrawResult.render({
                    luckyDrawServer: luckyDrawConfig.luckyDrawServer,
                    promotionId: encodeURIComponent(luckyDrawConfig.promotionId)
                });
                $.log("查询抽奖记录: " + url);
                $.ajax(url, {
                    dataType: 'jsonp',
                    success: function(jsonData) {
                        if (jsonData.code !== "success") {
                            return;
                        }
                        var records = jsonData.data;
                        if ((records === null) || !jQuery.isArray(records)) {
                            return;
                        }
                        var i = 0;
                        for (i = 0; i < records.length; ++i) {
                            var record = records[i];
                            var recordDate = record.gmtModified;
                            recordDate = new Date(recordDate);
                            var recordFormat = recordDate.format("yyyy-MM-dd");
                            if (recordFormat === todayFormat) {
                                ++ todayCounter;
                            }
                        }
                        $.log("今天已经已经使用的抽奖次数: " + todayCounter);
                        if (todayCounter >= luckyDrawConfig.totalChances) {
                            $.log("今天的抽奖次数已经用完了");
                            popTip(luckyDrawText.mismatchConditionTitle,
                                luckyDrawText.mismatchConditionText);
                            return;
                        }
                        else {
                            doDrawLucky();
                        }
                    }
                });
            }

            /**
             * 开始旋转
             */
            function runRotate(i) {
                clearInterval(runTime);
                $("#draw-lumps li").eq(i).addClass("current").siblings().removeClass("current");
                if ($.browser.msie && ($.browser.version == "6.0")) {
                    $(".current").fadeIn(10).fadeOut(10);
                }
                if (runStart < awardsLength) {
                    ++ runStart;
                }
                else {
                    runStart = 0;
                }
                runTime = setInterval(function() {
                    runRotate(runStart);
                }, runSpeed);
            }

            /**
             * 结束旋转
             */
            function stopRotate(i, jsonData) {
                clearInterval(runTime);
                var current = $("#draw-lumps li").index($("#draw-lumps li.current")[0]);

                // 转3圈
                var index = i - current + (3 * (awardsLength + 1));
                var next = current;
                if (next >= awardsLength) {
                    next = 0;
                }
                easeOutQuad(index, next, jsonData);
            }

            /**
             * 停止旋转
             * @param index
             * @param next
             */
            function easeOutQuad(index, current, jsonData) {
                clearInterval(runTime);
                $("#draw-lumps li").eq(current).addClass("current").siblings().removeClass("current");
                if (runStart < awardsLength) {
                    ++ runStart;
                }
                else {
                    runStart = 0;
                }
                -- index;
                if (index !== 0) {
                    ++ curveMotionCurrentTime;
                    runTime=setInterval(function(){
                        easeOutQuad(index, runStart, jsonData);
                    },easeOut(curveMotionCurrentTime, 60 , 120, 25));
                }
                else {
                    runSpeed = 60;
                    curveMotionCurrentTime = 1;
                    $(".iframe-background").hide();
                    $.log("转盘已经停止");
                    isRunning = false;

                    if ($.browser.msie && ($.browser.version == "6.0")) {
                        // 闪烁
                        clearInterval(fadeRunner);
                        $("#draw-lumps li").css("display", "none");
                        $("#draw-lumps li .current").css("display", "block");
                        fadeRunner = setInterval(function() {
                            $(".current").fadeOut(500).fadeIn(500);
                        }, 1000);
                    }

                    var awardName = jsonData.data.outData.name;
                    if (awardName.indexOf(luckyDrawText.badLucksKeywords) >= 0) {
                        var number = Math.random();
                        number = number * 10;
                        number = parseInt(number, 10);
                        number = number % luckyDrawText.badLucks.length;
                        if (number >= luckyDrawText.badLucks.length) {
                            number = 0;
                        }
                        $.log("第" + number + "条Bad Luck信息");
                        var badLuck = luckyDrawText.badLucks[number];
                        popTip(badLuck.title, badLuck.text);
                    }
                    else {
                        popTip(luckyDrawText.goodLuckTitle,
                            luckyDrawText.goodLuckText.render({name:awardName}));
                    }

                    var loginId = FE.util.LoginId();
                    updateContacts(loginId, jsonData.data.promotionId,
                        jsonData.data.resultId);
                }
            }

            /**
             * 曲线算法,减速值
             */
            function easeOut(t,b,c,d){
                return c*(t/=d)*t*t + b;
            }

            /**
             * 浮出提示框
             * @param text
             */
            function popTip(title, text) {
                $("#draw-tip").remove();

                var tipDialogNode = document.createElement("div");
                tipDialogNode.id = "draw-tip";
                tipDialogNode.style.width = "240px";
                tipDialogNode.className = "dpl-dialog";
                // Title
                var tipDialogTitleNode = document.createElement("div");
                tipDialogTitleNode.className = "dpl-t";
                var titleNode = document.createElement("strong");
                titleNode.innerHTML = title;
                titleNode.className = "dpl-title";
                tipDialogTitleNode.appendChild(titleNode);
                var closeNode = document.createElement("a");
                closeNode.href = "javascript:;";
                closeNode.target = "_self";
                closeNode.className = "dpl-close";
                tipDialogTitleNode.appendChild(closeNode);
                tipDialogNode.appendChild(tipDialogTitleNode);

                // 正文
                var tipDialogContextNode = document.createElement("div");
                tipDialogContextNode.className = "dpl-d";
                var contextNode = document.createElement("div");
                contextNode.className = "dpl-m";
                contextNode.innerHTML = text;
                tipDialogContextNode.appendChild(contextNode);
                tipDialogNode.appendChild(tipDialogContextNode);
                var topNode = document.getElementById("top");
                topNode.appendChild(tipDialogNode);

                $.use('ui-core,ui-draggable,ui-dialog', function(){
                    var dialog = $('#draw-tip');
                    $(dialog).bind('dialogbefore', function(){
                        //$.log('custom before');
                    }).dialog({
                        fixed: true,
                        modal: false,
                        draggable: {
                            handle: 'div.dpl-t'
                        },
                        fadeOut: 200,
                        shim: true,
                        center: true
                    });
                    $('a.dpl-close').click(function(){
                        $(this).closest('div.dpl-dialog').dialog('close');
                    });
                });
            }

            /**
             * 调用公共抽奖服务,进行一次抽奖
             */
            function doDrawLucky() {
                // 如果用户第2次抽奖前没有关闭之前的中奖信息的提示框
                $("#draw-tip").remove();

                var url = luckyDrawConfig.doLuckyDraw.render({
                    luckyDrawServer:  luckyDrawConfig.luckyDrawServer,
                    promotionId: luckyDrawConfig.promotionId
                });
                $.log("抽奖的URL: " + url);
                $.ajax(url, {
                    dataType: 'jsonp',
                    success: function(jsonData) {
                        // 用户是否还有权限来抽奖
                        var isVaild = true;
                        if (jsonData.data === null) {
                            isVaild = false;
                        }
                        // 如果用户没有权限来抽奖了
                        if (!isVaild) {
                            $.log("用户抽奖次数已经达到上线了");
                            popTip(luckyDrawText.mismatchConditionTitle,
                                luckyDrawText.mismatchConditionText);
                            return;
                        }
                        if (jQuery.DEBUG) {
                            console.log("得到抽奖结果: %o", jsonData);
                            $.log("中奖的奖品的index: " + jsonData.data.outData.index);
                        }
                        var awardIndex = jsonData.data.outData.index;
                        awardIndex = parseInt(awardIndex, 10);
                        // 开始旋转转盘
                        $(".iframe-background").show();
                        runRotate(runStart);
                        setTimeout(function() {
                            stopRotate(awardIndex, jsonData);
                        }, 1000);
                    }
                })
            }

            /**
             * 更新中奖用户的联系人信息
             */
            function updateContacts(loginId, promotionId, resultId) {
                var url = "http://webww.1688.com/message/ajax/getMemberNames.htm?memberIds=" + encodeURIComponent(loginId);
                $.getScript(url, function() {
                    if ((typeof namesArr === "undefined") ||
                        (namesArr === null) ||
                        (!jQuery.isArray(namesArr))) {
                        $.log("访问: " + url + " 错误");
                        return;
                    }
                    var userProfile = namesArr[0];
                    var username = userProfile.uname;
                    var updateContactUrl = luckyDrawConfig.updateContacts.render({
                        luckyDrawServer:  luckyDrawConfig.luckyDrawServer,
                        promotionId: encodeURIComponent(promotionId),
                        resultId: encodeURIComponent(resultId),
                        contactName: encodeURIComponent(username)
                    });
                    $.ajax(updateContactUrl, {
                        dataType: 'jsonp',
                        success: function(jsonData) {
                            $.log("更新用户的信息成功: "+ loginId)
                        }
                    })
                })
            }

            /**
             * 开始抽奖
             */
            function beginDrawLucky() {
                $.log("开始抽奖喽 ......");
                getRecords();
            }

            /**
             * 弹出登录窗口
             */
            function popLogin() {
                jQuery.use("webww-logist", function () {
                    FE.sys.logist({
                        source:'webim',
                        aliDomain:'exodus.1688.com',
                        onLoginSuccess:function () {
                            $.log("logon to website success");
                            FE.sys.logist('close');
                            checkWangWangOnline();
                        },
                        onRegistSuccess:function () {
                            FE.sys.logist('close');
                            self.isShowWebWW = true;
                            checkWangWangOnline();
                        }
                    });
                });
            }

            /**
             * 检查WangWang是否在线
             */
            function checkWangWangOnline(){
                var loginId = FE.util.LoginId();
                $.log("用户的登录ID: " + loginId);
                $.ajax("http://amos.im.alisoft.com/mullidstatus.aw", {
                    dataType: 'jsonp',
                    data: 'uids=' + "cnalichn" + loginId,
                    success: function(data) {
                        var isOnline = false;
                        // 如果返回的信息中success为false时
                        if (data.success === false) {
                            isOnline = false;
                        }
                        else {
                            var onlineCode = data.data[0];
                            switch (onlineCode) {
                                case 1:
                                    isOnline = true;
                                    break;
                                default:
                                    isOnline = false;
                                    break;
                            }
                        }

                        if (isOnline) {
                            beginDrawLucky();
                        }
                        else {
                            $.log("WangWang没有在线");
                            popTip(luckyDrawText.mismatchConditionTitle,
                                luckyDrawText.mismatchConditionText);
                        }
                    }
                });
            }

            /**
             * 当点击抽奖按钮时的动作
             */
            function onClickDrawLucky() {
                if (isRunning) {
                    $.log("上一次抽奖还在运行中");
                    return;
                }
                isRunning = true;

                if ($.browser.msie && ($.browser.version == "6.0")) {
                    if (fadeRunner !== null) {
                        clearInterval(fadeRunner);
                    }
                    $(".current").fadeOut(1);
                }

                if (!FE.util.IsLogin()) {
                    popLogin();
                }
                else {
                    checkWangWangOnline();
                }
            }

            $("#draw-lucky").bind("click", onClickDrawLucky);

            return self;
        }
    }

})(jQuery);