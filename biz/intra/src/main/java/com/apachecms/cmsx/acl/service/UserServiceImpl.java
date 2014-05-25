package com.apachecms.cmsx.acl.service;

import javax.annotation.Resource;

import org.apache.commons.codec.digest.Md5Crypt;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.citrus.util.StringUtil;
import com.apachecms.cmsx.acl.IUserService;
import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.UserParam;
import com.apachecms.cmsx.acl.service.util.SnoGerUtil;
import com.apachecms.cmsx.dal.dao.IUserDAO;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CmsUser;
import com.apachecms.cmsx.exception.DuplicateException;

@Resource(name="userService")
public class UserServiceImpl implements IUserService {
	private static final String SALT = "CASE$SYS";
	protected static final Log LOG = LogFactory.getLog(UserServiceImpl.class);
	@Autowired
	private IUserDAO userDAO;
	
	@Override
	public String create(UserParam param, String opUserID) throws ACLException,DuplicateException {
		String  userId = null, password = null, fullName = null, email = null, depId = null, groups = null, groupids = null, status = null;
		Long profileSite = null;
		if(param==null || StringUtil.isEmpty((userId = param.getUserId()))
				|| StringUtil.isEmpty((password = param.getPassword()))
				|| StringUtil.isEmpty((fullName = param.getFullName()))
				|| StringUtil.isEmpty((status = param.getStatus()))){
			throw new ACLException("创建用户入参存在空.");
		} 
		profileSite = param.getProfileSite();
		 
		email = param.getEmail();
		depId = param.getDepId();
		groups = param.getGroups();
		groupids = param.getGroupids();
		CmsUser existUser = userDAO.findByUserId(userId);
		if(existUser!=null){
			throw new DuplicateException("用户名已存在:" + userId);
		}
		String md5password = Md5Crypt.md5Crypt(password.getBytes(), SALT);
		CmsUser user = new CmsUser();
		user.setId(SnoGerUtil.getUUID());
		user.setUserId(userId);
		user.setFullName(fullName); 
		user.setStatus(status);
		user.setProfileSite(profileSite);
		user.setEmail(email);
		user.setDepId(depId);
		user.setGroups(groups);
		user.setGroupids(groupids);
		user.setPassword(md5password);
		userDAO.addCmsUser(user);
		return user.getId();
	}

	@Override
	public void update(UserParam param, String opUserID) throws ACLException,DuplicateException {
		String id = null;
		String userId = null;
		if (null == param || StringUtil.isEmpty((id = param.getId())) ||  StringUtil.isEmpty((userId = param.getUserId()))) {
            throw new ACLException("更新用户入参存在空.");
		}
		//check userid
		CmsUser existUser = userDAO.findByUserId(userId);
		if(existUser!=null && !id.equals(existUser.getId())){
			throw new DuplicateException("用户名已存在:" + userId);
		}
		CmsUser user = new CmsUser();
		BeanUtils.copyProperties(param, user);
		userDAO.updateCmsUser(user);
	}

	@Override
	public void delete(String id, String opUserID) throws ACLException {
		CmsUser user = userDAO.findById(id);
		if(user!=null){
			LOG.info("delete user, ID: " + id + ", by " + opUserID + ". user=[" + user+ "]");
			userDAO.delCmsUser(id);
		}
	}

	@Override
	public CmsUser findById(String userID) throws ACLException { 
		return userDAO.findByUserId(userID);
	}

	@Override
	public PageInfo<CmsUser> findByWhere(UserParam param, Integer currentPage, Integer pageSize) throws ACLException {
		CmsUser user = new CmsUser();
		if(param!=null){
			BeanUtils.copyProperties(param, user);
		}
		return userDAO.findByWhere(user, currentPage, pageSize); 
	}

}
