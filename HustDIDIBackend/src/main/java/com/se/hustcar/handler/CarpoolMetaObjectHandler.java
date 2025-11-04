package com.se.hustcar.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.se.hustcar.utils.PlaceNormalizer;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

/**
 * ClassName: CarpoolMetaObjectHandler
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/22 22:24
 * @Veision 1.0
 */
@Component
public class CarpoolMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        Object startPlace = getFieldValByName("startPlace", metaObject);
        Object destination = getFieldValByName("destination", metaObject);

        if (startPlace != null) {
            setFieldValByName("normalizedStartPlace", PlaceNormalizer.normalize(startPlace.toString()), metaObject);
        }
        if (destination != null) {
            setFieldValByName("normalizedDestination", PlaceNormalizer.normalize(destination.toString()), metaObject);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        if(metaObject==null)return;
        Object startPlace = getFieldValByName("startPlace", metaObject);
        Object destination = getFieldValByName("destination", metaObject);

        if (startPlace != null) {
            setFieldValByName("normalizedStartPlace", PlaceNormalizer.normalize(startPlace.toString()), metaObject);
        }
        if (destination != null) {
            setFieldValByName("normalizedDestination", PlaceNormalizer.normalize(destination.toString()), metaObject);
        }
    }
}
