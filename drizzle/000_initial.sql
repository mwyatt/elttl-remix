CREATE TABLE IF NOT EXISTS "tennisYear" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "value" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "ad" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "title" TEXT,
  "description" TEXT,
  "url" TEXT,
  "action" TEXT,
  "timeCreated" INTEGER,
  "status" INTEGER,
  "image" TEXT,
  "groupKey" TEXT
);

CREATE TABLE IF NOT EXISTS "content" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "title" TEXT DEFAULT '',
  "slug" TEXT,
  "html" TEXT,
  "type" TEXT NOT NULL DEFAULT '',
  "timePublished" INTEGER DEFAULT 0,
  "status" INTEGER DEFAULT 0,
  "userId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "contentMeta" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "contentId" INTEGER NOT NULL,
  "name" TEXT NOT NULL DEFAULT '',
  "value" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS "log" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "message" TEXT NOT NULL,
  "time" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  "type" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "logAdminUnseen" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "logId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "mail" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "to" TEXT,
  "from" TEXT,
  "subject" TEXT,
  "body" TEXT,
  "timeSent" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "media" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "timePublished" INTEGER DEFAULT 0,
  "userId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "idParent" INTEGER,
  "url" TEXT,
  "name" TEXT,
  "keyGroup" TEXT
);

CREATE TABLE IF NOT EXISTS "options" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL DEFAULT '',
  "value" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS "tennisDivision" (
  "id" INTEGER NOT NULL,
  "yearId" INTEGER NOT NULL,
  "name" TEXT,
  PRIMARY KEY ("id", "yearId")
);

CREATE TABLE IF NOT EXISTS "tennisEncounter" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "yearId" INTEGER NOT NULL,
  "playerIdLeft" INTEGER,
  "playerIdRight" INTEGER,
  "scoreLeft" INTEGER,
  "scoreRight" INTEGER,
  "playerRankChangeLeft" INTEGER,
  "playerRankChangeRight" INTEGER,
  "fixtureId" INTEGER,
  "status" TEXT
);

CREATE TABLE IF NOT EXISTS "tennisFixture" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "yearId" INTEGER NOT NULL,
  "teamIdLeft" INTEGER NOT NULL,
  "teamIdRight" INTEGER NOT NULL,
  "timeFulfilled" INTEGER,
  "weekId" INTEGER
);

CREATE TABLE IF NOT EXISTS "tennisPlayer" (
  "id" INTEGER NOT NULL,
  "yearId" INTEGER NOT NULL,
  "nameFirst" TEXT DEFAULT '',
  "nameLast" TEXT DEFAULT '',
  "slug" TEXT,
  "rank" INTEGER,
  "phoneLandline" TEXT DEFAULT '',
  "phoneMobile" TEXT DEFAULT '',
  "ettaLicenseNumber" TEXT DEFAULT '',
  "teamId" INTEGER,
  PRIMARY KEY ("id", "yearId")
);

CREATE TABLE IF NOT EXISTS "tennisTeam" (
  "id" INTEGER NOT NULL,
  "yearId" INTEGER NOT NULL,
  "name" TEXT,
  "slug" TEXT,
  "homeWeekday" INTEGER,
  "secretaryId" INTEGER,
  "venueId" INTEGER,
  "divisionId" INTEGER,
  PRIMARY KEY ("id", "yearId")
);

CREATE TABLE IF NOT EXISTS "tennisVenue" (
  "id" INTEGER NOT NULL,
  "yearId" INTEGER NOT NULL,
  "name" TEXT,
  "slug" TEXT,
  "location" TEXT,
  PRIMARY KEY ("id", "yearId")
);

CREATE TABLE IF NOT EXISTS "tennisWeek" (
  "id" INTEGER NOT NULL,
  "timeStart" INTEGER NOT NULL,
  "type" INTEGER NOT NULL,
  "yearId" INTEGER NOT NULL,
  PRIMARY KEY ("id", "yearId"),
  FOREIGN KEY ("yearId") REFERENCES "tennisYear" ("id")
);

CREATE TABLE IF NOT EXISTS "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "email" TEXT NOT NULL DEFAULT '',
  "password" TEXT NOT NULL DEFAULT '',
  "timeRegistered" INTEGER,
  "level" INTEGER NOT NULL DEFAULT 1,
  "nameFirst" TEXT NOT NULL DEFAULT '',
  "nameLast" TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS "userPermission" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "userId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "ability" TEXT NOT NULL
);
