/**
 * 布局 模版 页面 组件保存后统一提示
 * @author springyu
 * 2012-12-04
 */

;(function($, D, ui) {
	function SubmitComplete(config) {
		this.config = config;
		this.url = config.url;
		this.data = config.data;
		this.editUrl = config.editUrl;
		this.toLibUrl = config.toLibUrl;
		this.toLibName = config.toLibName;
		this.callback = config.callback;
        this.complete = config.complete;
        this.tip=config.tip;
	}


	SubmitComplete.prototype = {
		constructor : SubmitComplete,
		_getShowData : function(json) {
			var self = this, data = {}, templateType = json.templateType, index = -1;
			data['name'] = json.name;
			data['tip'] = '页面';
			
			if(json.flag && (json.flag === 'F' || json.flag === 'f')) {
				data['toLibName'] = '去个人库';
			}
			if(self.toLibName){
				data['toLibName'] = self.toLibName;
			}
			if(json.flag && (json.flag === 'T' || json.flag === 't')) {
				data['toLibName'] = '去素材库';
			}
			if(templateType) {
				switch(templateType) {
					case 'pl_layout':
						data['tip'] = '布局';
						break;
					case 'pl_template':
						data['tip'] = '模版';
						break;
					case 'page':
						data['tip'] = '页面';
						self.toLibUrl = json.url;
						if(self.editUrl) {
							index = self.editUrl.indexOf('?');
							if(index != -1) {
								self.editUrl = self.editUrl + "&pageId=" + json.id;
							} else {
								self.editUrl = self.editUrl + "?pageId=" + json.id;
							}
						}

						break;
					case 'module':
						data['tip'] = '组件';
						if(self.tip){
							data['tip'] = self.tip;
						}
						if(self.editUrl) {
							index = self.editUrl.indexOf('?');
							if(index != -1) {
								self.editUrl = self.editUrl + "&moduleId=" + json.id + "&flag=" + json.flag;
							} else {
								self.editUrl = self.editUrl + "?moduleId=" + json.id + "&flag=" + json.flag;
							}
						}

						break;
					case 'pl_cell':
						data['tip'] = '控件';
						if(self.editUrl) {
							index = self.editUrl.indexOf('?');
							//console.log(index);
							//console.log('aaa');
							if(index != -1) {
								self.editUrl = self.editUrl + "&cellid=" + json.id + "&cellId=" + json.id + "&flag=" + json.flag;
							} else {
								self.editUrl = self.editUrl + "?cellId=" + json.id + "&cellid=" + json.id + "&flag=" + json.flag;
							}
						}

						break;
					default:
						data['tip'] = '模版';
						break;
				}
			}
			return data;
		},
		init : function() {
			var self = this;

			$.post(self.url, self.data, function(text) {
				//console.log(text);
				var json = $.parseJSON(text), htmlCode = '', _data;
				if(json) {
					if(json.status && json.status === 'success') {
						if(json.data) {
							self.callback&&typeof self.callback ==='function'&&self.callback.call(self,json.data);
							_data = self._getShowData(json.data);
							htmlCode += '<div class="submit-ok"><div class="ok"></div>' + _data.tip + '<span>"' + _data.name + '"</span>已提交成功！</div>';
							htmlCode += '<div class="submit-next"><a href="' + self.toLibUrl + '" class="btn-basic  btn-gray">' + _data.toLibName + '</a><a class="btn-basic  btn-gray" href="' + self.editUrl + '">返回编辑</a></div>';
						}
					}
					$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '提示信息',
						'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
						'complete' : function() {
							window.location = self.editUrl;
						}
					});
				}
			}).complete(self.complete); //complete add by hongss for 阻止多次请求
		}
	}

	ui.SubmitComplete = SubmitComplete;
})(dcms, FE.dcms, FE.dcms.box.ui);
