package com.apachecms.cmsx.dal.dao.testcase;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.apachecms.cmsx.dal.dao.CmsxAuthResDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthResDO;
import com.apachecms.cmsx.dal.query.CmsxAuthResQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:springbeans-resource.xml","classpath:springbeans-ds.xml", "classpath:springbeans-data.xml" })
public class CmsxAuthResDAOTest {

    @Resource
    private CmsxAuthResDAO cmsxAuthResDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAuthResDOTest() {
        CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxAuthResDAO.insertCmsxAuthResDO( cmsxAuthResDO );
    }

    @Test
    public void countCmsxAuthResDOByExampleTest() {
        CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthResDAO.countCmsxAuthResDOByExample( cmsxAuthResDO ) > 0 );
    }

    @Test
    public void countCmsxAuthResQueryByExampleTest() {
        CmsxAuthResQuery cmsxAuthResQuery = new CmsxAuthResQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthResDAO.countCmsxAuthResQueryByExample( cmsxAuthResQuery ) > 0 );
    }

    @Test
    public void updateCmsxAuthResDOTest() {
        CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthResDAO.updateCmsxAuthResDO( cmsxAuthResDO ) > 0 );
    }

    @Test
    public void findListCmsxAuthResDOByExampleTest() {
        CmsxAuthResDO cmsxAuthResDO = new CmsxAuthResDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthResDO> resultList = cmsxAuthResDAO.findListByExample( cmsxAuthResDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAuthResQueryByExampleTest() {
        CmsxAuthResQuery cmsxAuthResQuery = new CmsxAuthResQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthResQuery> resultList = cmsxAuthResDAO.findListByExample( cmsxAuthResQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAuthResDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAuthResDAO.findCmsxAuthResDOByPrimaryKey( ID ) );
    }

    @Test
    public void deleteCmsxAuthResDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAuthResDAO.deleteCmsxAuthResDOByPrimaryKey( ID ) > 0 );
    }

}