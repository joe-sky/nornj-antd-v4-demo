import nj from 'nornj';
import 'nornj-react';
import { observable } from 'mobx';
import schema from 'async-validator';
import { Input } from 'antd';

nj.registerComponent({
  'ant-Input': {
    component: Input,
    options: {
      hasEventObject: true,
    },
  },
});

nj.registerExtension(
  'mobxFormData',
  options => {
    const { children, props } = options;
    let _children = children();
    if (!Array.isArray(_children)) {
      _children = [_children];
    }

    const ret = {
      _njMobxFormData: true,
      fieldDatas: new Map(),
      validate(name) {
        const oFd = this.fieldDatas.get(name);
        let value = this[name];
        switch (oFd.type) {
          case 'number':
          case 'integer':
          case 'float':
            value = n`${value}.trim()` !== '' ? +value : '';
            break;
          case 'boolean':
            value = n`${value}.trim()` !== '' ? Boolean(value) : '';
            break;
          default:
            break;
        }

        return new Promise((resolve, reject) => {
          oFd.validator.validate({ [name]: value }, (errors, fields) => {
            console.log(errors);
            if (errors) {
              this.error(oFd.message != null ? oFd.message : errors[0].message, name);
              reject({ errors, fields });
            } else {
              this.clear(name);
              resolve();
            }
          });
        });
      },
      error(help, name) {
        const oFd = this.fieldDatas.get(name);
        oFd.validateStatus = 'error';
        oFd.help = help;
      },
      clear(name) {
        const oFd = this.fieldDatas.get(name);
        oFd.validateStatus = null;
        oFd.help = null;
      },
      reset(name) {
        this.clear(name);
        const oFd = this.fieldDatas.get(name);
        oFd.reset();
      },
      add(fieldData) {
        const {
          name,
          value,
          type = 'string',
          required = false,
          message,
          trigger = 'onChange',
          ...ruleOptions
        } = fieldData;
        const fd = { name, value, type, required, message, trigger, ...ruleOptions };

        fd.validator = new schema({
          [name]: {
            type,
            required,
            ...ruleOptions,
          },
        });

        fd.reset = function() {
          this.value = value;
        };

        const oFd = observable(fd);
        this.fieldDatas.set(name, oFd);

        Object.defineProperty(this, name, {
          get: function() {
            return this.fieldDatas.get(name).value;
          },
          set: function(v) {
            this.fieldDatas.get(name).value = v;
          },
          enumerable: true,
          configurable: true,
        });
      },
      delete(name) {
        this.fieldDatas.delete(name);
      },
    };

    _children.forEach(fieldData => {
      fieldData && ret.add(fieldData);
    });

    return props && props.observable ? observable(ret) : ret;
  },
  { onlyGlobal: true }
);

nj.registerExtension('mobxFieldData', options => options.props, { onlyGlobal: true });

nj.registerExtension(
  'mobxField',
  options => {
    const { value, tagProps } = options;
    const _value = value();
    const { prop, source } = _value;
    const oFd = source.fieldDatas.get(prop);

    tagProps.validateStatus = oFd.validateStatus;
    tagProps.help = oFd.help;
  },
  { onlyGlobal: true }
);