drop table if exists publicFixtureFulfilment;

create table publicFixtureFulfilment
(
    id integer not null primary key autoincrement,

    fixtureId integer not null,
    passcode integer not null,

    -- Track lifecycle
    timeStarted integer not null,
    timeCompleted integer default NULL,

    -- JSON scorecard payload
    scorecardData json default NULL,

    -- IP address (IPv4 or IPv6)
    creatorIpAddress TEXT default NULL,

    -- Metadata
    userAgent TEXT default NULL,

    -- Optional: enforce unique fulfilment per fixture+passcode
    unique(fixtureId, passcode)
);

-- Indexes
create index idx_publicFixtureFulfilment_fixtureId
    on publicFixtureFulfilment(fixtureId);

create index idx_publicFixtureFulfilment_passcode
    on publicFixtureFulfilment(passcode);
