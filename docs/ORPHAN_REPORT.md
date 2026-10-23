# Orphan Detection Report

**Status:** Baseline pending automated reference scan

No file may be classified as orphaned from filename inspection alone. The scan must include:

- Route references and lazy imports
- Component imports and dynamic imports
- Service imports
- Data imports and registry references
- CSS imports
- Public asset references
- Documentation and download links
- Test references

## Required output

| File | Surface | Reference evidence | Decision | Migration owner |
|---|---|---|---|---|
| Pending scan | Pending | Pending | Preserve until verified | Platform Engineering |

## Rule

Unreferenced code is marked `Deprecated` first. It is not deleted until a second scan, build, route test, content count test, and rollback review pass.
