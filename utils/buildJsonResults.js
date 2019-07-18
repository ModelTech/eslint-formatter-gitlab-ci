const stripAnsi = require('strip-ansi'); // eslint-disable-line

const buildTemplate = function buildTemplate (template, obj) {
  return template.replace(/{([^{}]*)}/g, (capture) => {
    const key = capture.slice(1, capture.length - 1);

    return obj.hasOwnProperty(key)
        ? obj[key]
        : '';
  });
};

module.exports = function buildJsonResults (report, appDirectory, options) {
  // Generate a single XML file for all jest tests
  const jsonResults = {'testsuites': [{'_attr': {'name': options.suiteName}}]};

  // Iterate through outer testResults (test suites)
  report.forEach((suite) => {
    // Skip empty test suites
    if (suite.messages.length <= 0) {
      return;
    }

    // Add <testsuite /> properties
    const testSuite = {
      'testsuite': [
        {
          '_attr': {
            // not supported
            'errors': suite.errorCount,
            'failures': suite.fixableErrorCount,
            'name': suite.filePath.replace(appDirectory, ''),
            'skipped': suite.warningCount,
            'tests': suite.errorCount + suite.warningCount,
            'time': 1,
            'timestamp': (new Date()).toISOString().slice(0, -5) // eslint-disable-line
          }
        }
      ]
    };

    const testCase = {
      'testcase': [
        {
          '_attr': {
            'classname': testSuite.testsuite[0]._attr.name,
            'name': testSuite.testsuite[0]._attr.name,
            'time': 1
          }
        }
      ]
    };


    // Iterate through test cases
    suite.messages.forEach((tc) => {
      // let opt = Object.assign({},tc);
      //  Object.assign(opt,{path:testSuite.testsuite[0]._attr.name});


      // const testCase = {
      //   'testcase': [
      //     {
      //       '_attr': {
      //         'classname': buildTemplate(options.classNameTemplate, opt),
      //         'name': buildTemplate(options.titleTemplate, opt),
      //         'time': 1
      //       }
      //     }
      //   ]
      // };
      const addTag = function addTag (type) {
        let opt = Object.assign({},tc);
        opt.message = stripAnsi(tc.message);
        opt.level = (tc.severity === 1)?'warn':'error';


        const tag = {
          [type]:{
            '_attr': {
              type: (tc.severity === 1)?'warning':'error'
            },
            _cdata: buildTemplate(options.titleTemplate,opt)
          }
        };

        testCase.testcase.push(tag);
      };

      // Write out all failure messages as <failure> tags
      // Nested underneath <testcase> tag
      if (tc.severity === 2) {
        addTag('failure');
      }

      // Write out a <skipped> tag if test is skipped
      // Nested underneath <testcase> tag
      if (tc.severity === 1) {
        addTag('skipped');
      }

    });
      testSuite.testsuite.push(testCase);

    jsonResults.testsuites.push(testSuite);
  });

  return jsonResults;
};
