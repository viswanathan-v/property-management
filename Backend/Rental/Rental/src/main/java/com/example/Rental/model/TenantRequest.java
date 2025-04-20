package com.example.Rental.model;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "TenantRequest")
public class TenantRequest {
    @Id
    String request_id;
    @DBRef
    Tenants tenants;

    public String getRequest_id() {
        return request_id;
    }

    public Tenants getTenants() {
        return tenants;
    }

    public Owners getOwners() {
        return owners;
    }

    public String getRequest_message() {
        return request_message;
    }

    public String getStatus() {
        return status;
    }

    @DBRef
    Owners owners;
    String request_message;
    String status;

    public String getRequested_address() {
        return requested_address;
    }

    public void setRequested_address(String requested_address) {
        this.requested_address = requested_address;
    }

    public String getReq_location() {
        return req_location;
    }

    public void setReq_location(String req_location) {
        this.req_location = req_location;
    }

    String requested_address;
    String req_location;
    public void setRequest_id(String request_id) {
        this.request_id = request_id;
    }

    public void setTenants(Tenants tenants) {
        this.tenants = tenants;
    }

    public void setOwners(Owners owners) {
        this.owners = owners;
    }

    public void setRequest_message(String request_message) {
        this.request_message = request_message;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
