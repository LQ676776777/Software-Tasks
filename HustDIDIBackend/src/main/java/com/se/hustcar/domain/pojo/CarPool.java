package com.se.hustcar.domain.pojo;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * ClassName: query
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 15:51
 * @Veision 1.0
 */
@Data
@TableName("carpool")
public class CarPool {
    @TableId(value = "trade_id",type = IdType.AUTO)
    private Long id;
    private LocalDateTime dateTime;
    private Long userId;
    private String startPlace;
    private String destination;
    private Integer state;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String normalizedStartPlace;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String normalizedDestination;
}
