package com.apachecms.cmsx.acl.param;

import java.util.List;

public class PageParam<T> {

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

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
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

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}
}