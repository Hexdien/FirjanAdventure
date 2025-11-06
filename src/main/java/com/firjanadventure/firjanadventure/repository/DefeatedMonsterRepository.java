package com.firjanadventure.firjanadventure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.firjanadventure.firjanadventure.modelo.DefeatedMonsters;
import com.firjanadventure.firjanadventure.modelo.DefeatedMonstersId;

public interface DefeatedMonsterRepository extends JpaRepository<DefeatedMonsters, DefeatedMonstersId> {

  @Query("select d.id.spawnId from DefeatedMonsters d " +
      "where d.id.characterId = :characterId and d.id.mapId = :mapId")
  List<Long> findSpawnIdsByCharacterAndMap(@Param("characterId") String characterId,
      @Param("mapId") String mapId);

  boolean existsByIdCharacterIdAndIdMapIdAndIdSpawnId(String characterId, String mapId, Long spawnId);
}
