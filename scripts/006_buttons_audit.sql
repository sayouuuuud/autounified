-- ============================================================
-- Audit: every button / CTA / link in the site must be editable
-- ============================================================
-- This script lists every content key that drives a button label
-- or a destination URL on the live site, and checks that each one
-- exists in site_content (so the admin can change it).
-- ============================================================

DO $$
DECLARE
  required_keys text[] := ARRAY[
    -- Nav (au-nav.tsx)
    'nav.brand',
    'nav.link_manifesto',
    'nav.link_buyers',
    'nav.link_specs',
    'nav.link_system',
    'nav.cta_label',

    -- Hero CTAs (au-hero.tsx)
    'hero.cta_primary',
    'hero.cta_secondary',

    -- Thesis CTA (au-thesis.tsx)
    'thesis.cta_label',

    -- Price block CTAs + link destinations (au-price.tsx)
    'price.cta_buy',
    'price.cta_question',
    'site.buy_url',
    'site.question_url',
    'site.sales_email',

    -- System CTA (au-system.tsx)
    'system.cta_label',

    -- Footer links + labels (au-footer.tsx)
    'footer.link_acquire',
    'footer.transmission_label',
    'footer.copyright',
    'footer.lot'
  ];
  k text;
  missing text[] := ARRAY[]::text[];
  present_count int := 0;
BEGIN
  FOREACH k IN ARRAY required_keys LOOP
    IF EXISTS (SELECT 1 FROM site_content WHERE key = k) THEN
      present_count := present_count + 1;
    ELSE
      missing := array_append(missing, k);
    END IF;
  END LOOP;

  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'BUTTONS / LINKS AUDIT';
  RAISE NOTICE '---------------------------------------------';
  RAISE NOTICE 'Required keys : %', array_length(required_keys, 1);
  RAISE NOTICE 'Present in DB : %', present_count;
  RAISE NOTICE 'Missing       : %', COALESCE(array_length(missing, 1), 0);
  IF COALESCE(array_length(missing, 1), 0) > 0 THEN
    RAISE EXCEPTION 'AUDIT FAILED — missing keys: %', missing;
  END IF;
  RAISE NOTICE 'AUDIT PASSED — every button/link on the site is editable.';
  RAISE NOTICE '---------------------------------------------';
END
$$ LANGUAGE plpgsql;

-- Return a summary table so the admin can see all button values
SELECT
  key,
  value,
  CASE
    WHEN key LIKE 'nav.%' THEN 'Navigation'
    WHEN key LIKE 'hero.cta%' THEN 'Hero CTAs'
    WHEN key LIKE 'thesis.cta%' THEN 'Manifesto CTA'
    WHEN key IN ('price.cta_buy','price.cta_question') THEN 'Price CTAs'
    WHEN key IN ('site.buy_url','site.question_url','site.sales_email','site.price_usd') THEN 'Destinations'
    WHEN key LIKE 'system.cta%' THEN 'System CTA'
    WHEN key LIKE 'footer.%' THEN 'Footer'
    ELSE 'Other'
  END AS section
FROM site_content
WHERE
  key LIKE 'nav.%'
  OR key LIKE '%cta%'
  OR key IN (
    'site.buy_url','site.question_url','site.sales_email','site.price_usd',
    'footer.link_acquire','footer.transmission_label','footer.copyright','footer.lot'
  )
ORDER BY section, key;
