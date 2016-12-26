package com.kalnee.superliga.api;

import com.kalnee.superliga.api.models.Fixture;
import com.kalnee.superliga.api.repositories.FixtureRepository;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SuperligaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(SuperligaApiApplication.class, args);
    }

    @Bean
    InitializingBean populate(final FixtureRepository repository) {
        return () -> {
            repository.deleteAll();
            repository.save(new Fixture("SDC", "TAU"));
        };
    }

    @Bean
    CommandLineRunner run(FixtureRepository repository) {
        return (args) -> {
            System.out.println(repository.findByHomeIgnoringCase("sdc"));
        };
    }
}
