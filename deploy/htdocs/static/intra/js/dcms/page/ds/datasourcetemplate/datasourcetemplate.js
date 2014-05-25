/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-03-19
 */

 ;(function($, D){
    var confirmEl = $('#dcms-message-confirm');
    pageNum = $('#js-page-num'),
    readyFun = [
        /**
         * 切换到第N页
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * 上一页、下一页
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * 跳到第几页
         */
        function(){
            $('#js-jumpto-page').click(function(e){
                var n = $('#js-jump-page').val();
                setPageNum(n);
            });
        }
    ];
     
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    
    function setPageNum(n){
        pageNum.val(n);
		var searchPageForm = document.getElementById("form1");
        searchPageForm.submit();
    }
 })(dcms, FE.dcms);
 

(function($, D){

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

	}	 
	

	 
}


)(dcms, FE.dcms);



function closeDiv(){
	var bg_node = document.getElementById('bg');
	var id = bg_node.relative;
	bg_node.relative = null;
	bg_node.style.display='none';
	document.getElementById(id).style.display='none';

}
	

/**
 * 数据源schema detail中新增一条属性信息
 */
function addDsSchemaDetailTableRow() {
	var tbobj = document.getElementById("subTable");
	var trobj, tdobj;
	var rowIndex = tbobj.rows.length;
	if (rowIndex == -1) {
		trobj = tbobj.insertRow(-1);
	} else {
		trobj = tbobj.insertRow(rowIndex);
	}

	var autoTableRowData = new Array(
			'<input name="name" type="text" id="name" size="10" dataType="LimitB" min="1" max="100" msg="此项非空，且最多不超过100字节"/>',
			'<input name="cnName" type="text" id="cnName" size="10" dataType="Require" dataType="LimitB" min="1" max="100" msg="此项非空，且最多不超过100字节"/>',
			'<select name="intfShowFlag" id="intfShowFlag"><option value="0">0-否</option><option value="1" selected>1-是</option></select>',
			'<input name="dataLength" type="text" id="dataLength" size="10" maxLength="10" value="0" dataType="Integer" msg="此项必须数字"/>',
			'<input name="description" type="text" id="description" size="10" dataType="LimitB" min="0" max="1000" msg="此项非空，且最多不超过1000字节"/>',
			'<input name="childSchemaId" type="text" id="childSchemaId" size="10" maxLength="10"  />',
			'<a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex)" class="btnS"><span class="inner">删除</span></a>');

	for ( var i = 0; i < autoTableRowData.length; i++) {
		tdobj = trobj.insertCell(-1);
		tdobj.id = "god";
		tdobj.innerHTML = autoTableRowData[i];
	}
}



/**
 * 数据源主schema的记录删除
 * 
 * @param id
 * @returns {Boolean}
 */
function del(id,tid) {
	if (!window.confirm("删除后将不能找回，确定需要删除？")) {
		return false;
	}
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "dsId";
	input.value = id;
	document.form1.appendChild(input);
	var inputTemplate = document.createElement("input");
	inputTemplate.type = "hidden";
	inputTemplate.name = "tId";
	inputTemplate.value = tid;
	document.form1.appendChild(inputTemplate);
	document.getElementById("event_submit_do_query_ds_template").name="event_submit_do_delete_ds_template_rel";
	document.form1.submit();
}

/**
 * 数据源主schema的详细信息预览查看
 * 
 * @param id
 */
function perview(id) {
	modify(id);
}

/**
 * 数据源主schema的详细信息的修改
 * 
 * @param id
 */
function modify(id) {
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "dsSchemaId";
	input.value = id;
	document.form1.appendChild(input);
	document.getElementById("event_submit_do_query_ds_schema").name="event_submit_do_getDsSchema";
	document.form1.submit();
}



/**
 * 添加一个新的数据源主schema
 * 
 * @returns {Boolean}
 */
function add() {
	var form1 = document.getElementById("addForm");
	var vaname = form1.elements["main.name"].value;
	if (StringUtils.isEmpty(vaname)) {
		alert("请输入数据源schema名称");
		return false;
	}

	var vadescription = form1.elements["main.description"].value;
	if (vadescription.length > 128) {
		alert("系统描述不能超过128个字符。");
		return false;
	}
	form1.submit();
}

/**
 * 数据源schema详细信息的保存
 * 
 * @returns {Boolean}
 */
function save() {
	var form1 = document.getElementById("form1");
	var flag = Validator.validate(form1, 3, "form1", "form1");
	if (flag == false) {
		return false;
	}

	var dsSchemaParamList = getParamList();
	document.getElementById('dsSchemaParamListValue').value = dsSchemaParamList;
	document.form1.submit();
}