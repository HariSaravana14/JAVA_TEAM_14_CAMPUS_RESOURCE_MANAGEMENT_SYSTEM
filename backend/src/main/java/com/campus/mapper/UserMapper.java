package com.campus.mapper;

import com.campus.dto.response.UserResponse;
import com.campus.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
	UserResponse toResponse(User user);
}
