package org.sortic.sorticproject;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@MapperScan("org.sortic.sorticproject.Mapper")
@MapperScan(basePackages = "org.sortic.sorticproject.Mapper")
public class SorticProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SorticProjectApplication.class, args);
    }
    @Bean
    public CommandLineRunner checkRestControllers(ApplicationContext ctx) {
        return args -> {
            System.out.println("=== 등록된 @RestController 목록 ===");
            String[] controllers = ctx.getBeanNamesForAnnotation(RestController.class);
            for (String name : controllers) {
                System.out.println("✅ " + name);
            }
        };
    }

}
