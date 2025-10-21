package com.se.hustcar.domain.dto;

import lombok.Data;

/**
 * ClassName: LoginFormDTO
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 17:17
 * @Veision 1.0
 */
@Data
public class LoginFormDTO {
    private String phone;
    private String code;
    private String password;
}
