package com.se.hustcar;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
@SpringBootTest
class HustCarApplicationTests {
    @Autowired
    private CarpoolMapper carpoolMapper;
    @Autowired
    private UserMapper userMapper;
    @Test
    void contextLoads() {
    }
    @Test
    public void test1(){
        List<CarPool> list = carpoolMapper.selectList(null);
        System.out.println(list);
    }
    @Test
    public void test2(){
        List<User> list = userMapper.selectList(null);
        System.out.println(list);
    }
    @Test
    public void test3(){
        User user = userMapper.selectById(1L);
        System.out.println(user);
    }
    @Test
    public void test4(){
        //依据手机号查询用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getPhoneNumber, "12345678911"));
        System.out.println(user);
    }
    @Test
    public void test5(){
        //新增用户
        User user = new User();
        user.setPhoneNumber("13849098687");
        userMapper.insert(user);
    }
}
