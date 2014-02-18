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

import com.apachecms.cmsx.dal.dao.CmsxMetaPropenumDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropenumDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropenumQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxMetaPropenumDAOTest {

    @Resource
    private CmsxMetaPropenumDAO cmsxMetaPropenumDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxMetaPropenumDOTest() {
        CmsxMetaPropenumDO cmsxMetaPropenumDO = new CmsxMetaPropenumDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxMetaPropenumDAO.insertCmsxMetaPropenumDO( cmsxMetaPropenumDO );
    }

    @Test
    public void countCmsxMetaPropenumDOByExampleTest() {
        CmsxMetaPropenumDO cmsxMetaPropenumDO = new CmsxMetaPropenumDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropenumDAO.countCmsxMetaPropenumDOByExample( cmsxMetaPropenumDO ) > 0 );
    }

    @Test
    public void countCmsxMetaPropenumQueryByExampleTest() {
        CmsxMetaPropenumQuery cmsxMetaPropenumQuery = new CmsxMetaPropenumQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropenumDAO.countCmsxMetaPropenumQueryByExample( cmsxMetaPropenumQuery ) > 0 );
    }

    @Test
    public void updateCmsxMetaPropenumDOTest() {
        CmsxMetaPropenumDO cmsxMetaPropenumDO = new CmsxMetaPropenumDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropenumDAO.updateCmsxMetaPropenumDO( cmsxMetaPropenumDO ) > 0 );
    }

    @Test
    public void findListCmsxMetaPropenumDOByExampleTest() {
        CmsxMetaPropenumDO cmsxMetaPropenumDO = new CmsxMetaPropenumDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxMetaPropenumDO> resultList = cmsxMetaPropenumDAO.findListByExample( cmsxMetaPropenumDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxMetaPropenumQueryByExampleTest() {
        CmsxMetaPropenumQuery cmsxMetaPropenumQuery = new CmsxMetaPropenumQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxMetaPropenumQuery> resultList = cmsxMetaPropenumDAO.findListByExample( cmsxMetaPropenumQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxMetaPropenumDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxMetaPropenumDAO.findCmsxMetaPropenumDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxMetaPropenumDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxMetaPropenumDAO.deleteCmsxMetaPropenumDOByPrimaryKey( ID ) > 0 );
    }

}