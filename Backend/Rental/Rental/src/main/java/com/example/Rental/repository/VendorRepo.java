package com.example.Rental.repository;


import com.example.Rental.model.Vendors;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepo extends MongoRepository<Vendors,String> {
    Vendors findByEmail(String email);

    Vendors findByEmailAndPassword(String email, String password);



    List<Vendors> findByJob(String issueType);
}
