// JavaScript Document
//**copyright by exodus.1688.com
//**author:�Ų�
//**���ڴ�����Ŀ���ý����ͨ�þ�̬��������
//@cid:��Ŀ��Ӧ��ID
//************
var Citem= function(cid){
	this.id=cid;
	this.newitem={};
	this.fatherindex=[];//�洢��Ԫ�ص�˳�����
	this.fatherid=[];//�洢��Ԫ�ص�id
	//����HTML���룬���ӵ�body��ȥ
	this.InitialHtml=function(htmlid){
		var thehtml='<div id="cw" class="dialog-basic">\
						<div class="dialog-b">\
						<header><a href="#" class="close">�ر�</a><h5></h5></header>\
						<section>\
						<div  class="cw">\
                    	<div class="cw-block">\
                        	<div class="cw-categorylist">\
                            	<h3 class="cw-categorylist-title">������</h3>\
                            	<ul id="cw-categorylist1" class="cw-categorylist-box ui-portlets">\
                                </ul>\
                                <div class="cw-categorylist-addbar">\
                                	<div navtype="c" pid="cw-categorylist1" class="cw-categorylist-add cw-add-category"><span class="cw-categorylist-addtext">������Ŀ</span></div>\
                                    <div navtype="q" pid="cw-categorylist1" class="cw-categorylist-add cw-add-keyword"><span class="cw-categorylist-addtext">���ӹؼ���</span></div>\
                                </div>\
                            </div>\
                            <div class="cw-categorylist">\
                            	<h3 class="cw-categorylist-title">�����飺<span id="cw-categorylist-2"></span></h3>\
                            	<ul id="cw-categorylist2" class="cw-categorylist-box ui-portlets">\
                                </ul>\
                                <div class="cw-categorylist-addbar">\
                                	<div navtype="c" pid="cw-categorylist2" class="cw-categorylist-add cw-add-category"><span class="cw-categorylist-addtext">������Ŀ</span></div>\
                                    <div navtype="q" pid="cw-categorylist2" class="cw-categorylist-add cw-add-keyword"><span class="cw-categorylist-addtext">���ӹؼ���</span></div>\
                                </div>\
                            </div>\
                            <div class="cw-categorylist">\
                            	<h3 class="cw-categorylist-title">��Ŀ/�ؼ��֣�<span id="cw-categorylist-3"></span></h3>\
                            	<ul id="cw-categorylist3" class="cw-categorylist-box ui-portlets">\
                                </ul>\
                                <div class="cw-categorylist-addbar">\
                                	<div navtype="c" pid="cw-categorylist3" class="cw-categorylist-add cw-add-category"><span class="cw-categorylist-addtext">������Ŀ</span></div>\
                                    <div navtype="q" pid="cw-categorylist3" class="cw-categorylist-add cw-add-keyword"><span class="cw-categorylist-addtext">���ӹؼ���</span></div>\
                                </div>\
                            </div>\
                        </div>\
                        <hr class="cw-hr">\
                        <div class="cw-block">\
                        	<div class="cw-hotkeylist">\
                            	<h3 class="cw-categorylist-title">���Ѵʣ�<span id="cw-hotkey-title"></span></h3>\
                                <ul id="cw-categorylist4" class="cw-categorylist-box ui-portlets">\
                                </ul>\
                                <div class="cw-categorylist-addbar">\
                                	<div navtype="c" pid="cw-categorylist4" class="cw-categorylist-add  cw-add-category"><span class="cw-categorylist-addtext">������Ŀ</span></div>\
                                    <div navtype="q" pid="cw-categorylist4" class="cw-categorylist-add cw-add-keyword"><span class="cw-categorylist-addtext">���ӹؼ���</span></div>\
                                </div>\
                            </div>\
                            <div class="cw-urlinfo form-vertical">\
                            	<h3 class="cw-categorylist-title">�༭URL����<input type="hidden" id="isurlchanged" value="false"/></h3>\
                                <dl class="item-form"><dt class="cw-row  topic">����·����</dt><dd><span id="cw-guid-path">123</span></dd></dl>\
                                <dl class="item-form"><dt class="cw-row topic">��Ŀ���ƣ�</dt><dd><span id="cw-category-name" class="ank-categoryName"></span><input type="hidden" name="ank-categoryName" value="" id="cw-category-fullname"><input type="hidden" name="ank-categoryId" id="cw-category-nameid" value=""><span class="choose-category cw-item-icon-search">����</span><span class="delete-url-category cw-item-icon-deleteca">ɾ��</span></dd></dl>\
	                            <dl class="item-form"><dt class="fd-left topic">�����ؼ��ʣ�</dt><dd><input type="text" id="cw-search-keyword" value="" class="cw-form-text"><label for="cw-show-keyword">չʾ�ؼ��ʣ�</label><input type="text" id="cw-show-keyword" value="" class="cw-form-text"></dd></dl>\
	                            <dl class="item-form"><dt class="fd-left topic"> ����(��ǩ)�� </dt><dd><input type="text" name="tagParam" class="define-param cw-form-text" value=""><label for="tracelogParam">&nbsp;����(���)�� </label><input type="text" name="tracelogParam" class="define-param cw-form-text" value=""></dd></dl>\
                                <dl class="item-form">\
                                	<dt class="topic">ת��URL��&nbsp;</dt>\
                                	<dd>\
	                                    <select id="cw-switch-url" type="text">\
	                                    	<option value="1" selected="true">���г�</option>\
	                                        <option value="2">��ҵƷ����</option>\
	                                        <option value="3">ԭ����</option>\
											<option value="0">�Զ���</option>\
											</select>\
	                                    <input type="text" id="cw-switch-custom-url" value="http://" class="cw-form-text">\
                                    </dd>\
                                </dl>\
                                <dl class="cw-row item-form">\
                                	<dt class="topic">�������ԣ�</dt>\
                                	<dd><input type="checkbox" id="cw-url-iscolor" class="cw-form-checkbox">��ɫ����&nbsp;&nbsp;\
                                    <input type="checkbox" id="cw-url-isnew" class="cw-form-checkbox">"��"��ʶ&nbsp;&nbsp;\
                                    <input type="checkbox" id="cw-url-ishot" class="cw-form-checkbox">"��"��ʶ</dd>\
                                </dl>\
                                <div class="cw-row">\
                                	<input type="button" value="����" id="cw-form-button-add" class="btn-basic btn-gray mr16">\
                                    <input type="button" value="����" id="cw-form-button-delete" class="btn-basic btn-gray">\
                                </div>\
                            </div>\
                        </div>\
                        <hr class="cw-hr">\
  					</div>\
					<div class="alert_dialog">ddsfsf</div>\
					</section>\
					<footer id="cw-block-foot" class="cw-block">\
							<input type="hidden" value="" id="pageId" name="pageId">\
	                    	<input type="button" value="Ԥ��" id="cw-form-button-preview" class="btn-basic btn-blue mr16">\
	                         <input type="button" value="�ر�" id="cw-form-button-check" class="btn-basic btn-blue">\
                	</footer>\
                </div>\
            </div>';
  		if(htmlid!=undefined&&jQuery(htmlid)!=undefined){
  			jQuery(htmlid).append(thehtml);
  		}else{
  			jQuery("body").append(thehtml);
  		}
  		
	};
	//���¼���
	this.BindEvent=function(){
		//ʵʱ���������ؼ���
		jQuery("#cw-search-keyword").live("keyup",function(){
			jQuery("#cw-show-keyword").val(jQuery(this).val());
		});
		//��ÿһ��ĵ���¼�
		jQuery("li.cw-category-item").live("click",function(){
			// ����л�֮ǰ��Ҫ���浱ǰ��URL����
			
			var cid=jQuery(".cw-item-selected").attr("cid");
			var citem1=new Citem(cid);
			citem1.findCitemById();
			var ispassed=citem1.saveURL();
			if(ispassed===false) return false;
			//��ʼ�µ�ѡ�����
			if(jQuery(this).attr("cid")!=cid){ //����л��˵Ļ�
				cid=jQuery(this).attr("cid");
				var citem1=new Citem(cid);
				citem1.findCitemById();
				citem1.showSelected();
				citem1.showSelectButton();
				citem1.showChild();			
				citem1.showURL();
				//citem1.getCategoryNameById();
				citem1.showHotkey();
				//citem1.showDeleteButton();
				//citem1.deleteItem();
				return false;
			}
		});
		
		//ɾ��ĳ���¼���
		jQuery("span.cw-item-icon-delete").live("click",function(event){
			//!!!̫��Ҫ�ˣ���ff��������µ�ð�ݼ����Բ�ͬ
			var cid=jQuery(this).parent("li").attr("cid");
			var citem1=new Citem(cid);
			citem1.findCitemById();
			citem1.deleteItem();
			//over��
			
			return false; //�Ϳ�����ֹð���ˡ��Ǻ�
		});
		//over
		
		//��ÿһ���hover�¼�
		jQuery("li.cw-category-item").live("mouseover",function(){
			var cid=jQuery(this).attr("cid");
			var citem1=new Citem(cid);
			//citem1.findCitemById();
			citem1.showDeleteButton();
			
		});
		//over
		
		//�϶�����
		jQuery(function($){
			$.use('ui-portlets', function(){
				var updatedata="";
				//var tempitem={};
				
				var ischanged=false;
				var demo1 = $('.cw-categorylist-box').portlets({
					items: '>li',
					start:function(e,ui){
						updatedata=""
						ischanged=false;
					},
					change:function(e,ui){ //λ�øı�������
						ischanged=true;
					},
					stop:function(e, ui){
						if(ischanged){
							
							var thiscid=ui.currentItem.attr("cid");
							var newitem=new Citem(thiscid);
							var thesystemurl=jQuery("#elf_url").val();
							newitem.findCitemById();
							updatedata=newitem.postOrderId();
							jQuery.ajax({
								traditional: true, //��ֹ���������������һ��[]
								type:"post",
								url:thesystemurl+"/tools/change_nav_order.do",
								data:updatedata,
								cache:false,
								beforeSend:function(){},
								success:function(data,textStatus){	
									if(data=="OK"){
										
										var newitem=new Citem(thiscid);
										newitem.findCitemById();
										newitem.changeItemPosition();
									}
								},
								complete:function(){},
								error:function(){}	
							});
						}
					},
					cursorAt: {
						top: 5,
						left:5
					},
					opacity: .5,
					modal: false
				});
			});
		});
		//�϶��������
		
		//����URL��
		jQuery("#cw-form-button-add").live("click",function(){
			var cid=jQuery(".cw-item-selected").attr("cid");
			var citem1=new Citem(cid);
			citem1.findCitemById();
			citem1.saveURL();
		});
		//over
		
		//����URL���ð�
		jQuery("#cw-form-button-delete").live("click",function(){
			
			jQuery("#cw-search-keyword").val("");
			jQuery("#cw-show-keyword").val("");
			jQuery("#cw-switch-url").val(1);
			jQuery("#cw-switch-custom-url").hide();
			jQuery("#cw-switch-custom-url").val("");
			
			jQuery("#cw-url-ishot").attr("checked",false);
			jQuery("#cw-url-isnew").attr("checked",false);
			jQuery("#cw-url-iscolor").attr("checked",false);
			//jQuery("#cw-form-button-add").click();
		});
		//over
		
		//��ʾ�Զ���url
		jQuery("#cw-switch-url").live("change",function(){
			if(jQuery("#cw-switch-url").val()=="0"){
				jQuery("#cw-switch-custom-url").show();
			}else{
				jQuery("#cw-switch-custom-url").val("");
				jQuery("#cw-switch-custom-url").hide();
			}
		});
		//over
		
		//���������Ӱ�ť��ӹ��ܰ�
		var ank_dialog,navtype,boxid,parentid,ishotkey;
		jQuery("div.cw-add-keyword").live("click",function(){
			//clear content
			jQuery("ul.ank-categorylist-box","#ank").empty();
			jQuery(".ank-newkeyword-real").empty();
			//over
			navtype=jQuery(this).attr("navtype");
			boxid=jQuery(this).attr("pid");
			parentid="0";
			ishotkey="0";
			switch(boxid){
				case"cw-categorylist2":
					parentid=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					break;
				case"cw-categorylist3":
					parentid=jQuery("#cw-categorylist2 .cw-item-icon-selected:visible").parent().attr("cid");
					break;
				case"cw-categorylist4":
					//parentid=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
					//parentid=jQuery(".cw-item-selected").attr("cid");
					parentid=jQuery(this).data('parentId');
					ishotkey="1";
					if( jQuery('.cw-block').find('.cw-item-selected').size() == 0 ){
						parentid = undefined;
					}
					break;
				default:	//Ĭ��Ϊ��һ����
					parentid="0";
					ishotkey="0";
					break;
				
			}
			if(parentid==undefined){
				alertInfo({type:"info",content:"�Բ�����ѡ�����Ӧ�ĸ���Ŀ"},function(){});
				return false;
			}else{
				jQuery.use('ui-dialog',function(){
					jQuery('#ank').dialog({
						modal: true,
	                    shim: true,
	                    draggable: true,
	                    center: true,
	                    open: function(){
	                    	jQuery('#ank').find('h5').html("<input type='hidden' value='' class='ank-boxid'/><input type='hidden' value='' id='ank-parentid'/>��ӹؼ���")
	                    	jQuery(".ank-boxid").val(boxid);//����BOXID
						  	jQuery("#ank-parentid").val(parentid);//parentid
							var keyword1=new Keyword();
							keyword1.Initial();					//��ɶԻ������Ŀ���ݳ�ʼ��
							keyword1=null;
	                    },
	                    close: function(){
	                    	//removeOtherNUll
	                    	jQuery(".boxy-wrapper").not(jQuery(".boxy-wrapper:has(.boxy-content)")).remove();
							 /*
							 var keyword1=new Keyword();
							 keyword1.unloadList();
							 keyword1=null;
							 */
	                    }
					})
				})
				// if(ank_dialog){ 
				// 	ank_dialog.show();
				// 	ank_dialog.moveToY(30);
				// }else{
				// 	ank_dialog= new Boxy("#ank", {
				// 		  modal: true, //ģʽ�Ի����ǲ����϶��ġ�
				// 		  title:"<input type='hidden' value='' class='ank-boxid'/><input type='hidden' value='' id='ank-parentid'/>��ӹؼ���",//��ü��ϱ���Ϳ�����
				// 		  //menuid:Menu.GetActiveMenuID(),
				// 		  center:false,
				// 		  afterShow:function(){
				// 			this.moveToY(30);
				// 			jQuery(".ank-boxid").val(boxid);//����BOXID
				// 		  	jQuery("#ank-parentid").val(parentid);//parentid
				// 			var keyword1=new Keyword();
				// 			keyword1.Initial();					//��ɶԻ������Ŀ���ݳ�ʼ��
				// 			keyword1=null;
				// 		  },
				// 		  afterHide:function(){
							 
				// 			 this.removeOtherNull();
				// 			 /*
				// 			 var keyword1=new Keyword();
				// 			 keyword1.unloadList();
				// 			 keyword1=null;
				// 			 */
				// 		  }
						  
				// 	  });
				// }
				return false;
				
			}
			
		});
		//over
		
		//�����Ŀ
		jQuery("span.delete-url-category").live("click",function(){
			jQuery("#cw-category-name").text("");
			jQuery("#cw-category-fullname").val("");
			jQuery("#cw-category-nameid").val("");
		});
		//over
		
		//Ԥ������
		jQuery("#cw-form-button-preview").live("click",function(){
			var pageid=jQuery("#pageId").val();
			window.open(get_cms_url()+"/page/preview_checked_page.html?page_id="+pageid+"&template_name=&template_id=0", "newwindow", "");
		});
	};
	//��������б������飬�������������ӵ���Ӧ��json���ݵ��У�����Ϊ"sortArray":[];,ismust�Ƿ�ǿ�Ƹ��£���ѡ��
	//Ŀǰ���ַ�ʽ��������
	/*
	this.sortItem=function(jsonobj,ismust){
		var mustis=ismust||false;
		if(jsonobj.sortArray==null||jsonobj.sortArray==undefined||mustis==true){	//�����û�������
			delete	jsonobj.sortArray;
			var lastid="0";
			var orderarray=[];
			var jsonitem="";
			var i=0;//�洢�ж��ٸ�����
			for(jsonitem in jsonobj){
				if(jsonobj[jsonitem].nextNavId==null||jsonobj[jsonitem].nextNavId=="0"||jsonobj[jsonitem].nextNavId==0||jsonobj[jsonitem].nextNavId==""){
					lastid=jsonitem;	//�ҵ����һ����ID
				}
				i++;
			}
			jsonitem="";
			if(i>0){
				orderarray.unshift(lastid)
				for(var j=1;j<i;j++){
					for(jsonitem in jsonobj){
						if(jsonobj[jsonitem].nextNavId!=null&&jsonobj[jsonitem].nextNavId==lastid){
							orderarray.unshift(jsonitem)
							lastid=jsonitem;
						}else{
							continue;
						}
						
					}
				}
			}
			jsonobj.sortArray=orderarray;
			return orderarray;
		}else{
			//alert("yes");
			return jsonobj.sortArray;
		}
	};
	*/
	this.Initial=function(){
		var categorylist1="";
		var navtypeclass=""; //����ǹؼ��ʾ���Ҫ��������ʾ��ͬ�ı���
		var myjson=categoryJson; //all the list @areas
		
		//set the navigation block
		jQuery("#cw-categorylist1").html("");
		jQuery("#cw-categorylist2").html("");
		jQuery("#cw-categorylist3").html("");
		jQuery("#cw-categorylist4").html("");
		if(!this.isTrue(myjson))//�����û������
		{
			this.InitailURL();
			return false;
		}	
			
		
		for(var i=0;i<myjson.length;i++){
			myjson[i].isHotKey=false;
			if(!myjson[i].category)
				navtypeclass="cw-hotkey-item";
			categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
			navtypeclass="";
			
			
		}
		jQuery("#cw-categorylist1").html(categorylist1);
		//���õ�����
		categorylist1="";
		myjson=myjson[0].treeList; 
		if(this.isTrue(myjson)){	//�������һ��
			  
			  for(var i=0;i<myjson.length;i++){
				  
				  myjson[i].isHotKey=false;
				  if(!myjson[i].category)
					  navtypeclass="cw-hotkey-item";
				  categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
				  navtypeclass="";
			  }
			  jQuery("#cw-categorylist2").html(categorylist1);
			  //������������
			  categorylist1="";
			  myjson=myjson[0].treeList;
			  
			  if(this.isTrue(myjson)){	//�������һ��
				  
				  
				  for(var i=0;i<myjson.length;i++){
					  
					  myjson[i].isHotKey=false;
					  if(!myjson[i].category)
						  navtypeclass="cw-hotkey-item";
					  categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
					  navtypeclass="";
				  }
				  jQuery("#cw-categorylist3").html(categorylist1);
			  }
		}
		//�����ȴ�
		categorylist1="";
		myjson=categoryJson[0].hotList;
		if(this.isTrue(myjson)){	//�������һ��
			
			for(var i=0;i<myjson.length;i++){
				
				myjson[i].isHotKey=true;
				if(!myjson[i].category)
					navtypeclass="cw-hotkey-item";
				categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
				navtypeclass="";
			}
			
			jQuery("#cw-categorylist4").html(categorylist1);
		}
		jQuery("#cw-categorylist1 .cw-category-item").eq(0).addClass("cw-item-selected");
		jQuery("#cw-categorylist1 .cw-item-icon-selected").eq(0).show();
		jQuery("#cw-categorylist2 .cw-item-icon-selected").eq(0).show();
		//��ʾ�������
		
		//����Ĭ��URL
		
		this.id=categoryJson[0].id;
		if(this.id!=null&&this.id!=undefined){
		  this.newitem=categoryJson[0];
		  this.newitem.navigationPath=this.newitem.showName;
		  this.showURL();
		 
		}else{
			this.InitailURL();
		}
		
		
	};
	this.findCitemById=function(){
		var isfinded=false;
		//��Ȳ��Ҷ���
		var ct=categoryJson; 
		var ct1=null;
		var ct2=null;
		var ct3=null, 
		findObjByPath = function(rootObj, parentPath){
			var parent = rootObj, current = null;
			for(var i = 1; i <= parentPath.length; i++){
				var j = parentPath[i-1];
				var item = parent ? parent[j] : null;
				parent = (item && item.treeList) ? item.treeList : null;
				// ��������ϵ
				if(item && current){
					item.parent = current;
				}
		        current = item;				
			}
			return current;
		},	
		findParentIdAndPath = function(findObj, fatherIds, navPath){
			var obj = findObj;
			do {
				fatherIds.push(obj.id);// = [obj.id].concat(fatherIds);
				navPath.push(obj.showName); //= [obj.showName].concat(navPath);
				obj = obj.parent;
			} while(obj);
			fatherIds.reverse();
			navPath.reverse();
		},
		setFindItem = function(retItem, findObj, parentPath, fatherIds, navPath, isHot, parentId){
			retItem.fatherindex = parentPath;
			retItem.fatherid = fatherIds;
			retItem.newitem = findObj;
			retItem.newitem.navigationPath= navPath.join(">>");
			retItem.newitem.isHotKey= isHot;
			retItem.newitem.parentId = parentId;		
		},
		findInList = function(rootObj, parentPath, retItem){
			var findObj = findObjByPath(rootObj, parentPath), list;
			if(findObj){
				// �ҵ�ǰ����
				if(findObj.id == retItem.id){
					var fatherIds = [], navPath = [], parentId = findObj.parent ? findObj.parent.id : 0;
					findParentIdAndPath(findObj, fatherIds, navPath);
					setFindItem(retItem, findObj, parentPath, fatherIds, navPath, false, parentId);
					return true;
				}
				// ���ȴ�
				if(findObj.hotList){
					list = findObj.hotList;
					for(var s = 0; s < list.length; s++){						
						if(list[s].id == retItem.id){
							var fatherIds = [], navPath = [], parentId = findObj.id, hotPath = parentPath.concat(s);
							findParentIdAndPath(findObj, fatherIds, navPath);
							// �����ȴ�·��
							fatherIds.push(list[s].id);
							fatherIds.hotHit = true;
							navPath.push(list[s].showName);
							setFindItem(retItem, list[s], hotPath, fatherIds, navPath, true, parentId);
							return true;
						}
					}	
				}
			}
			return false;
		};
				
		// ����������Ŀ����ID		
		for (var i=0; i<ct.length; i++){
			if (findInList(ct, [i], this)) break;			
			for (var j=0, ct1=ct[i].treeList; j < ct1.length; j++){
				if (findInList(ct, [i, j], this)) break;
				for (var k=0; k < ct1[j].treeList.length; k++){
					if (findInList(ct, [i, j, k], this)) break;	
				}				
			}
		}
	
	};
	/**
	  * ��������ָ����ID����
	  * path:���Դ�һ��������������·��
	  */
	this.findObjectById = function(list, id, path){
		if (list) {
			for(var i=0; i < list.length; i++){
				if(list[i].id == id){
					if(path) path.push(i);
					return list[i];
				}  
				if(list[i].treeList) {
					var obj = this.findObjectById(list[i].treeList, id, path);
					if(obj) return obj;
				}
			}
		}
		return null;
	};
	//����һ��
	//@isCategory--����ǹؼ��ʻ�����Ŀ
	//@boxid����������ID
	//@newitemobj--��Ҫ���ӵĶ�������{id,showName,categoryName}ÿ��������������ָ�ʽ
	this.addItem=function(isCategory, boxid, newitemobj){
		var temparray=[];
		var fatherids=[];
		var myjson=[];
		switch(boxid){
			case "cw-categorylist1":
				temparray=categoryJson;
				break;
			case "cw-categorylist2":
				fatherids[0]=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
				myjson=categoryJson;
				for(var i=0;i<myjson.length;i++){
					if(myjson[i].id==fatherids[0]){
						temparray=myjson[i].treeList;
						break;
					}
						
				}
				break;
			case "cw-categorylist3":
				fatherids[0]=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
				fatherids[1]=jQuery("#cw-categorylist2 .cw-item-icon-selected:visible").parent().attr("cid");
				myjson=categoryJson;
				for(var i=0;i<myjson.length;i++){
					if(myjson[i].id==fatherids[0]){
						myjson=myjson[i].treeList;
						break;
					}
						
				}
				for(var i=0;i<myjson.length;i++){
					if(myjson[i].id==fatherids[1]){
						temparray=myjson[i].treeList;
						break;
					}						
				}
				break;
			case "cw-categorylist4":
				if(newitemobj && newitemobj.length && newitemobj[0].parentId){
					var obj = this.findObjectById(categoryJson, newitemobj[0].parentId);
					if(obj) temparray = obj.hotList;
				}
				/*
				fatherids[0]=jQuery("#cw-categorylist1 .cw-item-icon-selected:visible").parent().attr("cid");
				myjson=categoryJson;
				for(var i=0;i<myjson.length;i++){
					if(myjson[i].id==fatherids[0]){
						temparray=myjson[i].hotList;
						break;
					}
						
				}
				break;
				*/
			
		}
		
		for(var i=0;i<newitemobj.length;i++){
			temparray.push(newitemobj[i]);//����һ�����ݵ�jsonֵ��
			this._addItemLi(isCategory||newitemobj[i].isCategory,boxid,newitemobj[i].id,newitemobj[i].showName,newitemobj[i].orderId);
		}
		
	};
	//����dom����һ����¼
	this._addItemLi=function(isCategory,boxid,cid,showkeyword,orderId){
		  var navtypeclass="";
		  var showkeywordnow=showkeyword
		  if(isCategory=="0")
		  		navtypeclass="cw-hotkey-item";
		  if(boxid=="cw-categorylist1"||boxid=="cw-categorylist2")
		  		showkeywordnow+="<span class=\"cw-item-icon-selected\" style=\"display: none; \"></span>";
		  jQuery("#"+boxid).append("<li class=\"cw-category-item "+navtypeclass+"\"  orderId=\""+orderId+"\"  cid=\""+cid+"\">"+showkeywordnow+"<span class=\"cw-item-icon-delete\" style=\"display: none; \"></span></li>");
		 
	};
	//չʾ�Ӳ˵���ֻ��չʾ��һ������
	//
	this.showChild=function(){
		
		var thisitem=this.newitem;
		if(!this.isTrue(thisitem.isHotKey)){				//����Ƿ��ȴ�
		//this.showSelectButton(); //��ʾ��һ����ť
			var patharr=thisitem.navigationPath.split(">>");
			var categorylist1="";//�洢�ַ���html
			var templist=null;//���ö����˵�
			var templist2=null;//���������˵�
			var navtypeclass="";//�洢�ǲ��ǹؼ���
			if(patharr.length==1)	//�����1���˵�
			{	
				
				jQuery("#cw-categorylist2").html("");
				jQuery("#cw-categorylist3").html("");
				if(this.isTrue(thisitem.treeList)){
					templist=thisitem.treeList;
					
					
					 for(var i=0;i<templist.length;i++){	//չʾ�����˵�
						
						if(!templist[i].category)
						  navtypeclass="cw-hotkey-item";
						if(i==0)
						  categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+templist[i].orderId+"\"   cid=\""+templist[i].id+"\">"+templist[i].showName+"<span style='display:inline;' class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
						else
						  categorylist1+="<li class=\"cw-category-item  "+navtypeclass+"\" orderId=\""+templist[i].orderId+"\"    cid=\""+templist[i].id+"\">"+templist[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
						navtypeclass="";
					  }
					jQuery("#cw-categorylist2").html(categorylist1);
					
					//�����˵�����
					templist2=templist[0].treeList;
					
					categorylist1="";
					if(this.isTrue(templist2)){ //�������¼�Ŀ¼
						
						for(var i=0;i<templist2.length;i++){	//չʾ�����˵�
						 
						  if(!templist2[i].category)
						  navtypeclass="cw-hotkey-item";
						  categorylist1+="<li class=\"cw-category-item  "+navtypeclass+"\"  orderId=\""+templist2[i].orderId+"\"   cid=\""+templist2[i].id+"\">"+templist2[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
						  navtypeclass="";
						}
						jQuery("#cw-categorylist3").html(categorylist1);
					}
				}
					
				
			}else if(patharr.length==2){ //����Ƕ����˵�
				jQuery("#cw-categorylist3").html("");
				 if(this.isTrue(thisitem.treeList)){
					 templist=thisitem.treeList;
					  categorylist1="";
					  for(var i=0;i<templist.length;i++){
						 
						  if(!templist[i].category)
							navtypeclass="cw-hotkey-item";
						  if(i==0)
							categorylist1+="<li class=\"cw-category-item  "+navtypeclass+"\"  orderId=\""+templist[i].orderId+"\"   cid=\""+templist[i].id+"\">"+templist[i].showName+"<span style=\"display:inline;\" class=\"cw-item-icon-delete\"></span></li>";
						  else
							categorylist1+="<li class=\"cw-category-item  "+navtypeclass+"\"  orderId=\""+templist[i].orderId+"\"   cid=\""+templist[i].id+"\">"+templist[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
							navtypeclass="";
						}
						jQuery("#cw-categorylist3").html(categorylist1);
				 
				 }
			}
			
			categorylist1="";
		}
		
	};
	
	
	//չʾһ����Ŀ���ȴ�
	this.showHotkey=function(){
		if((!this.newitem.isHotKey)&&this.isTrue(this.newitem.hotList)){
			var thisitems=this.newitem.hotList;
			
			var categorylist1="";
			var navtypeclass="";
			for(var i=0;i<thisitems.length;i++){
				//������ȴ�һ��Ҫ���ȴʼ�������
				
				thisitems[i].isHotKey=true;
				if(!thisitems[i].category)
					navtypeclass="cw-hotkey-item";
				categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+thisitems[i].orderId+"\"   cid=\""+thisitems[i].id+"\">"+thisitems[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
				navtypeclass="";
			}
			jQuery("#cw-categorylist4").html(categorylist1);			
		}else if(this.newitem.isHotKey){
			
		}else{
			jQuery("#cw-categorylist4").html("");
		}
		// ���ʱ�����ȴʸ���Ŀ
		if(!this.newitem.isHotKey && this.newitem.id) {
		����jQuery(".cw-hotkeylist .cw-categorylist-add").data('parentId', this.newitem.id);
		}
	};
	//ɾ����
	this.deleteItem=function(){
		var self=this;
        jQuery('#enterButton').find('section').html('ɾ�����ָܻ�����ȷ��Ҫɾ��ô?');
        jQuery('#enterButton').dialog({
            modal: true,
            shim: true,
            draggable: true,
            center: true,
            open: function(){
                jQuery('.btn-cancel').unbind('click').click(function(){
                    jQuery('#enterButton').find('.close').click();
                    return false
                })

                jQuery('#makeSureOut').unbind('click').click(function(){
        			var thesystemurl=jQuery("#elf_url").val();
					jQuery.ajax({
						type:"get",
						url:thesystemurl+"/tools/delete_nav.do",
						data:"navId="+self.id,
						cache:false,
						beforeSend:function(){},
						success:function(data,textStatus){	
							if(data=="OK"){
								self._deleteCitemById(self.id);
							}
						},
						complete:function(){},
						error:function(){}
					});

					jQuery('#enterButton').find('.btn-cancel').trigger('click');
                })

            }
        })
        return false;

	};
	//@return json��ʽ�����ݷ��ظ�postʹ��{}
	this.postOrderId=function(){
		var postdata={"dataCount":0,"navId":[],"orderId":[]};	//�洢���ز���
		var thecidarray=[];		//�洢���е�li	
		var i=0;
		switch(this.fatherindex.length){
			case 1:			//�����һ����Ŀ
				thecidarray=jQuery("#cw-categorylist1 li");
				
				break;
			case 2:			
				if(this.newitem.isHotKey){	//������ȴ�
					
					thecidarray=jQuery("#cw-categorylist4 li");
				}else{
					
					thecidarray=jQuery("#cw-categorylist2 li");
				}
				break;
			case 3:
				
				thecidarray=jQuery("#cw-categorylist3 li");
				break;
		
		}
		postdata.dataCount=thecidarray.length;
		for(i=0;i<thecidarray.length;i++){//����˳��
					
							postdata.navId.push(thecidarray.eq(i).attr("cid"));
							postdata.orderId.push(i);
					
					
				}
		
		return postdata;
	};
	//�˷���������findCitemById()�����Ӷ���ö�fatherindex������
	//�ı�˳����������,��Ҫ�����޸ģ���������������������������������������
	//���ֻ����صı���json���ݵ�orderlist�����Լ�����
	
	this.changeItemPosition=function(){
		var theobjarray=categoryJson;
		var thecidarray=[];		//�洢���е�li	
		
		var i=0;
		var j=0;
		switch(this.fatherindex.length){
			case 1:			//�����һ����Ŀ
				thecidarray=jQuery("#cw-categorylist1 li");
				
				break;
			case 2:			
				if(this.newitem.isHotKey){	//������ȴ�
					theobjarray=categoryJson[this.fatherindex[0]].hotList;
					thecidarray=jQuery("#cw-categorylist4 li");
				}else{
					theobjarray=categoryJson[this.fatherindex[0]].treeList;
					thecidarray=jQuery("#cw-categorylist2 li");
				}
				break;
			case 3:
				theobjarray=categoryJson[this.fatherindex[0]].treeList[this.fatherindex[1]].treeList;
				thecidarray=jQuery("#cw-categorylist3 li");
				break;
		}
		
		for(i=0;i<thecidarray.length;i++){//����˳��
					for(j=0;j<theobjarray.length;j++) 
					{
						if(theobjarray[j].id==thecidarray.eq(i).attr("cid")){
							theobjarray[j].orderId=i;
							
						}
					}
					thecidarray.eq(i).attr("orderId",i);
				}
		this.sortObjByProperty(theobjarray,"orderId");
		
	};
	//����ĳ������ֵ��ĳ��������������
	this.sortObjByProperty=function(objarray,property,desc){
		var thearray=objarray;
		var sortbyproperty=function(a,b){
			return a[property]-b[property];
		};
		thearray.sort(sortbyproperty);
		if(desc=="desc")
			thearray.reverse();
		
	};
	//��ʼ��url��ʾΪ��
	this.InitailURL=function(){
		jQuery("#cw-guid-path").text("");
		jQuery("#cw-category-nameid").val("");
		jQuery("#cw-search-keyword").val("");
		jQuery("#cw-show-keyword").val("");
		jQuery("#cw-switch-url").val("1");
		jQuery("#cw-switch-custom-url").hide();
		jQuery("#cw-switch-custom-url").val("");
		jQuery("#cw-category-name").text("");
		jQuery("#cw-category-fullname").val("");
		jQuery("#cw-url-ishot").attr("checked",false);
		jQuery("#cw-url-isnew").attr("checked",false);
		jQuery("#cw-url-iscolor").attr("checked",false);
	};
	//չʾURL������Ϣ
	this.showURL=function(){
		var thisitem=this.newitem;
		jQuery("#cw-guid-path").text(thisitem.navigationPath);
		jQuery("#cw-category-nameid").val(thisitem.categoryId);
		jQuery("#cw-search-keyword").val(thisitem.searchKeyword);
		jQuery("#cw-show-keyword").val(thisitem.showKeyword);
		jQuery("#cw-switch-url").val(thisitem.defaultUrlId);
		jQuery("#cw-category-name").text(thisitem.fullCategoryName);
		jQuery("#cw-category-fullname").val(thisitem.fullCategoryName);
		// �Զ������
		var params = thisitem.props ? JSON.parse(thisitem.props): {};
		jQuery(".cw-urlinfo input.define-param").each(function(i){
				var name = jQuery(this).attr('name');
				jQuery(this).val(params[name]||'');
		});		
		
		if(thisitem.defaultUrlId!="0")
			jQuery("#cw-switch-custom-url").hide();
		else
			jQuery("#cw-switch-custom-url").show();
		if(thisitem.customUrl=="#")
			jQuery("#cw-switch-custom-url").val("");
		else
			jQuery("#cw-switch-custom-url").val(thisitem.customUrl);
			
		var ischecked=false;
		if(thisitem.colorFlag=="1"||thisitem.colorFlag.toLowerCase()=="y")
			ischecked=true;
		jQuery("#cw-url-iscolor").attr("checked",ischecked);
		
		ischecked=false;	
		if(thisitem.newFlag=="1"||thisitem.newFlag.toLowerCase()=="y")
			ischecked=true;
		jQuery("#cw-url-isnew").attr("checked",ischecked);
		
		ischecked=false;	
		if(thisitem.hotFlag=="1"||thisitem.hotFlag.toLowerCase()=="y")
			ischecked=true;
		jQuery("#cw-url-ishot").attr("checked",ischecked);
		
	};
	//��ȡurl�������Ŀ����
	this.getCategoryNameById=function(){
		var id=this.id;
		jQuery.ajax({
			type:"get",
			url:"http://ALIBABA-54473.hz.ali.com/getcname.php",
			data:"act=getcname&cid="+id,
			cache:false,
			dataType:"jsonp",
			beforeSend:function(){},
			success:function(data,textStatus){	
				
				jQuery("#cw-category-name").text(data.categoryName);
			},
			complete:function(){},
			error:function(){
				jQuery("#cw-category-name").text("��ȡʧ��");
			}
		});
	};
	//�ж��Ƿ�ı���
	this.isChanged=function(){
		var ischanged=false;//�ж��Ƿ�ı���ֵ
		var thisitem=this.newitem;
		var thisvalues=[];//�洢��Ϣ����Ϊajax������첽���ᵼ��������ʱ��ֵ�ı�
		if(!this.isTrue(thisitem.id)){
			
		}else{//���¶�����Ϣ
			thisvalues[0]=jQuery("#cw-category-nameid").val();
			thisvalues[1]=jQuery("#cw-search-keyword").val();
			thisvalues[2]=jQuery("#cw-show-keyword").val();
			thisvalues[3]=jQuery("#cw-switch-url  option:selected").val();
			thisvalues[4]=jQuery("#cw-switch-custom-url").val()||"#";
			ischanged=(thisitem.categoryId!=thisvalues[0]);
			ischanged=ischanged?true:(thisitem.searchKeyword!=thisvalues[1]);
			ischanged=ischanged?true:(thisitem.showKeyword!=thisvalues[2]);
			ischanged=ischanged?true:(thisitem.defaultUrlId.toString()!=thisvalues[3]);
			thisitem.customUrl=thisitem.customUrl||"#";
			ischanged=ischanged?true:(thisitem.customUrl!=thisvalues[4]);
			
			thisvalues[5]=(jQuery("#cw-url-iscolor").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.colorFlag!=thisvalues[5]);
			thisvalues[6]=(jQuery("#cw-url-isnew").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.newFlag!=thisvalues[6]);
			thisvalues[7]=(jQuery("#cw-url-ishot").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.hotFlag!=thisvalues[7]);
			thisvalues[8]=jQuery("#cw-category-fullname").val();
			ischanged=ischanged?true:(thisitem.fullCategoryName!=thisvalues[8]);				
			
		}
		return ischanged;
	};
	
	//����URL������Ϣ
	
	this.saveURL=function(){
		var ischanged=false;//�ж��Ƿ�ı���ֵ
		var thisitem=this.newitem;
		var thisvalues=[];//�洢��Ϣ����Ϊajax������첽���ᵼ��������ʱ��ֵ�ı�
		if(!this.isTrue(thisitem.id)){
		}else{
			
			
			//���¶�����Ϣ
			thisvalues[0]=jQuery("#cw-category-nameid").val();
			thisvalues[1]=jQuery("#cw-search-keyword").val();
			thisvalues[2]=jQuery("#cw-show-keyword").val();
			thisvalues[3]=jQuery("#cw-switch-url option:selected").val();
			thisvalues[4]=jQuery("#cw-switch-custom-url").val()||"#";
			ischanged=(thisitem.categoryId!=thisvalues[0]);
			ischanged=ischanged?true:(thisitem.searchKeyword!=thisvalues[1]);
			ischanged=ischanged?true:(thisitem.showKeyword!=thisvalues[2]);
			ischanged=ischanged?true:(thisitem.defaultUrlId.toString()!=thisvalues[3]);
			thisitem.customUrl=thisitem.customUrl||"#";
			ischanged=ischanged?true:(thisitem.customUrl!=thisvalues[4]);
			//alert("4"+ischanged);
			thisvalues[5]=(jQuery("#cw-url-iscolor").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.colorFlag!=thisvalues[5]);
			
			thisvalues[6]=(jQuery("#cw-url-isnew").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.newFlag!=thisvalues[6]);
			
			thisvalues[7]=(jQuery("#cw-url-ishot").attr("checked")==undefined)?"N":"Y";
			ischanged=ischanged?true:(thisitem.hotFlag!=thisvalues[7]);
			thisvalues[8]=jQuery("#cw-category-fullname").val();
			ischanged=ischanged?true:(thisitem.fullCategoryName!=thisvalues[8]);
			//����undefinedֵ
			thisvalues[8]=thisvalues[8]==undefined?"":thisvalues[8];
			thisvalues[0]=thisvalues[0]==undefined?"":thisvalues[0];
			//�����Զ������
			var params = {}, oldParam = thisitem.props ? JSON.parse(thisitem.props) : {};
			jQuery(".cw-urlinfo input.define-param").each(function(i){
				var value = jQuery.trim(jQuery(this).val()), name = jQuery(this).attr('name');
				value && (params[name] = value);
				if (!ischanged) {
					ischanged = params[name] != oldParam[name];
				}
			}), 
			props = JSON.stringify(params);
			
			if(thisvalues[2]==""&&thisvalues[8]==""){
				alertInfo({type:"error",content:"�Բ���չʾ�ؼ��ֺ���Ŀ���Ʋ���ͬʱΪ�գ�"},function(){});
				return false;
			}	
			if(ischanged){	//����༭��
				//�ж���û���ظ���
				var newfullnames,newcategoryname="",newshowname="";
				newfullnames=thisvalues[8].split(">>")
				if(newfullnames.length>0)
					newcategoryname=newfullnames[newfullnames.length-1];
				newshowname=thisvalues[2]||newcategoryname||thisvalues[1];
				var theitemli=jQuery("li[cid='"+thisitem.id+"']");
				var thealllis=theitemli.parent().find("li").not(theitemli[0]);
				
				for(var k=0;k<thealllis.length;k++){
					if(thealllis.eq(k).text().trim()==newshowname){
						alertInfo({type:"error",content:"�Բ����Ѿ�����ͬ��\""+newshowname+"\"��¼�����ˣ�"},function(){});
						return false;
					}
				}
				var pageid=jQuery("#pageId").val();
				var savedata={"pageId":pageid,"parentId":thisitem.parentId,"navId":thisitem.id,"categoryId":thisvalues[0],"fullCategoryName":encodeURIComponent(thisvalues[8]),"searchKeyword":encodeURIComponent(thisvalues[1]),"showKeyword":encodeURIComponent(thisvalues[2]),"defaultUrlId":thisvalues[3],"customUrl":encodeURIComponent(thisvalues[4]),"colorFlag":thisvalues[5],"newFlag":thisvalues[6],"hotFlag":thisvalues[7],"navType":thisitem.navType, "props":encodeURIComponent(props)};
				var thesystemurl=jQuery("#elf_url").val();		
				//����over
				jQuery.ajax({
					type:"post",
					url:thesystemurl+"/tools/update_nav.do?charset=utf-8",
					data:savedata,
					cache:false,
					beforeSend:function(){},
					success:function(data,textStatus){	
						if(data=="OK"){
							var tempshowname=thisitem.showName;
							
							
							thisitem.categoryId=thisvalues[0];
							thisitem.searchKeyword=thisvalues[1];
							thisitem.showName=newshowname;//showname ��ȡ����	
							if(thisvalues[1]!=""){	//�����ؼ��ֲ�Ϊ����һ��ת��Ϊ�ؼ���
								thisitem.category=false;
								theitemli.addClass("cw-hotkey-item");								
							}else if(thisvalues[8]==""&&thisvalues[2]!=""){		//����һ����������ؼ���Ϊ�գ�������Ŀ��Ϊ�ղ���չʾ�ؼ��ֲ�Ϊ�յ����Ϊ�ؼ���
								thisitem.category=false;
								theitemli.addClass("cw-hotkey-item");
							}else{ //��������ؼ���Ϊ��ת��Ϊ��Ŀ
								thisitem.category=true;
								theitemli.removeClass("cw-hotkey-item");
							}
							
							//�޸���ʾ
							var temphtml=theitemli.html();
							temphtml=temphtml.replace(tempshowname,thisitem.showName);
							theitemli.html(temphtml)
							//over
							thisitem.showKeyword=thisvalues[2];
							thisitem.props = props;
							thisitem.defaultUrlId=thisvalues[3];
							thisitem.customUrl=thisvalues[4];
							thisitem.colorFlag=thisvalues[5];
							thisitem.newFlag=thisvalues[6];
							thisitem.hotFlag=thisvalues[7];
							thisitem.fullCategoryName=thisvalues[8];
							jQuery("#isurlchanged").val("true"); //���ñ������״̬
							alertInfo({type:'success',content:'����ɹ�'},function(){})
						}else{
							alertInfo({type:"info",content:data},function(){});
						}
					},
					complete:function(){},
					error:function(){}
				});
			}
		}
	};
	this.deleteURL=function(){
		var thisitem=this.newitem;
		var that=this;
		//����over
			jQuery.ajax({
				type:"get",
				url:"http://ALIBABA-54473.hz.ali.com/addurl.php",
				data:"act=deleteurl&cid="+thisitem.id,
				dataType:"jsonp",
				cache:false,
				beforeSend:function(){},
				success:function(data,textStatus){	
					if(data.stauts=="ok"){
						thisitem.categoryName="0";
						thisitem.searchKeyword="";
						
						
						var temphtml=jQuery("li[cid='"+thisitem.id+"']").html();
						temphtml=temphtml.replace(thisitem.showKeyword,"������ؼ���");
						jQuery("li[cid='"+thisitem.id+"']").html(temphtml)
						thisitem.showKeyword="������ؼ���";
						
						thisitem.defaultUrlId="0";
						thisitem.customUrl="";
						thisitem.colorFlag="0";
						thisitem.newFlag="0";
						thisitem.hotFlag="0";
						that.showURL();
					}
				},
				complete:function(){},
				error:function(){}
			});
	};
	//��ʾѡ��״̬
	this.showSelected=function(){
		jQuery(".cw-category-item").removeClass("cw-item-selected"); //ȥ������ѡ�еģ�ֻ����һ��
		jQuery("li[cid='"+this.id+"']").addClass("cw-item-selected");
	};
	//ѡ��ĳһ��
	//������findCitemById������Ҫ��ʼ����ֱ����ɵ���
	this.chooseItem=function(){
		jQuery("#cw-categorylist1").html("");
		jQuery("#cw-categorylist2").html("");
		jQuery("#cw-categorylist3").html("");
		jQuery("#cw-categorylist4").html("");
		
		var self=this;
		var categorylist1="";
		var myjson=categoryJson; 
		var navtypeclass="";
		//���²��ָ�����ʾǰ����li���
		switch(self.fatherid.length){	
			
			case 1:	//˵������һ������
				for(var i=0;i<myjson.length;i++){
					myjson[i].isHotKey=false;
					if(!myjson[i].category)
						navtypeclass="cw-hotkey-item";
					categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
					navtypeclass="";
					
				}
				jQuery("#cw-categorylist1").html(categorylist1);
				
				break;
			case 2:
				for(var i=0;i<myjson.length;i++){
					myjson[i].isHotKey=false;
					if(!myjson[i].category)
						navtypeclass="cw-hotkey-item";
					categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
					navtypeclass="";
					
				}
				jQuery("#cw-categorylist1").html(categorylist1);
				
				if(self.newitem.isHotKey){//������ȴ�
					//�����ȴ�
					categorylist1="";
					myjson=categoryJson[self.fatherindex[0]].hotList;
					if(this.isTrue(myjson)){	//�������һ��
						
						for(var i=0;i<myjson.length;i++){
							
							myjson[i].isHotKey=true;
							if(!myjson[i].category)
								navtypeclass="cw-hotkey-item";
							categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
							navtypeclass="";
						}
						
						jQuery("#cw-categorylist4").html(categorylist1);
					}
				}else{
					//���ö�����Ŀ
					categorylist1="";
					myjson=categoryJson[self.fatherindex[0]].treeList;
					if(this.isTrue(myjson)){	//�������һ��
						
						for(var i=0;i<myjson.length;i++){
							
							myjson[i].isHotKey=true;
							if(!myjson[i].category)
								navtypeclass="cw-hotkey-item";
							categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
							navtypeclass="";
						}
						
						jQuery("#cw-categorylist2").html(categorylist1);
					}
				}
				
				break;
			case 3:	//˵����������Ŀ
				for(var i=0;i<myjson.length;i++){
					myjson[i].isHotKey=false;
					if(!myjson[i].category)
						navtypeclass="cw-hotkey-item";
					categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
					navtypeclass="";
					
				}
				jQuery("#cw-categorylist1").html(categorylist1);
				
					//���ö�����Ŀ
					categorylist1="";
					myjson=categoryJson[self.fatherindex[0]].treeList;
					if(this.isTrue(myjson)){	//�������һ��
						
						for(var i=0;i<myjson.length;i++){
							
							myjson[i].isHotKey=true;
							if(!myjson[i].category)
								navtypeclass="cw-hotkey-item";
							categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-selected\"></span><span class=\"cw-item-icon-delete\"></span></li>";
							navtypeclass="";
						}
						
						jQuery("#cw-categorylist2").html(categorylist1);
					}
					
					//����������Ŀ
					categorylist1="";
					myjson=categoryJson[self.fatherindex[0]].treeList[self.fatherindex[1]].treeList;
					if(this.isTrue(myjson)){	//�������һ��
						
						for(var i=0;i<myjson.length;i++){
							
							myjson[i].isHotKey=true;
							if(!myjson[i].category)
								navtypeclass="cw-hotkey-item";
							categorylist1+="<li class=\"cw-category-item "+navtypeclass+"\" orderId=\""+myjson[i].orderId+"\" cid=\""+myjson[i].id+"\">"+myjson[i].showName+"<span class=\"cw-item-icon-delete\"></span></li>";
							navtypeclass="";
						}
						
						jQuery("#cw-categorylist3").html(categorylist1);
					}
				break;
			
		}
		self.showSelectButton();
		self.showSelected();
		self.showChild();			
		self.showURL();
		self.showHotkey();
	};
	
	//��ʾ��һ����ť
	this.showSelectButton=function(){ //���������Ҫ��ʾ����Ҫ��ʾ��һ���Ļ��������ġ���������
		
		if(jQuery("#cw-categorylist4 > li[cid='"+this.id+"']").size()>0){//������ȴ����ù���
			jQuery("li[cid='"+this.fatherid[0]+"'] .cw-item-icon-selected").show();
		}else{				//���������������Ҫ������
			jQuery(".cw-item-icon-selected").hide();
			for(var i=0;i<this.fatherid.length;i++){
				jQuery("li[cid="+this.fatherid[i]+"] .cw-item-icon-selected").show();
			}
		}
	};
	//��ʾɾ����ť
	this.showDeleteButton=function(){
		jQuery("span.cw-item-icon-delete").hide();
		jQuery("li[cid='"+this.id+"'] .cw-item-icon-delete").show();
		
	};
	//����ɾ����ť
	this.hideDeleteButton=function(){
		Query("li[cid='"+this.id+"'] .cw-item-icon-delete").hide(2000);
		//jQuery("li[cid='"+this.id+"']").html(nowtext);
	};
	//ɾ����li�ؼ�
	this._deleteChildLiById=function(did){
		jQuery("li[cid='"+did+"']").remove();//�Ƴ��Լ�
		
	};
	//������finditembyid���Һã�Ȼ���ȡfatherindex
	//ɾ��һ����Ŀ��Ϣ,�������������
	this._deleteCitemById=function(did){	
		var hotId = -1,
		fatherIndexArray = [].concat(this.fatherindex), 
		fatheridArray = [].concat(this.fatherid);		
		if (this.fatherid.hotHit) {
			hotId = fatheridArray.pop();
			var parentId = fatheridArray.pop();
			var parentObj = this.findObjectById(categoryJson, parentId);
			if (parentObj && parentObj.hotList) {
				parentObj.hotList.splice(fatherIndexArray.pop(), 1);
			}			
		} else {
			var	selector = ["#cw-categorylist2", "#cw-categorylist3", "#cw-categorylist4"];
			//�����ѡ��״̬�Ļ�,����Ӳ˵�
			if (jQuery("li[cid='"+did+"'] .cw-item-icon-selected").css("display")!="none") {
				for(var i = fatherIndexArray.length - 1; i < selector.length; i++){
					jQuery(selector[i]).html("");
				}
			}
			// ��ջ���		
			var arr = categoryJson, parentObj = arr, len = fatherIndexArray.length;
			if (len > 1) {
				for( ; i < len -1; i++){
					parentObj = arr;
					arr = parentObj ? parentObj[fatherIndexArray[i]].treeList : null;
				}
			}
			if (parentObj) {
				parentObj.splice(fatherIndexArray.pop(), 1);
			}
		}

		this._deleteChildLiById(did);	
		
	};
	//�ж϶����Ƿ�Ϊ��
	this.isTrue=function(newobj){
		if(newobj==false||newobj==null||newobj==undefined||newobj==""||typeof(newobj)==undefined||newobj.toString()==""){
			return false;
		}else if(typeof(newobj)=='object'){
			for(var obi in newobj){
				return true;
			}
			return false;
		}else{
			return true;
		}
		
	};
};
