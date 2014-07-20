package com.apachecms.cmsx.dal.dao.impl;

import java.util.List;

import org.springframework.orm.ibatis.SqlMapClientTemplate;

import com.apachecms.cmsx.dal.dao.common.BasePage;

/**
 * TODO Comment of AbstractDaoRouter
 * 
 * @author jiwen.chenjw
 */
public abstract class AbstractDaoRouter {

	/**
	 * @return
	 */
	public abstract boolean isAutoCount();

	/**
	 * @return the sqlMapClientTemplate
	 */
	public abstract SqlMapClientTemplate getSqlMapClientTemplate();

	/**
	 * 普通查询
	 * 
	 * @param statement
	 *            sql语句定义的id
	 * @param parameters
	 *            参数
	 * @return
	 */
	public List<?> query(String statement, Object parameters) {
		return getSqlMapClientTemplate().queryForList(statement, parameters);
	}

	/**
	 * 分页查询，注意此处不需要在sql语句中定义startRow和endRow，如果定义，那就用上面的普通查询即可。
	 * 
	 * @param statement
	 * @param parameters
	 * @param offset
	 * @param limit
	 * @return
	 */
	public List<?> query(String statement, Object parameters, int offset, int limit) {
		return getSqlMapClientTemplate().queryForList(statement, parameters, offset, limit);
	}

	/**
	 * 更新数据
	 * 
	 * @param statement
	 * @param parameters
	 * @return
	 */
	public int update(String statement, Object parameters) {
		return getSqlMapClientTemplate().update(statement, parameters);
	}

	/**
	 * 删除
	 * 
	 * @param statement
	 * @param parameters
	 * @return
	 */
	public int delete(String statement, Object parameters) {
		return getSqlMapClientTemplate().delete(statement, parameters);
	}

	/**
	 * 新增数据，建议在定义sql语句的时候，使用selectKey保证可以返回新增后的主键
	 * 
	 * @param statement
	 * @param parameters
	 * @return
	 */
	public Object insert(String statement, Object parameters) {
		return getSqlMapClientTemplate().insert(statement, parameters);
	}

	/**
	 * 返回记录数
	 * 
	 * @param name
	 * @param parameters
	 * @return
	 */
	public int count(String name, Object parameters) {
		String statementName = getStatementName(isAutoCount() ? "query" : "count", name);
		if (isAutoCount()) {
			return (Integer) getSqlMapClientTemplate().queryForObject(statementName, parameters);
		} else {
			Object count = getSqlMapClientTemplate().queryForObject(statementName, parameters);
			return ((Integer) count).intValue();
		}
	}

	/**
	 * 生成statement
	 * 
	 * @param method
	 * @param name
	 * @return
	 */
	private String getStatementName(String method, String name) {
		if (name.indexOf(".") > 0) {
			return name;
		}
		return name + "." + method;
	}

	/**
	 * 分页查询，sql语句定义和普通查询一致，无需为分页进行特殊处理
	 * 
	 * @param statementName
	 * @param parameters
	 * @param page
	 * @return
	 */
	public List<?> query(String statementName, Object parameters, BasePage page) {
		int startRow = page.getStartRow();
		int pageSize = page.getPageSize();
		List<?> list = this.query(statementName, parameters, startRow, pageSize);

		int total = this.count(statementName, parameters);
		page.setTotalItem(total);
		return list;
	}

	/**
	 * 返回第一条记录查询结果，如果没有就返回null
	 * 
	 * @param statementName
	 * @param parameters
	 * @return
	 */
	public Object queryForObject(String statementName, Object parameters) {
		return getSqlMapClientTemplate().queryForObject(statementName, parameters);
	}
}
