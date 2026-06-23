import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@shared/AuthContext';
import api from '@shared/api';

const MAX_MEMBERS = 4;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

const INITIALS_COLORS = [
  'bg-primary-500', 'bg-amberSoft', 'bg-leaf-600', 'bg-primary-700',
];

function MemberCard({ member, onSelect, onEdit, onRemove, isEditing, onSaveEdit, onCancelEdit, editForm, onEditFormChange }) {
  const initials = (member.name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const colorClass = INITIALS_COLORS[member.id % INITIALS_COLORS.length];

  if (isEditing) {
    return (
      <div className="wellness-surface p-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700">Tên</label>
        <input
          className="input-field"
          value={editForm.name}
          onChange={(e) => onEditFormChange({ ...editForm, name: e.target.value })}
          placeholder="Tên thành viên"
        />
        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onEditFormChange({ ...editForm, gender: g.value })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                editForm.gender === g.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <label className="block text-sm font-medium text-gray-700">Tuổi</label>
        <input
          className="input-field"
          type="number"
          min="0"
          max="120"
          value={editForm.age}
          onChange={(e) => onEditFormChange({ ...editForm, age: e.target.value })}
          placeholder="Tuổi"
        />
        <label className="block text-sm font-medium text-gray-700">Mục tiêu sức khỏe</label>
        <input
          className="input-field"
          value={editForm.healthGoal}
          onChange={(e) => onEditFormChange({ ...editForm, healthGoal: e.target.value })}
          placeholder="VD: Tăng cường miễn dịch, thư giãn..."
        />
        <div className="flex gap-2 pt-1">
          <button onClick={onSaveEdit} className="btn-primary flex-1 text-sm py-2">Lưu</button>
          <button onClick={onCancelEdit} className="btn-outline flex-1 text-sm py-2">Hủy</button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(member)}
      className="wellness-surface p-4 flex items-center gap-4 text-left w-full active:scale-[0.98] transition-transform"
    >
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.age ? `${member.age} tuổi` : ''}{member.healthGoal ? ` · ${member.healthGoal}` : ''}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(member); }}
          className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
          aria-label="Sửa"
        >
          ✏️
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(member); }}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Xóa"
        >
          🗑️
        </button>
      </div>
    </button>
  );
}

function AddMemberForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    gender: 'female',
    age: '',
    healthGoal: '',
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit({
      name: form.name.trim(),
      gender: form.gender,
      age: parseInt(form.age, 10) || null,
      healthGoal: form.healthGoal.trim(),
    });
  };

  return (
    <div className="wellness-surface p-4 space-y-3">
      <h3 className="font-bold text-gray-800">Thêm thành viên</h3>
      <input
        className="input-field"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Tên thành viên"
      />
      <div className="flex gap-2">
        {GENDER_OPTIONS.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => setForm({ ...form, gender: g.value })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.gender === g.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <input
        className="input-field"
        type="number"
        min="0"
        max="120"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        placeholder="Tuổi"
      />
      <input
        className="input-field"
        value={form.healthGoal}
        onChange={(e) => setForm({ ...form, healthGoal: e.target.value })}
        placeholder="Mục tiêu sức khỏe (VD: Tăng cường miễn dịch)"
      />
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} className="btn-primary flex-1 text-sm py-2">Thêm</button>
        <button onClick={onCancel} className="btn-outline flex-1 text-sm py-2">Hủy</button>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
        <p className="text-gray-800 font-medium mb-4">{message}</p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="btn-primary flex-1 text-sm py-2 bg-red-500">Xác nhận</button>
          <button onClick={onCancel} className="btn-outline flex-1 text-sm py-2">Hủy</button>
        </div>
      </div>
    </div>
  );
}

export default function FamilyHub() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proStatus, setProStatus] = useState(null);
  const [checkingPro, setCheckingPro] = useState(true);
  const [showingForm, setShowingForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get('/wellness/family');
      setMembers(data.members || []);
    } catch (err) {
      setError('Không thể tải dữ liệu gia đình. Vui lòng thử lại.');
    }
  }, []);

  const checkPro = useCallback(async () => {
    try {
      const { data } = await api.get('/wellness/pro/status');
      setProStatus(data);
    } catch {
      setProStatus({ isPro: false, plan: 'free' });
    } finally {
      setCheckingPro(false);
    }
  }, []);

  useEffect(() => {
    checkPro().then(() => {});
  }, [checkPro]);

  useEffect(() => {
    setLoading(true);
    fetchMembers().finally(() => setLoading(false));
  }, [fetchMembers]);

  const handleAdd = async (formData) => {
    try {
      setError(null);
      const { data } = await api.post('/wellness/family/members', formData);
      setMembers((prev) => [...prev, data.member]);
      setShowingForm(false);
    } catch {
      setError('Không thể thêm thành viên. Vui lòng thử lại.');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditForm({
      name: member.name,
      gender: member.gender || 'female',
      age: member.age?.toString() || '',
      healthGoal: member.healthGoal || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMember || !editForm) return;
    try {
      setError(null);
      const payload = {
        name: editForm.name.trim(),
        gender: editForm.gender,
        age: parseInt(editForm.age, 10) || null,
        healthGoal: editForm.healthGoal.trim(),
      };
      const { data } = await api.put(`/wellness/family/members/${editingMember}`, payload);
      setMembers((prev) => prev.map((m) => (m.id === editingMember ? data.member : m)));
      setEditingMember(null);
      setEditForm(null);
    } catch {
      setError('Không thể cập nhật thành viên. Vui lòng thử lại.');
    }
  };

  const handleRemove = async () => {
    if (!confirmDelete) return;
    try {
      setError(null);
      await api.delete(`/wellness/family/members/${confirmDelete.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== confirmDelete.id));
      if (selectedMember?.id === confirmDelete.id) setSelectedMember(null);
    } catch {
      setError('Không thể xóa thành viên. Vui lòng thử lại.');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (checkingPro) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!proStatus?.isPro || proStatus?.plan !== 'family') {
    return (
      <div className="p-4 space-y-4">
        <div className="wellness-surface p-6 text-center space-y-4">
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
          <h2 className="text-xl font-bold text-gray-800">Trung tâm Gia đình</h2>
          <p className="text-gray-600">
            Tính năng này yêu cầu gói <strong>Pro Family</strong>. Nâng cấp ngay để quản lý sức khỏe cho cả gia đình bạn.
          </p>
          <a href="/wellness/pro" className="btn-primary inline-block no-underline">
            Nâng cấp lên Pro Family
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <div className="wellness-surface p-6 text-center space-y-3">
          <div className="text-4xl">😕</div>
          <p className="text-gray-600">{error}</p>
          <button onClick={fetchMembers} className="btn-primary text-sm py-2">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Gia đình</h1>
          <p className="text-sm text-gray-500">
            {members.length}/{MAX_MEMBERS} thành viên
          </p>
        </div>
        {members.length < MAX_MEMBERS && !showingForm && (
          <button
            onClick={() => setShowingForm(true)}
            className="btn-primary text-sm py-2 px-4"
          >
            + Thêm thành viên
          </button>
        )}
      </div>

      {showingForm && (
        <AddMemberForm
          onSubmit={handleAdd}
          onCancel={() => setShowingForm(false)}
        />
      )}

      {members.length === 0 && !showingForm ? (
        <div className="wellness-surface p-6 text-center space-y-3">
          <div className="text-4xl">👪</div>
          <p className="text-gray-500">Chưa có thành viên nào. Hãy thêm thành viên đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onSelect={setSelectedMember}
              onEdit={handleEdit}
              onRemove={(m) => setConfirmDelete(m)}
              isEditing={editingMember === member.id}
              editForm={editForm}
              onEditFormChange={setEditForm}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={() => { setEditingMember(null); setEditForm(null); }}
            />
          ))}
        </div>
      )}

      {selectedMember && !editingMember && (
        <div className="wellness-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">{selectedMember.name}</h3>
            <button
              onClick={() => setSelectedMember(null)}
              className="text-gray-400 text-lg"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-leaf-50 rounded-lg p-3">
              <p className="text-gray-500">Giới tính</p>
              <p className="font-medium text-gray-800">
                {GENDER_OPTIONS.find((g) => g.value === selectedMember.gender)?.label || '—'}
              </p>
            </div>
            <div className="bg-leaf-50 rounded-lg p-3">
              <p className="text-gray-500">Tuổi</p>
              <p className="font-medium text-gray-800">{selectedMember.age || '—'}</p>
            </div>
            <div className="bg-leaf-50 rounded-lg p-3 col-span-2">
              <p className="text-gray-500">Mục tiêu sức khỏe</p>
              <p className="font-medium text-gray-800">{selectedMember.healthGoal || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Xóa thành viên "${confirmDelete.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleRemove}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
