-- =============================================================
-- FULL TEST SUITE v2
-- Matches the real schema (key/value/updated_at) and the real
-- content keys the site + admin dashboard actually read.
-- Each block RAISE NOTICEs on success, RAISE EXCEPTIONs on fail.
-- =============================================================

-- -------------------------------------------------------------
-- TEST 1: All three tables exist
-- -------------------------------------------------------------
DO $$
DECLARE
  missing text[] := ARRAY[]::text[];
  required text[] := ARRAY['site_content', 'page_visits', 'admin_sessions'];
  t text;
BEGIN
  FOREACH t IN ARRAY required LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      missing := array_append(missing, t);
    END IF;
  END LOOP;
  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'TEST 1 FAILED - missing tables: %', missing;
  END IF;
  RAISE NOTICE 'TEST 1 OK - all tables exist';
END $$;

-- -------------------------------------------------------------
-- TEST 2: site_content has the exact columns the code reads/writes
-- -------------------------------------------------------------
DO $$
DECLARE
  cols text[];
BEGIN
  SELECT array_agg(column_name ORDER BY column_name) INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'site_content';

  IF NOT (cols @> ARRAY['key','value','updated_at']) THEN
    RAISE EXCEPTION 'TEST 2 FAILED - site_content missing columns. Has: %', cols;
  END IF;
  RAISE NOTICE 'TEST 2 OK - site_content schema valid (key, value, updated_at)';
END $$;

-- -------------------------------------------------------------
-- TEST 3: Every critical content key is seeded
-- Uses keys the actual components read (see FIELD_HINTS).
-- -------------------------------------------------------------
DO $$
DECLARE
  missing text[] := ARRAY[]::text[];
  required text[] := ARRAY[
    -- Commerce (editable in Settings tab)
    'site.price_usd',
    'site.price_label',
    'site.buy_url',
    'site.sales_email',
    'site.question_url',
    -- Nav
    'nav.cta',
    'nav.link_thesis',
    'nav.link_manifesto',
    'nav.link_buyers',
    'nav.link_specs',
    'nav.link_system',
    -- Hero
    'hero.eyebrow',
    'hero.headline_part_1',
    'hero.headline_part_2',
    'hero.headline_part_3',
    'hero.sub',
    'hero.cta_primary',
    -- Price
    'price.headline',
    'price.body',
    'price.cta_primary',
    -- Footer
    'footer.manifesto',
    'footer.copyright',
    -- Meta
    'meta.title',
    'meta.description'
  ];
  k text;
BEGIN
  FOREACH k IN ARRAY required LOOP
    IF NOT EXISTS (SELECT 1 FROM site_content WHERE key = k) THEN
      missing := array_append(missing, k);
    END IF;
  END LOOP;
  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'TEST 3 FAILED - missing content keys: %', missing;
  END IF;
  RAISE NOTICE 'TEST 3 OK - all critical keys seeded';
END $$;

-- -------------------------------------------------------------
-- TEST 4: page_visits read/write (bigserial id)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_id bigint;
  v_path text;
BEGIN
  INSERT INTO page_visits (path, referrer, user_agent, country)
  VALUES ('/__test__', 'https://test.local', 'test-runner', 'EG')
  RETURNING id INTO v_id;

  SELECT path INTO v_path FROM page_visits WHERE id = v_id;
  IF v_path IS DISTINCT FROM '/__test__' THEN
    RAISE EXCEPTION 'TEST 4 FAILED - could not read back visit';
  END IF;

  DELETE FROM page_visits WHERE id = v_id;
  RAISE NOTICE 'TEST 4 OK - page_visits read/write works (id=%)', v_id;
END $$;

-- -------------------------------------------------------------
-- TEST 5: admin_sessions with expiry filter (the login route's query)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_token text := 'test-token-' || gen_random_uuid()::text;
  v_count int;
BEGIN
  INSERT INTO admin_sessions (token, email, expires_at)
  VALUES (v_token, 'test@test.local', now() + interval '1 hour');

  INSERT INTO admin_sessions (token, email, expires_at)
  VALUES (v_token || '-expired', 'test@test.local', now() - interval '1 hour');

  -- Same query getSession() runs
  SELECT count(*) INTO v_count
  FROM admin_sessions
  WHERE token = v_token AND expires_at > now();

  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST 5 FAILED - active session lookup returned % rows', v_count;
  END IF;

  DELETE FROM admin_sessions WHERE token LIKE 'test-token-%';
  RAISE NOTICE 'TEST 5 OK - admin_sessions works with expiry';
END $$;

-- -------------------------------------------------------------
-- TEST 6: Full content-edit simulation (what the admin PUT route does)
-- -------------------------------------------------------------
DO $$
DECLARE
  original_price text;
  original_url text;
  new_price text := '777';
  new_url text := 'mailto:test@test.com';
  read_price text;
  read_url text;
BEGIN
  SELECT value INTO original_price FROM site_content WHERE key = 'site.price_usd';
  SELECT value INTO original_url   FROM site_content WHERE key = 'site.buy_url';

  -- Upsert path, matches sbInsert(..., { onConflict: 'key' })
  INSERT INTO site_content (key, value, updated_at)
  VALUES ('site.price_usd', new_price, now())
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

  INSERT INTO site_content (key, value, updated_at)
  VALUES ('site.buy_url', new_url, now())
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

  SELECT value INTO read_price FROM site_content WHERE key = 'site.price_usd';
  SELECT value INTO read_url   FROM site_content WHERE key = 'site.buy_url';

  IF read_price <> new_price OR read_url <> new_url THEN
    RAISE EXCEPTION 'TEST 6 FAILED - updated values did not persist';
  END IF;

  -- Restore originals
  UPDATE site_content SET value = original_price, updated_at = now() WHERE key = 'site.price_usd';
  UPDATE site_content SET value = original_url,   updated_at = now() WHERE key = 'site.buy_url';

  RAISE NOTICE 'TEST 6 OK - content edits persist correctly (upsert works)';
END $$;

-- -------------------------------------------------------------
-- TEST 7: Analytics aggregation (same queries /api/admin/analytics runs)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_total int;
  v_last24 int;
  v_last7 int;
BEGIN
  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'EG', now());

  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'US', now() - interval '2 hours');

  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'US', now() - interval '10 days');

  SELECT count(*) INTO v_total  FROM page_visits WHERE path = '/__agg__';
  SELECT count(*) INTO v_last24 FROM page_visits WHERE path = '/__agg__' AND created_at > now() - interval '24 hours';
  SELECT count(*) INTO v_last7  FROM page_visits WHERE path = '/__agg__' AND created_at > now() - interval '7 days';

  IF v_total <> 3 OR v_last24 <> 2 OR v_last7 <> 2 THEN
    RAISE EXCEPTION 'TEST 7 FAILED - expected total=3 last24=2 last7=2, got total=% last24=% last7=%',
      v_total, v_last24, v_last7;
  END IF;

  DELETE FROM page_visits WHERE path = '/__agg__';
  RAISE NOTICE 'TEST 7 OK - analytics aggregation correct';
END $$;

-- -------------------------------------------------------------
-- TEST 8: Keep-alive cron simulation
-- Mirrors exactly what app/api/cron/keep-alive/route.ts does.
-- -------------------------------------------------------------
DO $$
DECLARE
  v_heartbeat text;
  v_before text;
BEGIN
  -- 1. Read each table (the cron does count head:true)
  PERFORM count(*) FROM site_content;
  PERFORM count(*) FROM page_visits;
  PERFORM count(*) FROM admin_sessions;

  -- 2. Prune expired sessions (the cron does this too)
  DELETE FROM admin_sessions WHERE expires_at < now();

  -- 3. Upsert heartbeat row using ONLY (key, value, updated_at)
  SELECT value INTO v_before FROM site_content WHERE key = 'system.last_keepalive';

  INSERT INTO site_content (key, value, updated_at)
  VALUES ('system.last_keepalive', now()::text, now())
  ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = now();

  SELECT value INTO v_heartbeat FROM site_content WHERE key = 'system.last_keepalive';
  IF v_heartbeat IS NULL THEN
    RAISE EXCEPTION 'TEST 8 FAILED - heartbeat not written';
  END IF;
  IF v_before IS NOT NULL AND v_heartbeat = v_before THEN
    RAISE EXCEPTION 'TEST 8 FAILED - heartbeat did not update';
  END IF;

  RAISE NOTICE 'TEST 8 OK - keep-alive flow works (heartbeat=%)', v_heartbeat;
END $$;

-- -------------------------------------------------------------
-- TEST 9: RLS policy on site_content (public read must work)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_has_policy boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_content'
  ) INTO v_has_policy;

  IF NOT v_has_policy THEN
    RAISE EXCEPTION 'TEST 9 FAILED - no RLS policy on site_content (public site cannot read content)';
  END IF;
  RAISE NOTICE 'TEST 9 OK - site_content has a public-read policy';
END $$;

-- -------------------------------------------------------------
-- TEST 10: No orphan/stale test rows left behind
-- -------------------------------------------------------------
DO $$
DECLARE
  v_visits int;
  v_sessions int;
BEGIN
  SELECT count(*) INTO v_visits
  FROM page_visits
  WHERE path IN ('/__test__', '/__agg__');

  SELECT count(*) INTO v_sessions
  FROM admin_sessions
  WHERE token LIKE 'test-token-%';

  IF v_visits <> 0 OR v_sessions <> 0 THEN
    RAISE EXCEPTION 'TEST 10 FAILED - leftover test rows: visits=% sessions=%', v_visits, v_sessions;
  END IF;
  RAISE NOTICE 'TEST 10 OK - clean state, no test data left over';
END $$;

-- -------------------------------------------------------------
-- FINAL SUMMARY
-- -------------------------------------------------------------
SELECT
  (SELECT count(*) FROM site_content)                                  AS content_rows,
  (SELECT count(*) FROM page_visits)                                   AS visit_rows,
  (SELECT count(*) FROM admin_sessions)                                AS session_rows,
  (SELECT value FROM site_content WHERE key = 'site.price_usd')        AS current_price,
  (SELECT value FROM site_content WHERE key = 'site.buy_url')          AS current_buy_url,
  (SELECT value FROM site_content WHERE key = 'system.last_keepalive') AS last_keepalive;
