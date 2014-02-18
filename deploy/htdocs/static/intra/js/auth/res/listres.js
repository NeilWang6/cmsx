function edit(id,subject) {
	window.top.art.dialogid = "edit";
	window.top.art.dialog({id:'edit'}).close();
	window.top.art.dialog({title:'修改权限资源《'+subject+'》',id:'edit',iframe:'edit_res.htm?id='+id,width:'800',height:'400'});
}
function add() {
	window.top.art.dialogid = "add";
	window.top.art.dialog({id:'add'}).close();
	window.top.art.dialog({title:'添加权限资源',id:'add',iframe:'add_res.htm',width:'800',height:'400'});
}
function addpid(pid) {
	window.top.art.dialogid = "add";
	window.top.art.dialog({id:'add'}).close();
	window.top.art.dialog({title:'添加权限资源',id:'add',iframe:'add_res.htm?parentId='+pid,width:'800',height:'400'});
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
		var url='res.htm?event_submit_do_save_res=true&type='+obj.attr('post')+'&id='+obj.attr('id');
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
	if(confirm('您确实要删除这个权限资源吗?')){
		$.get('res.htm?event_submit_do_del_res=true&type='+tab+'&id='+id,function (data){
			eval('var json='+data);
			if(json.msg) alert('msg');
			if(fun){
				eval(fun+'("'+data+'")');
			}else{
				alert('权限资源删除成功');
				window.location.href=window.location.href;
			}
		});
	}
} 