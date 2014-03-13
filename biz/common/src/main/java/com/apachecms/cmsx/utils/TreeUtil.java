package com.apachecms.cmsx.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.apachecms.cmsx.dal.dataobject.AbstractTreeDO;

public class TreeUtil {
	 public static <T extends AbstractTreeDO> List<T> asTree(List<T> datas){
		 List<T> treeList = new ArrayList<T>();
		 Map<Long,T> dataMap = new HashMap<Long,T>();
		 for(T data:datas){
			 dataMap.put(data.getId(), data);
		 }
		 for(T data:datas){
			 if(data.getLev()==0){
				 treeList.add(data);
				 continue;
			 }
			 T parent = dataMap.get(data.getParentId());
			 if(parent!=null){
				 //如果有父级则作为下级，否则直接是顶级
				 parent.getSublist().add(data); 
			 }else{
				 treeList.add(data);
			 }
		 } 
		 return treeList;
	 }
}
