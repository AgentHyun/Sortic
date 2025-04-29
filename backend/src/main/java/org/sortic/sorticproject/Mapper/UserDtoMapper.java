package org.sortic.sorticproject.Mapper;

import org.mapstruct.Mapper;
import org.sortic.sorticproject.Entity.Users;
import org.sortic.sorticproject.DTO.request.SignupRequest;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {
    Users toEntity(SignupRequest DTO);
}
