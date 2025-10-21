package com.se.hustcar.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.se.hustcar.domain.dto.LoginFormDTO;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.UserMapper;
import com.se.hustcar.service.UserService;
import com.se.hustcar.utils.SmsSender;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cn.hutool.core.util.PhoneUtil;
/**
 * ClassName: UserServiceImpl
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 17:25
 * @Veision 1.0
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper userMapper;
    @Override
    public Result updateUserInfo(User user) {
        userMapper.updateById(user);
        return Result.ok("用户信息更新成功");
    }

    @Override
    public Result deleteUser(Integer id) {
        try {
            userMapper.deleteById(id);
        } catch (Exception e) {
            return Result.fail("用户删除失败");
        }
        return Result.ok("用户删除成功");
    }

    @Override
    public Result register(User user) {
        userMapper.insert(user);
        return Result.ok("用户注册成功");
    }

    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        return null;
    }

    @Override
    public Result sendCode(String phone, HttpSession session) {
        //校验手机号
        if(!PhoneUtil.isMobile(phone)){
            //如果不符合，返回错误信息
            return Result.fail("手机号格式错误");
        }
        //生成验证码
        String code= RandomUtil.randomNumbers(6);// 生成6位随机数字验证码
        //保存验证码到session
        session.setAttribute("code", code);
        //调用短信服务发送验证码
        SmsSender.sendCodeUtil(code,phone);
        System.out.println("发送短信验证码，验证码："+code);
        //返回ok
        return Result.ok("验证码发送成功");
    }
}
