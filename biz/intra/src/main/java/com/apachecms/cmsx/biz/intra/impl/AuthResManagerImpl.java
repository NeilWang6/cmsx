package com.apachecms.cmsx.biz.intra.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

import com.apachecms.cmsx.biz.exception.DuplicatedException;
import com.apachecms.cmsx.biz.intra.AuthResManager;
import com.apachecms.cmsx.common.AuthToken;
import com.apachecms.cmsx.dal.dao.CmsxAuthResDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthResQuery;

public class AuthResManagerImpl implements AuthResManager {
	
	@Autowired
	private CmsxAuthResDAO cmsxAuthResDAO;
	
	@Override
	public void saveAuthRes(CmsxAuthResDO authRes, AuthToken authToken) throws DuplicatedException {
		try {
			authRes.setModifyUser(authToken.getUserId());
			authRes.setGmtModified(new Date());
			if(authRes.getId()!=null){
				cmsxAuthResDAO.updateCmsxAuthResDO(authRes);
			}else{
				authRes.setCreateUser(authToken.getUserId());
				authRes.setGmtCreate(new Date());
				cmsxAuthResDAO.insertCmsxAuthResDO(authRes);
			}
        } catch (DataIntegrityViolationException e) {
        	e.printStackTrace();
            throw new DuplicatedException(authRes.getId()+":"+authRes.getResname());
        }
		
	}

	@Override
	public CmsxAuthResDO get(long id) { 
		return cmsxAuthResDAO.findCmsxAuthResDOByPrimaryKey(id);
	}

	@Override
	public List<CmsxAuthResDO> getAll(boolean cache) { 
		CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
		return cmsxAuthResDAO.findListByExample(cmsxAuthResDO);
	}

}
