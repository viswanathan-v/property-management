package com.example.Rental.service;
import com.example.Rental.model.Owners;
import com.example.Rental.model.Tenants;
import com.example.Rental.model.Vendors;
import com.example.Rental.repository.OwnerRepo;
import com.example.Rental.repository.TenantRepo;
import com.example.Rental.repository.VendorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private OwnerRepo ownerRepo;

    @Autowired
    private TenantRepo tenantRepo;

    @Autowired
    private VendorRepo vendorRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<Owners> ownerOpt = Optional.ofNullable(ownerRepo.findByEmail(email));
        if (ownerOpt.isPresent()) {
            Owners owner = ownerOpt.get();
            return new User(
                    owner.getEmail(),
                    owner.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_OWNER"))
            );
        }

        Optional<Tenants> tenantOpt = Optional.ofNullable(tenantRepo.findByEmail(email));
        if (tenantOpt.isPresent()) {
            Tenants tenant = tenantOpt.get();
            return new User(
                    tenant.getEmail(),
                    tenant.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_TENANT"))
            );
        }

        Optional<Vendors> vendorOpt = Optional.ofNullable(vendorRepo.findByEmail(email));
        if (vendorOpt.isPresent()) {
            Vendors vendor = vendorOpt.get();
            return new User(
                    vendor.getEmail(),
                    vendor.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_VENDOR"))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
