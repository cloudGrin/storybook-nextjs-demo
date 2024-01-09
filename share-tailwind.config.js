const plugin = require('tailwindcss/plugin')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

const paletteLess = fs.readFileSync(path.resolve(__dirname, './var.less'), 'utf8')
const palette = lessToJs(paletteLess, { resolveVariables: true, stripPrefix: true })

module.exports = {
  prefix: '',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        zg: 'PingFang SC, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Microsoft Yahei, STHeiti, SimSun, sans-serif'
      },
      fontSize: {
        base: '12px',
        12: '12px',
        13: '13px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px'
      }
    },
    colors: {
      //主色调
      c_primary: palette.c_primary,
      c_primary_light: palette.c_primary_light,
      c_primary_1: palette.c_primary_1,
      c_primary_2: palette.c_primary_2,
      c_success: palette.c_success,
      c_info: palette.c_info,
      c_error: palette.c_error,
      c_warning: palette.c_warning,
      c_hover: palette.c_hover,
      c_white: palette.c_white,
      c_level_1: palette.c_level_1,
      c_level_2: palette.c_level_2,
      c_level_3: palette.c_level_3,
      c_level_4: palette.c_level_4,
      c_level_5: palette.c_level_5,
      c_level_6: palette.c_level_6,
      c_level_7: palette.c_level_7,
      //背景色
      c_bg_1: palette.c_bg_1,
      c_bg_2: palette.c_bg_2,
      c_bg_3: palette.c_bg_3,
      c_bg_4: palette.c_bg_4,
      c_bg_5: palette.c_bg_5,
      c_bg_6: palette.c_bg_6,
      c_bg_7: palette.c_bg_7,
      //边框/分割线颜色
      c_line_1: palette.c_line_1,
      c_line_2: palette.c_line_2,
      c_line_3: palette.c_line_3,
      c_line_4: palette.c_line_4,
      c_999: palette.c_999,
      c_333: palette.c_333,
      c_334: palette.c_334,
      c_163: palette.c_163
    },
    spacing: {
      ...[...Array(41).keys()].reduce((result, _, idx) => {
        result[idx] = `${idx}px`
        return result
      }, {}),
      ...[...Array(13).keys()].reduce((result, _, idx) => {
        result === 0 && (result = {})
        let num = idx * 5 + 40
        result[num] = `${num}px`
        return result
      }),
      px: '1px',
      unset: 'unset'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    // 多行省略
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addBase, addComponents, config }) {
      // 注入基础样式
      addBase({
        'body a': { color: config('theme.colors.c_level_1') },
        'body a:hover': { color: config('theme.colors.c_primary') }
      })
      addComponents({
        '.btn': {
          borderRadius: '6px',
          display: 'inline-block',
          textAlign: 'center',
          height: '30px',
          lineHeight: '30px',
          cursor: 'pointer'
        },
        '.btn-primary_ghost': {
          color: palette.c_primary,
          border: `1px solid ${palette.c_primary}`,
          '&:hover': {
            border: `1px solid ${palette.c_primary_light}`,
            color: palette.c_primary_light
          }
        },
        '.btn-primary_linear': {
          color: '#fff',
          background: 'linear-gradient(270deg, #ECAA71 0%, #DA9051 100%)',
          '&:hover': {
            background: palette.c_primary_light
          }
        },
        '.btn-primary_disabled': {
          color: '#A8AFBF',
          background: '#F8FAFD',
          cursor: 'not-allowed',
          border: '1px solid #D5DAE5'
        },
        '.btn-primary_outline': {
          color: palette.c_level_2,
          border: `1px solid ${palette.c_line_1}`,
          '&:hover': {
            border: `1px solid ${palette.c_primary}`,
            color: palette.c_primary
          }
        }
      })
    })
  ],
  corePlugins: {
    // 完全禁用响应式变体
    container: false
  }
}
