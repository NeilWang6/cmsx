function edit(id,subject) {
	window.top.art.dialog({id:'edit'}).close();
	window.top.art.dialog({title:'修改文章《'+subject+'》',id:'edit',iframe:'?type=content&do=info&cn=article&id='+id,width:'950',height:'600'});
}
function add() {
	window.top.art.dialog({id:'edit'}).close();
	window.top.art.dialog({title:'发布文章',id:'edit',iframe:'?type=content&cn=article&do=info',width:'950',height:'600'});
}
 

function confirm_delete(){
	if(confirm('您确实要删除这些资料吗？')) $('#myform').submit();
}
function confirm_nochecked(){
	if(confirm('您确实要解除审核吗？')) $('#myform').submit();
}
function confirm_checked(){
	if(confirm('您确实要审核吗？')) $('#myform').submit();
}
setcookie('refersh_time', 0);
function refersh_window() {
	var refersh_time = getcookie('refersh_time');
	if(refersh_time==1) {
		window.location.reload();
	}
}
  
function searchFun(){
	var url=$('#searchForm').attr('action');
	$('#searchForm').find(':input[name]').each(function (){
		if($(this).val()){
			url+='&'+$(this).attr('name')+'='+$(this).val();
		}
	});
	window.location.href=url;
	return false;
}
/*
 * 提交简单参数
 */
function postCmd(obj,fun){
	var admin_url=rooturl+admin_dir;
	if(obj.val()){
		var url='admins.ajax.php?action='+obj.attr('action')+'&type='+obj.attr('post')+'&id='+obj.attr('id');
		var paramstr=obj.attr('params');
		if(!paramstr) paramstr='';
		eval('params={'+paramstr+'}');
		params[obj.attr('name')]=obj.val();
		if(fun){
			$.post(url,params,function (data){
				eval(fun+'("'+data+'")');
			});
		}else{
			$.post(url,params);
		}
	}
}
function delFun(tab,id,fun){
	var admin_url=rooturl+admin_dir;
	//alert(admin_url);
	if(confirm('您确实要删除这个资料吗?')){
		$.get('admins.ajax.php?action=del&type='+tab+'&id='+id,function (data){
			eval('var json='+data);
			if(json.msg) alert('msg');
			if(fun){
				eval(fun+'("'+data+'")');
			}else{
				alert('资料删除成功');
				window.location.href=window.location.href;
			}
		});
	}
} 