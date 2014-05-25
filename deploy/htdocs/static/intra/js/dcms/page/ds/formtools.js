FromTools = {
	//��ȡformԭ������
	getForm : function(target) {
		//����id
		if( typeof target === 'string') {
			return document.getElementById(target);
		}
		//����form jQuery����
		if( target instanceof jQuery) {
			return target[0];
		}
		if( target instanceof dcms) {
			return target[0];
		}
		//formԭ������
		if( target instanceof Object&&target.elements) {
			return target;
		} else {
			console.log(target+' is invalid ');
		}
	},
	//��form�����Map
	toMap : function(id) {
		var o = {};
		var form = FromTools.getForm(id);
		if(form == null) {
			return o;
		}
		for(var i = 0; i < form.elements.length; i++) {
			var el = form.elements[i];
			//�����disableֱ������
			if(el.disabled) {
				continue;
			}

			if(el.tagName.toLowerCase() == "input") {
				var type = el.type.toLowerCase();
				//��name��value���жϣ�����
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				//����ǰ�ť����
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
				//������file�Ȳ��账��
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
			//�����disableֱ������
			if(el.disabled) {
				continue;
			}
			if(el.tagName.toLowerCase() == "input" || el.tagName.toLowerCase() == "textarea") {
				var type = el.type.toLowerCase();
				//��name��value���жϣ�����
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				//����ǰ�ť����
				if(type == "button") {
					continue;
				}
				if(el.name == "_sessionToken" || el.name == "_formResubmitToken") {
					continue;
				}
				// �ų�ָ��class
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
				//������file�Ȳ��账��
			}

			if(el.tagName.toLowerCase() == "select") {
				if(el.name == undefined || el.name == "" || el.value == undefined || el.value == "") {
					continue;
				}
				// �ų�ָ��class
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

	//��form�����Map
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
		//������
		if(undefined == inputs.length) {
			var _tagName = inputs[j].tagName.toLowerCase();
			if(_tagName == "input" || _tagName == "select" || _tagName == "text") {
				strRow += inputs[j].name + "^" + inputs[j].value + "|";
			}
		} else {
			//������װ��
			for(var j = 0; j < inputs.length; j++) {
				var _tagName = inputs[j].tagName.toLowerCase();
				if(_tagName == "input" || _tagName == "select" || _tagName == "text") {
					strRow += inputs[j].name + "^" + inputs[j].value + "|";
				}
			}
		}
		return strRow;
	},
	//���б����prop1^value1|prop2^value2~prop1^value3|prop2^value4�Ķ��ж��еı�ģʽ����֮����~�ָ��ֱ����|�ָֵ��^��ʾ
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
 * ɾ��һ��������Ϣ
 *
 * @param rowIndex
 * @returns {Boolean}
 */
function delTableRow(rowIndex) {
	if(!window.confirm("ɾ���󲻿ɻָ���ȷ����Ҫɾ����")) {
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
 * ��ȡ�ñ�ǩ�µ����в����б���Ϣ
 *
 * @returns
 */
function getParamList() {
	return FromTools.toListQuery("subTable");
}

/**
 * ������������Ƿ����ظ���
 */
function checkDup() {
	var bRst = FromTools.checkListDump("subTable");
	if(!bRst) {
		alert("�����б�����ظ���");
	}
	return bRst;
}