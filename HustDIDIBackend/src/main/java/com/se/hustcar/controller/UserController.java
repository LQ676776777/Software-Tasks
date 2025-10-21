package com.se.hustcar.controller;

import com.se.hustcar.domain.pojo.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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

    //登录功能
    @PostMapping
    public Result login(){
        return
    }
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
    public Result loginUser(@RequestBody LoginFormDTO loginForm) {
        return userService.login(loginForm);
    }
}
