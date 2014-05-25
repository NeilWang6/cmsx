window.focus();
window.onload = function(){
	var html_a = document.getElementsByTagName('a');
	var num = html_a.length;
	for(var i=0;i<num;i++) {
		var href = html_a[i].href;
		if(href && href.indexOf('javascript:') == -1) {
			if(href.indexOf('?') != -1) {
				html_a[i].href = href;
			} else {
				html_a[i].href = href;
			}
		}
	}

	var html_form = document.forms;
	var num = html_form.length;
	for(var i=0;i<num;i++) {
		var newNode = document.createElement("input");
		newNode.name = 'pc_hash';
		newNode.type = 'hidden';
		newNode.value = pc_hash;
		html_form[i].appendChild(newNode);
	}
}

$(document).ready(function(){
    $("#category_tree").treeview({
			control: "#treecontrol",
			persist: "cookie",
			cookieId: "treeview-black"
	});
});
function open_list(obj) {
	window.top.$("#current_pos_attr").html($(obj).html());
}