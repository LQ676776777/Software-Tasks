package com.se.hustcar.config;

import com.se.hustcar.service.CarpoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * ClassName: CarpoolStateMaintenanceTask
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/29 15:20
 * @Veision 1.0
 */
@Component
@EnableScheduling
public class CarpoolStateMaintenanceTask {

    @Autowired
    private CarpoolService carpoolService;

    // 每15分钟执行一次，更新过期的拼车信息
    @Scheduled(fixedRate = 15*60*1000)
    public void updateExpiredCarpools() {
        boolean updated = carpoolService.update()
                .set("state", 2)
                .lt("date_time", LocalDateTime.now()) // date_time < 当前时间
                .ne("state", 2) // 可选：避免重复更新已过期的
                .update();
        if (updated) {
            // 可记录日志
            System.out.println("已更新过期拼车状态");
        }
    }
}