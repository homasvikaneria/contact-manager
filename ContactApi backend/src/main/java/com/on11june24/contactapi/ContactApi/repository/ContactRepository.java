package com.on11june24.contactapi.ContactApi.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.on11june24.contactapi.ContactApi.domain.Contact;
import com.on11june24.contactapi.ContactApi.domain.User;

@Repository
public interface ContactRepository extends JpaRepository<Contact, String> {
	Optional<Contact> findById(String id);
	Page<Contact> findByUser(User user, Pageable pageable);
	Optional<Contact> findByIdAndUser(String id, User user);
}
