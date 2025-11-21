
const express = require('express');
const router = express.Router();

// 直接存在記憶體
const signups = [];

function validateSignup(body) {
  const errors = {};

  if (!body.name || body.name.trim() === '') {
    errors.name = '姓名必填';
  }

  if (!body.email || body.email.trim() === '') {
    errors.email = 'Email 必填';
  } else {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(body.email)) {
      errors.email = 'Email 格式不正確';
    }
  }

  if (!body.phone || body.phone.trim() === '') {
    errors.phone = '手機必填';
  }

  if (!body.course || body.course.trim() === '') {
    errors.course = '請選擇課程';
  }

  if (body.agree !== true) {
    errors.agree = '請勾選同意條款';
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

// POST /api/signup
router.post('/', (req, res) => {
  const { isValid, errors } = validateSignup(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: '驗證失敗',
      errors
    });
  }

  const newSignup = {
    id: signups.length + 1,
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    phone: req.body.phone.trim(),
    course: req.body.course.trim(),
    agree: !!req.body.agree,
    createdAt: new Date().toISOString()
  };

  signups.push(newSignup);

  res.status(201).json({
    message: '報名成功',
    data: newSignup,
    total: signups.length
  });
});

// GET /api/signup
router.get('/', (req, res) => {
  res.json({
    total: signups.length,
    data: signups
  });
});

module.exports = router;
