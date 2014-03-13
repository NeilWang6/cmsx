package com.apachecms.cmsx.web.intra.module.screen.auth.res;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.apachecms.cmsx.biz.intra.AuthResManager;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.utils.TreeUtil;

public class AddRes {
	@Autowired
	private AuthResManager authResManager;

	public void execute(@Param("parentId") Long parentId, Context context) throws Exception {

		context.put("parentId", parentId);
		List<CmsxAuthResDO> reslist = authResManager.getAll(false);
		context.put("reslist", TreeUtil.asTree(reslist));
		
	}
}
