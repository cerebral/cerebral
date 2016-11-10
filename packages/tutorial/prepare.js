/* global rm, cp, sed */
var part = process.argv.length === 4 ? process.argv[3] : '01'

rm('-rf', './src')
cp('-R', './parts/' + part + '/src', '.')
cp('./parts/index.html', './public/')
sed('-i', '%N%', part, './public/index.html')
