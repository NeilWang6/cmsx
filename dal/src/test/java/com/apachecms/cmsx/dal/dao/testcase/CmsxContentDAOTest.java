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

import com.apachecms.cmsx.dal.dao.CmsxContentDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxContentDO;
import com.apachecms.cmsx.dal.query.CmsxContentQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxContentDAOTest {

    @Resource
    private CmsxContentDAO cmsxContentDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxContentDOTest() {
        CmsxContentDO cmsxContentDO = new CmsxContentDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxContentDAO.insertCmsxContentDO( cmsxContentDO );
    }

    @Test
    public void countCmsxContentDOByExampleTest() {
        CmsxContentDO cmsxContentDO = new CmsxContentDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxContentDAO.countCmsxContentDOByExample( cmsxContentDO ) > 0 );
    }

    @Test
    public void countCmsxContentQueryByExampleTest() {
        CmsxContentQuery cmsxContentQuery = new CmsxContentQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxContentDAO.countCmsxContentQueryByExample( cmsxContentQuery ) > 0 );
    }

    @Test
    public void updateCmsxContentDOTest() {
        CmsxContentDO cmsxContentDO = new CmsxContentDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxContentDAO.updateCmsxContentDO( cmsxContentDO ) > 0 );
    }

    @Test
    public void findListCmsxContentDOByExampleTest() {
        CmsxContentDO cmsxContentDO = new CmsxContentDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxContentDO> resultList = cmsxContentDAO.findListByExample( cmsxContentDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxContentQueryByExampleTest() {
        CmsxContentQuery cmsxContentQuery = new CmsxContentQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxContentQuery> resultList = cmsxContentDAO.findListByExample( cmsxContentQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxContentDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxContentDAO.findCmsxContentDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxContentDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxContentDAO.deleteCmsxContentDOByPrimaryKey( ID ) > 0 );
    }

}