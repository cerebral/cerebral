var fs = require("fs");
var path = require("path");

var declarationsRegex = /\.d\.ts$/;
var srcRoot = "src";
var destRoot = "lib";
var srcRegex = new RegExp(`^${srcRoot}`);
console.log(srcRegex);

function copyDeclarations(dirpath) {
  console.log(`Reading '${dirpath}' directory`);
  var files = fs.readdirSync(dirpath);
  files.forEach(filepath => {
    var resolvedPath = path.relative(process.cwd(), path.resolve(dirpath, filepath));
    var lstat = fs.lstatSync(resolvedPath);
    if(lstat.isFile() && declarationsRegex.test(filepath)) {
      var destPath = path.normalize(resolvedPath.replace(srcRegex, destRoot));
      console.log("Copying", resolvedPath, "to", destPath);
      fs.writeFileSync(destPath, fs.readFileSync(resolvedPath));
    } else if(lstat.isDirectory()) {
      copyDeclarations(resolvedPath);
    }
  });
}

copyDeclarations(srcRoot);