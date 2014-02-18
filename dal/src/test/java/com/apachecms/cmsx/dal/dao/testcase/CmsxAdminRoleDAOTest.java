package com.apachecms.cmsx.dal.dao.testcase;

import java.util.List;

import javax.annotation.Resource;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.apachecms.cmsx.dal.dao.CmsxAdminRoleDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAdminRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAdminRoleQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxAdminRoleDAOTest {

    @Resource
    private CmsxAdminRoleDAO cmsxAdminRoleDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAdminRoleDOTest() {
        CmsxAdminRoleDO cmsxAdminRoleDO = new CmsxAdminRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxAdminRoleDAO.insertCmsxAdminRoleDO( cmsxAdminRoleDO );
    }

    @Test
    public void countCmsxAdminRoleDOByExampleTest() {
        CmsxAdminRoleDO cmsxAdminRoleDO = new CmsxAdminRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAdminRoleDAO.countCmsxAdminRoleDOByExample( cmsxAdminRoleDO ) > 0 );
    }

    @Test
    public void countCmsxAdminRoleQueryByExampleTest() {
        CmsxAdminRoleQuery cmsxAdminRoleQuery = new CmsxAdminRoleQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAdminRoleDAO.countCmsxAdminRoleQueryByExample( cmsxAdminRoleQuery ) > 0 );
    }

    @Test
    public void updateCmsxAdminRoleDOTest() {
        CmsxAdminRoleDO cmsxAdminRoleDO = new CmsxAdminRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAdminRoleDAO.updateCmsxAdminRoleDO( cmsxAdminRoleDO ) > 0 );
    }

    @Test
    public void findListCmsxAdminRoleDOByExampleTest() {
        CmsxAdminRoleDO cmsxAdminRoleDO = new CmsxAdminRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAdminRoleDO> resultList = cmsxAdminRoleDAO.findListByExample( cmsxAdminRoleDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAdminRoleQueryByExampleTest() {
        CmsxAdminRoleQuery cmsxAdminRoleQuery = new CmsxAdminRoleQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAdminRoleQuery> resultList = cmsxAdminRoleDAO.findListByExample( cmsxAdminRoleQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAdminRoleDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAdminRoleDAO.findCmsxAdminRoleDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxAdminRoleDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAdminRoleDAO.deleteCmsxAdminRoleDOByPrimaryKey( ID ) > 0 );
    }

}