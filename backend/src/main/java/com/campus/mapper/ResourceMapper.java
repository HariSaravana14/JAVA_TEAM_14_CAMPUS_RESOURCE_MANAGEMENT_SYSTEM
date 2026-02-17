package com.campus.mapper;

import com.campus.dto.response.ResourceResponse;
import com.campus.entity.Resource;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ResourceMapper {
	ResourceResponse toResponse(Resource resource);
}
