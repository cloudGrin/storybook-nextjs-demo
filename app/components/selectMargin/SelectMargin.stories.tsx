import type { Meta, StoryObj } from "@storybook/react";

import SelectMargin from "./index";
import { useEffect, useState } from "react";
import { userEvent, within, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { Button, message } from "antd";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/SelectMargin",
  component: SelectMargin,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    // actions: { argTypesRegex: "^on.*" },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    isShow: {
      control: "boolean",
      description: "是否显示",
      table: { disable: true },
    },
    shouldPayMargin: { control: "number", description: "应付保证金" },
    title: { control: "text", description: "标题" },
    data: { control: "object", description: "账户数据" },
    onConfirm: { action: "onConfirm", description: "确认" },
    onCancel: { action: "onCancel", description: "取消" },
  },
  play: async ({ canvasElement, step, args }) => {
    const accountData = args.data;
    const canvas = within(canvasElement);

    // await step("打开弹框", async () => {
    //   const toggleModalBtn = canvas.getByRole("button", {
    //     name: "toggleModal",
    //   });

    //   await userEvent.click(toggleModalBtn);
    // });

    await step("使用余额", async () => {
      const useBalanceCheckbox = await canvas.findByLabelText("使用余额", {
        selector: "input",
      });

      await userEvent.click(useBalanceCheckbox, {
        delay: 500,
      });
    });

    await step("使用收款单，填写对应金额", async () => {
      const paymentReceiptNo1Checkbox = canvasElement.querySelector(
        `input[value='${accountData.creditReceiveOrderVOList![0].orderNo}']`
      );

      await userEvent.click(paymentReceiptNo1Checkbox!, {
        delay: 500,
      });

      const paymentReceiptNo2Checkbox = canvasElement.querySelector(
        `input[value='${accountData.creditReceiveOrderVOList![1].orderNo}']`
      );

      await userEvent.click(paymentReceiptNo2Checkbox!, {
        delay: 500,
      });

      const paymentReceiptNo2Input = canvasElement.querySelector(
        `div[data-orderno='${
          accountData.creditReceiveOrderVOList![1].orderNo
        }'] div:last-child input`
      );

      await userEvent.clear(paymentReceiptNo2Input!);

      await userEvent.type(paymentReceiptNo2Input!, "100", {
        delay: 100,
      });

      const paymentReceiptNo3Checkbox = canvasElement.querySelector(
        `input[value='${accountData.creditReceiveOrderVOList![2].orderNo}']`
      );

      await userEvent.click(paymentReceiptNo3Checkbox!, {
        delay: 500,
      });
    });

    await step("提交", async () => {
      const cancelBtn = canvas.getByRole("button", {
        name: "确定",
      });

      await userEvent.click(cancelBtn, {
        delay: 500,
      });
    });
    await sleep(3500);
    await expect(screen.getByText("提交成功")).toBeInTheDocument();
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isShow, setIsShow] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setIsShow(true);
    }, [setIsShow]);
    return (
      <div
        className="flex justify-center"
        style={{
          width: "1080px",
          height: "500px",
        }}
      >
        <div>
          <p>Press ESC to close modal or click on the close icon!</p>
          <Button onClick={() => setIsShow(!isShow)}>toggleModal</Button>
        </div>
        <SelectMargin
          {...args}
          isShow={isShow}
          getContainer={false}
          onCancel={() => {
            setIsShow(false);
            args.onCancel?.();
          }}
          onConfirm={async (data) => {
            await sleep(3000);
            args.onConfirm?.(data);
            message.success("提交成功");
            setIsShow(false);
          }}
        />
      </div>
    );
  },
  // decorators: [
  //   (Story) => (
  //     <ThemeProvider theme="default">
  //       {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
  //       <Story />
  //     </ThemeProvider>
  //   ),
  // ],
} satisfies Meta<typeof SelectMargin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  args: {
    title: "摘牌预购",
    isShow: false,
    shouldPayMargin: 300,
    data: {
      profitLossAmount: -100,
      useBalance: 100,
      marginRatio: 0.1,
      creditAuthStatus: 10,
      creditReceiveOrderVOList: [
        {
          orderNo: "6029-202312314598",
          orderAmount: 100,
          availableAmount: 58,
          gmtCreated: 1702881193000,
          orderId: "300001203681",
        },
        {
          orderNo: "6029-202312314599",
          orderAmount: 100000000,
          availableAmount: 99999109,
          gmtCreated: 1702881293000,
          orderId: "300001203682",
        },
        {
          orderNo: "6029-202312314600",
          orderAmount: 300,
          availableAmount: 1000,
          gmtCreated: 1702881393000,
          orderId: "300001203683",
        },
      ],
      creditBalanceLeft: 0,
      accountBalance: 200,
      creditBalance: 300,
      availableBalance: 200,
    },
  },
} satisfies Story;

async function sleep(ms: number) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve(true);
    }, ms);
  });
}
