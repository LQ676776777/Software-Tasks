package com.se.hustcar.domain.pojo;


import lombok.*;

import java.util.List;

/**
 * ClassName: Result
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/15 16:10
 * @Veision 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Boolean success;
    private String errorMsg;
    private Object data;
    private Long total;

    public static Result ok(){
        return new Result(true, null, null, null);
    }
    public static Result ok(Object data){return new Result(true, null, data, null);}
    public static Result ok(List<?> data, Long total){
        return new Result(true, null, data, total);
    }
    public static Result fail(String errorMsg){
        return new Result(false, errorMsg, null, null);
    }
}
