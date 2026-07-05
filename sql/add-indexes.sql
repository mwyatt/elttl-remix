CREATE INDEX idx_ad_status_groupKey
  ON ad(status, groupKey);
CREATE INDEX idx_content_type_status_timePublished
  ON content(type, status, timePublished DESC);
CREATE INDEX idx_encounter_year_status_fixture
  ON tennisEncounter(yearId, status, fixtureId);
CREATE INDEX idx_fixture_year_time
  ON tennisFixture(yearId, timeFulfilled DESC);
CREATE INDEX idx_team_yearId ON tennisTeam(yearId);
CREATE INDEX idx_division_yearId ON tennisDivision(yearId);
CREATE INDEX idx_player_yearId ON tennisPlayer(yearId);
CREATE INDEX idx_week_year_timeStart
  ON tennisWeek(yearId, timeStart);
CREATE INDEX idx_encounter_fixtureId
  ON tennisEncounter(fixtureId);
