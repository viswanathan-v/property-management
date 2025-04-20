package com.example.Rental.repository;

import com.example.Rental.model.TenantRequest;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRequestRepo extends MongoRepository<TenantRequest, String> {
//
//    @Query("{'owners.$id': ?0}")
//    List<TenantRequest> findByOwnerId(ObjectId ownerId);

    @Query("{'owners.$id': ?0, 'status': 'Pending'}")
    List<TenantRequest> findPendingRequest(ObjectId ownerId);

    @Query("{'owners.$id': ?0, 'status': 'Accepted'}")
    List<TenantRequest> findAcceptedRequest(ObjectId ownerId);

    @Query("{'tenants.$id':?0,'status':'Pending'}")
    List<TenantRequest> findRequestExistByTId(ObjectId tObjectId);

//    @Query("{'status':'Pending'}")
//    List<TenantRequest> findPending();
}

