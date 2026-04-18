-- Idempotent: adds the two newly-wired footer keys without touching anything else.
insert into public.site_content (key, value) values
  ('footer.link_acquire', 'Acquire'),
  ('footer.transmission_label', 'end · transmission')
on conflict (key) do nothing;

select key, value from public.site_content
where key in ('footer.link_acquire', 'footer.transmission_label')
order by key;
