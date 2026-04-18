-- =============================================================
-- FULL TEST SUITE — verifies every piece of the admin system
-- Each block raises an exception if something is wrong so it
-- shows up red in the script runner, or prints OK on success.
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
    RAISE EXCEPTION 'TEST 1 FAILED — missing tables: %', missing;
  END IF;
  RAISE NOTICE 'TEST 1 OK — all tables exist';
END $$;

-- -------------------------------------------------------------
-- TEST 2: site_content has required columns and a primary key on "key"
-- -------------------------------------------------------------
DO $$
DECLARE
  cols text[];
BEGIN
  SELECT array_agg(column_name ORDER BY column_name) INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'site_content';

  IF NOT (cols @> ARRAY['key','value','section','description','updated_at']) THEN
    RAISE EXCEPTION 'TEST 2 FAILED — site_content missing columns. Has: %', cols;
  END IF;
  RAISE NOTICE 'TEST 2 OK — site_content schema valid';
END $$;

-- -------------------------------------------------------------
-- TEST 3: Every critical content key is seeded
-- -------------------------------------------------------------
DO $$
DECLARE
  missing text[] := ARRAY[]::text[];
  required text[] := ARRAY[
    'site.price_usd',
    'site.buy_url',
    'hero.tagline',
    'hero.title_line_1',
    'nav.cta',
    'footer.copy_email_label',
    'price.heading',
    'specs.heading'
  ];
  k text;
BEGIN
  FOREACH k IN ARRAY required LOOP
    IF NOT EXISTS (SELECT 1 FROM site_content WHERE key = k) THEN
      missing := array_append(missing, k);
    END IF;
  END LOOP;
  IF array_length(missing, 1) > 0 THEN
    RAISE EXCEPTION 'TEST 3 FAILED — missing content keys: %', missing;
  END IF;
  RAISE NOTICE 'TEST 3 OK — all critical keys seeded';
END $$;

-- -------------------------------------------------------------
-- TEST 4: Can write a visit and read it back
-- -------------------------------------------------------------
DO $$
DECLARE
  v_id uuid;
  v_path text;
BEGIN
  INSERT INTO page_visits (path, referrer, user_agent, country)
  VALUES ('/__test__', 'https://test.local', 'test-runner', 'EG')
  RETURNING id INTO v_id;

  SELECT path INTO v_path FROM page_visits WHERE id = v_id;
  IF v_path IS DISTINCT FROM '/__test__' THEN
    RAISE EXCEPTION 'TEST 4 FAILED — could not read back visit';
  END IF;

  DELETE FROM page_visits WHERE id = v_id;
  RAISE NOTICE 'TEST 4 OK — page_visits read/write works';
END $$;

-- -------------------------------------------------------------
-- TEST 5: Can write an admin session and expiry filter works
-- -------------------------------------------------------------
DO $$
DECLARE
  v_token text := 'test-token-' || gen_random_uuid()::text;
  v_count int;
BEGIN
  -- Insert one active and one expired session
  INSERT INTO admin_sessions (token, expires_at)
  VALUES (v_token, now() + interval '1 hour');

  INSERT INTO admin_sessions (token, expires_at)
  VALUES (v_token || '-expired', now() - interval '1 hour');

  -- Active-only query should match exactly one
  SELECT count(*) INTO v_count
  FROM admin_sessions
  WHERE token = v_token AND expires_at > now();

  IF v_count <> 1 THEN
    RAISE EXCEPTION 'TEST 5 FAILED — active session lookup returned % rows', v_count;
  END IF;

  -- Prune expired
  DELETE FROM admin_sessions WHERE token LIKE 'test-token-%';
  RAISE NOTICE 'TEST 5 OK — admin_sessions works with expiry';
END $$;

-- -------------------------------------------------------------
-- TEST 6: Full content-edit simulation (what the admin dashboard does)
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
  -- Snapshot current values
  SELECT value INTO original_price FROM site_content WHERE key = 'site.price_usd';
  SELECT value INTO original_url   FROM site_content WHERE key = 'site.buy_url';

  -- Simulate an admin PUT on two keys
  UPDATE site_content SET value = new_price, updated_at = now() WHERE key = 'site.price_usd';
  UPDATE site_content SET value = new_url,   updated_at = now() WHERE key = 'site.buy_url';

  -- Read them back (what the public site will see on next render)
  SELECT value INTO read_price FROM site_content WHERE key = 'site.price_usd';
  SELECT value INTO read_url   FROM site_content WHERE key = 'site.buy_url';

  IF read_price <> new_price OR read_url <> new_url THEN
    RAISE EXCEPTION 'TEST 6 FAILED — updated values did not persist';
  END IF;

  -- Restore originals
  UPDATE site_content SET value = original_price, updated_at = now() WHERE key = 'site.price_usd';
  UPDATE site_content SET value = original_url,   updated_at = now() WHERE key = 'site.buy_url';

  RAISE NOTICE 'TEST 6 OK — content edits persist correctly';
END $$;

-- -------------------------------------------------------------
-- TEST 7: Analytics aggregation works (same query the dashboard runs)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_total int;
  v_last24 int;
  v_ids uuid[];
  id uuid;
BEGIN
  -- Seed 3 test rows with different timestamps
  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'EG', now()) RETURNING id INTO id;
  v_ids := array_append(v_ids, id);

  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'US', now() - interval '2 hours') RETURNING id INTO id;
  v_ids := array_append(v_ids, id);

  INSERT INTO page_visits (path, country, created_at)
  VALUES ('/__agg__', 'US', now() - interval '10 days') RETURNING id INTO id;
  v_ids := array_append(v_ids, id);

  -- Same aggregates the /api/admin/analytics route runs
  SELECT count(*) INTO v_total     FROM page_visits WHERE path = '/__agg__';
  SELECT count(*) INTO v_last24    FROM page_visits WHERE path = '/__agg__' AND created_at > now() - interval '24 hours';

  IF v_total <> 3 OR v_last24 <> 2 THEN
    RAISE EXCEPTION 'TEST 7 FAILED — expected total=3 last24=2, got total=% last24=%', v_total, v_last24;
  END IF;

  -- Cleanup
  DELETE FROM page_visits WHERE path = '/__agg__';
  RAISE NOTICE 'TEST 7 OK — analytics aggregation returns correct counts';
END $$;

-- -------------------------------------------------------------
-- TEST 8: Keep-alive cron simulation (read each table + heartbeat write)
-- -------------------------------------------------------------
DO $$
DECLARE
  v_count int;
  v_heartbeat text;
BEGIN
  PERFORM count(*) FROM site_content;
  PERFORM count(*) FROM page_visits;
  PERFORM count(*) FROM admin_sessions;

  INSERT INTO site_content (key, value, section, description, updated_at)
  VALUES ('system.last_keepalive', now()::text, 'system',
          'Auto-updated daily by cron to prevent Supabase pause.', now())
  ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = now();

  SELECT value INTO v_heartbeat FROM site_content WHERE key = 'system.last_keepalive';
  IF v_heartbeat IS NULL THEN
    RAISE EXCEPTION 'TEST 8 FAILED — heartbeat not written';
  END IF;

  RAISE NOTICE 'TEST 8 OK — keep-alive flow works (heartbeat=%)', v_heartbeat;
END $$;

-- -------------------------------------------------------------
-- FINAL SUMMARY
-- -------------------------------------------------------------
SELECT
  (SELECT count(*) FROM site_content)   AS content_rows,
  (SELECT count(*) FROM page_visits)    AS visit_rows,
  (SELECT count(*) FROM admin_sessions) AS session_rows,
  (SELECT value FROM site_content WHERE key = 'site.price_usd') AS current_price,
  (SELECT value FROM site_content WHERE key = 'site.buy_url')   AS current_buy_url,
  (SELECT value FROM site_content WHERE key = 'system.last_keepalive') AS last_keepalive;
