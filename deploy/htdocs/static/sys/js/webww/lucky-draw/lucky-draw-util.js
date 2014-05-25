/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/17/12
 * Time: 10:21 AM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

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

/**
 * º”‘ÿJS
 * @param url
 * @param callback
 */
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                script.readyState == "complete"){
                script.onreadystatechange = null;
                if (callback) {
                    callback();
                }
            }
        };
    } else {  //Others
        script.onload = function(){
            if (callback) {
                callback();
            }
        };
    }

    document.body.appendChild(script);
}

function isIE9() {
    return !!window.XDomainRequest && function () {var obj = {'1':1, '0':1};for (var s in obj) return !+s;}();
}