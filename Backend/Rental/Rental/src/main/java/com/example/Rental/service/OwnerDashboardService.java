package com.example.Rental.service;


import com.example.Rental.model.Owners;
import com.example.Rental.model.TenantRequest;
import com.example.Rental.model.Tenants;
import com.example.Rental.repository.TenantRepo;
import com.example.Rental.repository.TenantRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class OwnerDashboardService {
    @Autowired
    TenantRequestRepo tenantRequestRepo;
    @Autowired
    MongoTemplate mongoTemplate;
    @Autowired
    TenantRepo tenantRepo;
    @Transactional
    public ResponseEntity<?> UpdateRequest(String requestId, String new_status) {
        Query query = new Query(Criteria.where("_id").is(requestId));
        Update update = new Update().set("status", new_status);
        mongoTemplate.updateFirst(query, update, TenantRequest.class);

        TenantRequest request=tenantRequestRepo.findById(requestId).orElseThrow(()->new RuntimeException("tenant details not found"));
        if(new_status.equals("Accepted")){
            Optional<Tenants> optional_tenant=tenantRepo.findById(request.getTenants().getTenant_id());
            if(optional_tenant.isPresent()){
                Tenants tenant=optional_tenant.get();
                Owners owner=request.getOwners();
                tenant.setMatched_owner(owner);
                tenant.setAddress(request.getRequested_address());
                tenant.setLocation(request.getReq_location());
                tenantRepo.save(tenant);
            }else{
                System.out.println("Tenant Not found");
            }
        }
//        else
//            if(new_status.equals("Rejected")){
//            tenantRequestRepo.deleteById(requestId);
//        }

        return ResponseEntity.ok(tenantRequestRepo.findById(requestId));
    }
}
