const fs = require("fs");
const archiver = require("archiver");

function makeZip() {
  const output = fs.createWriteStream("qrcodes.zip");
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`📦 ZIP Created (${archive.pointer()} bytes)`);
  });

  archive.pipe(output);
  archive.directory("qrs/", false);
  archive.finalize();
}

module.exports = { makeZip };
