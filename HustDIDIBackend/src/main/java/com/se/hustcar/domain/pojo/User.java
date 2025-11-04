package com.se.hustcar.domain.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * ClassName: User
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/14 16:31
 * @Veision 1.0
 */
@Data
@TableName("user")
public class User {
    @TableId(value = "user_id",type= IdType.AUTO)
    private Long id;
    private String phoneNumber;
    private String schoolName;
    private String gender;
    private String userName;
}
