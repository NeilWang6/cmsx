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

import com.apachecms.cmsx.dal.dao.CmsxAuthRoleResDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthRoleResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthRoleResQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxAuthRoleResDAOTest {

    @Resource
    private CmsxAuthRoleResDAO cmsxAuthRoleResDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAuthRoleResDOTest() {
        CmsxAuthRoleResDO cmsxAuthRoleResDO = new CmsxAuthRoleResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxAuthRoleResDAO.insertCmsxAuthRoleResDO( cmsxAuthRoleResDO );
    }

    @Test
    public void countCmsxAuthRoleResDOByExampleTest() {
        CmsxAuthRoleResDO cmsxAuthRoleResDO = new CmsxAuthRoleResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleResDAO.countCmsxAuthRoleResDOByExample( cmsxAuthRoleResDO ) > 0 );
    }

    @Test
    public void countCmsxAuthRoleResQueryByExampleTest() {
        CmsxAuthRoleResQuery cmsxAuthRoleResQuery = new CmsxAuthRoleResQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleResDAO.countCmsxAuthRoleResQueryByExample( cmsxAuthRoleResQuery ) > 0 );
    }

    @Test
    public void updateCmsxAuthRoleResDOTest() {
        CmsxAuthRoleResDO cmsxAuthRoleResDO = new CmsxAuthRoleResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthRoleResDAO.updateCmsxAuthRoleResDO( cmsxAuthRoleResDO ) > 0 );
    }

    @Test
    public void findListCmsxAuthRoleResDOByExampleTest() {
        CmsxAuthRoleResDO cmsxAuthRoleResDO = new CmsxAuthRoleResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthRoleResDO> resultList = cmsxAuthRoleResDAO.findListByExample( cmsxAuthRoleResDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAuthRoleResQueryByExampleTest() {
        CmsxAuthRoleResQuery cmsxAuthRoleResQuery = new CmsxAuthRoleResQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthRoleResQuery> resultList = cmsxAuthRoleResDAO.findListByExample( cmsxAuthRoleResQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAuthRoleResDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAuthRoleResDAO.findCmsxAuthRoleResDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxAuthRoleResDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAuthRoleResDAO.deleteCmsxAuthRoleResDOByPrimaryKey( ID ) > 0 );
    }

}