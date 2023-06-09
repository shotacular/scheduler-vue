/* eslint-disable @typescript-eslint/no-var-requires */
const delay = require('mocker-api/lib/delay');

const proxy = {
  'GET /api/profile': (req, res) => {
    return res.status(200).json({
      userId: '66006d29-727e-4ed8-a3c8-95d4438f66d4',
      userName: 'shota',
      nickname: '翔太',
      themeColor: '#4caf50',
      hasAvatar: false,
      mailAddress: 'shota@example.com',
    });
  },
  'PATCH /api/profile': (req, res) => {
    if (req.body.userName === 'fune') {
      return res.status(422).json({
        title: 'このユーザー名は既に使用されています。',
      });
    }
    return res.status(200).json();
  },
};

// 1秒遅延させる
module.exports = delay(proxy, 1000);
