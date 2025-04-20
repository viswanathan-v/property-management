package com.example.Rental.repository;

import com.example.Rental.model.Tenants;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TenantRepo extends MongoRepository<Tenants,String> {

    Tenants findByEmail(String email);
    Tenants findByEmailAndPassword(String email, String password);
}
