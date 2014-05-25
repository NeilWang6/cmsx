/**
 * @author springyu
 * @userfor   ԭ�������������
 * @date  2013-01-06
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
;(function($, D) {

	//ʮ��������ɫֵ��RGB��ʽ��ɫֵ֮����໥ת��

	/*RGB��ɫת��Ϊ16����*/
	String.prototype.colorHex = function(arg) {

		//-------------------------------------
		//ʮ��������ɫֵ��������ʽ
		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
		var that = this;
		var type = /^(rgba\(|RGBA\()/.test(that) ? 'rgba' : 'default';
		type = /^(RGB\(|rgb\()/.test(that) ? 'rgb' : type;
		type = reg.test(that) ? 'hex' : type;
		switch(type) {
			case 'rgba':
				var aColor = that.replace(/(?:\(|\)|rgba|RGBA)*/g, "").split(",");
				var strHex = "";
				for(var i = 0; i < aColor.length - 1; i++) {
					var hex = Number(aColor[i]).toString(16);
					if(hex === "0") {
						hex += hex;
					}
					strHex += hex;
				}
				if(arg && arg === true) {
					strHex = '#' + strHex;
					if(strHex.length !== 7) {
						strHex = that;
					}
					return strHex;
				}

				return strHex;
				break;
			case 'rgb':
				var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
				var strHex = "";
				for(var i = 0; i < aColor.length; i++) {
					var hex = Number(aColor[i]).toString(16);
					if(hex === "0") {
						hex += hex;
					}
					strHex += hex;
				}
				if(arg && arg === true) {
					strHex = '#' + strHex;
					if(strHex.length !== 7) {
						strHex = that;
					}
					return strHex;
				}
				return strHex;
				break;
			case 'hex':
				var aNum = that.replace(/#/, "").split("");
				if(aNum.length === 6) {
					return that;
				} else if(aNum.length === 3) {
					var numHex = "#";
					for(var i = 0; i < aNum.length; i += 1) {
						numHex += (aNum[i] + aNum[i]);
					}
					return numHex;
				}
				break;
			default:
				return that;
				break;
		}

	};
	/**
	 * ��ʽ�����ڷ���
	 */

	Date.prototype.format = function(format) {
		var o = {
			"M+" : this.getMonth() + 1, //month
			"d+" : this.getDate(), //day
			"h+" : this.getHours(), //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
			"S" : this.getMilliseconds() //millisecond
		};
		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};

})(dcms, FE.dcms);
