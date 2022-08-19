const fs = require("fs");
try {
  const p = process.cwd();
  fs.readdirSync(p).forEach((r) => {
    if (/\.vsix$/.test(r)) {
      fs.rmSync(p + "/" + r);
    }
  });
} catch (_e) {}
