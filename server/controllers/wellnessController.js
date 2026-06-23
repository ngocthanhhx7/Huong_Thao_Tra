const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/User');
const Order = require('../models/Order');
const Tea = require('../models/Tea');
const ChatHistory = require('../models/ChatHistory');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const AiMixConfig = require('../models/AiMixConfig');
const ProActivation = require('../models/ProActivation');
const HealthLog = require('../models/HealthLog');
const TeaJournal = require('../models/TeaJournal');
const Streak = require('../models/Streak');
const DrinkSuggestion = require('../models/DrinkSuggestion');
const Exercise = require('../models/Exercise');
const WorkoutPlan = require('../models/WorkoutPlan');
const Challenge = require('../models/Challenge');
const FamilyProfile = require('../models/FamilyProfile');
const PushSubscription = require('../models/PushSubscription');
const SuspiciousFlag = require('../models/SuspiciousFlag');
const Ingredient = require('../models/Ingredient');
const { createNotification } = require('../utils/notificationHelper');
const { getGeminiModel } = require('../config/gemini');
const { hasUserPurchasedTea } = require('../utils/purchaseHelper');
const { createPayosPaymentLink } = require('../utils/payosHelper');

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getDateDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

// ---------------------------------------------------------------------------
// STREAK HELPERS (internal)
// ---------------------------------------------------------------------------
const updateStreak = async (userId) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  let streak = await Streak.findOne({ user: userId });
  if (!streak) {
    streak = await Streak.create({ user: userId });
  }

  grantWeeklyFreeze(streak);

  if (streak.lastLogDate === today) {
    return streak;
  }

  if (streak.lastLogDate === yesterday) {
    streak.currentStreak += 1;
  } else if (!streak.lastLogDate) {
    streak.currentStreak = 1;
  } else {
    const lastDate = new Date(streak.lastLogDate);
    const yesterdayDate = new Date(yesterday);
    if (lastDate < yesterdayDate) {
      if (streak.streakFreezes > 0) {
        streak.streakFreezes -= 1;
      } else {
        streak.currentStreak = 1;
      }
    }
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastLogDate = today;

  if (streak.currentStreak >= 7 && !streak.achievements.includes('7_day')) {
    streak.achievements.push('7_day');
  }
  if (streak.currentStreak >= 30 && !streak.achievements.includes('30_day')) {
    streak.achievements.push('30_day');
  }
  if (streak.currentStreak >= 100 && !streak.achievements.includes('100_day')) {
    streak.achievements.push('100_day');
  }

  await streak.save();
  return streak;
};

const recalculateStreak = async (userId) => {
  const entries = await TeaJournal.find({ user: userId })
    .sort({ drunkAt: 1 })
    .lean();

  if (!entries.length) {
    await Streak.findOneAndUpdate(
      { user: userId },
      { currentStreak: 0, lastLogDate: null },
      { upsert: true }
    );
    return;
  }

  const dateSet = new Set();
  entries.forEach((entry) => {
    dateSet.add(new Date(entry.drunkAt).toISOString().split('T')[0]);
  });

  const sortedDates = Array.from(dateSet).sort();
  const today = getTodayDateString();

  let currentStreak = 0;
  let longestStreak = 0;
  let run = 0;
  let expected = null;

  for (const dateStr of sortedDates) {
    const dateObj = new Date(dateStr);
    if (expected === null) {
      run = 1;
      expected = new Date(dateObj);
    } else {
      expected.setDate(expected.getDate() + 1);
      const expectedStr = expected.toISOString().split('T')[0];
      if (dateStr === expectedStr) {
        run += 1;
      } else {
        run = 1;
        expected = new Date(dateObj);
      }
    }
    if (run > longestStreak) {
      longestStreak = run;
    }
  }

  const lastDate = sortedDates[sortedDates.length - 1];
  if (lastDate === today || lastDate === getYesterdayDateString()) {
    currentStreak = run;
  } else {
    currentStreak = 0;
  }

  const achievements = [];
  if (longestStreak >= 7) achievements.push('7_day');
  if (longestStreak >= 30) achievements.push('30_day');
  if (longestStreak >= 100) achievements.push('100_day');

  const existing = await Streak.findOne({ user: userId });
  const freezes = existing ? existing.streakFreezes : 0;
  const lastFreezeGrantedAt = existing ? existing.lastFreezeGrantedAt : null;

  await Streak.findOneAndUpdate(
    { user: userId },
    {
      currentStreak,
      longestStreak,
      lastLogDate: lastDate,
      achievements,
      streakFreezes: freezes,
      lastFreezeGrantedAt,
    },
    { upsert: true }
  );
};

const grantWeeklyFreeze = (streakDoc) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(monday.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

  if (
    !streakDoc.lastFreezeGrantedAt ||
    new Date(streakDoc.lastFreezeGrantedAt) < monday
  ) {
    streakDoc.streakFreezes = Math.min(1, streakDoc.streakFreezes + 1);
    streakDoc.lastFreezeGrantedAt = now;
  }
};

// ---------------------------------------------------------------------------
// PRO MANAGEMENT
// ---------------------------------------------------------------------------

// @desc    Get current user's pro status
// @route   GET /api/wellness/pro/status
// @access  Private
const getProStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('pro');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let { isPro, proExpiry, proPlan, proActivatedAt } = user.pro;

    if (proExpiry && new Date(proExpiry) <= new Date()) {
      isPro = false;
      proExpiry = null;
      user.pro.isPro = false;
      user.pro.proExpiry = null;
      await user.save();
    }

    let daysRemaining = 0;
    if (isPro && proExpiry) {
      const diff = new Date(proExpiry).getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    res.json({ isPro, proExpiry, proPlan, proActivatedAt, daysRemaining });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auto-activate pro from paid orders
// @route   POST /api/wellness/pro/activate-from-orders
// @access  Private
const activateProFromOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    if (user.pro.isPro && user.pro.proExpiry && new Date(user.pro.proExpiry) > now) {
      const diff = Math.ceil(
        (new Date(user.pro.proExpiry).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return res.json({
        activated: false,
        message: 'Bạn đã có gói Pro đang hoạt động',
        daysAdded: 0,
        newExpiry: user.pro.proExpiry,
        daysRemaining: diff,
      });
    }

    const paidOrders = await Order.find({
      user: req.user._id,
      orderType: 'regular',
      isPaid: true,
    });

    if (!paidOrders.length) {
      return res.json({
        activated: false,
        message: 'Không có đơn hàng nào đã thanh toán để kích hoạt Pro',
        daysAdded: 0,
        newExpiry: user.pro.proExpiry,
      });
    }

    const existingActivations = await ProActivation.find({
      user: req.user._id,
      orderId: { $in: paidOrders.map((o) => o._id) },
      isRevoked: false,
    });

    const activatedOrderIds = new Set(
      existingActivations.map((a) => a.orderId.toString())
    );

    const newOrders = paidOrders.filter(
      (o) => !activatedOrderIds.has(o._id.toString())
    );

    if (!newOrders.length) {
      return res.json({
        activated: false,
        message: 'Tất cả đơn hàng đã được kích hoạt Pro trước đó',
        daysAdded: 0,
        newExpiry: user.pro.proExpiry,
      });
    }

    let currentExpiry =
      user.pro.proExpiry && new Date(user.pro.proExpiry) > now
        ? new Date(user.pro.proExpiry)
        : now;

    let totalDays = 0;

    for (const order of newOrders) {
      await ProActivation.create({
        user: req.user._id,
        source: 'order_purchase',
        daysAdded: 30,
        orderId: order._id,
      });

      totalDays += 30;
      currentExpiry.setDate(currentExpiry.getDate() + 30);

      const orderCode = order._id.toString().slice(-6).toUpperCase();
      await createNotification({
        recipient: req.user._id,
        type: 'pro_activated',
        title: 'Pro đã được kích hoạt',
        message: `Chúc mừng! Bạn được tặng 30 ngày dùng Pro miễn phí từ đơn hàng #${orderCode}`,
        link: '/wellness/pro',
        actor: req.user._id,
      });
    }

    user.pro.isPro = true;
    user.pro.proExpiry = currentExpiry;
    user.pro.proPlan = 'purchase_bonus';
    user.pro.proActivatedAt = now;
    await user.save();

    res.json({
      activated: true,
      daysAdded: totalDays,
      newExpiry: currentExpiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Purchase a pro subscription
// @route   POST /api/wellness/pro/purchase
// @access  Private
const purchasePro = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !['monthly', 'six_months'].includes(plan)) {
      return res
        .status(400)
        .json({ message: 'Gói không hợp lệ. Chọn monthly hoặc six_months' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const planConfig = {
      monthly: { price: 39000, days: 30, label: 'Gói Pro 1 tháng' },
      six_months: { price: 180000, days: 180, label: 'Gói Pro 6 tháng' },
    };

    const config = planConfig[plan];
    const now = new Date();

    const order = await Order.create({
      user: req.user._id,
      orderItems: [
        {
          name: config.label,
          qty: 1,
          image: '',
          price: config.price,
          tea: null,
        },
      ],
      shippingAddress: {
        receiverName: user.name,
        receiverPhone: '0000000000',
        address: 'Sản phẩm số',
        city: 'Hà Nội',
        postalCode: '100000',
      },
      paymentMethod: 'PayOS',
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: config.price,
      orderType: 'pro_subscription',
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          changedAt: now,
          changedBy: req.user._id,
          note: 'Đặt mua gói Pro',
        },
      ],
    });

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: config.price,
      paymentMethod: 'PayOS',
      transactionId: `PRO-${order._id}-${Date.now()}`,
      status: 'Pending',
    });

    const { paymentLink } = await createPayosPaymentLink({
      order,
      user,
    });

    payment.transactionId = String(paymentLink.orderCode);
    payment.paymentLinkId = paymentLink.paymentLinkId || '';
    payment.checkoutUrl = paymentLink.checkoutUrl || paymentLink.paymentLink;
    await payment.save();

    res.status(201).json({
      checkoutUrl: payment.checkoutUrl,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pro activation history
// @route   GET /api/wellness/pro/history
// @access  Private
const getProHistory = async (req, res) => {
  try {
    const activations = await ProActivation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderId', 'orderItems totalPrice')
      .populate('activatedBy', 'name');

    res.json(activations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// HEALTH LOGS
// ---------------------------------------------------------------------------

// @desc    Get health logs
// @route   GET /api/wellness/health/logs
// @access  Private
const getHealthLogs = async (req, res) => {
  try {
    const from = req.query.from || getDateDaysAgo(30);
    const to = req.query.to || getTodayDateString();

    const logs = await HealthLog.find({
      user: req.user._id,
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update a health log
// @route   POST /api/wellness/health/log
// @access  Private
const createHealthLog = async (req, res) => {
  try {
    const { date, weight, sleepHours, stress, heartRate, waterGlasses, exerciseMinutes, mood, source } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    let drankTea = req.body.drankTea;
    if (drankTea === undefined || drankTea === null) {
      const journalEntry = await TeaJournal.findOne({
        user: req.user._id,
        drunkAt: {
          $gte: new Date(`${date}T00:00:00.000Z`),
          $lte: new Date(`${date}T23:59:59.999Z`),
        },
      });
      drankTea = Boolean(journalEntry);
    }

    const log = await HealthLog.findOneAndUpdate(
      { user: req.user._id, date },
      {
        user: req.user._id,
        date,
        weight,
        sleepHours,
        stress,
        heartRate,
        waterGlasses,
        exerciseMinutes,
        mood,
        drankTea,
        source: source || 'manual',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get health summary with Body-Mind Score
// @route   GET /api/wellness/health/summary
// @access  Private
const getHealthSummary = async (req, res) => {
  try {
    const today = getTodayDateString();
    const todayLog = await HealthLog.findOne({
      user: req.user._id,
      date: today,
    });

    let score = 0;
    let category = 'unknown';
    const components = {
      sleep: 0,
      stress: 0,
      exercise: 0,
      water: 0,
      tea: 0,
      mood: 0,
    };

    if (todayLog) {
      if (todayLog.sleepHours !== null && todayLog.sleepHours !== undefined) {
        const s = todayLog.sleepHours;
        if (s >= 7 && s <= 8) components.sleep = 100;
        else if (s < 4) components.sleep = 0;
        else if (s < 7) components.sleep = ((s - 4) / 3) * 100;
        else components.sleep = Math.max(0, 100 - (s - 8) * 20);
      }

      if (todayLog.stress !== null && todayLog.stress !== undefined) {
        const s = todayLog.stress;
        if (s <= 3) components.stress = 100;
        else if (s >= 8) components.stress = 0;
        else components.stress = ((8 - s) / 5) * 100;
      }

      if (todayLog.exerciseMinutes !== null && todayLog.exerciseMinutes !== undefined) {
        const m = todayLog.exerciseMinutes;
        components.exercise = Math.min(100, (m / 30) * 100);
      }

      if (todayLog.waterGlasses !== null && todayLog.waterGlasses !== undefined) {
        components.water = Math.min(100, (todayLog.waterGlasses / 8) * 100);
      }

      components.tea = todayLog.drankTea ? 100 : 0;

      const moodMap = { awful: 0, bad: 25, okay: 50, good: 75, great: 100 };
      if (todayLog.mood && moodMap[todayLog.mood] !== undefined) {
        components.mood = moodMap[todayLog.mood];
      }

      score = Math.round(
        components.sleep * 0.25 +
          components.stress * 0.25 +
          components.exercise * 0.2 +
          components.water * 0.1 +
          components.tea * 0.1 +
          components.mood * 0.1
      );

      if (score >= 80) category = 'excellent';
      else if (score >= 60) category = 'good';
      else if (score >= 40) category = 'fair';
      else category = 'needs_attention';
    }

    const sevenDaysAgo = getDateDaysAgo(7);
    const thirtyDaysAgo = getDateDaysAgo(30);

    const recentLogs = await HealthLog.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo, $lte: today },
    }).sort({ date: 1 });

    const calcAvg = (logs, field) => {
      const vals = logs.map((l) => l[field]).filter((v) => v !== null && v !== undefined);
      return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
    };

    const calcAvgScore = (logs) => {
      if (!logs.length) return null;
      let total = 0;
      for (const log of logs) {
        const s = calcLogScore(log);
        total += s;
      }
      return Math.round(total / logs.length);
    };

    const calcLogScore = (log) => {
      let s = 0;
      if (log.sleepHours !== null && log.sleepHours !== undefined) {
        const sh = log.sleepHours;
        s += (sh >= 7 && sh <= 8 ? 100 : sh < 4 ? 0 : sh < 7 ? ((sh - 4) / 3) * 100 : Math.max(0, 100 - (sh - 8) * 20)) * 0.25;
      }
      if (log.stress !== null && log.stress !== undefined) {
        const st = log.stress;
        s += (st <= 3 ? 100 : st >= 8 ? 0 : ((8 - st) / 5) * 100) * 0.25;
      }
      if (log.exerciseMinutes !== null && log.exerciseMinutes !== undefined) {
        s += Math.min(100, (log.exerciseMinutes / 30) * 100) * 0.2;
      }
      if (log.waterGlasses !== null && log.waterGlasses !== undefined) {
        s += Math.min(100, (log.waterGlasses / 8) * 100) * 0.1;
      }
      s += (log.drankTea ? 100 : 0) * 0.1;
      const moodMap = { awful: 0, bad: 25, okay: 50, good: 75, great: 100 };
      if (log.mood && moodMap[log.mood] !== undefined) {
        s += moodMap[log.mood] * 0.1;
      }
      return Math.round(s);
    };

    const last7 = recentLogs.filter((l) => l.date >= sevenDaysAgo);
    const last30 = recentLogs.filter((l) => l.date >= thirtyDaysAgo);

    const trends = {
      weekly: {
        avgScore: calcAvgScore(last7),
        avgSleep: calcAvg(last7, 'sleepHours'),
        avgStress: calcAvg(last7, 'stress'),
        avgExercise: calcAvg(last7, 'exerciseMinutes'),
        avgWater: calcAvg(last7, 'waterGlasses'),
      },
      monthly: {
        avgScore: calcAvgScore(last30),
        avgSleep: calcAvg(last30, 'sleepHours'),
        avgStress: calcAvg(last30, 'stress'),
        avgExercise: calcAvg(last30, 'exerciseMinutes'),
        avgWater: calcAvg(last30, 'waterGlasses'),
      },
    };

    const streak = await Streak.findOne({ user: req.user._id });

    res.json({
      score,
      category,
      today: todayLog,
      trends,
      currentStreak: streak ? streak.currentStreak : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// TEA JOURNAL
// ---------------------------------------------------------------------------

// @desc    Get journal entries
// @route   GET /api/wellness/journal
// @access  Private
const getJournalEntries = async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    const filter = { user: req.user._id };

    if (from || to) {
      filter.drunkAt = {};
      if (from) filter.drunkAt.$gte = new Date(from);
      if (to) filter.drunkAt.$lte = new Date(`${to}T23:59:59.999Z`);
    }

    const entries = await TeaJournal.find(filter)
      .sort({ drunkAt: -1 })
      .populate('tea', 'name image price benefits');

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a journal entry
// @route   POST /api/wellness/journal
// @access  Private
const createJournalEntry = async (req, res) => {
  try {
    const { tea, teaName, drunkAt, mood, rating, bodyFeelings, note, photo } = req.body;

    if (!drunkAt) {
      return res.status(400).json({ message: 'drunkAt is required' });
    }

    const entry = await TeaJournal.create({
      user: req.user._id,
      tea: tea || null,
      teaName: teaName || '',
      drunkAt,
      mood,
      rating,
      bodyFeelings: bodyFeelings || [],
      note: note || '',
      photo: photo || '',
    });

    await updateStreak(req.user._id);

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a journal entry
// @route   PUT /api/wellness/journal/:id
// @access  Private
const updateJournalEntry = async (req, res) => {
  try {
    const entry = await TeaJournal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { tea, teaName, drunkAt, mood, rating, bodyFeelings, note, photo } = req.body;

    if (tea !== undefined) entry.tea = tea;
    if (teaName !== undefined) entry.teaName = teaName;
    if (drunkAt !== undefined) entry.drunkAt = drunkAt;
    if (mood !== undefined) entry.mood = mood;
    if (rating !== undefined) entry.rating = rating;
    if (bodyFeelings !== undefined) entry.bodyFeelings = bodyFeelings;
    if (note !== undefined) entry.note = note;
    if (photo !== undefined) entry.photo = photo;

    await entry.save();

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/wellness/journal/:id
// @access  Private
const deleteJournalEntry = async (req, res) => {
  try {
    const entry = await TeaJournal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await entry.deleteOne();

    await recalculateStreak(req.user._id);

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get streak info
// @route   GET /api/wellness/journal/streak
// @access  Private
const getStreakInfo = async (req, res) => {
  try {
    let streak = await Streak.findOne({ user: req.user._id });

    if (!streak) {
      streak = await Streak.create({ user: req.user._id });
    }

    grantWeeklyFreeze(streak);
    await streak.save();

    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      streakFreezes: streak.streakFreezes,
      achievements: streak.achievements,
      lastLogDate: streak.lastLogDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// DRINK SUGGESTIONS
// ---------------------------------------------------------------------------

// @desc    Get weather-based drink suggestion
// @route   GET /api/wellness/suggest/drink
// @access  Private
const getDrinkSuggestion = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 21.0285;
    const lng = parseFloat(req.query.lng) || 105.8542;

    let weather = {
      temp: 25,
      humidity: 70,
      code: 0,
      wind: 5,
      city: 'Hà Nội',
      lat,
      lng,
    };

    try {
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      const current = weatherRes.data?.current;
      if (current) {
        weather.temp = current.temperature_2m ?? weather.temp;
        weather.humidity = current.relative_humidity_2m ?? weather.humidity;
        weather.code = current.weather_code ?? weather.code;
        weather.wind = current.wind_speed_10m ?? weather.wind;
      }
    } catch (err) {
      console.error('Weather fetch failed, using defaults:', err.message);
    }

    const teas = await Tea.find({ isPublished: true }).limit(20).lean();

    let healthContext = '';
    const todayLog = await HealthLog.findOne({
      user: req.user._id,
      date: getTodayDateString(),
    });
    if (todayLog) {
      healthContext = `Người dùng hôm nay: ngủ ${todayLog.sleepHours || '?'} giờ, stress ${todayLog.stress || '?'}/10, vận động ${todayLog.exerciseMinutes || 0} phút, uống ${todayLog.waterGlasses || 0} ly nước, tâm trạng: ${todayLog.mood || 'không rõ'}. `;
    }

    const teaList = teas
      .map(
        (t, i) =>
          `${i + 1}. ${t.name} - ${t.description} - Lợi ích: ${(t.benefits || []).join(', ')} - Giá: ${t.price}đ`
      )
      .join('\n');

    const prompt = `Bạn là chuyên gia trà thảo mộc. Dựa trên thời tiết hiện tại (${weather.temp}°C, độ ẩm ${weather.humidity}%, gió ${weather.wind} m/s) và danh sách trà dưới đây, hãy gợi ý 1-3 loại trà phù hợp nhất. ${healthContext}

Danh sách trà:
${teaList}

Trả lời bằng tiếng Việt, định dạng JSON:
{
  "suggestions": [
    { "teaName": "Tên trà", "reason": "Lý do ngắn gọn" }
  ]
}`;

    let suggestions = [];
    try {
      const model = getGeminiModel({ generationConfig: { temperature: 0.7, maxOutputTokens: 512 } });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions;
        }
      }
    } catch (err) {
      console.error('Gemini suggestion failed:', err.message);
      suggestions = [{ teaName: 'Trà hoa cúc', reason: 'Giúp thư giãn, phù hợp mọi thời tiết' }];
    }

    const suggestionDoc = await DrinkSuggestion.create({
      user: req.user._id,
      weather,
      suggestions: suggestions.map((s) => ({
        teaId: null,
        teaName: s.teaName,
        reason: s.reason,
      })),
    });

    res.json({
      weather,
      suggestions: suggestionDoc.suggestions,
      id: suggestionDoc._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// AI COACH
// ---------------------------------------------------------------------------

// @desc    AI coach health check-in
// @route   POST /api/wellness/coach/checkin
// @access  Private
const coachCheckin = async (req, res) => {
  try {
    const { sleepHours, stress, mood, exerciseMinutes, waterGlasses } = req.body;
    const today = getTodayDateString();

    const healthLog = await HealthLog.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        user: req.user._id,
        date: today,
        sleepHours,
        stress,
        mood,
        exerciseMinutes,
        waterGlasses,
        source: 'ai_checkin',
      },
      { upsert: true, new: true, runValidators: true }
    );

    const recentLogs = await HealthLog.find({
      user: req.user._id,
      date: { $gte: getDateDaysAgo(7), $lte: today },
    }).sort({ date: 1 });

    let contextStr = '';
    if (recentLogs.length > 1) {
      const avgSleep = Math.round(
        recentLogs.reduce((a, l) => a + (l.sleepHours || 0), 0) / recentLogs.length
      );
      const avgStress = Math.round(
        recentLogs.reduce((a, l) => a + (l.stress || 0), 0) / recentLogs.length
      );
      contextStr = `\nXu hướng 7 ngày gần đây: ngủ trung bình ${avgSleep} giờ, stress trung bình ${avgStress}/10.`;
    }

    const prompt = `Bạn là huấn luyện viên sức khỏe thân thiện của Hương Thảo Trà, chuyên về trà thảo mộc và lối sống lành mạnh.

Người dùng vừa check-in: ngủ ${sleepHours || '?'} giờ, stress ${stress || '?'}/10, tâm trạng ${mood || 'không rõ'}, vận động ${exerciseMinutes || 0} phút.
Dựa trên lịch sử sức khỏe gần đây, hãy đưa ra lời khuyên cá nhân hóa bằng tiếng Việt về việc nên uống trà gì, tập luyện thế nào. Ngắn gọn, ấm áp, dưới 150 từ.${contextStr}`;

    let message = 'Cảm ơn bạn đã check-in! Hãy uống một tách trà ấm và nghỉ ngơi nhé.';
    try {
      const model = getGeminiModel({ generationConfig: { temperature: 0.8, maxOutputTokens: 300 } });
      const result = await model.generateContent(prompt);
      message = result.response.text().trim();
    } catch (err) {
      console.error('Gemini coach checkin failed:', err.message);
    }

    res.json({ message, healthLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Chat with AI coach
// @route   POST /api/wellness/coach/chat
// @access  Private
const coachChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    let chatHistory = await ChatHistory.findOne({
      user: req.user._id,
      source: 'wellness_coach',
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        user: req.user._id,
        source: 'wellness_coach',
        messages: [],
      });
    }

    const today = getTodayDateString();
    const recentLogs = await HealthLog.find({
      user: req.user._id,
      date: { $gte: getDateDaysAgo(7), $lte: today },
    })
      .sort({ date: 1 })
      .lean();

    let healthContext = '';
    if (recentLogs.length) {
      const avgSleep = Math.round(
        recentLogs.reduce((a, l) => a + (l.sleepHours || 0), 0) / recentLogs.length
      );
      const avgStress = Math.round(
        recentLogs.reduce((a, l) => a + (l.stress || 0), 0) / recentLogs.length
      );
      const totalEx = recentLogs.reduce((a, l) => a + (l.exerciseMinutes || 0), 0);
      healthContext = `Thông tin sức khỏe 7 ngày gần đây: Ngủ TB ${avgSleep}h, Stress TB ${avgStress}/10, Tổng vận động ${totalEx} phút.`;
    }

    const recentMessages = chatHistory.messages.slice(-10);
    const chatContext = recentMessages
      .map((m) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`)
      .join('\n');

    const systemInstruction = `Bạn là Hương Thảo, huấn luyện viên sức khỏe và chuyên gia trà thảo mộc của Hương Thảo Trà. 
Bạn đưa ra lời khuyên về trà thảo mộc, chế độ sinh hoạt, tập luyện nhẹ nhàng, và sức khỏe tổng thể.
Trả lời bằng tiếng Việt, giọng ấm áp, thân thiện, ngắn gọn dưới 200 từ.
${healthContext}`;

    const prompt = `${systemInstruction}

Lịch sử trò chuyện:
${chatContext || '(Chưa có)'}

User: ${message}
Coach:`;

    let responseText = 'Cảm ơn bạn đã chia sẻ! Tôi ở đây để đồng hành cùng bạn trên hành trình sức khỏe.';
    try {
      const model = getGeminiModel({ generationConfig: { temperature: 0.8, maxOutputTokens: 400 } });
      const result = await model.generateContent(prompt);
      responseText = result.response.text().trim();
    } catch (err) {
      console.error('Gemini coach chat failed:', err.message);
    }

    chatHistory.messages.push({ role: 'user', content: message, timestamp: new Date() });
    chatHistory.messages.push({ role: 'assistant', content: responseText, timestamp: new Date() });
    await chatHistory.save();

    res.json({ response: responseText });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI coach chat history
// @route   GET /api/wellness/coach/history
// @access  Private
const getCoachHistory = async (req, res) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      user: req.user._id,
      source: 'wellness_coach',
    });

    res.json(chatHistory ? chatHistory.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// WORKOUT
// ---------------------------------------------------------------------------

// @desc    Get exercises
// @route   GET /api/wellness/workout/exercises
// @access  Private
const getExercises = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const exercises = await Exercise.find(filter).sort({ category: 1, name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get or generate workout plan for a week
// @route   GET /api/wellness/workout/plan
// @access  Private
const getWorkoutPlan = async (req, res) => {
  try {
    const weekStart = req.query.week;

    if (!weekStart) {
      return res.status(400).json({ message: 'week query parameter is required (YYYY-MM-DD)' });
    }

    let plan = await WorkoutPlan.findOne({
      user: req.user._id,
      weekStart,
    }).populate('days.exercises.exercise');

    if (!plan) {
      const today = getTodayDateString();
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      if (today >= weekStart && today <= weekEndDate.toISOString().split('T')[0]) {
        plan = await generateWorkoutPlanInternal(req.user._id, weekStart);
      } else {
        return res.status(404).json({
          message: 'No plan found for this week and it is not the current week',
        });
      }
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateWorkoutPlanInternal = async (userId, weekStart) => {
  const exercises = await Exercise.find({}).lean();

  if (!exercises.length) {
    return null;
  }

  const categories = {};
  for (const ex of exercises) {
    if (!categories[ex.category]) {
      categories[ex.category] = [];
    }
    categories[ex.category].push(ex);
  }

  const categoryKeys = Object.keys(categories);
  const days = [];

  for (let day = 0; day < 6; day++) {
    const picked = [];
    const usedCategories = new Set();

    for (let i = 0; i < 3; i++) {
      const availableCats = categoryKeys.filter((c) => !usedCategories.has(c));
      if (!availableCats.length) break;

      const cat = availableCats[Math.floor(Math.random() * availableCats.length)];
      const catExercises = categories[cat];
      const ex = catExercises[Math.floor(Math.random() * catExercises.length)];

      picked.push({
        exercise: ex._id,
        durationMinutes: ex.durationMinutes || 5,
        order: i,
        completed: false,
      });
      usedCategories.add(cat);
    }

    days.push({
      dayOfWeek: day,
      exercises: picked,
    });
  }

  days.push({ dayOfWeek: 6, exercises: [] });

  const plan = await WorkoutPlan.create({
    user: userId,
    weekStart,
    days,
    aiGenerated: false,
  });

  return WorkoutPlan.findById(plan._id).populate('days.exercises.exercise');
};

// @desc    Generate a new workout plan
// @route   POST /api/wellness/workout/plan/generate
// @access  Private
const generateWorkoutPlan = async (req, res) => {
  try {
    const getWeekStart = () => {
      const now = new Date();
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      return monday.toISOString().split('T')[0];
    };

    const weekStart = req.body.weekStart || getWeekStart();

    await WorkoutPlan.findOneAndDelete({
      user: req.user._id,
      weekStart,
    });

    const plan = await generateWorkoutPlanInternal(req.user._id, weekStart);

    if (!plan) {
      return res.status(500).json({ message: 'Failed to generate workout plan' });
    }

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update workout plan
// @route   PUT /api/wellness/workout/plan
// @access  Private
const updateWorkoutPlan = async (req, res) => {
  try {
    const { weekStart, days } = req.body;

    if (!weekStart) {
      return res.status(400).json({ message: 'weekStart is required' });
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { user: req.user._id, weekStart },
      { days: days || [] },
      { upsert: true, new: true }
    ).populate('days.exercises.exercise');

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark an exercise as completed
// @route   POST /api/wellness/workout/complete
// @access  Private
const completeExercise = async (req, res) => {
  try {
    const { weekStart, dayOfWeek, exerciseId } = req.body;

    if (dayOfWeek === undefined || !exerciseId || !weekStart) {
      return res
        .status(400)
        .json({ message: 'weekStart, dayOfWeek, and exerciseId are required' });
    }

    const plan = await WorkoutPlan.findOne({
      user: req.user._id,
      weekStart,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Workout plan not found' });
    }

    const day = plan.days.find((d) => d.dayOfWeek === dayOfWeek);
    if (!day) {
      return res.status(404).json({ message: 'Day not found in plan' });
    }

    const exerciseEntry = day.exercises.find(
      (e) => e.exercise.toString() === exerciseId
    );
    if (!exerciseEntry) {
      return res.status(404).json({ message: 'Exercise not found in day plan' });
    }

    exerciseEntry.completed = true;
    const duration = exerciseEntry.durationMinutes || 0;
    await plan.save();

    if (duration > 0) {
      const today = getTodayDateString();
      const existingLog = await HealthLog.findOne({
        user: req.user._id,
        date: today,
      });

      const currentMins = existingLog ? existingLog.exerciseMinutes || 0 : 0;

      await HealthLog.findOneAndUpdate(
        { user: req.user._id, date: today },
        {
          user: req.user._id,
          date: today,
          exerciseMinutes: currentMins + duration,
        },
        { upsert: true, new: true }
      );
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// CHALLENGES
// ---------------------------------------------------------------------------

// @desc    Get active and upcoming challenges
// @route   GET /api/wellness/challenges
// @access  Private
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      status: { $in: ['active', 'upcoming'] },
    })
      .sort({ startDate: 1 })
      .lean();

    const result = challenges.map((c) => {
      const joined = c.participants.some(
        (p) => p.user.toString() === req.user._id.toString()
      );
      return { ...c, hasJoined: joined };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get challenge leaderboard
// @route   GET /api/wellness/challenges/:id/leaderboard
// @access  Private
const getChallengeLeaderboard = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      'participants.user',
      'name avatar'
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const sorted = challenge.participants.sort((a, b) => b.score - a.score);

    const userRank =
      sorted.findIndex(
        (p) => p.user?._id?.toString() === req.user._id.toString()
      ) + 1 || null;

    res.json({
      challenge: {
        _id: challenge._id,
        title: challenge.title,
        type: challenge.type,
        target: challenge.target,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
      },
      leaderboard: sorted,
      userRank,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a challenge
// @route   POST /api/wellness/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const alreadyJoined = challenge.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push({
      user: req.user._id,
      score: 0,
      joinedAt: new Date(),
    });

    await challenge.save();

    res.json({ message: 'Joined challenge successfully', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// FAMILY
// ---------------------------------------------------------------------------

// @desc    Get or create family profile
// @route   GET /api/wellness/family
// @access  Private
const getFamilyProfile = async (req, res) => {
  try {
    let profile = await FamilyProfile.findOne({ primaryUser: req.user._id });

    if (!profile) {
      profile = await FamilyProfile.create({
        primaryUser: req.user._id,
        members: [],
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a family member
// @route   POST /api/wellness/family/members
// @access  Private
const addFamilyMember = async (req, res) => {
  try {
    const { name, avatar, gender, age, healthGoal } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Member name is required' });
    }

    let profile = await FamilyProfile.findOne({ primaryUser: req.user._id });

    if (!profile) {
      profile = await FamilyProfile.create({
        primaryUser: req.user._id,
        members: [],
      });
    }

    if (profile.members.length >= profile.maxMembers) {
      return res.status(400).json({
        message: `Maximum ${profile.maxMembers} family members allowed`,
      });
    }

    profile.members.push({
      name,
      avatar: avatar || '',
      gender: gender || 'Khác',
      age: age || null,
      healthGoal: healthGoal || '',
    });

    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a family member
// @route   PUT /api/wellness/family/members/:id
// @access  Private
const updateFamilyMember = async (req, res) => {
  try {
    const profile = await FamilyProfile.findOne({ primaryUser: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Family profile not found' });
    }

    const member = profile.members.id(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { name, avatar, gender, age, healthGoal } = req.body;

    if (name !== undefined) member.name = name;
    if (avatar !== undefined) member.avatar = avatar;
    if (gender !== undefined) member.gender = gender;
    if (age !== undefined) member.age = age;
    if (healthGoal !== undefined) member.healthGoal = healthGoal;

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a family member
// @route   DELETE /api/wellness/family/members/:id
// @access  Private
const removeFamilyMember = async (req, res) => {
  try {
    const profile = await FamilyProfile.findOne({ primaryUser: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Family profile not found' });
    }

    const member = profile.members.id(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.deleteOne();
    await profile.save();

    res.json({ message: 'Member removed', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// REPORTS
// ---------------------------------------------------------------------------

// @desc    Get wellness report
// @route   GET /api/wellness/reports/:period
// @access  Private
const getReport = async (req, res) => {
  try {
    const { period } = req.params;
    let from;
    let to = getTodayDateString();

    if (period === 'weekly') {
      from = getDateDaysAgo(7);
    } else if (period === 'monthly') {
      from = getDateDaysAgo(30);
    } else if (period === 'custom') {
      from = req.query.from;
      to = req.query.to || to;
      if (!from) {
        return res.status(400).json({ message: 'from query param required for custom period' });
      }
    } else {
      return res.status(400).json({ message: 'Period must be weekly, monthly, or custom' });
    }

    const healthLogs = await HealthLog.find({
      user: req.user._id,
      date: { $gte: from, $lte: to },
    }).sort({ date: 1 });

    const calcAvg = (field) => {
      const vals = healthLogs.map((l) => l[field]).filter((v) => v !== null && v !== undefined);
      if (!vals.length) return null;
      return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    };

    const journalEntries = await TeaJournal.find({
      user: req.user._id,
      drunkAt: { $gte: new Date(from), $lte: new Date(`${to}T23:59:59.999Z`) },
    }).populate('tea', 'name');

    const totalTeaLogs = journalEntries.length;

    const teaCountMap = {};
    for (const entry of journalEntries) {
      const teaName = entry.tea ? entry.tea.name : entry.teaName || 'Không rõ';
      teaCountMap[teaName] = (teaCountMap[teaName] || 0) + 1;
    }

    let favoriteTea = null;
    let maxCount = 0;
    for (const [name, count] of Object.entries(teaCountMap)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteTea = name;
      }
    }

    const totalExerciseMins = healthLogs.reduce(
      (sum, l) => sum + (l.exerciseMinutes || 0),
      0
    );

    const streak = await Streak.findOne({ user: req.user._id });

    const report = {
      period,
      dateRange: { from, to },
      health: {
        avgSleepHours: calcAvg('sleepHours'),
        avgStress: calcAvg('stress'),
        avgWaterGlasses: calcAvg('waterGlasses'),
        avgExerciseMinutes: calcAvg('exerciseMinutes'),
        teaDays: healthLogs.filter((l) => l.drankTea).length,
        totalDays: healthLogs.length,
      },
      tea: {
        totalLogs: totalTeaLogs,
        favoriteTea,
      },
      streak: {
        currentStreak: streak ? streak.currentStreak : 0,
        longestStreak: streak ? streak.longestStreak : 0,
      },
      exercise: {
        totalMinutes: totalExerciseMins,
        avgMinutesPerDay: healthLogs.length
          ? Math.round((totalExerciseMins / healthLogs.length) * 10) / 10
          : 0,
      },
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report PDF (stub)
// @route   GET /api/wellness/reports/:period/pdf
// @access  Private
const getReportPdf = async (req, res) => {
  try {
    res.json({
      message: 'PDF generation coming soon',
      note: 'Tính năng xuất PDF đang được phát triển',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// DRUG CHECK
// ---------------------------------------------------------------------------

// @desc    Check drug-herb interactions
// @route   POST /api/wellness/drug-check
// @access  Private
const checkDrugInteraction = async (req, res) => {
  try {
    const { drugNames } = req.body;

    if (!drugNames || !Array.isArray(drugNames) || drugNames.length === 0) {
      return res
        .status(400)
        .json({ message: 'drugNames array is required' });
    }

    const teas = await Tea.find({ isPublished: true })
      .populate('ingredients')
      .lean();

    const teaList = teas.map((t) => {
      const ingredientNames = (t.ingredients || [])
        .map((i) => i.name || '')
        .filter(Boolean)
        .join(', ');

      const precautions = (t.ingredients || [])
        .map((i) => i.precautions || '')
        .filter(Boolean)
        .join('; ');

      const benefits = (t.benefits || []).join(', ');

      return `Trà "${t.name}": thành phần [${ingredientNames}], công dụng [${benefits}], lưu ý [${precautions}]`;
    });

    const prompt = `Bạn là chuyên gia dược lý và thảo dược học. 
Kiểm tra tương tác giữa các thuốc sau: ${drugNames.join(', ')} 
và các loại trà thảo mộc dưới đây:

${teaList.join('\n')}

Với mỗi cặp thuốc-trà có tương tác đáng kể, đánh giá mức độ: "An toàn", "Thận trọng", hoặc "Cảnh báo".
Chỉ liệt kê những cặp có mức "Thận trọng" hoặc "Cảnh báo" (bỏ qua các cặp An toàn).

Trả lời bằng tiếng Việt, định dạng JSON:
{
  "interactions": [
    { "drug": "Tên thuốc", "teaName": "Tên trà", "level": "Thận trọng|Cảnh báo", "detail": "Giải thích ngắn gọn" }
  ]
}`;

    let interactions = [];
    let rawResponse = '';

    try {
      const model = getGeminiModel({ generationConfig: { temperature: 0.4, maxOutputTokens: 1024 } });
      const result = await model.generateContent(prompt);
      rawResponse = result.response.text();

      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.interactions && Array.isArray(parsed.interactions)) {
          interactions = parsed.interactions;
        }
      }
    } catch (err) {
      console.error('Gemini drug check failed:', err.message);
      interactions = [];
    }

    const disclaimer =
      'Thông tin chỉ mang tính tham khảo, không thay thế tư vấn bác sĩ hoặc dược sĩ. Vui lòng tham khảo ý kiến chuyên gia y tế trước khi sử dụng.';

    res.json({ interactions, disclaimer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// PUSH SUBSCRIPTIONS
// ---------------------------------------------------------------------------

// @desc    Subscribe to push notifications
// @route   POST /api/wellness/push/subscribe
// @access  Private
const subscribePush = async (req, res) => {
  try {
    const { endpoint, keys, device } = req.body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ message: 'endpoint, keys.p256dh, and keys.auth are required' });
    }

    const subscription = await PushSubscription.findOneAndUpdate(
      { user: req.user._id, endpoint },
      {
        user: req.user._id,
        endpoint,
        keys: { p256dh: keys.p256dh, auth: keys.auth },
        device: device || 'unknown',
      },
      { upsert: true, new: true }
    );

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsubscribe from push notifications
// @route   DELETE /api/wellness/push/unsubscribe
// @access  Private
const unsubscribePush = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: 'endpoint is required' });
    }

    await PushSubscription.findOneAndDelete({
      user: req.user._id,
      endpoint,
    });

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------------------

// @desc    Get admin dashboard
// @route   GET /api/wellness/admin/dashboard
// @access  Private/Staff
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await HealthLog.distinct('user').then((ids) => ids.length);

    const activeProUsers = await User.countDocuments({
      'pro.isPro': true,
      'pro.proExpiry': { $gt: new Date() },
    });

    const totalUsersWithAccount = await User.countDocuments();
    const proConversionRate = totalUsersWithAccount
      ? Math.round((activeProUsers / totalUsersWithAccount) * 100)
      : 0;

    const topTeas = await TeaJournal.aggregate([
      { $match: { tea: { $ne: null } } },
      { $group: { _id: '$tea', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'teas',
          localField: '_id',
          foreignField: '_id',
          as: 'tea',
        },
      },
      { $unwind: { path: '$tea', preserveNullAndEmptyArrays: true } },
      { $project: { teaName: '$tea.name', count: 1 } },
    ]);

    const coachUsageCount = await ChatHistory.countDocuments({
      source: 'wellness_coach',
    });

    const challengeParticipation = await Challenge.aggregate([
      { $project: { title: 1, participantCount: { $size: '$participants' } } },
      { $sort: { participantCount: -1 } },
    ]);

    res.json({
      totalUsers,
      activeProUsers,
      proConversionRate,
      topTeas,
      coachUsageCount,
      challengeParticipation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin users list
// @route   GET /api/wellness/admin/users
// @access  Private/Staff
const getAdminUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('name email role pro createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin manage user pro status
// @route   PATCH /api/wellness/admin/users/:id/pro
// @access  Private/Admin
const adminUpdatePro = async (req, res) => {
  try {
    const { action, days, note } = req.body;

    if (!action || !['activate', 'deactivate', 'extend'].includes(action)) {
      return res.status(400).json({
        message: 'action must be one of: activate, deactivate, extend',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();

    if (action === 'activate') {
      const numDays = days || 30;
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + numDays);

      await ProActivation.create({
        user: user._id,
        source: 'admin_grant',
        daysAdded: numDays,
        activatedBy: req.user._id,
        note: note || 'Admin kích hoạt',
      });

      user.pro.isPro = true;
      user.pro.proExpiry = expiry;
      user.pro.proPlan = 'admin_grant';
      user.pro.proActivatedAt = now;

      await createNotification({
        recipient: user._id,
        type: 'pro_activated',
        title: 'Tài khoản Pro được kích hoạt',
        message: `Admin đã kích hoạt gói Pro ${numDays} ngày cho bạn.`,
        link: '/wellness/pro',
        actor: req.user._id,
      });
    } else if (action === 'deactivate') {
      await ProActivation.create({
        user: user._id,
        source: 'admin_grant',
        daysAdded: 0,
        activatedBy: req.user._id,
        note: note || 'Admin hủy kích hoạt',
        isRevoked: true,
        revokedAt: now,
        revokedReason: note || 'Admin hủy kích hoạt',
      });

      user.pro.isPro = false;
      user.pro.proExpiry = null;
    } else if (action === 'extend') {
      const numDays = days || 30;
      const baseDate =
        user.pro.proExpiry && new Date(user.pro.proExpiry) > now
          ? new Date(user.pro.proExpiry)
          : now;
      baseDate.setDate(baseDate.getDate() + numDays);

      await ProActivation.create({
        user: user._id,
        source: 'admin_grant',
        daysAdded: numDays,
        activatedBy: req.user._id,
        note: note || 'Admin gia hạn',
      });

      user.pro.isPro = true;
      user.pro.proExpiry = baseDate;
      user.pro.proPlan = 'admin_grant';
      if (!user.pro.proActivatedAt) {
        user.pro.proActivatedAt = now;
      }

      await createNotification({
        recipient: user._id,
        type: 'pro_extended',
        title: 'Gói Pro được gia hạn',
        message: `Admin đã gia hạn gói Pro thêm ${numDays} ngày cho bạn.`,
        link: '/wellness/pro',
        actor: req.user._id,
      });
    }

    await user.save();

    res.json({ message: `Pro ${action} successful`, user: { _id: user._id, pro: user.pro } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get suspicious users
// @route   GET /api/wellness/admin/suspicious
// @access  Private/Staff
const getSuspiciousUsers = async (req, res) => {
  try {
    const flags = await SuspiciousFlag.find({})
      .populate('user', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review a suspicious flag
// @route   PATCH /api/wellness/admin/suspicious/:id
// @access  Private/Staff
const reviewSuspiciousFlag = async (req, res) => {
  try {
    const { action, note } = req.body;

    if (!action || !['dismiss', 'pro_disabled', 'warning_sent'].includes(action)) {
      return res.status(400).json({
        message: 'action must be one of: dismiss, pro_disabled, warning_sent',
      });
    }

    const flag = await SuspiciousFlag.findById(req.params.id);

    if (!flag) {
      return res.status(404).json({ message: 'Suspicious flag not found' });
    }

    flag.status = 'reviewed';
    flag.reviewedBy = req.user._id;
    flag.reviewedAt = new Date();
    flag.action = action === 'dismiss' ? 'none' : action;
    flag.note = note || '';

    if (action === 'pro_disabled') {
      const user = await User.findById(flag.user);
      if (user) {
        user.pro.isPro = false;
        user.pro.proExpiry = null;
        await user.save();

        const existingActivations = await ProActivation.find({
          user: user._id,
          isRevoked: false,
        });
        for (const act of existingActivations) {
          act.isRevoked = true;
          act.revokedAt = new Date();
          act.revokedReason = 'Suspicious activity detected';
          await act.save();
        }
      }
    }

    await flag.save();

    res.json(flag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all challenges (admin)
// @route   GET /api/wellness/admin/challenges
// @access  Private/Staff
const getAdminChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({})
      .sort({ startDate: -1 })
      .populate('participants.user', 'name');

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a challenge
// @route   POST /api/wellness/admin/challenges
// @access  Private/Staff
const createChallenge = async (req, res) => {
  try {
    const { title, description, type, target, startDate, endDate } = req.body;

    if (!title || !type || !target || !startDate || !endDate) {
      return res.status(400).json({
        message: 'title, type, target, startDate, and endDate are required',
      });
    }

    const validTypes = ['streak', 'exercise', 'tea_log', 'body_mind_score'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${validTypes.join(', ')}`,
      });
    }

    const challenge = await Challenge.create({
      title,
      description: description || '',
      type,
      target,
      startDate,
      endDate,
      createdBy: 'admin',
      participants: [],
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a challenge
// @route   PUT /api/wellness/admin/challenges/:id
// @access  Private/Staff
const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const { title, description, type, target, startDate, endDate, status } = req.body;

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (type !== undefined) challenge.type = type;
    if (target !== undefined) challenge.target = target;
    if (startDate !== undefined) challenge.startDate = startDate;
    if (endDate !== undefined) challenge.endDate = endDate;
    if (status !== undefined) challenge.status = status;

    await challenge.save();

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProStatus,
  activateProFromOrders,
  purchasePro,
  getProHistory,
  getHealthLogs,
  createHealthLog,
  getHealthSummary,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getStreakInfo,
  getDrinkSuggestion,
  coachCheckin,
  coachChat,
  getCoachHistory,
  getExercises,
  getWorkoutPlan,
  generateWorkoutPlan,
  updateWorkoutPlan,
  completeExercise,
  getChallenges,
  getChallengeLeaderboard,
  joinChallenge,
  getFamilyProfile,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  getReport,
  getReportPdf,
  checkDrugInteraction,
  subscribePush,
  unsubscribePush,
  getAdminDashboard,
  getAdminUsers,
  adminUpdatePro,
  getSuspiciousUsers,
  reviewSuspiciousFlag,
  getAdminChallenges,
  createChallenge,
  updateChallenge,
};
