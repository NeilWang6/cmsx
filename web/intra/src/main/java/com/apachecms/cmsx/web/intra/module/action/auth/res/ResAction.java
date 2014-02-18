package com.apachecms.cmsx.web.intra.module.action.auth.res;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.service.form.Group;
import com.alibaba.citrus.service.uribroker.URIBrokerService;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.Navigator;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.dataresolver.FormGroup;
import com.apachecms.cmsx.biz.exception.DuplicatedException;
import com.apachecms.cmsx.biz.intra.AuthResManager;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.web.common.util.CommonUtil;

public class ResAction {
	
	@Autowired
	private AuthResManager authResManager;
    @Autowired
    protected URIBrokerService     uriBrokerService;

	public void doSaveRes(HttpServletRequest request, @FormGroup("resinfo") Group group, TurbineRunData runData, Context context, Navigator nav) throws Exception {
		AuthToken token = CommonUtil.getAuthToken(request);
		
		CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
		group.setProperties(cmsxAuthResDO);
		try {
			authResManager.saveAuthRes(cmsxAuthResDO, token);
			//nav.redirectTo("intraModule").withTarget("auth/res/listres");
			nav.redirectTo("intraModule").withTarget("common/success");
		} catch (DuplicatedException e) {
			group.getField("rescode").setMessage("duplicatedRescode");
		} 
	}

}
