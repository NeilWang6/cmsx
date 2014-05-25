package com.apachecms.cmsx.web.acl.module.screen;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.citrus.webx.WebxException;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ResourceParam;
import com.apachecms.cmsx.acl.service.resource.IDcmsResourceService;

public class EditAclPermission {
	@Autowired
	private IDcmsResourceService dcmsResourceService;
    private static int color = 8;

    public void execute(TurbineRunData rundata, Context context) throws WebxException {
        rundata.setLayoutEnabled(false);
        String id = rundata.getParameters().getString("id"); 
        if (!StringUtil.isBlank(id)) {
        	try {
                //FIXME 模拟数据
                ResourceParam  permission = dcmsResourceService.findById(id);
                context.put("resource", permission); 
            } catch (Exception e) {
            	throw new WebxException("EditAclPermission:", e);
            } 
        }

    }
}
