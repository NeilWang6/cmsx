package com.apachecms.cmsx.dal.dao.ibatis;

import org.springframework.orm.ibatis.SqlMapClientTemplate;

public class DaoRouter extends AbstractDaoRouter {
    /**
     * 扩展ibatis的sql处理方法
     */
    private SqlMapClientTemplate sqlMapClientTemplate = null; 

    /**
     * 是否自动处理count的sql语句
     */
    private boolean autoCount; 

    /**
     * @return the sqlMapClientTemplate
     */
    public SqlMapClientTemplate getSqlMapClientTemplate() {
        return sqlMapClientTemplate;
    }

    /**
     * @param sqlMapClientTemplate the sqlMapClientTemplate to set
     */
    public void setSqlMapClientTemplate(SqlMapClientTemplate sqlMapClientTemplate) {
        this.sqlMapClientTemplate = sqlMapClientTemplate;
    }

    /**
     * @return
     */
    public boolean isAutoCount() {
        return autoCount;
    }

    /**
     * @param autoCount
     */
    public void setAutoCount(boolean autoCount) {
        this.autoCount = autoCount;
    }
    
}

