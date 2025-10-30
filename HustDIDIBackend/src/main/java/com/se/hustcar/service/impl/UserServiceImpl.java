package com.se.hustcar.service.impl;

import cn.hutool.core.util.PhoneUtil;
import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import com.se.hustcar.domain.dto.LoginFormDTO;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.UserMapper;
import com.se.hustcar.service.UserService;
import com.se.hustcar.utils.SmsSender;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
 * ClassName: UserServiceImpl
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 17:25
 * @Veision 1.0
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper,User> implements UserService {
    @Autowired
    UserMapper userMapper;
    @Autowired
    private Cache<String, Boolean> smsSendLimitCache;
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
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        String phone = loginForm.getPhone();
        String code = loginForm.getCode();
        String sessionCode = (String) session.getAttribute("code");
        String sessionPhone = (String) session.getAttribute("phone");
        Long sessionCodeTimestamp = (Long) session.getAttribute("codeTimestamp");
        if(sessionCodeTimestamp==null||sessionCode==null||sessionPhone==null){
            return Result.fail("请先获取验证码");
        }
        if (System.currentTimeMillis()-sessionCodeTimestamp>5*60*1000){
            session.removeAttribute("code");
            session.removeAttribute("phone");
            session.removeAttribute("codeTimestamp");
            return Result.fail("验证码已过期，请重新获取");
        }
        if(!sessionPhone.equals(phone)){
            return Result.fail("手机号与接收验证码手机号不匹配");
        }
        if (!Objects.equals(sessionCode, code)) {
            return Result.fail("验证码错误");
        }
        session.removeAttribute("code");
        session.removeAttribute("phone");
        session.removeAttribute("codeTimestamp");
        //依据手机号查询是否存在用户
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhoneNumber, phone));
        if (user == null) {
            user = new User();
            user.setPhoneNumber(phone);
            userMapper.insert(user);
        }
        //登录成功，保存用户信息到session
        session.setAttribute("user", user);
        return Result.ok("登录成功");
    }

    @Override
    public Result sendCode(String phone, HttpSession session) {
        //校验手机号
        if(!PhoneUtil.isMobile(phone)){
            //如果不符合，返回错误信息
            return Result.fail("手机号格式错误");
        }
        String cacheKey = "sms_limit:" + phone;
        if (smsSendLimitCache.getIfPresent(cacheKey) != null) {
            return Result.fail("操作过于频繁，请60秒后再试");
        }
        //生成验证码
        String code= RandomUtil.randomNumbers(6);// 生成6位随机数字验证码
        //保存验证码到session
        session.setAttribute("code", code);
        session.setAttribute("codeTimestamp", System.currentTimeMillis());
        session.setAttribute("phone", phone);
        //调用短信服务发送验证码
        if(!SmsSender.sendCodeUtil(code,phone)){
            return Result.fail("验证码发送失败");
        }
//        System.out.println("发送短信验证码，验证码："+code);
        // 6. 写入缓存，标记该手机号已发送
        smsSendLimitCache.put(cacheKey, Boolean.TRUE);
        //返回ok
        return Result.ok("验证码发送成功");
    }

    @Override
    public Result logout(HttpSession session) {
        session.invalidate();
        return Result.ok("退出登录成功");
    }
}
