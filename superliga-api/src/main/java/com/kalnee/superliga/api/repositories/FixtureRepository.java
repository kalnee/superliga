package com.kalnee.superliga.api.repositories;

import com.kalnee.superliga.api.models.Fixture;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.math.BigInteger;
import java.util.List;

@RepositoryRestResource
public interface FixtureRepository extends MongoRepository<Fixture, BigInteger> {
    List<Fixture> findByHomeIgnoringCase(String home);
}
