package com.se.hustcar.service.impl;

import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.service.CarpoolService;
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
public class CarpoolServiceImpl implements CarpoolService {
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
    public Result addCarpool(CarPool carPool) {
        carpoolMapper.insert(carPool);
        return Result.ok("拼车请求发布成功！");
    }
}
