
;(function($, D){

/*弹出层*/
	showDiv = function(id){
		var bg_node = document.getElementById('bg');
		document.getElementById(id).style.display='block';
		bg_node.style.display='block';
		bg_node.relative = id;
		var obj = $("#"+id);
		
	    var t = 100;
	    var left = (document.body.scrollWidth  -obj.width())/2 + "px";
	    obj.css({"position":"absolute","top":"100px","left":left});
	    
	};

}


)(dcms, FE.dcms);

// 关闭自定义窗口
function closeDiv(){
	var bg_node = document.getElementById('bg');
	var id = bg_node.relative;
	bg_node.relative = null;
	bg_node.style.display='none';
	document.getElementById(id).style.display='none';

}
// 增加自定义参数到界面
function addTableRow(){
    var _customDsParamList = document.getElementById("customDsParamList");
    if (_customDsParamList.value == 0) {
        alert("请选择参数");
        return false;
    }
    else {
        closeDiv();
    }
    var fieldName = _customDsParamList.value;
    var fieldText = _customDsParamList.options[_customDsParamList.selectedIndex].text;
    _customDsParamList.value = 0;
    var tbobj = document.getElementById("subTable");
    var trobj, tdobj;
    var rowIndex = tbobj.rows.length;
    if (rowIndex == -1) {
        trobj = tbobj.insertRow(-1);
    }
    else {
        trobj = tbobj.insertRow(rowIndex);
    }
    var autoTableRowData = new Array(fieldText, fieldName, '<input name="' + fieldName + '" type="text" id="' + fieldName + '" size="16" dataType="LimitB" min="0" max="4000" msg="最多不超过4000字节"/><a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex,\'subTable\');return false;" class="btnS"><span class="inner">删除</span></a>');
    
    for (var i = 0; i < autoTableRowData.length; i++) {
        tdobj = trobj.insertCell(-1);
        tdobj.id = "god";
        tdobj.innerHTML = autoTableRowData[i];
    }
}

//删除1行   
function delTableRow(rowIndex, formid){
    var tbobj = document.getElementById(formid);
    if (rowIndex == -1) {
        if (tbobj.rows.length > 1) {
            tbobj.deleteRow(tbobj.rows.length - 1);
        }
    }
    else {
        tbobj.deleteRow(rowIndex);
    }
}
