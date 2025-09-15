import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Plus,
  Pin,
  Bell,
  MoreVertical,
  Users,
  Share2,
  File,
  Type,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Link,
  Code,
} from 'lucide-react';

const Notes = () => {
  const [activeNoteType, setActiveNoteType] = useState('text');
  
  // Mock data for notes (Handwritten note removed)
  const notesData = [
    {
      id: 1,
      title: 'Quantum Physics Lecture',
      type: 'text',
      content: 'Notes from Dr. Smith\'s lecture on quantum entanglement. Key topics include superposition and the measurement problem...',
      pinned: true,
      reminder: '2025-09-20T09:00:00',
      tags: ['Physics', 'Quantum Mechanics'],
      collaborators: [{ id: 1, name: 'Jane Doe', avatar: 'JD' }],
      lastEdited: '2 hours ago',
    },
    {
      id: 2,
      title: 'Chemistry Lab Report.pdf',
      type: 'upload',
      fileInfo: { name: 'Chemistry_Lab_Report_Final.pdf', size: '2.4 MB', type: 'pdf' },
      pinned: false,
      reminder: null,
      tags: ['Chemistry', 'Lab Report'],
      collaborators: [],
      lastEdited: '1 day ago',
    },
     {
      id: 4,
      title: 'Mid-term Study Plan',
      type: 'text',
      content: '1. Review all lecture notes.\n2. Complete practice problems.\n3. Form a study group...',
      pinned: false,
      reminder: null,
      tags: ['Exams', 'Study Plan'],
      collaborators: [],
      lastEdited: '5 days ago',
    },
  ];

  const NoteTypeButton = ({ icon: Icon, label, type }) => (
    <button
      onClick={() => setActiveNoteType(type)}
      className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm font-medium ${
        activeNoteType === type ? 'bg-blue-500 text-white shadow-md' : 'bg-white/50 hover:bg-white/80 text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const NoteCard = ({ note }) => {
    // Icons map without 'draw' type
    const noteIcons = {
      text: <FileText className="w-4 h-4 text-blue-500" />,
      upload: <UploadCloud className="w-4 h-4 text-purple-500" />,
    };

    return (
      <div className="backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-4 flex flex-col justify-between gap-4 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {noteIcons[note.type]}
            <h3 className="font-semibold text-gray-800">{note.title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {note.pinned && <Pin className="w-4 h-4 text-red-500" />}
            <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Card Body */}
        <div className="text-sm text-gray-600 flex-grow">
          {note.type === 'text' && <p>{note.content.substring(0, 100)}{note.content.length > 100 && '...'}</p>}
          {note.type === 'upload' && (
            <div className="p-3 bg-white/50 rounded-lg flex items-center gap-3">
              <File className="w-6 h-6 text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">{note.fileInfo.name}</p>
                <p className="text-xs">{note.fileInfo.size}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Card Footer */}
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">{tag}</span>
                ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    {note.reminder && <Bell className="w-3 h-3 text-green-600" />}
                    {note.collaborators.length > 0 && <Users className="w-3 h-3 text-blue-600" />}
                </div>
                <span>{note.lastEdited}</span>
            </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* Header */}
      <div className="mb-6 backdrop-blur-md bg-white/40 rounded-2xl border border-white/30 shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">My Notes</h1>
        <p className="text-gray-700 font-medium text-sm md:text-base">Create, organize, and collaborate on your study materials.</p>
      </div>
      
      {/* Add Note Section */}
      <div className="mb-6 backdrop-blur-md bg-white/70 rounded-2xl border border-white/20 shadow-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <NoteTypeButton icon={Type} label="Text Note" type="text" />
          <NoteTypeButton icon={UploadCloud} label="Upload File" type="upload" />
        </div>
        
        {/* Dynamic content based on activeNoteType */}
        {activeNoteType === 'text' && (
          <div className="space-y-3">
             <input type="text" placeholder="Note Title..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80" />
             <div className="p-1 bg-white/50 rounded-lg flex items-center gap-1 border border-gray-200">
                {[Bold, Italic, List, ImageIcon, Link, Code].map((Icon, idx) => <button key={idx} className="p-2 rounded hover:bg-gray-200/60"><Icon className="w-4 h-4 text-gray-600" /></button>)}
             </div>
             <textarea placeholder="Start writing your note here..." rows="4" className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"></textarea>
          </div>
        )}
        {activeNoteType === 'upload' && (
            <div className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-white/30">
                <UploadCloud className="w-10 h-10 mb-2" />
                <p className="font-medium">Click to upload or drag & drop</p>
                <p className="text-xs">PDF, DOCX, PPTX, TXT, or ZIP</p>
            </div>
        )}

        <div className="flex items-center justify-end mt-4">
            <button className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2">
                <Plus className="w-4 h-4"/> Add Note
            </button>
        </div>
      </div>
      
      {/* Pinned Notes Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Pin className="w-5 h-5 text-red-500" /> Pinned Notes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {notesData.filter(n => n.pinned).map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      </div>
      
      {/* All Notes Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">All Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {notesData.filter(n => !n.pinned).map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      </div>
    </div>
  );
};

export default Notes;