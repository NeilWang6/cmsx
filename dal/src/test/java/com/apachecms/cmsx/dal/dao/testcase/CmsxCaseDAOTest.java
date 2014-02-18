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

import com.apachecms.cmsx.dal.dao.CmsxCaseDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxCaseDO;
import com.apachecms.cmsx.dal.query.CmsxCaseQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxCaseDAOTest {

    @Resource
    private CmsxCaseDAO cmsxCaseDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxCaseDOTest() {
        CmsxCaseDO cmsxCaseDO = new CmsxCaseDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxCaseDAO.insertCmsxCaseDO( cmsxCaseDO );
    }

    @Test
    public void countCmsxCaseDOByExampleTest() {
        CmsxCaseDO cmsxCaseDO = new CmsxCaseDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseDAO.countCmsxCaseDOByExample( cmsxCaseDO ) > 0 );
    }

    @Test
    public void countCmsxCaseQueryByExampleTest() {
        CmsxCaseQuery cmsxCaseQuery = new CmsxCaseQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseDAO.countCmsxCaseQueryByExample( cmsxCaseQuery ) > 0 );
    }

    @Test
    public void updateCmsxCaseDOTest() {
        CmsxCaseDO cmsxCaseDO = new CmsxCaseDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCaseDAO.updateCmsxCaseDO( cmsxCaseDO ) > 0 );
    }

    @Test
    public void findListCmsxCaseDOByExampleTest() {
        CmsxCaseDO cmsxCaseDO = new CmsxCaseDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseDO> resultList = cmsxCaseDAO.findListByExample( cmsxCaseDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxCaseQueryByExampleTest() {
        CmsxCaseQuery cmsxCaseQuery = new CmsxCaseQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCaseQuery> resultList = cmsxCaseDAO.findListByExample( cmsxCaseQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxCaseDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxCaseDAO.findCmsxCaseDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxCaseDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxCaseDAO.deleteCmsxCaseDOByPrimaryKey( ID ) > 0 );
    }

}