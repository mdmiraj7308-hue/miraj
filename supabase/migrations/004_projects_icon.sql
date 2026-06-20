-- Project custom icon and formatted tech stack text

alter table public.projects
  add column if not exists icon text not null default 'folder-kanban',
  add column if not exists tech_stack_text text not null default '';
