/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-06-26
 */

 ;(function($, D){
 	// ������ģ�������ڣ������ģ�尴ť����
    D.bottomAttr.openDsTemplate = function() {
		//��ʼ��
		var _json = D._doInitDsTemplate();
		var _dsId = _json.dataSource;
		if (_dsId > 0){
			// �������������Դ�����ѡ��ģ��
			D._doShowTemplateForDsTemplate();
		}else{
			// ����������Դ
			D._doShowDsForDsTemplate();
		}
		
    };
	// �޸�����Դ����ڣ������ģ���Աߵ�����Դ��ť����
    D.bottomAttr.changeDsForDsTemplate = function() {
		//��ʼ��
		var _json = D._doInitDsTemplate();
		// ����������Դ
		D._doShowDsForDsTemplate();
		
    };
    readyFun = [
    ];
     
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    
	// ��ʼ��
	D._doInitDsTemplate = function(){
		// Ϊ�˷���
		var _rst = undefined;
		var _oModule = D.DropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);	
		var _dsTemplate =_oModule.attr('data-dstemplate');// '{"dataSource":"77","dsTemplateId":"3","paramList":[{"name":"length","value":"1"},{"name":"imageSize","value":"search"},{"name":"offerIds","value":"1058719115"},{"name":"queryFavoriteFlag","value":"true"}]}';
		if (! _dsTemplate){
			_dsTemplate = "";
		}
		_dsTemplate = encodeURIComponent(encodeURIComponent(_dsTemplate));
		var _url =  FE.dcms + "/page/ds/choose_template.html?action=ds_template_action&event_submit_do_init_ds_template=true";
		var _param ="&dsTemplate="+_dsTemplate;
		_url += _param;
		$.ajax({
		    url: _url,
		    type: "POST",
			async:false
		})
		.done(function(o) {
		    if (o) {
		        var _data = dcms.parseJSON(o);
				_rst = _data;
				//callback.call(this, _rst);
		    }
		})
		.fail(function() {
			alert('ϵͳ��������ϵ����Ա');
		});
		return _rst;
	}
	// ��������Դ
	D._doShowDsForDsTemplate = function(){
		var _url = D.domain + '/page/ds/ds_module_for_ds_template.html';
		var _rst = D._openDialogForDs(_url,600,450);
		if (_rst){
			// �����Ҫ����ѡ��ģ�壬���Ҫѡ��ģ��
			if( _rst.toSelectTemplate == "true"){
				D._doShowTemplateForDsTemplate();
			}else{
				// ���浽ҳ��
				var _dsDynamic = _rst.dsDynamic;
				var _dsTemplate = _rst.dsTemplate;
				D._refreshDsTemplate(_dsTemplate,_dsDynamic);
				
			}

		} 
	}
	
	D._openDialogForDs = function(urlPath,width,height){
	    var theUrl = ""+urlPath+"";
		var _width = 800;
		if (width >0){
			_width = width;
		}
		var _height = window.screen.height-200;
		if (height >0){
			_height = height;
		}
		var left = (window.screen.width - _width )/2;
		var _rst = window.showModalDialog(theUrl, "newwindow", "dialogHeight="+_height+"; dialogWidth="+_width+";toolbar =no; menubar=no; scrollbars=yes; resizable=no; location=no; status=no;dialogLeft="+left+";dialogTop=50");
		return _rst;
	}
	// ѡ��ģ��
	D._doShowTemplateForDsTemplate = function(){
		// 2 ��ѯģ���б�����
		var _url = D.domain + '/page/ds/choose_template.html?action=ds_template_action&event_submit_do_fetch_template_list=true';
		var _rst = D._openDialogForDs(_url,982);
		if (_rst){
			// ���浽ҳ��
			var _dsDynamic = _rst.dsDynamic;
			var _dsTemplate = _rst.dsTemplate;
			D._refreshDsTemplate(_dsTemplate,_dsDynamic);
		} 
	}
	// ������
	D._refreshDsTemplate = function(_dsTemplate,_dsDynamic){
		var _oModule = D.DropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
		var _strTmp = "";
		if (_dsTemplate) {
			_strTmp = JSON.stringify(_dsTemplate);
		}
		if (_strTmp) {
			// 1��������ģ��ֵ
			_oModule.attr('data-dstemplate', _strTmp);
		}else{
			// ����գ���ɾ��
			_oModule.removeAttr('data-dstemplate');
		}
		// 2 ����cell����tdp
		// 2.1�ж��Ƿ���ڣ���������޸ģ�����������
		var _tdpCell = _oModule.find(".cell-dstemplate-tdp");
		if (_tdpCell.length >0){
			// ��ʾtdpcell�Ѿ����ڣ����������tdp�������޸ģ����ȡ��tdp���룬���cellҲɾ����
			if (_dsDynamic) {
				_tdpCell.attr('data-dsdynamic', _dsDynamic);
			}else{
				// ɾ��cell
				_tdpCell.remove();
			}
		}else{
			if (_dsDynamic) {
				// �����ڣ�����Ҫ��module�����div��
				var _moduleSubDiv = _oModule.find(".crazy-box-content");
				if (_moduleSubDiv.length <= 0) {
					//�ӽ�׳�Կ��ǣ�����box�淶
					_moduleSubDiv = $('<div class="crazy-box-content crazy-box-enable-cell" data-boxoptions=\'{"ability":{"container":{"enableType":"cell","number":"n"}}}\' ><\/div>');
					_oModule.append(_moduleSubDiv);
					_moduleSubDiv = _oModule.find(".crazy-box-content");
				}
				var _strCellHtml = '<div  class="cell-dstemplate-tdp crazy-box-cell"  data-dsdynamic=\'' + _dsDynamic + '\'><\/div>';
				_moduleSubDiv.append(_strCellHtml);
			}
		}

		// 3 ˢ��
		$('.bar-a-refresh').click();
	}
 })(dcms, FE.dcms);


