const express = require('express');
const {
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
} = require('../controllers/wellnessController');
const { protect, staff, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// PRO
router.route('/pro/status').get(protect, getProStatus);
router.route('/pro/activate-from-orders').post(protect, activateProFromOrders);
router.route('/pro/purchase').post(protect, purchasePro);
router.route('/pro/history').get(protect, getProHistory);

// HEALTH
router.route('/health/logs').get(protect, getHealthLogs).post(protect, createHealthLog);
router.route('/health/summary').get(protect, getHealthSummary);

// JOURNAL
router.route('/journal').get(protect, getJournalEntries).post(protect, createJournalEntry);
router.route('/journal/streak').get(protect, getStreakInfo);
router.route('/journal/:id').put(protect, updateJournalEntry).delete(protect, deleteJournalEntry);

// DRINK SUGGESTION
router.route('/suggest/drink').get(protect, getDrinkSuggestion);

// AI COACH
router.route('/coach/checkin').post(protect, coachCheckin);
router.route('/coach/chat').post(protect, coachChat);
router.route('/coach/history').get(protect, getCoachHistory);

// WORKOUT
router.route('/workout/exercises').get(protect, getExercises);
router.route('/workout/plan').get(protect, getWorkoutPlan).put(protect, updateWorkoutPlan);
router.route('/workout/plan/generate').post(protect, generateWorkoutPlan);
router.route('/workout/complete').post(protect, completeExercise);

// CHALLENGES
router.route('/challenges').get(protect, getChallenges);
router.route('/challenges/:id/leaderboard').get(protect, getChallengeLeaderboard);
router.route('/challenges/:id/join').post(protect, joinChallenge);

// FAMILY
router.route('/family').get(protect, getFamilyProfile);
router.route('/family/members').post(protect, addFamilyMember);
router.route('/family/members/:id').put(protect, updateFamilyMember).delete(protect, removeFamilyMember);

// REPORTS
router.route('/reports/:period').get(protect, getReport);
router.route('/reports/:period/pdf').get(protect, getReportPdf);

// DRUG CHECK
router.route('/drug-check').post(protect, checkDrugInteraction);

// PUSH
router.route('/push/subscribe').post(protect, subscribePush);
router.route('/push/unsubscribe').delete(protect, unsubscribePush);

// ADMIN
router.route('/admin/dashboard').get(protect, staff, getAdminDashboard);
router.route('/admin/users').get(protect, staff, getAdminUsers);
router.route('/admin/users/:id/pro').patch(protect, admin, adminUpdatePro);
router.route('/admin/suspicious').get(protect, staff, getSuspiciousUsers);
router.route('/admin/suspicious/:id').patch(protect, staff, reviewSuspiciousFlag);
router.route('/admin/challenges').get(protect, staff, getAdminChallenges).post(protect, staff, createChallenge);
router.route('/admin/challenges/:id').put(protect, staff, updateChallenge);

module.exports = router;
