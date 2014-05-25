package com.apachecms.cmsx.acl;

import com.apachecms.cmsx.acl.exception.ACLException;
import com.apachecms.cmsx.acl.param.UserParam;
import com.apachecms.cmsx.dal.dao.common.PageInfo;
import com.apachecms.cmsx.dal.dataobject.CmsUser;
import com.apachecms.cmsx.exception.DuplicateException;

public interface IUserService {
	/**
	 * 创建user
	 * @param param
	 * @param opUserID
	 * @throws ACLException
	 */
	String create(UserParam param, String opUserID) throws ACLException,DuplicateException;

	/**
	 * 修改user
	 * @param param
	 * @param opUserID
	 * @throws ACLException
	 */
	void update(UserParam param, String opUserID) throws ACLException,DuplicateException;
	
	/**
	 * 删除user
	 * 在删除user时,需要查询判断是否当前user还授予了某角色,如果有则要级联删除
	 * 
	 * @param userID
	 * @param opUserID
	 * @throws ACLException
	 */
	void delete(String userID, String opUserID) throws ACLException;
	
	/**
	 * 根据id查询资源
	 * @param userID
	 * @return
	 * @throws ACLException
	 */
	CmsUser findById(String userID) throws ACLException;
	
	/**
	 * 分页查询
	 * @return
	 * @throws ACLException
	 */
	PageInfo<CmsUser> findByWhere(UserParam param, Integer currentPage, Integer pageSize) throws ACLException;
}
