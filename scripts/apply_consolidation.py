"""Apply the manager taxonomy to the checked-in generated catalogue."""

import json
import re
from pathlib import Path

from consolidation import consolidate_catalog


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def load(path, prefix):
    text = path.read_text()
    assert text.startswith(prefix)
    return json.loads(text[len(prefix):].rstrip(";\n"))


catalog = load(PUBLIC / "catalog.js", "window.FAMILI_DATA=")
library = load(PUBLIC / "library.js", "window.FAMILI_LIBRARY=")
catalog = consolidate_catalog(catalog, catalog["docs"], library, PUBLIC / "knowledge")
(PUBLIC / "catalog.js").write_text("window.FAMILI_DATA=" + json.dumps(catalog, ensure_ascii=False, separators=(",", ":")) + ";")
(PUBLIC / "library.js").write_text("window.FAMILI_LIBRARY=" + json.dumps(library, ensure_ascii=False, separators=(",", ":")) + ";")
print({"active_projects": len(catalog["projects"]), "archived_projects": len(catalog["projectArchive"]), "families": list(catalog["families"])})
