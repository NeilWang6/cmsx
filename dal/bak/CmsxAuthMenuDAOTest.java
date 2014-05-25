package com.apachecms.cmsx.dal.dao.testcase;

import com.apachecms.cmsx.dal.dao.CmsxAuthMenuDAO;
import com.apachecms.cmsx.dal.dataobject.CmsxAuthMenuDO;
import com.apachecms.cmsx.dal.query.CmsxAuthMenuQuery;

import java.util.List;

import javax.annotation.Resource;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-test.xml" })
public class CmsxAuthMenuDAOTest {

    @Resource
    private CmsxAuthMenuDAO cmsxAuthMenuDAO;

    private static Long ID = null;

    @Before
    public void insertCmsxAuthMenuDOTest() {
        CmsxAuthMenuDO cmsxAuthMenuDO = new CmsxAuthMenuDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        ID = cmsxAuthMenuDAO.insertCmsxAuthMenuDO( cmsxAuthMenuDO );
    }

    @Test
    public void countCmsxAuthMenuDOByExampleTest() {
        CmsxAuthMenuDO cmsxAuthMenuDO = new CmsxAuthMenuDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthMenuDAO.countCmsxAuthMenuDOByExample( cmsxAuthMenuDO ) > 0 );
    }

    @Test
    public void countCmsxAuthMenuQueryByExampleTest() {
        CmsxAuthMenuQuery cmsxAuthMenuQuery = new CmsxAuthMenuQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthMenuDAO.countCmsxAuthMenuQueryByExample( cmsxAuthMenuQuery ) > 0 );
    }

    @Test
    public void updateCmsxAuthMenuDOTest() {
        CmsxAuthMenuDO cmsxAuthMenuDO = new CmsxAuthMenuDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        Assert.assertTrue( cmsxAuthMenuDAO.updateCmsxAuthMenuDO( cmsxAuthMenuDO ) > 0 );
    }

    @Test
    public void findListCmsxAuthMenuDOByExampleTest() {
        CmsxAuthMenuDO cmsxAuthMenuDO = new CmsxAuthMenuDO();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthMenuDO> resultList = cmsxAuthMenuDAO.findListByExample( cmsxAuthMenuDO );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findListCmsxAuthMenuQueryByExampleTest() {
        CmsxAuthMenuQuery cmsxAuthMenuQuery = new CmsxAuthMenuQuery();
        //FIXME AutoDAO自动生成的代码，请在此处补充测试数据
        List<CmsxAuthMenuQuery> resultList = cmsxAuthMenuDAO.findListByExample( cmsxAuthMenuQuery );
        Assert.assertNotNull( resultList );
        Assert.assertTrue( resultList.size() > 0 );
    }

    @Test
    public void findCmsxAuthMenuDOByPrimaryKeyTest() {
        Assert.assertNotNull( cmsxAuthMenuDAO.findCmsxAuthMenuDOByPrimaryKey( ID ) );
    }

    @Test
    public void deleteCmsxAuthMenuDOByPrimaryKeyTest() {
        Assert.assertTrue( cmsxAuthMenuDAO.deleteCmsxAuthMenuDOByPrimaryKey( ID ) > 0 );
    }

}