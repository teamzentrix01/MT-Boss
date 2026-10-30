import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const patches = [
  // 1. CJS app-router-instance.js
  {
    file: path.join(rootDir, 'node_modules/next/dist/client/components/app-router-instance.js'),
    transforms: [
      {
        find: `function getAppRouterActionQueue() {
    if (globalActionQueue === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    return globalActionQueue;
}`,
        replace: `function getAppRouterActionQueue() {
    if (globalActionQueue === null) {
        return null;
    }
    return globalActionQueue;
}`
      },
      {
        find: `        const actionQueue = getAppRouterActionQueue();
        const prefetchKind = options?.kind ?? _routerreducertypes.PrefetchKind.AUTO;`,
        replace: `        const actionQueue = getAppRouterActionQueue();
        if (!actionQueue) {
            return;
        }
        const prefetchKind = options?.kind ?? _routerreducertypes.PrefetchKind.AUTO;`
      }
    ]
  },
  // 2. ESM app-router-instance.js
  {
    file: path.join(rootDir, 'node_modules/next/dist/esm/client/components/app-router-instance.js'),
    transforms: [
      {
        find: `function getAppRouterActionQueue() {
    if (globalActionQueue === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    return globalActionQueue;
}`,
        replace: `function getAppRouterActionQueue() {
    if (globalActionQueue === null) {
        return null;
    }
    return globalActionQueue;
}`
      },
      {
        find: `        const actionQueue = getAppRouterActionQueue();
        const prefetchKind = options?.kind ?? PrefetchKind.AUTO;`,
        replace: `        const actionQueue = getAppRouterActionQueue();
        if (!actionQueue) {
            return;
        }
        const prefetchKind = options?.kind ?? PrefetchKind.AUTO;`
      }
    ]
  },
  // 3. CJS use-action-queue.js
  {
    file: path.join(rootDir, 'node_modules/next/dist/client/components/use-action-queue.js'),
    transforms: [
      {
        find: `function dispatchAppRouterAction(action) {
    if (dispatch === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    dispatch(action);
}`,
        replace: `function dispatchAppRouterAction(action) {
    if (dispatch === null) {
        return;
    }
    dispatch(action);
}`
      },
      {
        find: `function dispatchGestureState(state) {
    if (setGestureRouterState === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    setGestureRouterState(state);
}`,
        replace: `function dispatchGestureState(state) {
    if (setGestureRouterState === null) {
        return;
    }
    setGestureRouterState(state);
}`
      }
    ]
  },
  // 4. ESM use-action-queue.js
  {
    file: path.join(rootDir, 'node_modules/next/dist/esm/client/components/use-action-queue.js'),
    transforms: [
      {
        find: `export function dispatchAppRouterAction(action) {
    if (dispatch === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    dispatch(action);
}`,
        replace: `export function dispatchAppRouterAction(action) {
    if (dispatch === null) {
        return;
    }
    dispatch(action);
}`
      },
      {
        find: `export function dispatchGestureState(state) {
    if (setGestureRouterState === null) {
        throw Object.defineProperty(new Error('Internal Next.js error: Router action dispatched before initialization.'), "__NEXT_ERROR_CODE", {
            value: "E668",
            enumerable: false,
            configurable: true
        });
    }
    setGestureRouterState(state);
}`,
        replace: `export function dispatchGestureState(state) {
    if (setGestureRouterState === null) {
        return;
    }
    setGestureRouterState(state);
}`
      }
    ]
  }
];

let totalPatched = 0;

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    console.log(`[skip] File not found: ${patch.file}`);
    continue;
  }

  let content = fs.readFileSync(patch.file, 'utf8');
  let fileChanged = false;

  for (const { find, replace } of patch.transforms) {
    // Normalize newlines for Windows vs Unix
    const normFind = find.replace(/\r\n/g, '\n');
    const normContent = content.replace(/\r\n/g, '\n');

    if (normContent.includes(normFind)) {
      content = normContent.replace(normFind, replace);
      fileChanged = true;
      totalPatched++;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(patch.file, content, 'utf8');
    console.log(`[patched] ${path.relative(rootDir, patch.file)}`);
  } else {
    console.log(`[already patched or clean] ${path.relative(rootDir, patch.file)}`);
  }
}

console.log(`\nNext.js router queue patch complete. (Patches applied: ${totalPatched})`);
