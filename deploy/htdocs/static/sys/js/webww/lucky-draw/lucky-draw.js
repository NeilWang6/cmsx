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

            var runTime = null;  // ��ʱ��
            var awardsLength = 11;  // ��Ʒ����
            var runStart = 0; // ɫ���λ��
            var curveMotionCurrentTime = 1; // �����˶���ǰʱ��
            var runSpeed = 60; //�ٶ�
            var fadeRunner = null; // ��˸
            var isRunning = false;

            function getRecords() {
                var todayCounter = 0;
                var today = new Date();
                var todayFormat = today.format("yyyy-MM-dd");

                var url = luckyDrawConfig.queryDrawResult.render({
                    luckyDrawServer: luckyDrawConfig.luckyDrawServer,
                    promotionId: encodeURIComponent(luckyDrawConfig.promotionId)
                });
                $.log("��ѯ�齱��¼: " + url);
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
                        $.log("�����Ѿ��Ѿ�ʹ�õĳ齱����: " + todayCounter);
                        if (todayCounter >= luckyDrawConfig.totalChances) {
                            $.log("����ĳ齱�����Ѿ�������");
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
             * ��ʼ��ת
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
             * ������ת
             */
            function stopRotate(i, jsonData) {
                clearInterval(runTime);
                var current = $("#draw-lumps li").index($("#draw-lumps li.current")[0]);

                // ת3Ȧ
                var index = i - current + (3 * (awardsLength + 1));
                var next = current;
                if (next >= awardsLength) {
                    next = 0;
                }
                easeOutQuad(index, next, jsonData);
            }

            /**
             * ֹͣ��ת
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
                    $.log("ת���Ѿ�ֹͣ");
                    isRunning = false;

                    if ($.browser.msie && ($.browser.version == "6.0")) {
                        // ��˸
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
                        $.log("��" + number + "��Bad Luck��Ϣ");
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
             * �����㷨,����ֵ
             */
            function easeOut(t,b,c,d){
                return c*(t/=d)*t*t + b;
            }

            /**
             * ������ʾ��
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

                // ����
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
             * ���ù����齱����,����һ�γ齱
             */
            function doDrawLucky() {
                // ����û���2�γ齱ǰû�йر�֮ǰ���н���Ϣ����ʾ��
                $("#draw-tip").remove();

                var url = luckyDrawConfig.doLuckyDraw.render({
                    luckyDrawServer:  luckyDrawConfig.luckyDrawServer,
                    promotionId: luckyDrawConfig.promotionId
                });
                $.log("�齱��URL: " + url);
                $.ajax(url, {
                    dataType: 'jsonp',
                    success: function(jsonData) {
                        // �û��Ƿ���Ȩ�����齱
                        var isVaild = true;
                        if (jsonData.data === null) {
                            isVaild = false;
                        }
                        // ����û�û��Ȩ�����齱��
                        if (!isVaild) {
                            $.log("�û��齱�����Ѿ��ﵽ������");
                            popTip(luckyDrawText.mismatchConditionTitle,
                                luckyDrawText.mismatchConditionText);
                            return;
                        }
                        if (jQuery.DEBUG) {
                            console.log("�õ��齱���: %o", jsonData);
                            $.log("�н��Ľ�Ʒ��index: " + jsonData.data.outData.index);
                        }
                        var awardIndex = jsonData.data.outData.index;
                        awardIndex = parseInt(awardIndex, 10);
                        // ��ʼ��תת��
                        $(".iframe-background").show();
                        runRotate(runStart);
                        setTimeout(function() {
                            stopRotate(awardIndex, jsonData);
                        }, 1000);
                    }
                })
            }

            /**
             * �����н��û�����ϵ����Ϣ
             */
            function updateContacts(loginId, promotionId, resultId) {
                var url = "http://webww.1688.com/message/ajax/getMemberNames.htm?memberIds=" + encodeURIComponent(loginId);
                $.getScript(url, function() {
                    if ((typeof namesArr === "undefined") ||
                        (namesArr === null) ||
                        (!jQuery.isArray(namesArr))) {
                        $.log("����: " + url + " ����");
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
                            $.log("�����û�����Ϣ�ɹ�: "+ loginId)
                        }
                    })
                })
            }

            /**
             * ��ʼ�齱
             */
            function beginDrawLucky() {
                $.log("��ʼ�齱� ......");
                getRecords();
            }

            /**
             * ������¼����
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
             * ���WangWang�Ƿ�����
             */
            function checkWangWangOnline(){
                var loginId = FE.util.LoginId();
                $.log("�û��ĵ�¼ID: " + loginId);
                $.ajax("http://amos.im.alisoft.com/mullidstatus.aw", {
                    dataType: 'jsonp',
                    data: 'uids=' + "cnalichn" + loginId,
                    success: function(data) {
                        var isOnline = false;
                        // ������ص���Ϣ��successΪfalseʱ
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
                            $.log("WangWangû������");
                            popTip(luckyDrawText.mismatchConditionTitle,
                                luckyDrawText.mismatchConditionText);
                        }
                    }
                });
            }

            /**
             * ������齱��ťʱ�Ķ���
             */
            function onClickDrawLucky() {
                if (isRunning) {
                    $.log("��һ�γ齱����������");
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