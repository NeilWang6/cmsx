package com.apachecms.cmsx.dal.dao.common;
 
public class BasePage {

	private static final Integer defaultPageSize;
	private static final Integer defaultFristPage = 1;
	private static final Integer defaultTotleItem = 0;
	private static final int defaultStartRow = 1;
	private static final int defaultEndRow;
	private Integer totalItem;
	private Integer pageSize;
	private Integer currentPage;
	private int startRow;
	private int endRow;

	static {
		defaultPageSize = 20;
		defaultEndRow = defaultPageSize.intValue();
	}

	public BasePage() {
		startRow = defaultStartRow;
		endRow = defaultEndRow;
	}

	protected Integer getDefaultPageSize() {
		return defaultPageSize;
	}

	public boolean isFirstPage() {
		return getCurrentPage().intValue() == 1;
	}

	public int getPreviousPage() {
		int back = getCurrentPage().intValue() - 1;
		if (back <= 0)
			back = 1;
		return back;
	}

	public boolean isLastPage() {
		return getTotalPage() == getCurrentPage().intValue();
	}

	public int getNextPage() {
		int back = getCurrentPage().intValue() + 1;
		if (back > getTotalPage())
			back = getTotalPage();
		return back;
	}

	public Integer getCurrentPage() {
		if (currentPage == null)
			return defaultFristPage;
		else
			return currentPage;
	}

	public void setCurrentPageString(String pageString) {
		if (isBlankString(pageString))
			return;
		try {
			Integer integer = new Integer(pageString);
			setCurrentPage(integer);
		} catch (NumberFormatException ignore) {
		}
	}

	public void setCurrentPage(Integer cPage) {
		if (cPage == null || cPage.intValue() <= 0)
			currentPage = null;
		else
			currentPage = cPage;
		buildStartEndRow(getPageFristItem(), getPageSize().intValue());
	}

	public Integer getPageSize() {
		if (pageSize == null)
			return getDefaultPageSize();
		else
			return pageSize;
	}

	public boolean hasSetPageSize() {
		return pageSize != null;
	}

	public void setPageSizeString(String pageSizeString) {
		if (isBlankString(pageSizeString))
			return;
		try {
			Integer integer = new Integer(pageSizeString);
			setPageSize(integer);
		} catch (NumberFormatException ignore) {
		}
	}

	private boolean isBlankString(String pageSizeString) {
		if (pageSizeString == null)
			return true;
		return pageSizeString.trim().length() == 0;
	}

	public void setPageSize(Integer pSize) {
		if (pSize == null || pSize.intValue() <= 0)
			pageSize = null;
		else
			pageSize = pSize;
		buildStartEndRow(getPageFristItem(), getPageSize().intValue());
	}

	public Integer getTotalItem() {
		if (totalItem == null)
			return defaultTotleItem;
		else
			return totalItem;
	}

	public void setTotalItem(Integer tItem) {
		if (tItem == null)
			throw new IllegalArgumentException("TotalItem can't be null.");
		totalItem = tItem;
		int current = getCurrentPage().intValue();
		int lastPage = getTotalPage();
		if (current > lastPage)
			setCurrentPage(lastPage);
	}

	public int getTotalPage() {
		int pgSize = getPageSize().intValue();
		int total = getTotalItem().intValue();
		int result = total / pgSize;
		if (total == 0 || total % pgSize != 0)
			result++;
		return result;
	}

	public int getPageFristItem() {
		int cPage = getCurrentPage().intValue();
		if (cPage == 1) {
			return 1;
		} else {
			cPage--;
			int pgSize = getPageSize().intValue();
			return pgSize * cPage + 1;
		}
	}

	public int getPageLastItem() {
		int cPage = getCurrentPage().intValue();
		int pgSize = getPageSize().intValue();
		int assumeLast = pgSize * cPage;
		int totalItem = getTotalItem().intValue();
		if (assumeLast > totalItem)
			return totalItem;
		else
			return assumeLast;
	}

	public int getEndRow() {
		return endRow;
	}

	public void setEndRow(int endRow) {
		this.endRow = endRow;
	}

	public int getStartRow() {
		return startRow;
	}

	public void setStartRow(int startRow) {
		this.startRow = startRow;
	}

	public void buildStartEndRow(int startRow, int rows) {
		this.startRow = startRow;
		if (this.startRow <= 0)
			this.startRow = 1;
		endRow = this.startRow;
		if (rows > 0)
			endRow = (endRow + rows) - 1;
	}

}
