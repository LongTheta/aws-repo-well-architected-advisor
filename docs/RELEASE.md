# Release Process

## Creating a Release

1. Update `VERSION` and `package.json` version
2. Update `CHANGELOG.md` with the new version entry
3. Commit and push
4. Create and push a tag:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
5. GitHub Actions will run tests and create a GitHub Release with auto-generated notes

## Version Format

Semantic versioning: `MAJOR.MINOR.PATCH`
