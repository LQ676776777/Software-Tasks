package com.se.hustcar.controller;


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
        Page<CarPool> page = carpoolService.query().page(new Page<>(current, DEFAULT_PAGE_SIZE));
        return Result.ok(page.getRecords(),page.getTotal());
    }

    /**
     * 根据起点和终点模糊查询拼车信息
     * @param startLocation
     * @param endLocation
     * @param current
     * @return
     */
/*    @GetMapping("/carpool/matching")
    public Result queryMatchingCarpool(@RequestParam("startLocation") String startLocation,
                                       @RequestParam("endLocation") String endLocation,
                                       @RequestParam("current") int current) {
        Page<CarPool> page = carpoolService.query()
                .like("start_place", startLocation)
                .like("destination", endLocation)
                .page(new Page<>(current, DEFAULT_PAGE_SIZE));
        return Result.ok(page.getRecords());
    }*/
    @GetMapping("/carpool/matching")
    public Result queryMatchingCarpool(@RequestParam("startLocation") String startLocation,
                                       @RequestParam("endLocation") String endLocation,
                                       @RequestParam("current") int current) {
        return carpoolService.queryCarpoolByMatching(startLocation, endLocation, current);
    }
}
