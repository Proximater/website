# Git hooks

This repository uses a local Git hooks directory via `core.hooksPath`.

- `.githooks/post-commit`: automatically stages and commits any current changes after a commit is created.
- This is intentionally lightweight and may create extra commits while you work.
