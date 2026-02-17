package com.campus.util;

import java.time.LocalDate;
import java.time.ZoneOffset;

public final class DateUtil {

	private DateUtil() {
	}

	public static LocalDate todayUtc() {
		return LocalDate.now(ZoneOffset.UTC);
	}
}
