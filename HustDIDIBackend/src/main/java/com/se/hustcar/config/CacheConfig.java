package com.se.hustcar.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * ClassName: CacheConfig
 * Description:
 *
 * @Auther KuoZ
 * @Create 2025/10/29 16:20
 * @Veision 1.0
 */
@Configuration
public class CacheConfig {

    /**
     * 短信发送频率限制缓存：key=手机号，value=任意值（如时间戳或1）
     * 自动过期：60秒
     */
    @Bean
    public Cache<String, Boolean> smsSendLimitCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(60, TimeUnit.SECONDS) // 写入后60秒过期
                .maximumSize(10_000) // 最多缓存1万个手机号，防止内存溢出
                .build();
    }
}