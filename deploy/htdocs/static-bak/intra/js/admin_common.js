function confirmurl(url,message) {
	url = url+'&pc_hash='+pc_hash;
	if(confirm(message)) redirect(url);
}
function redirect(url) {
	location.href = url;
}
//滚动条
$(function(){
	$(":text").addClass('input-text');
})

/**
 * 全选checkbox,注意：标识checkbox id固定为为check_box
 * @param string name 列表check名称,如 uid[]
 */
function selectall(name) {
	if ($("#check_box").attr("checked")==false) {
		$("input[name='"+name+"']").each(function() {
			this.checked=false;
		});
	} else {
		$("input[name='"+name+"']").each(function() {
			this.checked=true;
		});
	}
}
function openwinx(url,name,w,h) {
	if(!w) w=screen.width-4;
	if(!h) h=screen.height-95;
	url = url;
    window.open(url,name,"top=100,left=400,width=" + w + ",height=" + h + ",toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
}
//弹出对话框
function omnipotent(id,linkurl,title,close_type,w,h) {
	if(!w) w=700;
	if(!h) h=500;
	art.dialog({id:id,iframe:linkurl, title:title, width:w, height:h, lock:true},
	function(){
		if(close_type==1) {
			art.dialog({id:id}).close()
		} else {
			var d = art.dialog({id:id}).data.iframe;
			var form = d.document.getElementById('dosubmit');form.click();
		}
		return false;
	},
	function(){
			art.dialog({id:id}).close()
	});void(0);
}

// JavaScript Document
// Cars CMS 地图标注组件！
function mapadd1(textareaid, mapnumber){
	var uploadid = textareaid;
	var textareaid = textareaid;
	var funcName = map_add2;
	window.top.art.dialog({title:'地图标注',id:uploadid,iframe:"index.php?type=system&do=addmap&mapid="+mapnumber,width:'500',height:'420'}, function(){ if(funcName) {funcName.apply(this,[uploadid,textareaid]);}}, function(){window.top.art.dialog({id:uploadid}).close()});
}

function map_add2(uploadid,returnid){
	var d = window.top.art.dialog({id:uploadid}).data.iframe;
	var in_content = d.$("#mapid").html().substring(0);
	var in_content = in_content.split('|');
	$('#map_'+returnid).attr("value",in_content[0]);
	
}

function add400(textareaid, dealerid){
	var uploadid = textareaid;
	var textareaid = textareaid;
	var funcName = add400_2;
	window.top.art.dialog({title:'400分机号码选择',id:uploadid,iframe:"index.php?type=dealer&do=d400numlist&dealerid="+dealerid,width:'650',height:'420'}, function(){ if(funcName) {funcName.apply(this,[uploadid,textareaid]);}}, function(){window.top.art.dialog({id:uploadid}).close()});
}

function add400_2(uploadid,returnid){
	var d = window.top.art.dialog({id:uploadid}).data.iframe;
	var in_content = d.$("#d400_number").html().substring(0);
	var in_content = in_content.split('|');
	$('#d400_'+returnid).attr("value",in_content[0]);
	
}