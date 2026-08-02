/* Base-aware URL builder.

   import.meta.env.BASE_URL is vite.config.js's `base` and always ends
   with "/". Building every internal href through here means the site
   keeps working if it is ever moved back under a subdirectory (project
   Pages) instead of the apex domain.

   to("/")            -> "/"
   to("/docs/fees")   -> "/docs/fees"
*/
const BASE = import.meta.env.BASE_URL;

export function to(path) {
  return BASE + String(path).replace(/^\//, "");
}
