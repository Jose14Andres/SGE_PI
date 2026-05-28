## 2024-05-17 - [O(1) Map Lookups for Related Entities]
**Learning:** React components (especially Dashboard views) frequently fetch related entity names directly inside nested list iterators, column definitions, or chart data generators using `Array.find()`, resulting in O(N x M) operations on every render.
**Action:** Always replace multiple `.find()` calls on relationships with an O(1) dictionary mapped via `useMemo` (e.g., `const entityById = useMemo(() => Object.fromEntries(entities.map(e => [e.id, e])), [entities])`) before rendering list logic.

## 2024-06-25 - [Memoizing Static Prop Calculations in Dashboards]
**Learning:** Top-level components like Dashboards often recalculate large subsets of data (like filtering students by assigned courses) on every render (e.g., when switching active tabs) even when the source data and criteria haven't changed.
**Action:** Always wrap `Array.filter` and `Array.map` operations derived solely from static props and context users into `useMemo` hooks to avoid expensive O(N) recalculations on simple local state updates (like tab switching).
* **N+1 Render Iterations**: Avoid filtering large datasets inside `map` render blocks (e.g. `alumnos.filter(...)`). Pre-calculate the metrics into dictionaries using `useMemo` and `reduce` outside the render loop for an O(n) improvement.
## Memoization of Filter Operations
To prevent O(N) rendering bottlenecks in React components like dashboards, avoid evaluating unmemoized array operations (`.filter()`, `.find()`, `.map()`) directly in the render body. Wrap derived arrays and looked-up items using `useMemo` hooks with tight dependency arrays, ensuring that calculations only occur when necessary (e.g. data or selections change).
