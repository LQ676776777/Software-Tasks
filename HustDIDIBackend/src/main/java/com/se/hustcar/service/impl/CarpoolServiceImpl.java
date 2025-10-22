package com.se.hustcar.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.service.CarpoolService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ClassName: CarpoolServiceImpl
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 16:58
 * @Veision 1.0
 */
@Service
public class CarpoolServiceImpl extends ServiceImpl<CarpoolMapper,CarPool> implements CarpoolService {
    @Autowired
    CarpoolMapper carpoolMapper;

    @Override
    public Result queryCarpool() {
        List<CarPool> carpoolList = carpoolMapper.selectList(null);
        return Result.ok(carpoolList, (long) carpoolList.size());
    }

    @Override
    public Result queryCarpoolById(Integer id) {
        CarPool carpool = carpoolMapper.selectById(id);
        if (carpool != null) {
            return Result.ok(carpool);
        }
        return Result.fail("拼车请求不存在！");
    }

    @Override
    public Result addCarpool(CarPool carPool, HttpSession session) {
        // 从session中获取当前用户信息
        User user = (User) session.getAttribute("user");
        Long id = user.getId();
        carPool.setUserId(id);
        carpoolMapper.insert(carPool);
        return Result.ok("拼车请求发布成功！");
    }

    @Override
    public Result updateCarpool(CarPool carPool) {
        carpoolMapper.updateById(carPool);
        return Result.ok("拼车请求更新成功！");
    }
}
