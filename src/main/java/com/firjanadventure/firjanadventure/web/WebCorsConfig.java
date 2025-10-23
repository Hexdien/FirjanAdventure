package com.firjanadventure.firjanadventure.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:*", "http://127.0.0.1:*")
                .allowedMethods("GET","POST","DELETE","PUT","PATCH","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}