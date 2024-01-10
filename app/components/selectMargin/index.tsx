// import InfoError from '@/assets/icons/error-info.svg?sprite'
import { Input, Modal, Tooltip } from "antd";
import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { Checkbox, Table, message } from "antd";
import { toThousands } from "@/utils/format/toThousands";
import { Big } from "big.js";
import IconInfo from "@/assets/icons/info.svg?sprite";
import dayjs from "dayjs";

export default forwardRef(function SelectMargin(
  {
    isShow,
    onCancel,
    title,
    onConfirm,
    data,
    shouldPayMargin,
    getContainer,
  }: {
    /**
     * 是否显示
     */
    isShow: boolean;
    /**
     * 标题
     */
    title: string;
    /**
     * 应付保证金
     */
    shouldPayMargin: string | number;
    /**
     * 账户数据
     */
    data: ApiTypes["market.service.getCreditAccountLimit"]["response"];
    /**
     * 确认
     */
    onConfirm?: (data: any) => void;
    /**
     * 取消
     */
    onCancel?: () => void;
    /**
     * Modal 挂载位置
     */
    getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  },
  ref
) {
  const [isSelectBalance, setIsSelectBalance] = useState(false);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // 盈亏
  const dir = new Big(data?.profitLossAmount || 0).lt(0)
    ? "-"
    : new Big(data?.profitLossAmount || 0).gt(0)
    ? "+"
    : "";

  // 剩余额度 (免保额度-已用额度+盈亏，有可能是负的)
  const balance = new Big(data?.creditBalance || 0)
    .minus(data?.useBalance || 0)
    .plus(data?.profitLossAmount || 0)
    .toNumber();
  // 展示时用的剩余额度
  const showBalance = Math.max(balance, 0);
  // 是否使用余额
  const isNeedUseBalance = new Big(showBalance).lt(shouldPayMargin);
  // 本次使用多少额度
  const useBalance = isNeedUseBalance ? showBalance : shouldPayMargin;
  // 账户总余额
  const totalBalance = useMemo(() => {
    const total = data?.creditReceiveOrderVOList?.reduce((acc, item) => {
      return acc.plus(item.availableAmount || 0);
    }, new Big(0));
    if (total) {
      return total.toNumber();
    }
    return 0;
  }, [data]);
  // 需要使用多少余额
  const needUseBalance = isNeedUseBalance
    ? new Big(shouldPayMargin).minus(showBalance).toNumber()
    : 0;
  // 余额可用金额（当免保额度小于已用额度时，扣除差值）
  const availableBalance =
    balance < 0 ? new Big(totalBalance).plus(balance).toNumber() : totalBalance;

  // 收款单号对应使用的金额
  const [orderNoToAmount, setOrderNoToAmount] = useState<
    Record<string, string>
  >({});

  // 去掉totalUseAmount中未选中的收款单
  const totalUseAmountOmitUnSelected = useMemo<Record<string, string>>(() => {
    return Object.entries(orderNoToAmount).reduce((acc, [key, value]) => {
      if (selectedRows.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  }, [orderNoToAmount, selectedRows]);

  const selectRow = (e: any) => {
    const orderNo = e.target.value;
    if (selectedRows.includes(orderNo)) {
      setSelectedRows(selectedRows.filter((item) => item !== orderNo));
      setOrderNoToAmount({
        ...orderNoToAmount,
        [orderNo]: "",
      });
    } else {
      setSelectedRows([...selectedRows, orderNo]);
      // 当前收款单可用余额
      const availableAmount =
        data?.creditReceiveOrderVOList?.find((i) => i.orderNo === orderNo)
          ?.availableAmount || 0;

      // 所有收款单已填写的使用金额合计
      const totalUseAmount =
        Object.values(totalUseAmountOmitUnSelected).reduce(
          (acc: any, item: any) => {
            return new Big(acc || 0).plus(item || 0).toNumber() as any;
          },
          0
        ) || 0;
      // 还需要填写多少余额
      const needInputUseBalance = new Big(needUseBalance)
        .minus(totalUseAmount)
        .toNumber();
      // 最多可填写多少余额（免保额度小于已用额度时，需要扣除）
      const maxInputUseBalance = new Big(availableBalance)
        .minus(totalUseAmount)
        .toNumber();
      // 当前收款单最多可填写的余额
      const maxAvailableAmount = Math.min(
        maxInputUseBalance,
        needInputUseBalance,
        availableAmount
      );
      if (
        new Big(maxAvailableAmount).gte(needInputUseBalance) &&
        maxAvailableAmount > 0
      ) {
        message.info("已经可以足额支付");
      }
      if (needInputUseBalance <= 0) {
        setSelectedRows((rows) => {
          const a = [...rows];
          a.splice(a.length - 1, 1);
          return a;
        });
        message.info("当前已经可以足额支付");
      }
      // 设置当前选中的收款单号对应的金额
      setOrderNoToAmount({
        ...orderNoToAmount,
        [orderNo]: maxAvailableAmount < 0 ? 0 : maxAvailableAmount,
      });
    }
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  const onSubmit = async () => {
    setConfirmLoading(true);
    // 所有收款单已填写的使用金额合计
    const totalUseAmount =
      Object.values(totalUseAmountOmitUnSelected).reduce(
        (acc: any, item: any) => {
          return new Big(acc || 0).plus(item || 0).toNumber() as any;
        },
        0
      ) || 0;

    if (new Big(totalUseAmount).eq(needUseBalance)) {
      try {
        await onConfirm?.({
          receiveOrderUseParamList: Object.entries(
            totalUseAmountOmitUnSelected
          ).map(([key, value]) => {
            return {
              orderNo: key,
              useAmount: value,
              orderId: data?.creditReceiveOrderVOList?.find(
                (i) => i.orderNo === key
              )?.orderId,
            };
          }),
          balance: useBalance,
        });
        setSelectedRows([]);
        setOrderNoToAmount({});
        setIsSelectBalance(false);
      } catch (error) {
        console.log(error);
      } finally {
        setConfirmLoading(false);
      }
    } else {
      message.error("使用余额支付的金额与应付金额不一致");
      setConfirmLoading(false);
    }
  };

  const onCloseDialog = () => {
    onCancel?.();
    setSelectedRows([]);
    setOrderNoToAmount({});
    setIsSelectBalance(false);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        clean() {
          setSelectedRows([]);
          setOrderNoToAmount({});
          setIsSelectBalance(false);
        },
      };
    },
    [setSelectedRows, setOrderNoToAmount, setIsSelectBalance]
  );

  return (
    <Modal
      title={title}
      visible={isShow}
      wrapClassName="antd-dialog-wrap"
      bodyStyle={{
        padding: 30,
        paddingBottom: 10,
        paddingTop: 12,
      }}
      width={840}
      onCancel={onCloseDialog}
      okText="确定 "
      cancelText="取消 "
      onOk={onSubmit}
      confirmLoading={confirmLoading}
      getContainer={getContainer}
    >
      <div className="font-medium leading-none text-center text-14 text-c_level_2">
        应付保证金
      </div>
      <div className="flex items-baseline justify-center mt-10 leading-none text-c_level_1">
        <span className="font-semibold text-24">
          {" "}
          {toThousands(Number(shouldPayMargin))}
        </span>
        <span className="font-medium text-14">元</span>
      </div>
      <div className="mt-36">
        <div className="flex items-center justify-between h-48 pr-12 pl-18 bg-c_level_5 rounded-item">
          <div className="flex items-center options">
            <Checkbox checked disabled className="">
              <span className="font-medium text-16 text-c_level_1">
                额度抵扣
              </span>
            </Checkbox>
            <span className="ml-21 text-13 text-c_level_1">免保额度</span>
            <span className="ml-8 font-medium text-14 text-c_level_1">
              {toThousands(Number(data?.creditBalance || 0))}
            </span>
            <span className="text-12 text-c_level_1">元</span>
            <span className="ml-10 text-c_level_3">已用额度</span>
            <span className="ml-6 text-c_level_3">{`${toThousands(
              Number(data?.useBalance || 0)
            )}元`}</span>
            <span className="ml-10 text-c_level_3">盈亏金额</span>
            <span
              className="ml-6 text-c_level_3"
              style={{
                color:
                  dir === "-" ? "#63B115" : dir === "+" ? "#D0111A" : "#6c7280",
              }}
            >{`${dir === "-" ? "" : dir}${
              data?.profitLossAmount
                ? toThousands(data?.profitLossAmount || 0)
                : "0"
            }元`}</span>
          </div>
          <div
            className="flex items-baseline font-medium"
            style={{ color: Number(useBalance) > 0 ? "#CC7830" : "#AAB1C1" }}
          >
            <span className="text-18">{toThousands(Number(useBalance))}</span>
            <span className="text-14">元</span>
          </div>
        </div>
        <div className="mt-10 bg-c_level_5 rounded-item pb-9">
          <div
            className="flex items-center justify-between h-48 pr-12 border-b border-solid pl-18"
            style={{ borderColor: "#E6EAF2" }}
          >
            <div className="flex items-center options">
              <Checkbox
                checked={isSelectBalance}
                className=""
                disabled={
                  !isNeedUseBalance || !data?.creditReceiveOrderVOList?.length
                }
                onChange={() => setIsSelectBalance(!isSelectBalance)}
              >
                <span className="font-medium text-16 text-c_level_1">
                  使用余额
                </span>
              </Checkbox>
              {isNeedUseBalance && !!data?.creditReceiveOrderVOList?.length ? (
                <>
                  <span className="ml-21 text-13 text-c_level_1">账户余额</span>
                  <span className="ml-8 font-medium text-14 text-c_level_1">
                    {toThousands(totalBalance)}
                  </span>
                  <span className="text-12 text-c_level_1">元</span>
                  <span className="text-c_level_3 ml-11">本次可用金额</span>
                  <span className="ml-6 text-c_level_3">{`${toThousands(
                    availableBalance
                  )}元`}</span>
                  {balance < 0 && (
                    <Tooltip
                      title="[已用额度]大于[免保额度]和[盈亏]的部分会占用账户的[余额]"
                      placement="top"
                    >
                      <IconInfo
                        className="ml-5 cursor-pointer"
                        width="12px"
                        height="12px"
                      />
                    </Tooltip>
                  )}
                </>
              ) : null}
            </div>
            <div
              className="flex items-baseline font-semibold"
              style={{ color: false ? "#AAB1C1" : "#CC7830" }}
            >
              <span className="text-18">{toThousands(needUseBalance)}</span>
              <span className="text-14">元</span>
            </div>
          </div>
          {isSelectBalance && (
            <div
              className="overflow-y-auto border rounded-item bg-c_white mt-9 ml-9 mr-9"
              style={{ borderColor: "#E6EAF2", maxHeight: "260px" }}
            >
              <div
                className="flex items-center h-32 pr-3 leading-none border-b text-c_level_3"
                style={{ borderColor: "#E6EAF2" }}
              >
                <div className="w-45" />
                <div style={{ width: "138px" }}>到款单号</div>
                <div style={{ width: "138px" }}>到款时间</div>
                <div style={{ width: "126px" }}>到款金额</div>
                <div style={{ width: "126px" }} className="text-right">
                  可用余额(元)
                </div>
                <div style={{ flexBasis: "161px" }} className="flex-1 ml-26">
                  本次使用金额
                </div>
              </div>
              <div>
                {data?.creditReceiveOrderVOList?.map((item) => (
                  <div
                    key={item.orderNo}
                    data-orderno={item.orderNo}
                    className="flex items-center pr-3 border-b h-39 text-c_level_2"
                    style={{ borderColor: "#E6EAF2" }}
                  >
                    <div className="pl-16 w-45">
                      <Checkbox
                        value={item.orderNo}
                        checked={selectedRows.includes(item.orderNo)}
                        onChange={selectRow}
                      />
                    </div>
                    <div style={{ width: "138px" }} className="">
                      {item.orderNo}
                    </div>
                    <div style={{ width: "138px" }}>
                      {dayjs(item.gmtCreated).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div style={{ width: "126px" }}>
                      {toThousands(item.orderAmount || 0)}
                    </div>
                    <div
                      style={{ width: "126px" }}
                      className="font-medium text-right text-14"
                    >
                      {toThousands(item.availableAmount || 0)}
                    </div>
                    <div
                      style={{ flexBasis: "161px" }}
                      className="flex-1 ml-26"
                    >
                      <div
                        className={`flex items-center overflow-hidden border rounded h-34  ${
                          selectedRows.includes(item.orderNo)
                            ? "hover:border-c_primary_1 border-c_line_1"
                            : "bg-c_bg_1 border-c_line_1"
                        }`}
                      >
                        <Input
                          bordered={false}
                          placeholder={
                            selectedRows.includes(item.orderNo) ? "请输入" : ""
                          }
                          value={orderNoToAmount[item.orderNo!] || ""}
                          onChange={(e) =>
                            setOrderNoToAmount({
                              ...orderNoToAmount,
                              [item.orderNo!]: e.target.value,
                            })
                          }
                          disabled={!selectedRows.includes(item.orderNo)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .options :global(.ant-checkbox-inner) {
            width: 18px;
            height: 18px;
          }
          .options :global(.ant-checkbox-inner::after) {
            left: 30%;
          }
          .options :global(.ant-checkbox + span) {
            padding-left: 12px;
            padding-right: 0;
          }
        `}
      </style>
    </Modal>
  );
});
