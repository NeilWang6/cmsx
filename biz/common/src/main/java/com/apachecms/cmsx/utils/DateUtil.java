package com.apachecms.cmsx.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang.StringUtils;

public class DateUtil {

	private static final String DEFAULT_DATE_FORMAT = "yyyy/MM/dd/";

	public static String toLocaleString(Date date, String dateFormat) {
		if (date == null) {
			return "";
		}

		if (StringUtils.isBlank(dateFormat)) {
			return new SimpleDateFormat(DEFAULT_DATE_FORMAT).format(date);
		}

		return new SimpleDateFormat(dateFormat).format(date);
	}

	public static String toLocaleString(Date date) {
		return toLocaleString(date, null);
	}

	public static Date getSysDate(int hours) {
		Calendar time = Calendar.getInstance();

		time.add(Calendar.HOUR, hours);

		return time.getTime();
	}

	public static int getTimeIntervalDays(Date firstDate, Date lastDate) {
		long intervals = lastDate.getTime() - firstDate.getTime() + (60 * 1000);

		if (intervals > 0) {
			long daysd = intervals / (24 * 60 * 60 * 1000);

			return new Long(daysd).intValue();
		}

		return 0;
	}

	public static int getTimeIntervalHours(Date firstDate, Date lastDate) {
		long intervals = lastDate.getTime() - firstDate.getTime() + (60 * 1000);

		if (intervals > 0) {
			long longHours = (intervals / (60 * 60 * 1000)) % 24;

			return new Long(longHours).intValue();
		}

		return 0;
	}

	public static int getTimeIntervalMins(Date firstDate, Date lastDate) {
		long intervals = lastDate.getTime() - firstDate.getTime() + (60 * 1000);

		if (intervals > 0) {
			long longMins = (intervals / (60 * 1000)) % 60;

			return new Long(longMins).intValue();
		}

		return 0;
	}

	public static Date parseDate(String date, String dateformat) {
		SimpleDateFormat sdf = new SimpleDateFormat(dateformat);

		try {
			return sdf.parse(date);
		} catch (ParseException e) {
			return null;
		}
	}

	public static boolean afterNow(Date date) {
		if (date == null) {
			return false;
		}

		Calendar nowCar = Calendar.getInstance();
		Calendar car = Calendar.getInstance();

		car.setTime(date);

		return car.after(nowCar);
	}

	public static boolean afterDays(Date date, int day) {
		if (date == null) {
			return false;
		}

		Calendar levelDay = Calendar.getInstance();
		Calendar createDay = Calendar.getInstance();

		createDay.setTime(date);
		createDay.add(Calendar.DATE, day);

		if (createDay.after(levelDay)) {
			return true;
		} else {
			return false;
		}
	}

	public static boolean afterHours(Date date, int hours) {
		if (date == null) {
			return false;
		}

		Calendar levelDay = Calendar.getInstance();
		Calendar createDay = Calendar.getInstance();

		createDay.setTime(date);
		createDay.add(Calendar.HOUR, hours);

		if (createDay.after(levelDay)) {
			return true;
		} else {
			return false;
		}
	}

	public static Date getCurrentTime() {
		return new Date();
	}

	public static Date addTime(Date when, int seconds) {
		Calendar c = Calendar.getInstance();

		c.setTime(when);
		c.add(Calendar.SECOND, seconds);

		return c.getTime();
	}
}