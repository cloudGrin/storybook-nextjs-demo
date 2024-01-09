/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

interface ApiTypes {
  ['market.service.getCreditAccountLimit']: MarketServiceGetCreditAccountLimit
}

interface MarketServiceGetCreditAccountLimit {
  request: MarketServiceGetCreditAccountLimitRequest
  response: MarketServiceGetCreditAccountLimitResponse
}

// @ts-ignore
type FileData = File

/**
 * 接口 [test__market.service.getCreditAccountLimit↗](http://yapi.zhaogangrentest.com/project/12/interface/api/194189) 的 **请求类型**
 *
 * @分类 [market↗](http://yapi.zhaogangrentest.com/project/12/interface/api/cat_3435)
 * @请求头 `POST /market/service/getCreditAccountLimit`
 * @更新时间 `2024-01-04 17:36:03`
 */
interface MarketServiceGetCreditAccountLimitRequest {
  /**
   * 查询参数
   */
  param?: {
    /**
     * 客户编号
     */
    orgId?: number
    /**
     * 交货日期
     */
    deliveryDateTime?: number
    /**
     * 当前页码，默认：1
     */
    pageNo?: number
    /**
     * 每页展示数，默认：40
     */
    pageSize?: number
    /**
     * 是否分页, 默认：是
     */
    paging?: boolean
  }
}

/**
 * 接口 [test__market.service.getCreditAccountLimit↗](http://yapi.zhaogangrentest.com/project/12/interface/api/194189) 的 **返回类型**
 *
 * @分类 [market↗](http://yapi.zhaogangrentest.com/project/12/interface/api/cat_3435)
 * @请求头 `POST /market/service/getCreditAccountLimit`
 * @更新时间 `2024-01-04 17:36:03`
 */
interface MarketServiceGetCreditAccountLimitResponse {
  /**
   * 额度管控状态 10-启用 20-禁用
   */
  creditAuthStatus?: number
  /**
   * 保证金比例（计算保证金用）
   */
  marginRatio?: number
  /**
   * 可用额度=账户余额+免保额度-已用额度
   */
  availableBalance?: number
  /**
   * 账户额度-TP账户余额
   */
  accountBalance?: number
  /**
   * 免保额度-运营后台配置
   */
  creditBalance?: number
  /**
   * 免保额度-剩余未使用
   */
  creditBalanceLeft?: number
  /**
   * 已用额度=锁货占用额度+订单占用额度
   */
  useBalance?: number
  /**
   * 盈亏金额
   */
  profitLossAmount?: number
  /**
   * 收款单
   */
  creditReceiveOrderVOList?: {
    /**
     * 收款单号
     */
    orderNo?: string
    /**
     * 收款单ID
     */
    orderId?: string
    /**
     * 到款金额
     */
    orderAmount?: number
    /**
     * 可用余额
     */
    availableAmount?: number
    /**
     * 到款时间
     */
    gmtCreated?: number
  }[]
}

/* prettier-ignore-end */
