package com.se.hustcar;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.se.hustcar.mapper")
@SpringBootApplication
public class HustCarApplication {
    public static void main(String[] args) {
        SpringApplication.run(HustCarApplication.class, args);
    }
}
