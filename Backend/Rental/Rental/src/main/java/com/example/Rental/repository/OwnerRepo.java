package com.example.Rental.repository;

import com.example.Rental.model.Owners;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepo extends MongoRepository<Owners, String> {

    Owners findByEmailAndPassword(String email, String password);

    Owners findByEmail(String email);
}

