/**
 * @author zhaoyang.maozy
 * @userfor �༭ҳ�棬����ҳ��
 * @date  2012.02.28
 */

;(function($, D, undefined) {
	D.EditModule = {};
	var domain = D.domain;
	/**
	 * �༭�������
	 */
	D.EditModule.edit = function(data) {

		var confirmEl = $('#dcms-message-confirm-new'), awakeEl = $('#dcms-message-awake');
		if(data) {
			var moduleId = data.moduleId,type = data.type,moduleName,revertId = data.revertId?data.revertId:'';
			if(type && type==='module'){
				moduleName="���";
			}else{
				moduleName="��������";
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
					//��������
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
					tip ='<div class="lock">'+data.lockedUser+'���ڱ༭��'+moduleName+'���㲻��ͬʱ���б༭��<br/>����ϵ<a href="http://work.alibaba-inc.com/work/search?keywords='+data.lockedUser+'&type=person" target="_blank">'+data.lockedUser+'</a>�����ύҳ���رձ༭�������ټ����༭��ҳ��!</div>';
				} else {
					tip ='<div class="lock">'+data.lockedUser+'���ڱ༭��'+moduleName+'���㲻��ͬʱ���б༭��<br/>����ϵ'+data.lockedUser+'�����ύҳ���رձ༭�������ټ����༭��ҳ��!</div>';
				}
				if(data.isAllow) {
					D.Msg.show(confirmEl, {
						//msg : 'ҳ�汻' + data.lockedUser + '����! �Ƿ����ڽ���?',
						msg : tip,
						title : '��ʾ',
						buttons : [{
							name : 'cancel',
							value : '��֪����',
							className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
							close : true
						}, {
							name : 'lock',
							value : '����',
							className : 'page-tip-btn submit-btn btn-basic  btn-gray',
							handle : function(e, msgObj) {
								var target = $(this);
								if(data.isAllow) {
									D.EditModule.unlockPage(moduleId, msgObj, target,type);
								} else {
									D.Msg.awake(awakeEl, {
										msg : '��û�н���Ȩ�ޣ�',
										relatedEl : target
									});
								}
							}
						}]
					});
				} else {
					D.Msg.show(confirmEl, {
						msg : tip,
						title : '��ʾ',
						buttons : [{
							name : 'cancel',
							value : '��֪����',
							className : 'page-tip-btn cancel-btn btn-basic  btn-blue',
							close : true
						}]
					});
				}
			} else if(data.hasExists) {
				// ����1������
				var operateButtons=[{
					name : 'goDraft',
					value : data.isSelf!==true ? '�༭���Ĳݸ�':'�༭�ݸ�',
					className : 'page-tip-btn submit-btn btn-basic  btn-blue',
					handle : function(e, msgObj) {
						msgObj.dialog('close');
						var url;
						if(type && type==='module'){
							//����Ҫ�ж��Ƿ���Դ��༭
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
					value : '���±༭', //�������Ҫ�Ѱ汾revertId������
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
					value : "��֪����",
					className : 'page-tip-btn submit-btn btn-basic  btn-gray',
					close:true
				}];
			
				if(data.needUnlock && data.needUnlock == 'true'){
					var unLockButton={
							name : 'lock',
							value : '����',
							className : 'page-tip-btn submit-btn btn-basic  btn-gray' + (data.needUnlock ? ' dcms-disable' : ''),
							handle : function(e, msgObj) {
								var target = $(this);
								if(data.isAllow) {
									D.EditModule.unlockPage(moduleId, msgObj, target,type);
								} else {
									D.Msg.awake(awakeEl, {
										msg : '��û�н���Ȩ�ޣ�',
										relatedEl : target
									});
								}
							}
						};
					operateButtons.push(unLockButton);
				}
				
				var msg;
				if(data.isSelf!==true){
					msg="<div class='has-draft'>������Ѿ���"+data.draftUser+"�༭�������ڲݸ�<br/>����Խ������²�����</div>";
				} else {
					msg = '<div class="self-draft">���Ĳݸ������ѱ�����' + data.hasExists + '�ݸ�'+moduleName+'���޸�<div>';
				}
					D.Msg.show(confirmEl, {
						msg : msg,
						title : '��ʾ',
						buttons : operateButtons
					});
			} else if(data.noPermission) {
				//console.log(data);
				D.Msg.show(confirmEl, {
					msg : '���ã�����Ȩ�ޱ༭��'+moduleName+'!',
					title : '��ʾ',
					buttons : [{
						name : 'cancel',
						value : 'ȡ��',
						className : 'page-tip-btn cancel-btn btn-basic  btn-gray',
						close : true
					}]
				});
			}
		}
	};

	/**
	 * ������Դ
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
						msg : '�����ɹ�',
						relatedEl : target
					});
					msgObj.dialog('close');
				} else {
					var msg = '', result = o.result, end = '<br />';
					for(var i = 0, l = result.length; i < l; i++) {
						if(i === l - 1) {
							end = '';
						}
						msg += 'ҳ��' + result[i].code + '����ʧ�ܣ��������£�' + result[i].error + end;
					}
					D.Msg.awake(awakeEl, {
						msg : msg
					});
				}

			},
			error : function() {
				D.Msg.awake(awakeEl, {
					msg : '����ʧ�ܣ����Ժ����ԣ�',
					relatedEl : target
				});
				msgObj.dialog('close');
			}
		});
	};



})(dcms, FE.dcms);
