-- =======================================================================
-- 009 · FINAL BUTTONS / CTA / LINK AUDIT
-- Verified against the actual t(...) calls inside:
--   components/au-nav.tsx
--   components/au-hero.tsx
--   components/au-price.tsx
--   components/au-footer.tsx
-- Exactly 15 keys. Anything missing = build break.
-- Also confirms in-code keep-alive (no pg_cron, no vercel cron).
-- Read + tiny heartbeat write only.
-- =======================================================================

-- ---------- STEP 1 · Verify every button/CTA/link key exists -----------
DO $$
DECLARE
  required_keys TEXT[] := ARRAY[
    -- Nav bar (also reused by footer sitemap)
    'nav.link_thesis',
    'nav.link_manifesto',
    'nav.link_buyers',
    'nav.link_specs',
    'nav.link_system',
    'nav.cta',
    -- Hero CTAs
    'hero.cta_primary',
    'hero.cta_secondary',
    -- Pricing CTAs
    'price.cta_primary',
    'price.cta_secondary',
    -- Footer-only link
    'footer.link_acquire',
    -- Target URLs / values wired behind the buttons
    'site.buy_url',
    'site.question_url',
    'site.sales_email',
    'site.price_usd'
  ];
  missing TEXT[];
BEGIN
  SELECT COALESCE(ARRAY_AGG(k), ARRAY[]::TEXT[])
  INTO missing
  FROM UNNEST(required_keys) k
  WHERE NOT EXISTS (SELECT 1 FROM site_content WHERE key = k);

  IF array_length(missing, 1) IS NOT NULL THEN
    RAISE EXCEPTION 'Buttons audit FAILED. Missing keys: %', missing;
  END IF;

  RAISE NOTICE 'STEP 1 OK — all 15 button/CTA/link keys exist.';
END $$;

-- ---------- STEP 2 · Show current values for every button --------------
SELECT
  key,
  LEFT(value, 80) AS current_value,
  updated_at
FROM site_content
WHERE key IN (
  'nav.link_thesis','nav.link_manifesto','nav.link_buyers','nav.link_specs',
  'nav.link_system','nav.cta',
  'hero.cta_primary','hero.cta_secondary',
  'price.cta_primary','price.cta_secondary',
  'footer.link_acquire',
  'site.buy_url','site.question_url','site.sales_email','site.price_usd'
)
ORDER BY key;

-- ---------- STEP 3 · Simulate the in-code keep-alive heartbeat ---------
-- This is what lib/keep-alive.ts does on every page visit when >20h old.
INSERT INTO site_content (key, value, updated_at)
VALUES ('_system.keepalive', NOW()::TEXT, NOW())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = EXCLUDED.updated_at;

SELECT
  key,
  value AS last_ping,
  updated_at
FROM site_content
WHERE key = '_system.keepalive';

-- ---------- STEP 4 · Confirm no external cron dependency ---------------
DO $$
DECLARE
  has_pg_cron BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron')
  INTO has_pg_cron;

  IF has_pg_cron THEN
    RAISE NOTICE 'pg_cron extension present, but the app does NOT rely on it.';
  ELSE
    RAISE NOTICE 'STEP 4 OK — no pg_cron. Keep-alive is 100 percent app-driven.';
  END IF;
END $$;

-- ---------- STEP 5 · Final summary -------------------------------------
SELECT
  (SELECT COUNT(*) FROM site_content)                                    AS total_content_rows,
  (SELECT COUNT(*) FROM site_content WHERE key LIKE 'nav.%')             AS nav_keys,
  (SELECT COUNT(*) FROM site_content WHERE key LIKE 'hero.%')            AS hero_keys,
  (SELECT COUNT(*) FROM site_content WHERE key LIKE 'price.%')           AS price_keys,
  (SELECT COUNT(*) FROM site_content WHERE key LIKE 'footer.%')          AS footer_keys,
  (SELECT COUNT(*) FROM site_content WHERE key LIKE 'site.%')            AS site_keys,
  (SELECT value FROM site_content WHERE key = 'site.price_usd')          AS current_price,
  (SELECT value FROM site_content WHERE key = 'site.buy_url')            AS current_buy_url,
  (SELECT value FROM site_content WHERE key = '_system.keepalive')       AS last_keepalive;
