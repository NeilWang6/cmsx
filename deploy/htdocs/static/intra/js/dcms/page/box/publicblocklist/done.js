/**
 * @author raywu
 * @userfor �����������ҳ��
 * @date  2013.08.06
 */

;(function($, D, undefined) {
	//����Ҫչʾ������ҳ��͹����Ĺ������,�����Ҫ����
	var moduleId,tabType,type,MODULE_STATUS_MAP={'new':'�½�','apply':'�����','update':'���޸�'},$Dialog = $('.publish-dialog');
	
	D.publish={
		init:function(){
			var t=this;
			$('.btn-publish').click(function(e){
				var blockId=$(this).data('blockid');
				type=$(this).data('type');
				moduleId=blockId;
				
				e.preventDefault();
				t.queryPageList(blockId, type ? type : 'public_block',true);
				
			});
			//tab�л��¼�����
			t.bindTabChange();
			t.bindEditPublicblock();
		},
		queryPageList:function(blockId,type,first){
			var t=this,
				form=$('#form-publish-query'),
				title=(type=='public_block'?'��������':'���');
			if($('[name="PageManager"]')){
				$('[name="PageManager"]').val('PageManager');
				$('[name="PageManager"]').attr('name','action')
			}
			$.ajax({
				url:D.domain+'/page/json.html',
				data:{
					action:'PageManager',
					event_submit_do_SearchPublicBlockPage:true,
					returnType:'json',
					publicBlockId:blockId,
					type:type
				},
				dataType: 'json'
			}).done(function(o){
				if(o.status==='success'){
					if(first){
						t.openDialog(t.htmlBulid(o.data,blockId,type,true),blockId,type,true);
					}else{
						t.resetDialog(t.htmlBulid(o.data,blockId,type,false),blockId,type);
					}
					
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:title + '�����⣬����ϵ������dcms����';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : title+'�����⣬����ϵ������dcms����'
				});
			});
		},
		htmlBulid:function(data,blockId,type,first){
			//û�б�ҳ������
			var title=(type=='public_block'?'��������':'���');
			//�˴���Ҫ�жϴӹ�����������ķ�֧
			if(!data && type=='public_block'){
				return "�ܱ�Ǹ����" + title + "û��ҳ�����ã�";
			}
			
			var htmlStr='<div class="margin-left-25"><div class="tui-tabs-header">\
					<ul class="list-tabs-t">\
			            <li class="js-tab current"  data-tabtype="page"><a href="#">ҳ��</a></li>\
			            <li class="js-tab"  data-tabtype="publicblock"><a href="#" >��������</a></li>\
			        </ul>\
			    </div></div>';
			
			//�������鲻��Ҫtab
			if(type=='public_block'){
				htmlStr='';
			}
			//��һ�γ�ʼ������tab,�ڶ���ֻ��������
			if(!first){
				htmlStr='';
			}
			//���û������
			if(!data){
				if($('.publish-dialog .publish-content').length==0){
					htmlStr+='<div class="publish-content">';
					htmlStr+= '<div class="dialog-content-center">�ܱ�Ǹ����' + title + 'û��ҳ�����ã�<div>';
					htmlStr+='</div>';
				}else{
					htmlStr+= '<div class="dialog-content-center">�ܱ�Ǹ����' + title + 'û��ҳ�����ã�<div>';
				}				
				return htmlStr;
			 }
			
			if(first){	
				htmlStr+=
					'<div class="publish-content">';
			}			
			htmlStr+=
					'<table>\
						<thead>\
							<tr>\
								<th class="td1">\
									<span class="value"><input id="publish-all-select" type="checkbox"/><label for="publish-all-select">ȫѡ</label></span>\
								</th>\
								<th class="td2">\
									<span class="value">ҳ������</span>\
								</th>\
								<th class="td3">\
									<span class="value">URL</span>\
								</th>\
								<th class="td4">\
									<span class="value">����ʱ��</span>\
								</th>\
								<th class="td5">\
									<span class="value">����ʱ��</span>\
								</th>\
								<th class="td6">\
									<span class="value">״̬</span>\
								</th>\
							</tr>\
						</thead>\
						<tbody>';
			$.each(data,function(){
				htmlStr+=
					'<tr>\
						<td class="td1">\
							<span class="value"><input type="checkbox" data-pageid="'+this.id+'"/></span>\
						</td>\
						<td class="td2">\
							<span class="value"><a href="'+D.domain+'/page/box/PreviewBoxPageWithUpdateModule.html?publicBlockId='+blockId+'&pageId='+this.id+'&type='+type+'" title="���Ԥ������ڸ�ҳ���ϵ�Ч��" target="_blank">'+$.util.escapeHTML(this.title)+'</a></span>\
						</td>\
						<td class="td3">\
							<span class="value"><a href="'+this.pageUrl+'" title="����鿴����ҳ��" target="_blank">'+this.pageUrl+'</a></span>\
						</td>\
						<td class="td4">\
							<span class="value">'+this.gmtModified+'</span>\
						</td>\
						<td class="td5">\
							<span class="value">'+this.gmtModified+'</span>\
						</td>\
						<td class="td6">\
							<span class="value">'+this.pageStautsName+'</span>\
						</td>\
					</tr>'
			});
			htmlStr+=				
						'</tbody>\
					</table>';
			
			if(first){	
				htmlStr+='</div>';
			}
			return htmlStr;
		},
		openDialog:function(htmlStr,blockId,type){
			var t=this;
			D.Msg['confirm']({
				'title' : 'ʹ�����',
				'body' : htmlStr,
				'onlymsg':false,
				'success':function(){
					t.dialogSubmit(blockId,type);
				}
			},{
				'open':function(){
					$(this).addClass('publish-dialog');
					t.checkMutual($(this),type);
				},
				'close':function(){
					$(this).removeClass('publish-dialog');
				}
			});
		},
		resetDialog:function(htmlStr,blockId,type){
			var t=this;
			var $publishcontent = $('.publish-dialog  .publish-content');
			$publishcontent.empty();
			$publishcontent.html(htmlStr);
			t.checkMutual($('.publish-dialog'));
			
		},
		checkMutual:function(node,type){
			node.find('#publish-all-select').change(function(){
				var checkGroup=node.find('tbody .td1 input:checkbox');
				checkGroup.prop('checked',$(this).prop('checked'));
			});
		},
		dialogSubmit:function(blockId,type){
			if(tabType && tabType=='publicblock'){
				/** �����������������
				var t=this,publicblockids=[],checkedNode=$('.publish-dialog .publish-content tbody :checked');
				if(checkedNode.length>=1){
					checkedNode.each(function(){
						publicblockids.push(checkedNode.data('publicblockid'));
					});
					publicblockids=publicblockids.join(',');
					t.publishPublicblock(blockId,publicblockids);
				}**/
				
			}else{
				var t=this,
				pageIds=[],
				checkedNode=$('.publish-dialog .publish-content tbody :checked');
				if(checkedNode.length>=1){
					checkedNode.each(function(index,obj){
						//pageIds.push(checkedNode.data('pageid'));
						pageIds.push($(obj).data('pageid'));
					});
					pageIds=pageIds.join(',');
					t.publishPage(blockId,pageIds,type);
				}
			}	
		},
		publishPage:function(publicBlockId,pageIds,type){
			if(!window.confirm("������������Ӱ����ϴ󣬷���ǰ����Ԥ����������ҳ���ϵ�Ч����ȷ��������ٷ�����\r\n��������鿴����Ч������ȷ�ϡ�")) {
				return;
			}
			var t=this;
			$.ajax({
				url:D.domain+'/page/box/SubmitBoxPageWithUpdateModule.html',
				data:{
					publicBlockId:publicBlockId,
					pageIds:pageIds,
					type:type
				},
				dataType: 'json'
			}).done(function(o){
				if(o.status==='success'){
					D.Msg.tip({
						'message' : 'ָ��ҳ���ѳɹ��ύ����'
					});
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:'���������⣬����ϵ������dcms����';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '���������⣬����ϵ������dcms����'
				});
			});;
		},
		publishPublicblock:function(moduleId,publicBlockIds){
			var t=this;
			$.ajax({
				url:D.domain+'/page/box/SubmitBoxPageWithUpdateModule.html',
				data:{
					moduleId:moduleId,
					publicBlockIds:publicBlockIds
				},
				dataType: 'json'
			}).done(function(o){
				if(o.status==='success'){
					D.Msg.tip({
						'message' : 'ָ�����������ѳɹ��ύ����'
					});
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:'���������⣬����ϵ������dcms����';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '���������⣬����ϵ������dcms����'
				});
			});;
		},
		//��tab
		bindTabChange:function(){	
			var t=this;
			$(document).off('click.tab', '.publish-dialog .js-tab');
			$(document).on('click.tab', '.publish-dialog .js-tab', function(event){
				var $self = $(this), 
				 	$Dialog = $self.closest('.js-dialog');
					tabType = $self.data('tabtype');
				$('.js-tab', $Dialog).removeClass('current');
			    
				$self.addClass('current');
				//��ѯ����
				if(tabType=='page'){	
					t.queryPageList(moduleId, type ? type : 'public_block',false);				
				}else{
					t.queryPublicBlockList(moduleId,$Dialog);
				}	
			});
		},
		bindEditPublicblock:function(){			
			$('body').delegate('.publish-dialog .js-edit-public-block','click', function(event) {
				event.preventDefault();
				var that = this, $self = $(that), data = $self.data('module');
				//$.getJSON(D.domain+'/page/box/can_edit_module.html',data,D.EditModule.edit);
				//����Ϊͬ������ʾ���û�����Ĳ���
				$.ajax({
					async: false,
					url:D.domain+'/page/box/can_edit_module.html',
					data:data,
					dataType: 'json',
					success:D.EditModule.edit
				});
			});			
		},
		//��ѯ�����صĹ������
		queryPublicBlockList:function(moduleId,dialog){
			var t=this;
			$.ajax({
				url:D.domain+'/page/json.html',
				data:{
					action:'PublicBlockAction',
					event_submit_do_SearchPublicBlock:true,
					returnType:'json',
					moduleId:moduleId	
				},
				dataType: 'json'
			}).done(function(o){
				if(o.status==='success'){
					//����html
					var html=t.buildPublicblockListHtml(o.data,moduleId);
					t.resetDialog(html,moduleId);
					
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:title + '�����⣬����ϵ������dcms����';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '��������⣬����ϵ������dcms����'
				});
			});
	
		},
		buildPublicblockListHtml:function(data,moduleId){
			//û�б�ҳ������
			var title='���';
			if(!data || data.length==0){
				return "<div class=\"dialog-content-center\">�ܱ�Ǹ����" + title + "û�й����������ã�<div>";
			}
			
			var htmlStr='';
				
			htmlStr+=				
					'<table>\
						<thead>\
							<tr>\
								<th class="td2">\
									<span class="value">������������</span>\
								</th>\
								<th class="td4">\
									<span class="value">����ʱ��</span>\
								</th>\
								<th class="td4">\
									<span class="value">����ʱ��</span>\
								</th>\
							</tr>\
						</thead>\
						<tbody>';
		    //�����ת����������༭����
			$.each(data,function(){
				htmlStr+=
					'<tr>\
						<td class="td2">\
							<span class="value"><a data-module="{&quot;type&quot;:&quot;public_block&quot;,&quot;moduleId&quot;:&quot;'+this.id+'&quot;}"  href="javascript:void(0)" title="����༭��������" target="_blank" class="js-edit-public-block"  >'+$.util.escapeHTML(this.name)+'</a></span>\
						</td>\
						<td class="td4">\
							<span class="value">'+this.gmtModified+'</span>\
						</td>\
						<td class="td4">\
							<span class="value">'+this.gmtModified+'</span>\
						</td>\
							</tr>'
			});
			htmlStr+=				
						'</tbody>\
					</table>';
			return htmlStr;
		}		
	}
	/**
	 * ���״̬
	 */
	function getModuleStatus(code){
		var cnName='';
		if(!code){
			return '';
		}
		cnName=MODULE_STATUS_MAP[code];
		if(!cnName){
			return '';
		}
		return cnName;
		
	}
	$(document).ready(function(){
		D.publish.init();
    });

})(dcms, FE.dcms);
