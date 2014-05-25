FromTools = {
	//获取form原生对象
	getForm : function(target) {
		//传入id
		if( typeof target === 'string') {
			return document.getElementById(target);
		}
		//传入form jQuery对象
		if( target instanceof jQuery) {
			return target[0];
		}
		if( target instanceof dcms) {
			return target[0];
		}
		//form原生对象
		if( target instanceof Object&&target.elements) {
			return target;
		} else {
			console.log(target+' is invalid ');
		}
	},
	//将form构造成Map
	toMap : function(id) {
		var o = {};
		var form = FromTools.getForm(id);
		if(form == null) {
			return o;
		}
		for(var i = 0; i < form.elements.length; i++) {
			var el = form.elements[i];
			//如果是disable直接跳过
			if(el.disabled) {
				continue;
			}

			if(el.tagName.toLowerCase() == "input") {
				var type = el.type.toLowerCase();
				//对name和value做判断，过滤
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				//如果是按钮跳过
				if(type == "button") {
					continue;
				}
				if(el.name == "_sessionToken" || el.name == "_formResubmitToken") {
					continue;
				}
				if(type == "radio") {
					if(el.checked) {
						o[el.name] = el.value;
					}
					continue;
				}
				if(type == "checkbox") {
					if(el.checked) {
						o[el.name] = "1";
					} else {
						o[el.name] = "0";
					}
					continue;
				}
				if(type == "hidden" || type == "text") {
					o[el.name] = el.value;
					continue;
				}
				//其它的file等不予处理
			}

			if(el.tagName.toLowerCase() == "select") {
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				o[el.name] = el.value;
			}
		}
		return o;
	},
	toNewMap : function(id, excludeClass) {
		var o = {}, exclude = function(elm) {
			if(excludeClass && elm && elm.className) {
				var arr = elm.className.split(/\s+/g);
				for(var i = 0; i < arr.length; i++) {
					if(arr[i] == excludeClass) {
						return 1;
					}
				}
			}
			return 0;
		};
		var form = FromTools.getForm(id);
		if(form == null) {
			return o;
		}
		for(var i = 0; i < form.elements.length; i++) {
			var el = form.elements[i];
			//如果是disable直接跳过
			if(el.disabled) {
				continue;
			}
			if(el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "textarea") {
				var type = el.type.toLowerCase();
				//对name和value做判断，过滤
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				//如果是按钮跳过
				if(type == "button") {
					continue;
				}
				if(el.name == "_sessionToken" || el.name == "_formResubmitToken") {
					continue;
				}
				// 排除指定class
				if(excludeClass && exclude(el, excludeClass)) {
					continue;
				}
				if((type == "radio" || type == "checkbox" )) {
					if(el.checked) {
						var str1 = (el.value).replace(/\^/, '');
						str1 = str1.replace(/~/, '');
						o[el.name] = str1;
					}
					continue;
				}
				if(type == "hidden" || type == "text" || type == "textarea") {
					var str2 = (el.value).replace(/\^/, '');
					str2 = str2.replace(/~/, '');
					o[el.name] = str2;
					continue;
				}
				//其它的file等不予处理
			}

			if(el.tagName.toLowerCase() == "select") {
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				// 排除指定class
				if(excludeClass && exclude(el, excludeClass)) {
					continue;
				}
				var str = (el.value).replace(/\^/, '');
				str = str.replace(/~/, '');
				o[el.name] = str;
			}
		}
		return o;
	},
	toNewStr : function(id, excludeClass) {
		var map = FromTools.toNewMap(id, excludeClass || '');
		var arr = [];
		for(var item in map) {
			arr.push(item + "~" + map[item]);
		}
		return encodeURIComponent(arr.join("^"));
	},

	//将form构造成Map
	toQuery : function(id) {
		var map = FromTools.toMap(id);
		var arr = [];
		for(var item in map) {
			arr.push(item + "~" + map[item]);
		}
		return encodeURIComponent(arr.join("^"));
	},
	buildInputValue : function(inputs) {

		var strRow = "";
		if(inputs == "undefined" || inputs == undefined) {
			return "";
		}
		//非数组
		if(undefined == inputs.length) {
			var _tagName = inputs[j].tagName.toLowerCase();
			if(_tagName == "input" || _tagName == "select" || _tagName == "text") {
				strRow += inputs[j].name + "^" + inputs[j].value + "|";
			}
		} else {
			//数组组装行
			for(var j = 0; j < inputs.length; j++) {
				var _tagName = inputs[j].tagName.toLowerCase();
				if(_tagName == "input" || _tagName == "select" || _tagName == "text") {
					strRow += inputs[j].name + "^" + inputs[j].value + "|";
				}
			}
		}
		return strRow;
	},
	//将列表构造成prop1^value1|prop2^value2~prop1^value3|prop2^value4的多行多列的标模式，行之间用~分割；列直接用|分割；值用^表示
	toListQuery : function(id) {
		var strRst = "";
		var form = FromTools.getForm(id);
		if(form == null) {
			return o;
		}
		var trs = form.getElementsByTagName("tr");
		for(var i = 0; i < trs.length; i++) {
			var strRow = "";
			var inputs = trs[i].getElementsByTagName("input");
			strRow += FromTools.buildInputValue(inputs);
			var inputs = trs[i].getElementsByTagName("select");
			strRow += FromTools.buildInputValue(inputs);
			var inputs = trs[i].getElementsByTagName("text");
			strRow += FromTools.buildInputValue(inputs);
			strRst += strRow;
			if(i < trs.length - 1) {
				strRst += "~";
			}
		}
		return encodeURIComponent(strRst);
	},
	checkListDump : function(id) {
		var o = {};
		var form = FromTools.getForm(id);
		if(form == null) {
			return o;
		}
		var trs = form.getElementsByTagName("tr");
		for(var i = 0; i < trs.length; i++) {
			var inputs = trs[i].getElementsByTagName("input");
			if(inputs == "undefined") {
				continue;
			}
			for(var j = 0; j < inputs.length; j++) {
				if(inputs[j].name != "name") {
					continue;
				}
				if( typeof o[inputs[0].value] != "undefined") {
					return false;
				}
				o[inputs[0].value] = inputs[1].value;
			}

		}
		return true;
	}
};

/**
 * 删除一行属性信息
 *
 * @param rowIndex
 * @returns {Boolean}
 */
function delTableRow(rowIndex) {
	if(!window.confirm("删除后不可恢复，确定需要删除？")) {
		return false;
	}
	var tbobj = document.getElementById("subTable");
	if(rowIndex == -1) {
		if(tbobj.rows.length > 1) {
			tbobj.deleteRow(tbobj.rows.length - 1);
		}
	} else {
		tbobj.deleteRow(rowIndex);
	}
}

/**
 * 获取该标签下的所有参数列表信息
 *
 * @returns
 */
function getParamList() {
	return FromTools.toListQuery("subTable");
}

/**
 * 检查属性列中是否有重复行
 */
function checkDup() {
	var bRst = FromTools.checkListDump("subTable");
	if(!bRst) {
		alert("参数列表存在重复！");
	}
	return bRst;
}