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

import com.apachecms.cmsx.dal.dao.CmsxAdminDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAdminDO;
import com.apachecms.cmsx.dal.query.CmsxAdminQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxAdminDAOTest {

    @Resource
    private CmsxAdminDAO cmsxAdminDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAdminDOTest() {
        CmsxAdminDO cmsxAdminDO = new CmsxAdminDO();
        cmsxAdminDO.setUserid("olduserid");
        ID = cmsxAdminDAO.insertCmsxAdminDO( cmsxAdminDO );
    }

    @Test
    public void countCmsxAdminDOByExampleTest() {
        CmsxAdminDO cmsxAdminDO = new CmsxAdminDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAdminDAO.countCmsxAdminDOByExample( cmsxAdminDO ) > 0 );
    }

    @Test
    public void countCmsxAdminQueryByExampleTest() {
        CmsxAdminQuery cmsxAdminQuery = new CmsxAdminQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAdminDAO.countCmsxAdminQueryByExample( cmsxAdminQuery ) > 0 );
    }

    @Test
    public void updateCmsxAdminDOTest() {
        CmsxAdminDO cmsxAdminDO = new CmsxAdminDO();
        cmsxAdminDO.setId(ID);
        cmsxAdminDO.setUserid("newuserid");
        Assert.assertTrue( cmsxAdminDAO.updateCmsxAdminDO( cmsxAdminDO ) > 0 );
    }

    @Test
    public void findListCmsxAdminDOByExampleTest() {
        CmsxAdminDO cmsxAdminDO = new CmsxAdminDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAdminDO> resultList = cmsxAdminDAO.findListByExample( cmsxAdminDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAdminQueryByExampleTest() {
        CmsxAdminQuery cmsxAdminQuery = new CmsxAdminQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAdminQuery> resultList = cmsxAdminDAO.findListByExample( cmsxAdminQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAdminDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAdminDAO.findCmsxAdminDOByPrimaryKey( ID ) );
    }
 
    @After
    public void deleteCmsxAdminDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAdminDAO.deleteCmsxAdminDOByPrimaryKey( ID ) > 0 );
    }

}