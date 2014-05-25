package com.apachecms.cmsx.dal.dao.common;

import java.util.List;

public class PageInfo<T> {
	// 默认页面大小
	public static final int PAGE_SIZE = 15;
	// 支持多样sql查询总条数
	public static final int COMPLETE_COUNT = 0;
	// 高效查询总条数
	public static final int EFFICIENT_COUNT = 1;
	// 不使用框架提供统计总条数
	public static final int NO_COUNT = 2;

	// 每页记录数
	private int pageSize;

	// 总记录数
	private int allRow;

	// 总页数
	private int totalPage;

	// 当前页
	private int currentPage;

	// 要返回的某一页的记录列表
	private List<T> list;

	/**
	 * 计算总页数,静态方法,供外部直接通过类名调用　
	 * 
	 * @param pageSize 每页记录数
	 * @param allRow   总记录数
	 * @return 总页数
	 */
	public void countTotalPage(int pageSize, int allRow) {
		this.totalPage = allRow % pageSize == 0 ? allRow / pageSize : allRow / pageSize + 1;
	}

	public int getAllRow() {
		return allRow;
	}

	public void setAllRow(int allRow) {
		this.allRow = allRow;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}
}