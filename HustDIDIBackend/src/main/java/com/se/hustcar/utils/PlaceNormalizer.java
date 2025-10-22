package com.se.hustcar.utils;

/**
 * ClassName: Normalize
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/22 22:05
 * @Veision 1.0
 */
public class PlaceNormalizer {
    /**
     * 对地名进行标准化，去掉冗余词汇，提高模糊匹配准确度
     */
    public static String normalize(String place) {
        if (place == null) return null;

        // 统一全角半角、去空格
        String p = place.trim().replaceAll("\\s+", "");

        // 常见地名规范化
        p = p.replace("火车站", "站")
                .replace("汽车站", "站")
                .replace("高铁站", "站")
                .replace("地铁站", "站")
                .replace("大学", "")
                .replace("学院", "")
                .replace("校区", "")
                .replace("东门", "东门")
                .replace("西门", "西门")
                .replace("南门", "南门")
                .replace("北门", "北门");

        // 特殊规则：例如“华中科技大学”归一成“华科”
        if (p.contains("华中科技")) p = p.replace("华中科技", "华科");

        return p;
    }
}
