INSERT INTO "product" ("id", "name", "slug", "description", "href", "status")
VALUES (
  'zerith-fleet',
  'Zerith Fleet',
  'zerith-fleet',
  'Inteligência operacional para frotas. Produto próprio em desenvolvimento.',
  '/produtos/fleet',
  'published'
)
ON CONFLICT ("slug") DO NOTHING;
