BEGIN;
CREATE TABLE IF NOT EXISTS ticket (
 id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 title varchar(120) NOT NULL,
 status varchar(20) NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW','IN_PROGRESS','DONE')),
 version integer NOT NULL DEFAULT 1 CHECK(version>0),
 estimate_cents integer NOT NULL DEFAULT 0 CHECK(estimate_cents>=0)
);
CREATE TABLE IF NOT EXISTS request_dedup (
 key varchar(128) PRIMARY KEY, request_hash char(64) NOT NULL,
 response jsonb, created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO ticket(title,estimate_cents) SELECT 'Refactor validation',12550 WHERE NOT EXISTS (SELECT 1 FROM ticket);
COMMIT;
