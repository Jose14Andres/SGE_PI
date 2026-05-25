## 2024-05-17 - [O(1) Map Lookups for Related Entities]
**Learning:** React components (especially Dashboard views) frequently fetch related entity names directly inside nested list iterators, column definitions, or chart data generators using `Array.find()`, resulting in O(N x M) operations on every render.
**Action:** Always replace multiple `.find()` calls on relationships with an O(1) dictionary mapped via `useMemo` (e.g., `const entityById = useMemo(() => Object.fromEntries(entities.map(e => [e.id, e])), [entities])`) before rendering list logic.

### N+1 Query Loops
* When mapping entities with cross-references inside a loop (e.g. `array.forEach(...)` with `otherArray.find(...)` inside), pre-compute an `Object.fromEntries` lookup map before the loop. This converts O(N*M) operations into O(N+M) and is critical for larger datasets.
* Always accompany this optimization with the standardized comment: `// ⚡ Bolt: O(1) Map Lookups for Related Entities`.
