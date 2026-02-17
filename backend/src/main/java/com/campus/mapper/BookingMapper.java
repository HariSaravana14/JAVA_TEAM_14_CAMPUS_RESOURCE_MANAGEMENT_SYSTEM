package com.campus.mapper;

import com.campus.dto.response.BookingResponse;
import com.campus.entity.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
	BookingResponse toResponse(Booking booking);
}
