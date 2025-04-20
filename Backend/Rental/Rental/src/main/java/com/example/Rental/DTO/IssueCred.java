package com.example.Rental.DTO;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
public class IssueCred {
    String Statement;
    String Type;
    int Estimated_Days;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime posted;
    String tenant_id;
    String owner_id;

    public String getTenant_id() {
        return tenant_id;
    }

    public void setTenant_id(String tenant_id) {
        this.tenant_id = tenant_id;
    }

    public String getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(String owner_id) {
        this.owner_id = owner_id;
    }



    public String getStatement() {
        return Statement;
    }

    public void setStatement(String statement) {
        Statement = statement;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public int getEstimated_Days() {
        return Estimated_Days;
    }

    public void setEstimated_Days(int estimated_Days) {
        Estimated_Days = estimated_Days;
    }

    public LocalDateTime getPosted() {
        return posted;
    }

    public void setPosted(LocalDateTime posted) {
        this.posted = posted;
    }
}
