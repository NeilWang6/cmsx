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

import com.apachecms.cmsx.dal.dao.CmsxCaseCatalogDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxCaseCatalogDAOTest {

    @Resource
    private CmsxCaseCatalogDAO cmsxCaseCatalogDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxCaseCatalogDOTest() {
        CmsxCaseCatalogDO cmsxCaseCatalogDO = new CmsxCaseCatalogDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxCaseCatalogDAO.insertCmsxCaseCatalogDO( cmsxCaseCatalogDO );
    }

    @Test
    public void countCmsxCaseCatalogDOByExampleTest() {
        CmsxCaseCatalogDO cmsxCaseCatalogDO = new CmsxCaseCatalogDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogDAO.countCmsxCaseCatalogDOByExample( cmsxCaseCatalogDO ) > 0 );
    }

    @Test
    public void countCmsxCaseCatalogQueryByExampleTest() {
        CmsxCaseCatalogQuery cmsxCaseCatalogQuery = new CmsxCaseCatalogQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogDAO.countCmsxCaseCatalogQueryByExample( cmsxCaseCatalogQuery ) > 0 );
    }

    @Test
    public void updateCmsxCaseCatalogDOTest() {
        CmsxCaseCatalogDO cmsxCaseCatalogDO = new CmsxCaseCatalogDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogDAO.updateCmsxCaseCatalogDO( cmsxCaseCatalogDO ) > 0 );
    }

    @Test
    public void findListCmsxCaseCatalogDOByExampleTest() {
        CmsxCaseCatalogDO cmsxCaseCatalogDO = new CmsxCaseCatalogDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseCatalogDO> resultList = cmsxCaseCatalogDAO.findListByExample( cmsxCaseCatalogDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxCaseCatalogQueryByExampleTest() {
        CmsxCaseCatalogQuery cmsxCaseCatalogQuery = new CmsxCaseCatalogQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseCatalogQuery> resultList = cmsxCaseCatalogDAO.findListByExample( cmsxCaseCatalogQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxCaseCatalogDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxCaseCatalogDAO.findCmsxCaseCatalogDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxCaseCatalogDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxCaseCatalogDAO.deleteCmsxCaseCatalogDOByPrimaryKey( ID ) > 0 );
    }

}