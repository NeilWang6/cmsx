/**
 * @author zhaoyang.maozy
 * @userfor 编辑页面，导入页面
 * @date  2012.02.28
 */

;(function($, D, undefined) {
	D.EditModule = {};
	var domain = D.domain;
	/**
	 * 编辑组件处理
	 */
	D.EditModule.edit = function(data) {

		var confirmEl = $('#dcms-message-confirm-new'), awakeEl = $('#dcms-message-awake');
		if(data) {
			var moduleId = data.moduleId,type = data.type,moduleName,revertId = data.revertId?data.revertId:'';
			if(type && type==='module'){
				moduleName="组件";
			}else{
				moduleName="公用区块";
			}
			if(data.status) {
				var url="";
				if(type && type==='module'){
					if(data.codeType=='code'){
						url = domain + '/page/box/create_code_module.htm?overite=true&moduleId=' + moduleId+"&type="+type+"&revertId="+revertId;
					}else{
						url = domain + '/page/box/new_create_module.htm?moduleId=' + moduleId+'&type='+type+"&revertId="+revertId+"&flag=F&extParam=isYunYing:false";;
					}
				}else{
					//公用区块
					url = domain + '/page/box/edit_module.htm?moduleId=' + moduleId+'&type='+type+"&revertId="+revertId;					
				}
				
				
				if($(".publish-dialog").length==0){
					location.href =url;
				}else{
					window.open(url);					
				}	
			 
			} else if(data.lockedUser) {
				var tip='';
				if(data.internalUser){
					tip ='<div class="lock">'+data.lockedUser+'正在编辑此'+moduleName+'，你不能同时进行编辑！<br/>请联系<a href="http://work.alibaba-inc.com/work/search?keywords='+data.lockedUser+'&type=person" target="_blank">'+data.lockedUser+'</a>请他提交页面或关闭编辑器后你再继续编辑本页面!</div>';
				} else {
					tip ='<div class="lock">'+data.lockedUser+'正在编辑此'+moduleName+'，你不能同时进行编辑！<br/>请联系'+data.lockedUser+'请他提交页面或关闭编辑器后你再继续编辑本页面!</div>';
				}
				if(data.isAllow) {
					D.Msg.show(confirmEl, {
						//msg : '页面被' + data.lockedUser + '锁定! 是否现在解锁?',
						msg : tip,
						title : '提示',
						buttons : [{
							name : 'cancel',
							value : '我知道了',
							className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
							close : true
						}, {
							name : 'lock',
							value : '解锁',
							className : 'page-tip-btn submit-btn btn-basic  btn-gray',
							handle : function(e, msgObj) {
								var target = $(this);
								if(data.isAllow) {
									D.EditModule.unlockPage(moduleId, msgObj, target,type);
								} else {
									D.Msg.awake(awakeEl, {
										msg : '你没有解锁权限！',
										relatedEl : target
									});
								}
							}
						}]
					});
				} else {
					D.Msg.show(confirmEl, {
						msg : tip,
						title : '提示',
						buttons : [{
							name : 'cancel',
							value : '我知道了',
							className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
							close : true
						}]
					});
				}
			} else if(data.hasExists) {
				// 存在1个副本
				var operateButtons=[{
					name : 'goDraft',
					value : data.isSelf!==true ? '编辑他的草稿':'编辑草稿',
					className : 'page-tip-btn submit-btn btn-basic  btn-blue',
					handle : function(e, msgObj) {
						msgObj.dialog('close');
						var url;
						if(type && type==='module'){
							//还需要判断是否是源码编辑
							if(data.codeType=='code'){
								url = domain + '/page/box/create_code_module.htm?overite=false&moduleId=' + moduleId+"&type="+type;
							}else{
								url = domain + '/page/box/new_create_module.htm?overite=false&moduleId=' + moduleId+"&type="+type+"&flag=F&extParam=isYunYing:false";
							}
						}else{
							url = domain + '/page/box/edit_module.htm?overite=false&moduleId=' + moduleId+"&type="+type;
						}
						
						if($(".publish-dialog").length==0){
							location.href =url;
						}else{
							window.open(url);
						}	
					}
				}, {
					name : 'overwrite',
					value : '重新编辑', //这个还是要把版本revertId传过来
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					handle : function(e, msgObj) {
						msgObj.dialog('close');  
						var url;
						if(type && type==='module'){
							if(data.codeType=='code'){
								url = domain + '/page/box/create_code_module.htm?overite=true&moduleId=' + moduleId+"&type="+type+"&revertId="+revertId;
							}else{
								url = domain + '/page/box/new_create_module.htm?moduleId=' + moduleId+"&type="+type+"&revertId="+revertId+"&flag=F&extParam=isYunYing:false";
							}
							
						}else{
							url = domain + '/page/box/edit_module.htm?moduleId=' + moduleId+"&type="+type+"&revertId="+revertId;
						}
						
						
						if($(".publish-dialog").length==0){
							location.href =url;
						}else{
							window.open(url);
						}	
					}
				},{
					name : 'close',
					value : "我知道了",
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					close:true
				}];
			
				if(data.needUnlock && data.needUnlock == 'true'){
					var unLockButton={
							name : 'lock',
							value : '解锁',
							className : 'page-tip-btn submit-btn btn-basic  btn-gray' + (data.needUnlock ? ' dcms-disable' : ''),
							handle : function(e, msgObj) {
								var target = $(this);
								if(data.isAllow) {
									D.EditModule.unlockPage(moduleId, msgObj, target,type);
								} else {
									D.Msg.awake(awakeEl, {
										msg : '你没有解锁权限！',
										relatedEl : target
									});
								}
							}
						};
					operateButtons.push(unLockButton);
				}
				
				var msg;
				if(data.isSelf!==true){
					msg="<div class='has-draft'>此组件已经被"+data.draftUser+"编辑过，存在草稿<br/>你可以进行以下操作：</div>";
				} else {
					msg = '<div class="self-draft">您的草稿箱里已保存了' + data.hasExists + '份该'+moduleName+'的修改<div>';
				}
					D.Msg.show(confirmEl, {
						msg : msg,
						title : '提示',
						buttons : operateButtons
					});
			} else if(data.noPermission) {
				//console.log(data);
				D.Msg.show(confirmEl, {
					msg : '您好，你无权限编辑此'+moduleName+'!',
					title : '提示',
					buttons : [{
						name : 'cancel',
						value : '取消',
						className : 'page-tip-btn cancel-btn btn-basic  btn-gray',
						close : true
					}]
				});
			}
		}
	};

	/**
	 * 解锁资源
	 */
	D.EditModule.unlockPage = function(moduleId, msgObj, target,type) {
		var awakeEl = $('#dcms-message-awake'), params = {
			type : type,
			resourceCode : moduleId
		}, url = domain + '/page/box/unlock_resource.htm';
		$.ajax({
			url : url,
			data : params,
			dataType : 'jsonp',
			success : function(o) {
				if(o.success === true) {
					D.Msg.awake(awakeEl, {
						msg : '解锁成功',
						relatedEl : target
					});
					msgObj.dialog('close');
				} else {
					var msg = '', result = o.result, end = '<br />';
					for(var i = 0, l = result.length; i < l; i++) {
						if(i === l - 1) {
							end = '';
						}
						msg += '页面' + result[i].code + '解锁失败，错误如下：' + result[i].error + end;
					}
					D.Msg.awake(awakeEl, {
						msg : msg
					});
				}

			},
			error : function() {
				D.Msg.awake(awakeEl, {
					msg : '解锁失败，请稍后再试！',
					relatedEl : target
				});
				msgObj.dialog('close');
			}
		});
	};



})(dcms, FE.dcms);
