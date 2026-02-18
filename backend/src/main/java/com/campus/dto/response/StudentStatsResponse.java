package com.campus.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentStatsResponse {
	private long totalStudents;
	private long activeStudents;
	private long inactiveStudents;
}
