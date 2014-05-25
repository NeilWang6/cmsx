/**
 * 提供一些通用的工具方法
 * @author xuping.nie
 */

//jQuery(document).ready(function ($) {
//    //所有flash触发的事件会被flash代码通过try catch捕获，而不打印错误信息，因此暂时提前捕获输出异常
//    $.util.flash.triggerHandler = function (o) {
//        try {
//            $('#' + o.swfid).triggerHandler(o.type, o);
//        } catch (e) {
//            console.log("catch exception:" + e.message + "\n" + e.stack);
//        }
//    }
//    $(document).ajaxError(function (e, xhr, settings, exception) {
//        console.log('error in: ' + settings.url + ' \n' + 'error:\n' + exception);
//    });
//});

// 扩展DATA格式化函数
Date.prototype.format = function (format) {
    var o = {
        "M+":this.getMonth() + 1, //month
        "d+":this.getDate(), //day
        "h+":this.getHours(), //hour
        "m+":this.getMinutes(), //minute
        "s+":this.getSeconds(), //second
        "q+":Math.floor((this.getMonth() + 3) / 3), //quarter
        "S":this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
function datetime(offset) {
    var timezone = parseInt(offset, 10);
    var d = new Date();
    var utc = d.getTime() + d.getTimezoneOffset() * 1000 * 60 + timezone * 1000 * 60 * 60;
    return new Date(utc);
}

function t12hourclock(offset) {
    var d = datetime(offset);
    var h = d.getHours();
    var suffix = '';
    if (h > 12) {
        h = h - 12;
        suffix = ' pm';
    } else {
        suffix = ' am';
    }
    if (h == 12) {
        suffix = ' pm';
    }
    if (h == 0) {
        h = 12;
        suffix = ' am';
    }
    var now = h + ':' + d.getMinutes() + suffix;
    return now;
}

//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function () {
    var self = this;
    if (/^(rgb|RGB)/.test(self)) {
        var aColor = self.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = self;
        }
        return strHex;
    } else if (reg.test(self)) {
        var aNum = self.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return self;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return self;
    }
};

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, '');
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, '');
}
String.prototype.fulltrim = function () {
    return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
}


