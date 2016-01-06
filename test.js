var reporter = require('nodeunit').reporters.default;

process.chdir(__dirname);

var run_tests = new Array();
var tests_available = {
    'signals' : 'tests/signals.js',
    'store': 'tests/store.js',
    'recorder': 'tests/recorder.js',
    'types': 'tests/types.js',
    'mutations': 'tests/mutations.js',
    'statictree': 'tests/staticTree.js',
    'computed': 'tests/computed.js',
    'accessors': 'tests/accessors.js',
    'staticTree': 'tests/staticTree.js',
    'modules': 'tests/modules.js'
};

var test_name;

// Check if any arguments were provided to the script
if(process.argv.length > 2) {
    var i;
    // For each argument, treat it as the name of a test
    for(i = 2; i < process.argv.length; i++) {
        test_name = process.argv[i];
        if(tests_available.hasOwnProperty(test_name)) {
            // Add the test to the list of tests to run
            run_tests.push(tests_available[test_name]);
        } else {
            console.log("Invalid test '" + test_name + "'");
        }
    }
} else {
    // No arguments provided to the script, so we run all the tests
    for(test_name in tests_available) {
        if(tests_available.hasOwnProperty(test_name)) {
            run_tests.push(tests_available[test_name]);
        }
    }
}

// Tell the reporter to run the tests
if(run_tests.length > 0) {
    reporter.run(run_tests);
}
