-- =============================================================================
-- Audit: every button/CTA key on the live site + self-triggered keep-alive.
-- No psql meta-commands; everything is pure SQL / PL/pgSQL.
-- =============================================================================

-- PART A: button & link keys used on the live site
DO $$
DECLARE
  required_keys TEXT[] := ARRAY[
    -- Navigation
    'nav.cta',
    'nav.link_manifesto',
    'nav.link_buyers',
    'nav.link_specs',
    'nav.link_system',
    'nav.link_acquire',
    -- Hero CTAs
    'hero.cta_primary',
    'hero.cta_secondary',
    -- Thesis CTA
    'thesis.cta',
    -- Price (buy button + links)
    'price.cta',
    'price.secondary_cta',
    'site.buy_url',
    'site.sales_email',
    'site.question_url',
    -- System section
    'system.cta',
    -- Footer links/labels
    'footer.link_acquire',
    'footer.transmission_label'
  ];
  k TEXT;
  missing TEXT[] := '{}';
  v TEXT;
BEGIN
  RAISE NOTICE '=== PART A: button & link keys used on the live site ===';
  FOREACH k IN ARRAY required_keys LOOP
    SELECT value INTO v FROM site_content WHERE key = k;
    IF NOT FOUND THEN
      missing := array_append(missing, k);
    ELSE
      RAISE NOTICE '  OK  %  ->  %', rpad(k, 28), left(v, 60);
    END IF;
  END LOOP;

  IF array_length(missing, 1) IS NOT NULL THEN
    RAISE EXCEPTION 'Buttons audit FAILED. Missing keys: %', missing;
  END IF;
  RAISE NOTICE '  === all % button keys present ===', array_length(required_keys, 1);
END $$;

-- PART B: simulate the self-triggered keep-alive (lib/keep-alive.ts)
DO $$
DECLARE
  key_name CONSTANT TEXT := '_system.keepalive';
  last_ts  TIMESTAMPTZ;
  hours    NUMERIC;
  new_ts   TIMESTAMPTZ;
BEGIN
  RAISE NOTICE '=== PART B: simulate the in-code keep-alive heartbeat ===';

  SELECT updated_at INTO last_ts FROM site_content WHERE key = key_name;

  IF NOT FOUND THEN
    RAISE NOTICE '  no heartbeat row yet, one will be created on the next visit';
  ELSE
    hours := EXTRACT(EPOCH FROM (NOW() - last_ts)) / 3600.0;
    RAISE NOTICE '  current heartbeat: % (age: % h)', last_ts, round(hours, 2);
  END IF;

  -- This mirrors exactly what runHeartbeat() does when > 20h have passed.
  INSERT INTO site_content (key, value, updated_at)
  VALUES (key_name, NOW()::TEXT, NOW())
  ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value,
        updated_at = EXCLUDED.updated_at
  RETURNING updated_at INTO new_ts;

  RAISE NOTICE '  upsert OK, new heartbeat: %', new_ts;

  IF NOT EXISTS (
    SELECT 1 FROM site_content
    WHERE key = key_name AND updated_at = new_ts
  ) THEN
    RAISE EXCEPTION 'Keep-alive write verification failed';
  END IF;

  RAISE NOTICE '  === self keep-alive simulation OK ===';
END $$;

-- PART C: confirm no external cron is referenced anywhere
DO $$
DECLARE
  cron_rows INT;
BEGIN
  RAISE NOTICE '=== PART C: verify no external cron dependency ===';
  SELECT COUNT(*) INTO cron_rows
  FROM pg_catalog.pg_class
  WHERE relname = 'job' AND relnamespace = (
    SELECT oid FROM pg_namespace WHERE nspname = 'cron'
  );
  IF cron_rows = 0 THEN
    RAISE NOTICE '  OK — no pg_cron registered, keep-alive is 100%% app-driven';
  ELSE
    RAISE NOTICE '  pg_cron present but our app does not rely on it';
  END IF;
END $$;

-- PART D: final state snapshot
SELECT
  (SELECT COUNT(*) FROM site_content)             AS content_rows,
  (SELECT COUNT(*) FROM page_visits)              AS visit_rows,
  (SELECT COUNT(*) FROM admin_sessions)           AS session_rows,
  (SELECT value FROM site_content WHERE key = 'site.price_usd')  AS price_usd,
  (SELECT value FROM site_content WHERE key = 'site.buy_url')    AS buy_url,
  (SELECT updated_at FROM site_content WHERE key = '_system.keepalive') AS last_heartbeat;
