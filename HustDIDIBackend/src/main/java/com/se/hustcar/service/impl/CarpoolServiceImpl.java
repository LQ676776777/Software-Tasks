package com.se.hustcar.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.domain.pojo.User;
import com.se.hustcar.mapper.CarpoolMapper;
import com.se.hustcar.service.CarpoolService;
import com.se.hustcar.utils.PlaceNormalizer;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.se.hustcar.constants.SystemConstants.DEFAULT_PAGE_SIZE;

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
        //查询状态为有效的拼车请求
        QueryWrapper<CarPool> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("state", 0);
        List<CarPool> carpoolList = carpoolMapper.selectList(queryWrapper);
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
        carPool.setState(0);
        carpoolMapper.insert(carPool);
        return Result.ok("拼车请求发布成功！");
    }

    @Override
    public Result updateCarpool(CarPool carPool) {
        carpoolMapper.updateById(carPool);
        return Result.ok("拼车请求更新成功！");
    }

    @Override
    public Result queryCarpoolByMatching(String startLocation, String endLocation, int current) {
        String normalizedStart = PlaceNormalizer.normalize(startLocation);
        String normalizedEnd = PlaceNormalizer.normalize(endLocation);

        Page<CarPool> page = this.query()
                .like("normalized_start_place", normalizedStart)
                .like("normalized_destination", normalizedEnd)
                .page(new Page<>(current, DEFAULT_PAGE_SIZE));

        return Result.ok(page.getRecords());
    }

    @Override
    public Result queryMyCarpool(HttpSession session) {
        Long userId = ((User) session.getAttribute("user")).getId();
        QueryWrapper<CarPool> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId);
        List<CarPool> myCarpools = carpoolMapper.selectList(queryWrapper);
        return Result.ok(myCarpools, (long) myCarpools.size());
    }

}
