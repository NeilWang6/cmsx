/**
 * ���� ģ�� ҳ�� ��������ͳһ��ʾ
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
			data['tip'] = 'ҳ��';
			
			if(json.flag && (json.flag === 'F' || json.flag === 'f')) {
				data['toLibName'] = 'ȥ���˿�';
			}
			if(self.toLibName){
				data['toLibName'] = self.toLibName;
			}
			if(json.flag && (json.flag === 'T' || json.flag === 't')) {
				data['toLibName'] = 'ȥ�زĿ�';
			}
			if(templateType) {
				switch(templateType) {
					case 'pl_layout':
						data['tip'] = '����';
						break;
					case 'pl_template':
						data['tip'] = 'ģ��';
						break;
					case 'page':
						data['tip'] = 'ҳ��';
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
						data['tip'] = '���';
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
						data['tip'] = '�ؼ�';
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
						data['tip'] = 'ģ��';
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
							htmlCode += '<div class="submit-ok"><div class="ok"></div>' + _data.tip + '<span>"' + _data.name + '"</span>���ύ�ɹ���</div>';
							htmlCode += '<div class="submit-next"><a href="' + self.toLibUrl + '" class="btn-basic  btn-gray">' + _data.toLibName + '</a><a class="btn-basic  btn-gray" href="' + self.editUrl + '">���ر༭</a></div>';
						}
					}
					$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '��ʾ��Ϣ',
						'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
						'complete' : function() {
							window.location = self.editUrl;
						}
					});
				}
			}).complete(self.complete); //complete add by hongss for ��ֹ�������
		}
	}

	ui.SubmitComplete = SubmitComplete;
})(dcms, FE.dcms, FE.dcms.box.ui);
