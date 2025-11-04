package com.se.hustcar.utils;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * ClassName: sendCodeUtil
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/21 19:47
 * @Veision 1.0
 */
public class SmsSender {
    public static boolean sendCodeUtil(String code, String phone) {
        String url = "https://push.spug.cc/send/zk9qMjwAg98BRgQp";
        Map<String, Object> body = new HashMap<>();
        body.put("key1", "Hust滴滴");
        body.put("key2", code);
        body.put("key3", "5");
        body.put("targets", phone);
        RestTemplate restTemplate = new RestTemplate();
        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // 设置请求体
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        // 发送POST请求
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        return response.getStatusCode().is2xxSuccessful();
    }
}
