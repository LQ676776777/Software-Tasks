package com.se.hustcar.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.se.hustcar.domain.dto.LoginFormDTO;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import jakarta.servlet.http.HttpSession;


/**
 * ClassName: UserService
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 14:44
 * @Veision 1.0
 */
public interface UserService extends IService<User> {
    Result updateUserInfo(User user);

    Result deleteUser(Integer id);

    Result register(User user);

    Result login(LoginFormDTO loginForm, HttpSession session);

    Result sendCode(String phone , HttpSession session);

    Result logout(HttpSession session);
}
