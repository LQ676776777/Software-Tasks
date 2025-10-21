package com.se.hustcar.controller;


import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import com.se.hustcar.service.CarpoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Result queryCarpoolById(@PathVariable Integer id){
        return carpoolService.queryCarpoolById(id);
    }
    @PostMapping("/carpool")
    public Result addCarpool(@RequestBody CarPool carPool) {
        return carpoolService.addCarpool(carPool);
    }
    @PutMapping("/carpool")
    public Result updateCarpool(@RequestBody CarPool carPool) {
        return carpoolService.updateCarpool(carPool);
    }
}
