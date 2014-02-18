function edit(id,subject) {
	window.top.art.dialog({id:'edit'}).close();
	window.top.art.dialog({title:'修改菜单《'+subject+'》',id:'edit',iframe:'edit_menu.htm?id='+id,width:'600',height:'300'});
}
function add() {
	window.top.art.dialog({id:'add'}).close();
	window.top.art.dialog({title:'添加菜单',id:'add',iframe:'add_menu.htm',width:'600',height:'300'});
}
function addpid(pid) {
	window.top.art.dialog({id:'add'}).close();
	window.top.art.dialog({title:'添加菜单',id:'add',iframe:'add_menu.htm?pid='+pid,width:'600',height:'300'});
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
		var url='menu.htm?event_submit_do_save_menu='+obj.attr('action')+'&type='+obj.attr('post')+'&id='+obj.attr('id');
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
	if(confirm('您确实要删除这个菜单吗?')){
		$.get('menu.htm?event_submit_do_del_menu=true&type='+tab+'&id='+id,function (data){
			eval('var json='+data);
			if(json.msg) alert('msg');
			if(fun){
				eval(fun+'("'+data+'")');
			}else{
				alert('菜单删除成功');
				window.location.href=window.location.href;
			}
		});
	}
} 