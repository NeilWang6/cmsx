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

import com.apachecms.cmsx.dal.dao.CmsxCaseCatalogPropDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseCatalogPropDO;
import com.apachecms.cmsx.dal.query.CmsxCaseCatalogPropQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxCaseCatalogPropDAOTest {

    @Resource
    private CmsxCaseCatalogPropDAO cmsxCaseCatalogPropDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxCaseCatalogPropDOTest() {
        CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO = new CmsxCaseCatalogPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxCaseCatalogPropDAO.insertCmsxCaseCatalogPropDO( cmsxCaseCatalogPropDO );
    }

    @Test
    public void countCmsxCaseCatalogPropDOByExampleTest() {
        CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO = new CmsxCaseCatalogPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogPropDAO.countCmsxCaseCatalogPropDOByExample( cmsxCaseCatalogPropDO ) > 0 );
    }

    @Test
    public void countCmsxCaseCatalogPropQueryByExampleTest() {
        CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery = new CmsxCaseCatalogPropQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogPropDAO.countCmsxCaseCatalogPropQueryByExample( cmsxCaseCatalogPropQuery ) > 0 );
    }

    @Test
    public void updateCmsxCaseCatalogPropDOTest() {
        CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO = new CmsxCaseCatalogPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseCatalogPropDAO.updateCmsxCaseCatalogPropDO( cmsxCaseCatalogPropDO ) > 0 );
    }

    @Test
    public void findListCmsxCaseCatalogPropDOByExampleTest() {
        CmsxCaseCatalogPropDO cmsxCaseCatalogPropDO = new CmsxCaseCatalogPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseCatalogPropDO> resultList = cmsxCaseCatalogPropDAO.findListByExample( cmsxCaseCatalogPropDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxCaseCatalogPropQueryByExampleTest() {
        CmsxCaseCatalogPropQuery cmsxCaseCatalogPropQuery = new CmsxCaseCatalogPropQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseCatalogPropQuery> resultList = cmsxCaseCatalogPropDAO.findListByExample( cmsxCaseCatalogPropQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxCaseCatalogPropDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxCaseCatalogPropDAO.findCmsxCaseCatalogPropDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxCaseCatalogPropDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxCaseCatalogPropDAO.deleteCmsxCaseCatalogPropDOByPrimaryKey( ID ) > 0 );
    }

}