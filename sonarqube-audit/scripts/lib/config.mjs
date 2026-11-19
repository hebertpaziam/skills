// Constantes centrais da skill. Alterar versões de imagem apenas aqui.
import os from "node:os";
import path from "node:path";

export const SONAR_IMAGE = "sonarqube:26.11.0.134175-community";
export const SCANNER_IMAGE = "sonarsource/sonar-scanner-cli:12.4.0.4321_8.4.0";

export const CONTAINER_NAME = "sonarqube-audit-server";
export const NETWORK_NAME = "sonarqube-audit-net";
export const VOLUMES = {
  data: "sonarqube-audit-data",
  extensions: "sonarqube-audit-extensions",
  logs: "sonarqube-audit-logs",
};

export const DEFAULT_PORT = 9000;
export const STARTUP_TIMEOUT_MS = 5 * 60 * 1000;
export const ANALYSIS_TIMEOUT_MS = 10 * 60 * 1000;

export const CONFIG_DIR = path.join(os.homedir(), ".config", "sonarqube-audit");
export const CREDENTIALS_FILE = path.join(CONFIG_DIR, "credentials.json");
export const WORK_ROOT = path.join(os.tmpdir(), "sonarqube-audit");

// Exclusões sempre aplicadas (além do .gitignore).
export const EXCLUDE_DIRS = ["node_modules", "bower_components", "vendor", "dist", "build", "target", ".git", "sonarqube-reports", ".angular", "coverage"];
export const EXCLUDE_FILE_GLOBS = ["**/*.min.js", "**/*.min.css", "**/jquery*.js", "**/jquery*.css"];

export const SEVERITIES = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"];
