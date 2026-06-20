-- Add plain-text formatting options for skills

alter table public.skills
  add column if not exists bold boolean not null default false,
  add column if not exists font_size text not null default 'base'
    check (font_size in ('sm', 'base', 'lg', 'xl')),
  add column if not exists text_align text not null default 'left'
    check (text_align in ('left', 'center', 'right'));
