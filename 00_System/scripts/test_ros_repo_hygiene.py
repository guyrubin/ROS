import importlib.util
from pathlib import Path
import tempfile
import unittest

MODULE_PATH = Path(__file__).with_name("ros_repo_hygiene.py")
spec = importlib.util.spec_from_file_location("ros_repo_hygiene", MODULE_PATH)
ros_repo_hygiene = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ros_repo_hygiene)


class RepoHygieneTests(unittest.TestCase):
    def test_classifies_generated_and_secret_paths(self):
        self.assertEqual(ros_repo_hygiene.classify_path("graphify-out/graph.json"), "generated-output")
        self.assertEqual(ros_repo_hygiene.classify_path("00_System/secrets/keys.env"), "secret-local")
        self.assertEqual(ros_repo_hygiene.classify_path("Arbor/app/.env.local"), "secret-local")
        self.assertEqual(ros_repo_hygiene.classify_path(".claude/worktrees/demo/file.md"), "agent-worktree")

    def test_never_auto_cleans_arbor_or_secrets(self):
        self.assertFalse(ros_repo_hygiene.is_auto_cleanable("Arbor/.arbor-build-i18n/cache.json"))
        self.assertFalse(ros_repo_hygiene.is_auto_cleanable("Arbor/app/.env.local"))
        self.assertFalse(ros_repo_hygiene.is_auto_cleanable("00_System/secrets/keys.env"))
        self.assertTrue(ros_repo_hygiene.is_auto_cleanable("graphify-out/cache/node.json"))

    def test_scan_omits_excluded_dirs(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            (root / "graphify-out").mkdir()
            (root / "graphify-out" / "graph.json").write_text("{}")
            (root / "Arbor").mkdir()
            (root / "Arbor" / "active.ts").write_text("// active")
            (root / "MEMORY.md").write_text("ok")
            report = ros_repo_hygiene.build_report(root)
            paths = {item["path"] for item in report["candidates"]}
            self.assertIn("graphify-out/graph.json", paths)
            self.assertNotIn("Arbor/active.ts", paths)


if __name__ == "__main__":
    unittest.main()
