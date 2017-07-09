h5i18n
-----------

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

A mobile page of internationalization development framework.

## 使用方法

### 创建多语言环境

```js
var langs = new h5i18n.Languages('cn');

langs.update('en');
```

## API

### 更新语言环境

```js
// function update (locale?: string)
langs.update('en');
```

### 获取文本

```js
// function get (text: string, locale?: string)
langs.get('中文<!--{en}English-->');
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/h5i18n
[npm-image]: https://badge.fury.io/js/h5i18n.svg
[travis-url]: https://travis-ci.org/zswang/h5i18n
[travis-image]: https://travis-ci.org/zswang/h5i18n.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/h5i18n?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/h5i18n/badge.svg?branch=master&service=github