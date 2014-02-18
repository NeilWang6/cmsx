//create by kevin 2009-06-05
//cascade bsm or province, city
//when option is '请选择...' then default value is '0'
//url : 
//value: you select option value, this.value
//id: cascade option's id
function selectNew(id,val,url,clearId){
	this.url = url;
	this.value = val;
	this.id = id;
	if(clearId != undefined){
		this.clearId = clearId; //will clear item's id
		var clsItem = document.getElementById(this.clearId);
		if(clsItem == undefined){
			alert(clearId + " is error defined, please check it!");
			return;
		}else{
			clsItem.options.length = 0;
			clsItem.options.add(new Option("请选择型号", "0"));
		}
	}
	this.args = 'id=' + val;
	//this is callback method by ajax
	this.addItem = function (response){
		var txt = response.responseText;
		var sel = document.getElementById(this.id);
		    sel.innerHTML = "";
			     var all = txt.split('==');
				 for(var i=0;i<all.length;i++){
					var option = all[i].split(',');
				     if(i==0){
				        sel.options.add(new Option(option[0], option[1]));
				     }else{
				       var optGroup =  all[i].split("#");
                       var tmp = optGroup[1].split("@");
                       var groupArr = optGroup[0].split(",");
                       if(all.length>2){//如果包含两个厂商则需加OPTGROUP
						       var group=document.createElement('OPTGROUP'); 
						       //group.style.color="#777777"; 
						       //group.style.fontStyle="normal";  
		                      // group.style.fontWeight="normal"; 
		                       //group.style.textAlign="center";
		                       group.label = groupArr[0];
		                       sel.appendChild(group);
                       }
                       for(var j=0;j<tmp.length-1;j++){
                           var op = tmp[j].split(",");
                           sel.options.add(new Option(op[0], op[1]));
                       }
                  }
				}
				
	}
	post(this.url, this.args, addItem);
}


function selectItem(id,val,url,clearId){
	this.url = url;
	this.value = val;
	this.id = id;
	if(clearId != undefined){
		this.clearId = clearId; //will clear item's id
		var clsItem = document.getElementById(this.clearId);
		if(clsItem == undefined){
			alert(clearId + " is error defined, please check it!");
			return;
		}else{
			clsItem.options.length = 0;
			clsItem.options.add(new Option("请选择型号", "0"));
		}
	}
	this.args = 'id=' + val;
	//this is callback method by ajax
	this.addItem = function (response){
		var txt = response.responseText;
		var sel = document.getElementById(this.id);
		    sel.innerHTML = "";
			     var all = txt.split('==');
				 for(var i=0;i<all.length;i++){
					var option = all[i].split(',');
				     if(i==0){
				        sel.options.add(new Option(option[0], option[1]));
				     }else{
				       var optGroup =  all[i].split("#");
                       var tmp = optGroup[1].split("@");
                       var groupArr = optGroup[0].split(",");
                       if(all.length>2){//如果包含两个厂商则需加OPTGROUP
						       var group=document.createElement('OPTGROUP'); 
						       //group.style.color="#777777"; 
						       //group.style.fontStyle="normal";  
		                      // group.style.fontWeight="normal"; 
		                       //group.style.textAlign="center";
		                       group.label = groupArr[0];
		                       sel.appendChild(group);
                       }
                       for(var j=0;j<tmp.length-1;j++){
                           var op = tmp[j].split(",");
                           sel.options.add(new Option(op[0], op[1]));
                       }
                  }
				}
				
	}
	post(this.url, this.args, addItem);
}
function selectItem2(url, value, id, clearId){
	this.url = url;
	this.value = value;
	this.id = id;
	if(clearId != undefined){
		this.clearId = clearId; //will clear item's id
		var clsItem = document.getElementById(this.clearId);
		if(clsItem == undefined){
			alert(clearId + " is error defined, please check it!");
			return;
		}else{
			clsItem.options.length = 0;
			clsItem.options.add(new Option("请选择...", "0"));
		}
	}
	this.args = 'id=' + value;
	//this is callback method by ajax
	this.addItem = function (response){
		var txt = response.responseText;
		var sel = document.getElementById(this.id);
		sel.options.length = 0;
		var all = txt.split('==');
		
 
		
		
		for(var i=0;i<all.length;i++){
			var option = all[i].split(',');
		    sel.options.add(new Option(option[0], option[1]));
		}
	}
	post(this.url, this.args, addItem);
}

//add by jackie on 2011-02-15
function selectItemPrice(url, value, id, clearId){
	this.url = url;
	this.value = value;
	this.id = id;
	if(clearId != undefined){
		this.clearId = clearId; //will clear item's id
		var clsItem = document.getElementById(this.clearId);
		if(clsItem == undefined){
			alert(clearId + " is error defined, please check it!");
			return;
		}else{
			clsItem.value = 0;
		}
		
	}
	//alert(this.value);
	this.args = 'id=' + value;
	//this is callback method by ajax
	this.addItem = function (response){
		var txt = response.responseText;
		var mhref = "/car/daikuan/"+ value +"/";
		var sel = document.getElementById(this.id);
		sel.value = txt;
		calcAutoCashAll();
		getModelHref(mhref);
	}
	post(this.url, this.args, addItem);
}

//add by jackie on 2011-02-17
function selectItemLoan(url, value, id, clearId){
	this.url = url;
	this.value = value;
	this.id = id;
	if(clearId != undefined){
		this.clearId = clearId; //will clear item's id
		var clsItem = document.getElementById(this.clearId);
		if(clsItem == undefined){
			alert(clearId + " is error defined, please check it!");
			return;
		}else{
			clsItem.value = 0;
		}
	}
	this.args = 'id=' + value;
	//this is callback method by ajax
	this.addItem = function (response){
		var txt = response.responseText;
		var mhref = "/car/quankuan/"+ value +"/";
		var sel = document.getElementById(this.id);
		sel.value = txt;
		calcAutoLoanAll();
		getModelHref(mhref);
	}
	post(this.url, this.args, addItem);
}

