import React, { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../utils/env'

const read = (k, f) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f } catch { return f }
}
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const Teachers = () => {
  const [classes, setClasses] = useState(() => read('classes', []))
  const [pendingTeachers, setPendingTeachers] = useState([])
  const [approvedTeachers, setApprovedTeachers] = useState([])
  const teacherEmail = useMemo(() => read('currentTeacherEmail', null), [])
  const currentCollegeId = useMemo(() => read('currentCollegeId', null), [])

  const teacher = useMemo(() => approvedTeachers.find(t => t.email === teacherEmail) || pendingTeachers.find(t => t.email === teacherEmail) || null, [approvedTeachers, pendingTeachers, teacherEmail])
  const isApproved = !!approvedTeachers.find(t => t.email === teacherEmail)

  const [form, setForm] = useState({ name: '', department: '', classId: '' })

  useEffect(() => {
    setClasses(read('classes', []))
    const load = async () => {
      try {
        const [p, a] = await Promise.all([
          apiFetch(`/admin/pending-teachers?collegeId=${encodeURIComponent(currentCollegeId || '')}`),
          apiFetch(`/admin/approved-teachers?collegeId=${encodeURIComponent(currentCollegeId || '')}`)
        ])
        const toShape = (u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          department: u.department || '—',
        })
        setPendingTeachers((p.users || []).map(toShape))
        setApprovedTeachers((a.users || []).map(toShape))
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [currentCollegeId])

  const myClasses = useMemo(() => classes.filter(c => c.teacherEmail === teacherEmail), [classes, teacherEmail])

  const handleCreateClass = (e) => {
    e.preventDefault()
    if (!isApproved) { alert('Awaiting admin approval.'); return }
    if (!form.classId || !form.name) { alert('Please fill class name and ID.'); return }
    if (classes.some(c => c.classId === form.classId)) { alert('Class ID already exists.'); return }
    const newClass = {
      classId: form.classId,
      name: form.name,
      department: form.department || teacher?.department || '—',
      teacherEmail,
      teacherName: teacher?.name || teacherEmail,
      students: []
    }
    const updated = [...classes, newClass]
    setClasses(updated)
    write('classes', updated)
    setForm({ name: '', department: '', classId: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Teacher Portal</h1>
          {!teacherEmail && (
            <p className="text-sm text-gray-700 mt-2">Please login/sign up from the landing page first.</p>
          )}
          {teacher && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{teacher.name} <span className="text-gray-500">({teacher.email})</span></p>
                <p className="text-sm text-gray-700">Department: {teacher.department || '—'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{isApproved ? 'Approved' : 'Pending approval'}</span>
            </div>
          )}
        </div>

        <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Create a Class</h2>
          <form onSubmit={handleCreateClass} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="glass-input border rounded-xl px-3 py-2 bg-white/60" placeholder="Class Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="glass-input border rounded-xl px-3 py-2 bg-white/60" placeholder="Class ID" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} />
            <input className="glass-input border rounded-xl px-3 py-2 bg-white/60" placeholder="Department (optional)" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            <div className="md:col-span-3">
              <button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 shadow">Create</button>
            </div>
          </form>
          <style>{`.glass-input{border-color:rgba(255,255,255,0.4)}`}</style>
          <p className="text-xs text-gray-600 mt-2">After creation, share the Class ID with students so they can join.</p>
        </div>

        <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">My Classes</h2>
          <div className="space-y-3">
            {myClasses.length === 0 && <p className="text-gray-700">No classes yet.</p>}
            {myClasses.map(c => (
              <div key={c.classId} className="p-4 bg-white/60 border border-white/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{c.name} <span className="text-gray-500">({c.classId})</span></p>
                  <p className="text-sm text-gray-700">Students: {c.students?.length || 0} • Department: {c.department}</p>
                </div>
                <button className="px-3 py-1 text-sm rounded-xl bg-white shadow border border-white/40" onClick={() => navigator.clipboard?.writeText(c.classId)}>Copy ID</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Teachers