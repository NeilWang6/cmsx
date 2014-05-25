;(function($,T){
	var HIDE_STR = 'tagedListHide',HIDE_DATA_STR = 'data-taged-list-hide',
		SHOW_STR = 'tagedListShow',SHOW_DATA_STR = 'data-taged-list-show',
		OPER_TYPE_HIGH_SHOW = 'HIGH_SHOW',OPER_TYPE_HIDE = 'HIDE',
		OPER_TYPE_SHOW = 'SHOW',
		
		isMatchKeyword = function(keyword,$dsCfgInfo){
			if(!$dsCfgInfo){
				return false;
			}
			if($dsCfgInfo.fieldName && $dsCfgInfo.fieldName.indexOf(keyword) >= 0){
				return true;
			}
			if($dsCfgInfo.displayName && $dsCfgInfo.displayName.indexOf(keyword) >= 0){
				return true;
			}
			if($dsCfgInfo.fieldAlias && $dsCfgInfo.fieldAlias.indexOf(keyword) >= 0){
				return true;
			}
			return false;
		},
		searchByTag = function(tagIds,isChecked,callback){
			var $fieldList = $('input.searchable-field'),$fieldInput,$dsCfgInfo,tags,
				isTagedField,operType,hasChecked,dsCfgStr,tagId,tagIdList= ('' + tagIds).split(',');
			if(!$fieldList || !$fieldList.length || $fieldList.length < 1){
				return;
			}
			//console.log(tagId );
			$.each($fieldList,function(n,fieldInput){
				if(!fieldInput){
					return ;
				}
				$fieldInput = $(fieldInput);
				callback($fieldInput,OPER_TYPE_SHOW);
				hasChecked = $fieldInput.is(':checked');
				if(hasChecked){
					return;
				}
				if(tagIds=='-1'||isChecked == false){
					return;
				}
				$dsCfgInfo = $fieldInput.data('dsCfgInfo');
				
				if(!$dsCfgInfo){
					return;
				}
				tags = $dsCfgInfo.tags;
				
				operType = OPER_TYPE_HIDE;
				if(tags){
					for(var i = 0;i<tagIdList.length;i++){
						if(tags.indexOf(','+tagIdList[i]+',') >=0){
							operType = OPER_TYPE_HIGH_SHOW;
							break;
						}
					}
				}
				
				if(callback){
					callback($fieldInput,operType);
				}
			});
			
		},
		searchByKeyword = function(keyword,callback){
			var $fieldList = $('input.searchable-field'),$fieldInput,$dsCfgInfo,tags,
				isTagedField,isClear,isChecked;
			if(!$fieldList || !$fieldList.length || $fieldList.length < 1){
				return;
			}
			if(!keyword || keyword == ''){
				isClear = true;
			}
			$.each($fieldList,function(n,fieldInput){
				if(!fieldInput){
					return ;
				}
				$fieldInput = $(fieldInput);
				
				$dsCfgInfo = $fieldInput.data('dsCfgInfo');
				//console.log($dsCfgInfo);
				if(isClear){
					if(callback){
						callback($fieldInput,isClear);
					}
				}else if(isMatchKeyword(keyword,$dsCfgInfo)){
					callback($fieldInput,false);
				}else{
					callback($fieldInput,true);
				}
			});
		};
		
		T.idatacenter = {
			searchByTag : searchByTag,
			searchByKeyword : searchByKeyword,
			//高亮显示
			OPER_TYPE_HIGH_SHOW : OPER_TYPE_HIGH_SHOW,
			//隐藏对象
			OPER_TYPE_HIDE : OPER_TYPE_HIDE,
			//显示但是并不高亮
			OPER_TYPE_SHOW : OPER_TYPE_SHOW
		};
})(jQuery, FE.dcms);