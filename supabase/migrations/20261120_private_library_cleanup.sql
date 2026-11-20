-- Recover earlier publication times only when the catalogue and access rows were inserted together.
update public.catalogue_editorial_books e
set published_at = m.updated_at
from public.catalogue_moderation m
where e.id = m.book_id and e.published_at is null and e.xmin = m.xmin;

-- Retire the explicitly requested test book without exposing its metadata or PDF.
update public.catalogue_moderation m
set deleted = true, updated_at = now()
from public.catalogue_editorial_books e
where m.book_id = e.id and m.quentin_only and m.hidden and not m.deleted
  and lower(btrim(e.ficha->>'title')) = 'livre'
  and lower(btrim(e.ficha->>'author')) = 'essai';
