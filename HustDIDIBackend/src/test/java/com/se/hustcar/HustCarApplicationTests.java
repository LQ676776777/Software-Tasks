package com.se.hustcar;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.mapper.UserMapper;
import com.se.hustcar.service.CarpoolService;
import com.se.hustcar.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
@SpringBootTest
class HustCarApplicationTests {
    @Autowired
    private CarpoolMapper carpoolMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CarpoolService carpoolService;
    @Autowired
    private UserService userService;
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
    //分页查询
    @Test
    public void test6(){
        int pageNo = 2;
        int pageSize = 2;
        Page<CarPool> page = Page.of(pageNo, pageSize);
        carpoolService.page(page);
        System.out.println(page.getRecords());
    }
    //将数据库中的startplace和destination全部标准化进行更新
    @Test
    public void test7(){
        List<CarPool> carPools = carpoolMapper.selectList(null);
        for (CarPool carPool : carPools) {
            String normalizedStart = com.se.hustcar.utils.PlaceNormalizer.normalize(carPool.getStartPlace());
            String normalizedEnd = com.se.hustcar.utils.PlaceNormalizer.normalize(carPool.getDestination());
            carPool.setNormalizedStartPlace(normalizedStart);
            carPool.setNormalizedDestination(normalizedEnd);
            carpoolMapper.updateById(carPool);
        }
    }
    //插入一条测试数据，看看标准化是否生效
    @Test
    public void test8(){
        CarPool carPool = new CarPool();
        carPool.setUserId(1L);
        carPool.setStartPlace("华中科技大学东校区火车站");
        carPool.setDestination("武汉大学南门");
        //设置时间,localfatetime
        carPool.setDateTime(LocalDateTime.now());
        carPool.setState(1);
        carpoolMapper.insert(carPool);
    }
}
