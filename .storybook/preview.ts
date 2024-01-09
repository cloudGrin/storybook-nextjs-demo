import type { Preview } from "@storybook/react";
import '../base.css'
import 'antd/dist/antd.less'
// import 'reactShare/styles/antd-reset.less'
import "../globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
