package com.firjanadventure.firjanadventure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firjanadventure.firjanadventure.modelo.MonsterTemplate;

public interface MonsterTemplateRepository extends JpaRepository<MonsterTemplate, Long> {

  Optional<MonsterTemplate> findByTipo(String tipo);

}
