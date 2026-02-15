# Implementation Plan - Optimize Dashboard UI & Performance

## 1. Dashboard UI Cleanup
- **File**: `frontend/app/dashboard/page.tsx`
- **Goal**: Address user feedback "make it clean please" by reducing visual clutter and heavy typographic elements.
- **Changes**:
    - **Typography**: Reduced the main greeting size from `text-5xl lg:text-7xl` to `text-3xl md:text-5xl`. This creates a more balanced hierarchy.
    - **Daily Insight Card**: Changed from a heavy solid gradient (`from-emerald-600 to-teal-800`) to a cleaner, more subtle glass-morphism gradient (`from-emerald-900/60 to-teal-950/60` with backdrop blur). This integrates better with the dark theme.
    - **Spacing**: Tighted the grid gap from `gap-6` to `gap-4` for a more cohesive layout.
    - **Visual Noise**: Reduced the prominence of the "Daily Insight" and "Cognitive State" pills, making them cleaner. Reduced font weights on some headers.
    - **Skeleton Loading**: Updated the Skeleton UI to match the new cleaner layout structure.

## 2. Performance & Loading
- **File**: `frontend/app/dashboard/page.tsx`
- **Changes**: 
    - Verified the Skeleton UI is in place to handle the *perceived* load time issues.
    - The reduced complexity of the DOM (smaller text, cleaner cards) should slightly help rendering performance.
    - Previously added `t=${Date.now()}` ensures data freshness, fixing the "not syncing" issue.

## 3. Sidebar & Branding
- **File**: `frontend/components/common/Sidebar.tsx`
- **Change**: Updated the logo icon to `Trees` as requested.
- **File**: `frontend/app/forest/page.tsx`
- **Change**: Replaced the previous `InsightOrb` with a static `Leaf` logo box to match the "original black and green tree logo" request (avoiding the holographic effect).

These changes collectively aim to provide a "cleaner", more professional, and faster-feeling application.
