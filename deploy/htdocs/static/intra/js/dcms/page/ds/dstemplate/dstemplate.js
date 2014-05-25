/**
 * @package FD.app.cms.search.page
 * @author: quxiao
 * @Date: 2012-06-26
 */

 ;(function($, D){
 	// 打开设置模板的总入口，当点击模板按钮触发
    D.bottomAttr.openDsTemplate = function() {
		//初始化
		var _json = D._doInitDsTemplate();
		var _dsId = _json.dataSource;
		if (_dsId > 0){
			// 如果设置了数据源，则打开选择模板
			D._doShowTemplateForDsTemplate();
		}else{
			// 打开设置数据源
			D._doShowDsForDsTemplate();
		}
		
    };
	// 修改数据源的入口，当点击模板旁边的数据源按钮触发
    D.bottomAttr.changeDsForDsTemplate = function() {
		//初始化
		var _json = D._doInitDsTemplate();
		// 打开设置数据源
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
    
	// 初始化
	D._doInitDsTemplate = function(){
		// 为了返回
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
			alert('系统错误，请联系管理员');
		});
		return _rst;
	}
	// 设置数据源
	D._doShowDsForDsTemplate = function(){
		var _url = D.domain + '/page/ds/ds_module_for_ds_template.html';
		var _rst = D._openDialogForDs(_url,600,450);
		if (_rst){
			// 如果需要继续选择模板，则打开要选择模板
			if( _rst.toSelectTemplate == "true"){
				D._doShowTemplateForDsTemplate();
			}else{
				// 保存到页面
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
	// 选择模板
	D._doShowTemplateForDsTemplate = function(){
		// 2 查询模板列表，并打开
		var _url = D.domain + '/page/ds/choose_template.html?action=ds_template_action&event_submit_do_fetch_template_list=true';
		var _rst = D._openDialogForDs(_url,982);
		if (_rst){
			// 保存到页面
			var _dsDynamic = _rst.dsDynamic;
			var _dsTemplate = _rst.dsTemplate;
			D._refreshDsTemplate(_dsTemplate,_dsDynamic);
		} 
	}
	// 保存结果
	D._refreshDsTemplate = function(_dsTemplate,_dsDynamic){
		var _oModule = D.DropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM);
		var _strTmp = "";
		if (_dsTemplate) {
			_strTmp = JSON.stringify(_dsTemplate);
		}
		if (_strTmp) {
			// 1保存数据模板值
			_oModule.attr('data-dstemplate', _strTmp);
		}else{
			// 如果空，则删除
			_oModule.removeAttr('data-dstemplate');
		}
		// 2 新增cell设置tdp
		// 2.1判断是否存在，如果存在修改，否则新增加
		var _tdpCell = _oModule.find(".cell-dstemplate-tdp");
		if (_tdpCell.length >0){
			// 表示tdpcell已经存在，如果需设置tdp代码则修改，如果取消tdp代码，则把cell也删除了
			if (_dsDynamic) {
				_tdpCell.attr('data-dsdynamic', _dsDynamic);
			}else{
				// 删除cell
				_tdpCell.remove();
			}
		}else{
			if (_dsDynamic) {
				// 不存在，插入要在module下面的div中
				var _moduleSubDiv = _oModule.find(".crazy-box-content");
				if (_moduleSubDiv.length <= 0) {
					//从健壮性考虑，符合box规范
					_moduleSubDiv = $('<div class="crazy-box-content crazy-box-enable-cell" data-boxoptions=\'{"ability":{"container":{"enableType":"cell","number":"n"}}}\' ><\/div>');
					_oModule.append(_moduleSubDiv);
					_moduleSubDiv = _oModule.find(".crazy-box-content");
				}
				var _strCellHtml = '<div  class="cell-dstemplate-tdp crazy-box-cell"  data-dsdynamic=\'' + _dsDynamic + '\'><\/div>';
				_moduleSubDiv.append(_strCellHtml);
			}
		}

		// 3 刷新
		$('.bar-a-refresh').click();
	}
 })(dcms, FE.dcms);


