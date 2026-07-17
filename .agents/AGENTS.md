# CBS Portal Context & Guidelines

This file serves as the long-term memory for agent interactions on the CBS Portal project. Review these guidelines to maintain architectural consistency and save processing time.

## 1. Project Structure
*   **Monorepo-like, but discrete Git repos**: The workspace root is `d:\Projects\cbs\portal`. Inside it are two distinct git repositories: `cbs-portal-ui` (Next.js) and `cbs-portal-strapi-be` (Strapi v5). **Always check `git status` in the specific sub-folders before committing.**
*   **Documentation**: Confluence-style documentation `.md` files are strictly maintained inside `cbs-portal-ui/docs`. Always update them after major structural or API changes.

## 2. Strapi Backend & Data Migrations
*   **Migration Scripts**: Run from `cbs-portal-strapi-be/migration-tool` using `node index.js <script>` (e.g., `node index.js members`).
*   **Legacy Data Source**: Data is pulled from a local MySQL database (`wp-data/homedir/...`).
*   **Drafts vs Published**: When writing scripts to delete/clear Strapi collections, explicitly include `?publicationState=preview` to ensure drafts are retrieved and deleted, preventing silent accumulation of hidden records.
*   **Image Uploads (API)**: Uploading images programmatically via Strapi `/api/upload` requires `form-data`. You must pass the physical file stream and a `filename` property in the append options. Do not try to immediately link entities during upload using `ref`, `refId`, or `field` if it causes instability; upload first, get the ID, and then assign it in the entry creation payload.

## 3. Next.js Frontend Development
*   **i18n Routing**: The app uses dynamic `[lang]` paths. Hardcoded slugs must be avoided; use `getDictionary(currentLang)` to retrieve translated `dict.routes` dynamically.
*   **Next.js Rewrites (CRITICAL)**: When configuring URL translations in `next.config.mjs` (e.g., rewriting `/sr/vesti` to `/sr/news`), you MUST define a secondary wildcard rule (`{ source: '/sr/vesti/:path*', destination: '/sr/news/:path*' }`) to ensure nested dynamic segments (like single post pages) are rewritten correctly. Omitting `/:path*` causes hard 404s for all subpages.
*   **Component Architecture**: Avoid importing complex 3rd-party libraries (like `react-select`) for basic UI components. Build custom dropdowns/inputs using native React state and CSS for better bundle size and CSS control.
*   **URL State Sync**: For interactive components (e.g., search, toggles), heavily favor syncing local state to the browser URL (via `next/navigation` `useRouter`, `usePathname`, `useSearchParams`). This allows the state to be "copy-pasteable".
*   **Data Fetching**: Prefer Strapi REST queries with dynamic filters (e.g., `filters[$or][0][FirstName][$containsi]=X`) for server-side accuracy instead of fetching all items and filtering locally.

## 4. Styling (Bootstrap + Custom)
*   **Bootstrap**: Used ONLY for Grid (`.row`, `.col-*`) and Utility classes (`.mt-4`, `.d-none`). Do NOT import global Bootstrap UI elements or typography. 
*   **Custom Scoping**: Brand aesthetics are in `globals.css` or scoped React `<style>` blocks. Do not invent legacy classes (like `.cw-flex-row`); stick strictly to native Bootstrap grid classes.
