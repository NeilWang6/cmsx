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
         * �л�����Nҳ
         */
        function(){
            $('.pages').live('click', function(e){
                e.preventDefault();
                var n = $(this).text();
                setPageNum(n);
            });
        },
        /**
         * ��һҳ����һҳ
         */
        function(){
            $('.dcms-page-btn').live('click', function(e){
                e.preventDefault();
                var n = $(this).data('pagenum');
                setPageNum(n);
            });
        },
        /**
         * �����ڼ�ҳ
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

/*������*/
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
 * ����Դschema detail������һ��������Ϣ
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
			'<input name="name" type="text" id="name" size="10" dataType="LimitB" min="1" max="100" msg="����ǿգ�����಻����100�ֽ�"/>',
			'<input name="cnName" type="text" id="cnName" size="10" dataType="Require" dataType="LimitB" min="1" max="100" msg="����ǿգ�����಻����100�ֽ�"/>',
			'<input name="mappingField" type="text" id="mappingField" size="10" dataType="LimitB" min="0" max="100" msg="������಻����100�ֽ�"/>',
			'<select name="intfShowFlag" id="intfShowFlag"><option value="0">0-��</option><option value="1" selected>1-��</option></select>',
			'<input name="dataLength" type="text" id="dataLength" size="10" maxLength="10" value="0" dataType="Integer" msg="�����������"/>',
			'<input name="description" type="text" id="description" size="10" dataType="LimitB" min="0" max="1000" msg="����ǿգ�����಻����1000�ֽ�"/>',
			'<input name="childSchemaId" type="text" id="childSchemaId" size="10" maxLength="10"  />',
			'<select name="primaryKeyFlag" id="primaryKeyFlag"><option value="0" selected>0-��</option><option value="1" >1-��</option></select>',
			'<select name="dataModifyFlag" id="dataModifyFlag"><option value="0" selected>0-��</option><option value="1" >1-��</option></select>',
			'<a href="#" onclick="delTableRow(this.parentNode.parentNode.rowIndex)" class="btnS"><span class="inner">ɾ��</span></a>');

	for ( var i = 0; i < autoTableRowData.length; i++) {
		tdobj = trobj.insertCell(-1);
		tdobj.id = "god";
		tdobj.innerHTML = autoTableRowData[i];
	}
}



/**
 * ����Դ��schema�ļ�¼ɾ��
 * 
 * @param id
 * @returns {Boolean}
 */
function del(id) {
	if (!window.confirm("ɾ���󽫲����һأ�ȷ����Ҫɾ����")) {
		return false;
	}
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "schemaId";
	input.value = id;
	document.form1.appendChild(input);
	document.getElementById("event_submit_do_query_ds_schema").name="event_submit_do_delete";
	document.form1.submit();
}

/**
 * ����Դ��schema����ϸ��ϢԤ���鿴
 * 
 * @param id
 */
function perview(id) {
	modify(id);
}

/**
 * ����Դ��schema����ϸ��Ϣ���޸�
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
 * ���һ���µ�����Դ��schema
 * 
 * @returns {Boolean}
 */
function add() {
	var form1 = document.getElementById("addForm");
	var vaname = form1.elements["main.name"].value;
	if (StringUtils.isEmpty(vaname)) {
		alert("����������Դschema����");
		return false;
	}

	var vadescription = form1.elements["main.description"].value;
	if (vadescription.length > 128) {
		alert("ϵͳ�������ܳ���128���ַ���");
		return false;
	}
	form1.submit();
}

/**
 * ����Դschema��ϸ��Ϣ�ı���
 * 
 * @returns {Boolean}
 */
function save() {
	var form1 = document.getElementById("form1");
	var flag = Validator.validate(form1, 3, "form1", "form1");
	if (flag == false) {
		return false;
	}
	//��ȡ������ֵ
    var primaryKeyFlags=document.getElementsByName('primaryKeyFlag');
    var  flag=0;
     for(var i=0;i<primaryKeyFlags.length;i++){
        if(primaryKeyFlags[i].value==1){
        	flag+=1;
        }
     }
     if(flag>1){
     	alert('����ֻ����һ����������ѡ��');
     	return false;
     }
	var dsSchemaParamList = getParamList();
	document.getElementById('dsSchemaParamListValue').value = dsSchemaParamList;
	document.form1.submit();
}