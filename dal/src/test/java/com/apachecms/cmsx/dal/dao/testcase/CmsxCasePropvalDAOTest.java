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

import com.apachecms.cmsx.dal.dao.CmsxCasePropvalDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxCasePropvalDO;
import com.apachecms.cmsx.dal.query.CmsxCasePropvalQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxCasePropvalDAOTest {

    @Resource
    private CmsxCasePropvalDAO cmsxCasePropvalDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxCasePropvalDOTest() {
        CmsxCasePropvalDO cmsxCasePropvalDO = new CmsxCasePropvalDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxCasePropvalDAO.insertCmsxCasePropvalDO( cmsxCasePropvalDO );
    }

    @Test
    public void countCmsxCasePropvalDOByExampleTest() {
        CmsxCasePropvalDO cmsxCasePropvalDO = new CmsxCasePropvalDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCasePropvalDAO.countCmsxCasePropvalDOByExample( cmsxCasePropvalDO ) > 0 );
    }

    @Test
    public void countCmsxCasePropvalQueryByExampleTest() {
        CmsxCasePropvalQuery cmsxCasePropvalQuery = new CmsxCasePropvalQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCasePropvalDAO.countCmsxCasePropvalQueryByExample( cmsxCasePropvalQuery ) > 0 );
    }

    @Test
    public void updateCmsxCasePropvalDOTest() {
        CmsxCasePropvalDO cmsxCasePropvalDO = new CmsxCasePropvalDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxCasePropvalDAO.updateCmsxCasePropvalDO( cmsxCasePropvalDO ) > 0 );
    }

    @Test
    public void findListCmsxCasePropvalDOByExampleTest() {
        CmsxCasePropvalDO cmsxCasePropvalDO = new CmsxCasePropvalDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCasePropvalDO> resultList = cmsxCasePropvalDAO.findListByExample( cmsxCasePropvalDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxCasePropvalQueryByExampleTest() {
        CmsxCasePropvalQuery cmsxCasePropvalQuery = new CmsxCasePropvalQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxCasePropvalQuery> resultList = cmsxCasePropvalDAO.findListByExample( cmsxCasePropvalQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxCasePropvalDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxCasePropvalDAO.findCmsxCasePropvalDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxCasePropvalDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxCasePropvalDAO.deleteCmsxCasePropvalDOByPrimaryKey( ID ) > 0 );
    }

}