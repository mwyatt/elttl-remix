-- Creates a new column within the tennisTeam table which will store a small int 1-10/11
ALTER TABLE tennisTeam ADD COLUMN fixtureMatrixIndex SMALLINT;

SELECT * FROM tennisTeam;
