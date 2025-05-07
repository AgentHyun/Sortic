package org.sortic.sorticproject.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SignupRequest {

    @NotBlank
    private String userId;

    @Size(min = 6)
    private String password;

    @NotBlank
    private String confirm;

    @NotBlank
    private String username;

    @Pattern(regexp="^\\d{10,11}$")
    private String phone;

    @Email
    private String email;

    @NotBlank
    private String region;
}
