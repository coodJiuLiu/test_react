import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/home/overview',
    method: 'get',
    response: () => ({
      code: 200,
      message: '获取首页数据成功',
      data: {
        welcomeTitle: '欢迎回来，管理员',
        welcomeDescription: '这是您的后台管理首页，您可以在此查看系统概览和快速动态。',
        metrics: [
          { title: '总用户数', value: 112893, suffix: '人' },
          { title: '今日订单', value: 93, suffix: '单' },
          { title: '今日营收', value: 9320, suffix: '元', precision: 2 },
          { title: '增长率', value: 11.28, suffix: '%', precision: 2, trend: 'up' },
        ],
        announcements: [
          { id: '1', content: '系统将于本周六凌晨进行维护，预计耗时 2 小时。' },
          { id: '2', content: '新版本功能已上线，请查看用户管理模块的新增筛选能力。' },
        ],
      },
    }),
  },
] as MockMethod[];
