[![Downloads][npm-dm]][package-url]
[![Downloads][npm-dt]][package-url]
[![NPM Version][npm-v]][package-url]
[![Dependencies][deps]][package-url]
[![Dev Dependencies][dev-deps]][package-url]
[![License][license]][package-url]
 
# eslint-formatter-gitlab-ci
A eslint reporter that creates compatible junit xml files friendly for gitlab-ci

## Installation
```shell
yarn add --dev eslint-formatter-gitlab-ci
```

## Usage
Simply run:

```shell
eslint -f gitlab-ci .
```

## Configuration

`eslint-formatter-gitlab-ci` offers four configurations based on environment variables or a `eslint-formatter-gitlab-ci` key defined in `package.json`. All configuration values should be **strings**.

| Variable Name | Description | Default |
|--|--|--|
| `ESLINT_SUITE_NAME` | `name` attribute of `<testsuites>` | `"eslint tests"` |
| `ESLINT_JUNIT_OUTPUT` | File path to save the output. | `"./junit.xml"` |
| `ESLINT_JUNIT_CLASSNAME` | Template string for the `classname` attribute of `<testcase>`. | `"{ruleId}"` |
| `ESLINT_JUNIT_TITLE` | Template string for the `name` attribute of `<testcase>`. | `"{line} : {source}"` |

Example:

```shell
ESLINT_SUITE_NAME="Eslint Style Tests" ESLINT_JUNIT_OUTPUT="./artifacts/eslint-junit.xml" eslint
```

You can also define a `eslint-junit` key in your `package.json`.  All are **string** values.

```
{
  ...
  "eslint-junit": {
    "suiteName": "eslint tests",
    "output": "./eslint-junit.xml",
    "classNameTemplate": "{ruleId}",
    "titleTemplate": "{line} : {source}"
  }
}
```

For the following case:

```js
function test (a) {
  a = '1';
}
```

The default output:

```xml
<testsuites name="eslint tests">
  <testsuite errors="1" failures="0" name="/test.js" skipped="0" tests="1" time="1" timestamp="2017-09-06T20:04:53">
    <testcase classname="no-param-reassign" name="2 :  a = '1';" time="1">
      <failure>Assignment to function parameter &apos;a&apos;.</failure>
    </testcase>
  </testsuite>
</testsuites>
```

Changing the `classNameTemplate` and `titleTemplate`:

```shell
ESLINT_JUNIT_CLASSNAME="{ruleId}" ESLINT_JUNIT_TITLE="{source}" eslint
```

```xml
<testsuites name="eslint tests">
  <testsuite errors="1" failures="0" name="/utils/getOptions.js" skipped="0" tests="1" time="1" timestamp="2017-09-06T20:04:53">
    <testcase classname="no-param-reassign" name="    pathToResolve = path.dirname(pathToResolve);" time="1">
      <failure>Assignment to function parameter &apos;pathToResolve&apos;.</failure>
    </testcase>
  </testsuite>
</testsuites>
```

[npm-dm]: https://img.shields.io/npm/dm/eslint-junit-gitlab.svg
[npm-dt]: https://img.shields.io/npm/dt/eslint-junit-gitlab.svg
[npm-v]: https://img.shields.io/npm/v/eslint-junit-gitlab.svg
[deps]: https://img.shields.io/david/jcgertig/eslint-junit-gitlab.svg
[dev-deps]: https://img.shields.io/david/dev/jcgertig/eslint-junit-gitlab.svg
[license]: https://img.shields.io/npm/l/eslint-junit-gitlab.svg
[package-url]: https://npmjs.com/package/eslint-junit-gitlab
