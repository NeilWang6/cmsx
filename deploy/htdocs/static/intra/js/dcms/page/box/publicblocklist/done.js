/**
 * @author raywu
 * @userfor 公共区块管理页面
 * @date  2013.08.06
 */

;(function($, D, undefined) {
	//由于要展示关联的页面和关联的公用组件,因此需要保存
	var moduleId,tabType,type,MODULE_STATUS_MAP={'new':'新建','apply':'已审核','update':'已修改'},$Dialog = $('.publish-dialog');
	
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
			//tab切换事件处理
			t.bindTabChange();
			t.bindEditPublicblock();
		},
		queryPageList:function(blockId,type,first){
			var t=this,
				form=$('#form-publish-query'),
				title=(type=='public_block'?'公用区块':'组件');
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
					var msg=(o.msg&&o.msg!=='')?o.msg:title + '有问题，请联系旺旺：dcms答疑';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : title+'有问题，请联系旺旺：dcms答疑'
				});
			});
		},
		htmlBulid:function(data,blockId,type,first){
			//没有被页面引用
			var title=(type=='public_block'?'公用区块':'组件');
			//此处需要判断从公用区块过来的分支
			if(!data && type=='public_block'){
				return "很抱歉，此" + title + "没有页面引用！";
			}
			
			var htmlStr='<div class="margin-left-25"><div class="tui-tabs-header">\
					<ul class="list-tabs-t">\
			            <li class="js-tab current"  data-tabtype="page"><a href="#">页面</a></li>\
			            <li class="js-tab"  data-tabtype="publicblock"><a href="#" >公用区块</a></li>\
			        </ul>\
			    </div></div>';
			
			//公用区块不需要tab
			if(type=='public_block'){
				htmlStr='';
			}
			//第一次初始化加载tab,第二次只加载内容
			if(!first){
				htmlStr='';
			}
			//如果没有数据
			if(!data){
				if($('.publish-dialog .publish-content').length==0){
					htmlStr+='<div class="publish-content">';
					htmlStr+= '<div class="dialog-content-center">很抱歉，此' + title + '没有页面引用！<div>';
					htmlStr+='</div>';
				}else{
					htmlStr+= '<div class="dialog-content-center">很抱歉，此' + title + '没有页面引用！<div>';
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
									<span class="value"><input id="publish-all-select" type="checkbox"/><label for="publish-all-select">全选</label></span>\
								</th>\
								<th class="td2">\
									<span class="value">页面名称</span>\
								</th>\
								<th class="td3">\
									<span class="value">URL</span>\
								</th>\
								<th class="td4">\
									<span class="value">创建时间</span>\
								</th>\
								<th class="td5">\
									<span class="value">更新时间</span>\
								</th>\
								<th class="td6">\
									<span class="value">状态</span>\
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
							<span class="value"><a href="'+D.domain+'/page/box/PreviewBoxPageWithUpdateModule.html?publicBlockId='+blockId+'&pageId='+this.id+'&type='+type+'" title="点击预览组件在该页面上的效果" target="_blank">'+$.util.escapeHTML(this.title)+'</a></span>\
						</td>\
						<td class="td3">\
							<span class="value"><a href="'+this.pageUrl+'" title="点击查看线上页面" target="_blank">'+this.pageUrl+'</a></span>\
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
				'title' : '使用情况',
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
				/** 发布组件到公用区块
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
			if(!window.confirm("因批量发布的影响面较大，发布前，请预览组件在相关页面上的效果，确认无误后再发布。\r\n发布后，请查看线上效果进行确认。")) {
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
						'message' : '指定页面已成功提交更新'
					});
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:'发布有问题，请联系旺旺：dcms答疑';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '发布有问题，请联系旺旺：dcms答疑'
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
						'message' : '指定公用区块已成功提交更新'
					});
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:'发布有问题，请联系旺旺：dcms答疑';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '发布有问题，请联系旺旺：dcms答疑'
				});
			});;
		},
		//绑定tab
		bindTabChange:function(){	
			var t=this;
			$(document).off('click.tab', '.publish-dialog .js-tab');
			$(document).on('click.tab', '.publish-dialog .js-tab', function(event){
				var $self = $(this), 
				 	$Dialog = $self.closest('.js-dialog');
					tabType = $self.data('tabtype');
				$('.js-tab', $Dialog).removeClass('current');
			    
				$self.addClass('current');
				//查询数据
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
				//设置为同步，表示是用户发起的操作
				$.ajax({
					async: false,
					url:D.domain+'/page/box/can_edit_module.html',
					data:data,
					dataType: 'json',
					success:D.EditModule.edit
				});
			});			
		},
		//查询组件相关的公用组件
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
					//处理html
					var html=t.buildPublicblockListHtml(o.data,moduleId);
					t.resetDialog(html,moduleId);
					
				}else{
					var msg=(o.msg&&o.msg!=='')?o.msg:title + '有问题，请联系旺旺：dcms答疑';
					D.Msg.error({
						'message' : msg
					});
				}
			}).fail(function(){
				D.Msg.error({
					'message' : '组件有问题，请联系旺旺：dcms答疑'
				});
			});
	
		},
		buildPublicblockListHtml:function(data,moduleId){
			//没有被页面引用
			var title='组件';
			if(!data || data.length==0){
				return "<div class=\"dialog-content-center\">很抱歉，此" + title + "没有公用区块引用！<div>";
			}
			
			var htmlStr='';
				
			htmlStr+=				
					'<table>\
						<thead>\
							<tr>\
								<th class="td2">\
									<span class="value">公用区块名称</span>\
								</th>\
								<th class="td4">\
									<span class="value">创建时间</span>\
								</th>\
								<th class="td4">\
									<span class="value">更新时间</span>\
								</th>\
							</tr>\
						</thead>\
						<tbody>';
		    //点击跳转到公用区块编辑界面
			$.each(data,function(){
				htmlStr+=
					'<tr>\
						<td class="td2">\
							<span class="value"><a data-module="{&quot;type&quot;:&quot;public_block&quot;,&quot;moduleId&quot;:&quot;'+this.id+'&quot;}"  href="javascript:void(0)" title="点击编辑公用区块" target="_blank" class="js-edit-public-block"  >'+$.util.escapeHTML(this.name)+'</a></span>\
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
	 * 组件状态
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
