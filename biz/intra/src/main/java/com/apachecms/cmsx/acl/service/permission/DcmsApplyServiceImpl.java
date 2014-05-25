package com.apachecms.cmsx.acl.service.permission;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.ApplyParam;
import com.apachecms.cmsx.acl.service.util.ACLConstants;
import com.apachecms.cmsx.dal.dao.ResourceSiteDAO;
import com.apachecms.cmsx.dal.dataobject.ACLRole;

/**
 * <pre>DcmsApplyServiceImpl</pre>申请接口 
 * @author qinming.zhengqm
 */
@Resource(name="dcmsApplyService")
public class DcmsApplyServiceImpl extends ApplyServiceImpl implements IDcmsApplyService {
	private static final String ROLE_NAME = "运营人员";
	// 资源对应站点关系
	@Autowired
    private ResourceSiteDAO resourceSiteDAO;

	@Override
	public void applyResPermission(String resourceID, String resourceType, String userID, boolean isOutsite) throws ACLException {
		if (StringUtil.isEmpty(resourceID) || StringUtil.isEmpty(resourceType) || StringUtil.isEmpty(userID)) {
			throw new ACLException(
					"DcmsApplyServiceImpl.applyResPermission 入参存在空, resourceID:"
							+ resourceID + ", resourceType" + resourceType
							+ ", userID:" + userID);
		}
		List<Long> siteIDs = this.resourceSiteDAO.queryResourcesSiteId(Long.valueOf(resourceID), resourceType);
		int s;
		if (null == siteIDs || 0 == (s = siteIDs.size())) {
			throw new ACLException("资源:" + resourceID + ", resourceType:" + resourceType + ":没有对应到站点");
		}
		
		// 申请的角色信息
		List<String> roleIDs = null;
	    ACLRole bean = new ACLRole();
	    bean.setIsDelete(ACLConstants.EFFECTIVE);
	    bean.setName(ROLE_NAME);
	    List<ACLRole> roles = this.aclRoleDAO.findByWhere(bean);
	    if (null != roles && roles.size() > 0) {
	    	String roleID = roles.get(0).getId();
	    	roleIDs = Arrays.asList(roleID);
	    }
	    
	    // 默认申请一年有效期
	    Date now = new Date(), expiredDate = DateUtils.addYears(now, 1);
	    ApplyParam param = null;
	    for (int i = 0; i < s; i ++) {
	    	param = new ApplyParam();
			param.setSiteID(siteIDs.get(i));
	    	param.setRoles(roleIDs);
	    	param.setExpiredDate(expiredDate);
	    	param.setUserID(userID);
	    	param.setInside(!isOutsite);
	    	this.applyRoles2User(param);
	    }
	}

	public void setResourceSiteDAO(ResourceSiteDAO resourceSiteDAO) {
		this.resourceSiteDAO = resourceSiteDAO;
	}
}