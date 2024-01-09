import type { Meta, StoryObj } from "@storybook/react";

import SelectMargin from "./index";
import { useEffect, useState } from "react";

import { Button } from "antd";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/SelectMargin",
  component: SelectMargin,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    isShow: { control: "boolean" },
    // shouldPayMargin: { control: 'text' },
  },
} satisfies Meta<typeof SelectMargin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  args: {
    title: "摘牌预购",
    isShow: true,
    onCancel: () => {},
    data: {
      profitLossAmount: -100,
      useBalance: 100,
      marginRatio: 0.1,
      creditAuthStatus: 10,
      creditReceiveOrderVOList: [
        {
          orderNo: "6029-202312314599",
          orderAmount: 100000000,
          availableAmount: 99999109,
          gmtCreated: 1702881293000,
          orderId: "300001203682",
        },
      ],
      creditBalanceLeft: 0,
      accountBalance: 200,
      creditBalance: 200,
      availableBalance: 200,
    },
    onConfirm: (data) => console.log,
    shouldPayMargin: "300",
  },
} satisfies Story;
