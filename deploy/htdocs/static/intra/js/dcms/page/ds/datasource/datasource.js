/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-03-19
 */

 ;(function($, D){
    var confirmEl = $('#dcms-message-confirm');
    var searchPageForm = $('#js-search-page'),
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
	


	$("#btnRegisterModify").bind("click",function(event){
		event.preventDefault();
		var dsId = $("#datasourceId").val();
		document.location.href = D.domain + '/page/ds/datasource.htm?action=ds_datasource_action&event_submit_do_show_register_config=true&datasourceId=' + dsId;
		
	});
	
	$("#btnSaveRegisterConfig").bind("click",function(event){
		$.ajax({
		    url: D.domain + '/page/appCommand.htm?action=ds_datasource_action&event_submit_do_save_register_config=true&_input_charset=UTF-8',
		    type: "POST",
			async:false,
			data : $('#frmRegisterConfig').serialize(),
		})
		.done(function(o) {
	            if(o) {
					var _data = dcms.parseJSON(o);
	                if(_data.sucess==true ) {
	                    alert("保存成功");
	                }
	            }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
		});
	});
	
	// 有效性检查
	var _checkDsRegisterConfig = function( dsId){
		var _rst = true;
		$.ajax({
		    url: D.domain + '/page/appCommand.htm?action=ds_datasource_action&event_submit_do_check_ds_register_config=true&datasourceId=' + dsId,
		    type: "POST",
			async:false
		})
		.done(function(o) {
	            if(o) {
					var _data = dcms.parseJSON(o);
	                if(_data.sucess!=true ) {
	                    alert(_data.errorMsg);
	                    _rst = false;
	                }
	            }
		})
		.fail(function() {
			alert('系统错误，请联系管理员');
            _rst = false;
		});
		return _rst;
	}
	$("#btnMappingParam").bind("click",function(event){
		var dsId = $("#datasourceId").val();
		if(_checkDsRegisterConfig(dsId)){
		    var url= D.domain + '/page/ds/datasource.htm?action=ds_datasource_action&event_submit_do_mapping_param=true&datasourceId=' + dsId;
			document.location.href= url;
		}
	});
	$("#btnMappingOutput").bind("click",function(event){
		var dsId = $("#datasourceId").val();
		if(_checkDsRegisterConfig(dsId)){	
		    var url= D.domain + '/page/ds/datasource_schema.htm?action=ds_datasource_action&event_submit_do_mapping_output=true&datasourceId=' + dsId;
			document.location.href= url;
		}
	});
}


)(dcms, FE.dcms);


/**
 * 保存数据源叁数的详细信息
 * 
 * @returns {Boolean}
 */
function save() {
	var form1 = document.getElementById("form1");
	var flag = Validator.validate(form1, 3, "form1", "form1");
	if (flag == false) {
		return false;
	}

	var dsParamList = getParamList();
	document.getElementById('dsParamListValue').value = dsParamList;

	document.form1.submit();
}

/**
 * 删除一条数据源记录
 * 
 * @param id
 * @returns {Boolean}
 */
function del(id) {
	if (!window.confirm("删除后将不能找回，确定需要删除？")) {
		return false;
	}
	var form1 = document.getElementById("js-search-page");
	form1.action= document.getElementById("baseUrl").value + "/datasource.html";
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "datasourceId";
	input.value = id;
	form1.appendChild(input);
	document.getElementById("event_submit_do_query").name="event_submit_do_delete";
	form1.submit();
}

/**
 * 预览某一条数据源记录
 * 
 * @param id
 */
function perview(id) {
	modify(id);
}

/**
 * 对某一条数据源进行修改
 * 
 * @param id
 */
function modify(id) {
	var form1 = document.getElementById("js-search-page");
	form1.action= document.getElementById("baseUrl").value + "/datasource.html";
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "datasourceId";
	input.value = id;
	form1.appendChild(input);
	document.getElementById("event_submit_do_query").name="event_submit_do_getDatasource";
	
	form1.submit();
}


/**
 * 新增一条数据源
 * 
 * @returns {Boolean}
 */
function add() {
	var form1 = document.getElementById("addForm");
	var vaname = form1.elements["datasource.name"].value;
	if (vaname=="") {
		alert("请输入后台系统名称");
		return false;
	}
	form1.submit();
}

function associate() {
	var form1 = document.getElementById("inlineForm");//ZD.get("inlineForm");
	form1.submit();
}

function closeDiv(){
	var bg_node = document.getElementById('bg');
	var id = bg_node.relative;
	bg_node.relative = null;
	bg_node.style.display='none';
	document.getElementById(id).style.display='none';

}


		function getDataSourceId(id) {
		    if(id != null) {
				document.getElementById("asso_datasourceId").value = id;
				return true;
			}
			return false;
		}
		
		
		
/**
 * 数据源中新增一条属性信息
 */
function addTableRow() {
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
			'<select name="dataFormat" id="dataFormat"><option value="0">0-数字</option><option value="1" selected>1-字符串</option></select>',
			'<input name="defaultValue" type="text" id="defaultValue" size="10" dataType="LimitB" min="0" max="100" msg="此项非空，且最多不超过100字节"/>',
			'<select name="required" id="required"><option value="0">0-否</option><option value="1">1-是</option></select>',
			'<select name="intfShowFlag" id="intfShowFlag"><option value="0">0-否</option><option value="1">1-是</option></select>',
			'<select name="editType" id="editType"><option value="1">1-选择框</option><option value="2" selected>2-文本框</option><option value="3">3-颜色框</option><option value="7">7-隐藏字段</option><option value="8">8-区间</option><option value="9">9-自定义</option><option value="11">11-后台自增参数</option></select>',
			'<input class="num" name="dataLength" type="text" id="dataLength" size="10" maxLength="10" value="0" dataType="Integer" msg="此项必须数字"/>',
			'<input name="selectValue" type="text" id="selectValue" size="10"  dataType="LimitB" min="0" max="1024" msg="此项非空，且最多不超过1024字节"/>',
			'<input name="description" type="text" id="description" size="10" dataType="LimitB" min="1" max="1000" msg="此项非空，且最多不超过1000字节"/>',
			'<input class="num" name="orderNum" type="text" id="orderNum" value="0" size="5" maxLength="5" dataType="Custom" regexp="^[0-9]{1,8}|[0-9]{1,6}\.[0-9]{1,2}$" require="false" msg="此项必须数字"/>',
			'<a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex)" class="btnS"><span class="inner">删除</span></a>');

	for ( var i = 0; i < autoTableRowData.length; i++) {
		tdobj = trobj.insertCell(-1);
		tdobj.id = "god";
		tdobj.innerHTML = autoTableRowData[i];
	}
}

