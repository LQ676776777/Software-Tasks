package com.se.hustcar.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.service.CarpoolService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static com.se.hustcar.constants.SystemConstants.DEFAULT_PAGE_SIZE;


/**
 * ClassName: QueryCarController
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 15:57
 * @Veision 1.0
 */
@RestController
public class CarPoolController {
    @Autowired
    CarpoolService carpoolService;
    @GetMapping("/carpool")
    public Result queryCarpool(){
            return carpoolService.queryCarpool();
    }
    @GetMapping("/carpool/mine")
    public Result queryMyCarpool(HttpSession session){
        return carpoolService.queryMyCarpool(session);
    }
    @GetMapping("/carpool/{id}")
    public Result queryCarpoolById(@PathVariable Integer id){return carpoolService.queryCarpoolById(id);}
    //发布拼车信息
    @PostMapping("/carpool")
    public Result addCarpool(@RequestBody CarPool carPool, HttpSession session) {return carpoolService.addCarpool(carPool,session);}

    /**
     * 更新拼车信息
     * @param carPool
     * @return
     */
    @PutMapping("/carpool")
    public Result updateCarpool(@RequestBody CarPool carPool) {
        return carpoolService.updateCarpool(carPool);
    }
    /**
     * 分页查询拼车信息
     */
    @GetMapping("/carpool/page")
    public Result queryCarpoolByPage(@RequestParam("current") int current) {
        QueryWrapper<CarPool> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("state", 0); // 只查询状态为有效的拼车信息
        // 分页查询
        Page<CarPool> page = carpoolService.page(new Page<>(current, DEFAULT_PAGE_SIZE),queryWrapper);
        return Result.ok(page.getRecords(),page.getTotal());
    }

    /**
     * 根据起点和终点模糊查询拼车信息
     * @param startLocation
     * @param endLocation
     * @param current
     * @return
     */
    @GetMapping("/carpool/matching")
    public Result queryMatchingCarpool(@RequestParam("startLocation") String startLocation,
                                       @RequestParam("endLocation") String endLocation,
                                       @RequestParam("current") int current) {
        return carpoolService.queryCarpoolByMatching(startLocation, endLocation, current);
    }
}
