package com.se.hustcar.service;

import com.se.hustcar.domain.pojo.CarPool;
import com.se.hustcar.domain.pojo.Result;

import java.util.List;

/**
 * ClassName: CarpoolService
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 16:56
 * @Veision 1.0
 */
public interface CarpoolService {

    Result queryCarpool();

    Result queryCarpoolById(Integer id);

    Result addCarpool(CarPool carPool);
}
