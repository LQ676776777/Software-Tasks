package com.se.hustcar.controller;

import com.se.hustcar.domain.dto.LoginFormDTO;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * ClassName: UserController
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 13:56
 * @Veision 1.0
 */
@RestController
public class UserController {
    @Autowired
    UserService userService;
    // 用户信息修改
    @PutMapping("/user")
    public Result updateUserInfo(@RequestBody User user) {
        return userService.updateUserInfo(user);
    }
    // 用户注销
    @DeleteMapping("/user/{id}")
    public Result deleteUser(@PathVariable Integer id) {
        return userService.deleteUser(id);
    }
    // 用户登录
    @PostMapping("/login")
    public Result login(@RequestBody LoginFormDTO loginForm, HttpSession session) {
        return userService.login(loginForm,session);
    }
    //退出登录
    @PostMapping("/logout")
    public Result logout(HttpSession session) {
        return userService.logout(session);
    }
    //发送验证码
    @PostMapping("/code")
    public Result sendCode(@RequestParam ("phone") String phone,HttpSession session) {
        return userService.sendCode(phone, session);
    }
}
