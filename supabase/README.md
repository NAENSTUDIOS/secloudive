# SecLoudive Supabase setup

The product workspace uses only Supabase Auth, PostgreSQL, Row Level Security,
and private Storage. Apply the migrations in `migrations/` to the Supabase
project, then create a local `apps/frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-publishable-key
```

Never put `SUPABASE_SECRET_KEY`, a service-role key, or a database password in
the frontend or in Git. Promote the first trusted profile to `admin` from the
Supabase SQL editor only after verifying the account:

```sql
update public.profiles
set role = 'admin'
where id = 'AUTH_USER_UUID';
```

The migration enables RLS on profiles, products, activities, and product image
storage. The catalog/orders migration adds `name`, `email`, `title`, and
`category` compatibility fields plus immutable order snapshots. The frontend is
safe to deploy to Vercel once the migrations and environment variables are
configured.
