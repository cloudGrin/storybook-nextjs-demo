/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    enabled: false
  },
  presets: [require('./share-tailwind.config')],
  theme: {
    extend: {
      width: {
        page_content: '1190px'
      },
      height: {
        header: '36px',
        footer: '131px',
        48: '48px',
        54: '54px',
        124: '124px'
      },
      minHeight: (theme) => ({
        layout_content: `calc(100vh - ${theme('height.header')} - ${theme('height.footer')})`,
        layout_content_search: `calc(100vh - ${theme('height.header')} - 78px)`,
        layout_content_presell: `calc(100vh - ${theme('height.header')} - ${theme('height.footer')} - 20px - 78px)`
      }),
      borderRadius: {
        none: '0',
        base: '2px',
        sm: '4px',
        default: '6px',
        item: '8px',
        5: '5px',
        10: '10px',
        container: '16px',
        full: '9999px'
      },
      borderColor: {
        c_ec: '#ecaa71',
        c_ff: '#FFDDB3'
      },
      lineHeight: {
        12: '12px',
        16: '16px'
      },
      inset: {
        16: '16px',
        9: '9px'
      }
    }
  },
  variants: {
    backgroundColor: ['hover', 'group-hover'],
    color: ['hover', 'group-hover'],
    margin: ['first', 'last'],
    rotate: ['group-hover'],
    extend: { rotate: ['group-hover'], color: ['group-hover'] }
  }
}
