package com.se.hustcar;

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
}
