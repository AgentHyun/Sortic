package org.sortic.sorticproject;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "org.sortic.sorticproject.Mapper")
public class SorticProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SorticProjectApplication.class, args);
    }

}
