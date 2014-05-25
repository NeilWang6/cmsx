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

import com.apachecms.cmsx.dal.dao.CmsxMetaPropDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxMetaPropDO;
import com.apachecms.cmsx.dal.query.CmsxMetaPropQuery;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxMetaPropDAOTest {

    @Resource
    private CmsxMetaPropDAO cmsxMetaPropDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxMetaPropDOTest() {
        CmsxMetaPropDO cmsxMetaPropDO = new CmsxMetaPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxMetaPropDAO.insertCmsxMetaPropDO( cmsxMetaPropDO );
    }

    @Test
    public void countCmsxMetaPropDOByExampleTest() {
        CmsxMetaPropDO cmsxMetaPropDO = new CmsxMetaPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropDAO.countCmsxMetaPropDOByExample( cmsxMetaPropDO ) > 0 );
    }

    @Test
    public void countCmsxMetaPropQueryByExampleTest() {
        CmsxMetaPropQuery cmsxMetaPropQuery = new CmsxMetaPropQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropDAO.countCmsxMetaPropQueryByExample( cmsxMetaPropQuery ) > 0 );
    }

    @Test
    public void updateCmsxMetaPropDOTest() {
        CmsxMetaPropDO cmsxMetaPropDO = new CmsxMetaPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxMetaPropDAO.updateCmsxMetaPropDO( cmsxMetaPropDO ) > 0 );
    }

    @Test
    public void findListCmsxMetaPropDOByExampleTest() {
        CmsxMetaPropDO cmsxMetaPropDO = new CmsxMetaPropDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxMetaPropDO> resultList = cmsxMetaPropDAO.findListByExample( cmsxMetaPropDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxMetaPropQueryByExampleTest() {
        CmsxMetaPropQuery cmsxMetaPropQuery = new CmsxMetaPropQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxMetaPropQuery> resultList = cmsxMetaPropDAO.findListByExample( cmsxMetaPropQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxMetaPropDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxMetaPropDAO.findCmsxMetaPropDOByPrimaryKey( ID ) );
    }

    @After
    public void deleteCmsxMetaPropDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxMetaPropDAO.deleteCmsxMetaPropDOByPrimaryKey( ID ) > 0 );
    }

}