package com.se.hustcar.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;
import jakarta.servlet.http.HttpSession;

/**
 * ClassName: CarpoolService
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 16:56
 * @Veision 1.0
 */
public interface CarpoolService extends IService<CarPool> {

    Result queryCarpool();

    Result queryCarpoolById(Integer id);

    Result addCarpool(CarPool carPool, HttpSession session);

    Result updateCarpool(CarPool carPool);
}
