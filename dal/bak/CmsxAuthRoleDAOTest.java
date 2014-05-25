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

import com.apachecms.cmsx.dal.dao.CmsxAuthRoleDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxAuthRoleDAOTest {

    @Resource
    private CmsxAuthRoleDAO cmsxAuthRoleDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAuthRoleDOTest() {
        CmsxAuthRoleDO cmsxAuthRoleDO = new CmsxAuthRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxAuthRoleDAO.insertCmsxAuthRoleDO( cmsxAuthRoleDO );
    }

    @Test
    public void countCmsxAuthRoleDOByExampleTest() {
        CmsxAuthRoleDO cmsxAuthRoleDO = new CmsxAuthRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleDAO.countCmsxAuthRoleDOByExample( cmsxAuthRoleDO ) > 0 );
    }

    @Test
    public void countCmsxAuthRoleQueryByExampleTest() {
        CmsxAuthRoleQuery cmsxAuthRoleQuery = new CmsxAuthRoleQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleDAO.countCmsxAuthRoleQueryByExample( cmsxAuthRoleQuery ) > 0 );
    }

    @Test
    public void updateCmsxAuthRoleDOTest() {
        CmsxAuthRoleDO cmsxAuthRoleDO = new CmsxAuthRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleDAO.updateCmsxAuthRoleDO( cmsxAuthRoleDO ) > 0 );
    }

    @Test
    public void findListCmsxAuthRoleDOByExampleTest() {
        CmsxAuthRoleDO cmsxAuthRoleDO = new CmsxAuthRoleDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthRoleDO> resultList = cmsxAuthRoleDAO.findListByExample( cmsxAuthRoleDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAuthRoleQueryByExampleTest() {
        CmsxAuthRoleQuery cmsxAuthRoleQuery = new CmsxAuthRoleQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthRoleQuery> resultList = cmsxAuthRoleDAO.findListByExample( cmsxAuthRoleQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAuthRoleDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAuthRoleDAO.findCmsxAuthRoleDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxAuthRoleDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAuthRoleDAO.deleteCmsxAuthRoleDOByPrimaryKey( ID ) > 0 );
    }

}