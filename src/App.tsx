import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Constant email addresses - All team members
const TEAM_EMAILS = [
  'gokul.kadaparthi@gmail.com',
  'maddireddykirankumar2117@gmail.com',
  'vanam.pranav03@gmail.com',
  'vanam413@gmail.com'
];

// Team member names for dropdown
const TEAM_MEMBERS = [
  'Kiran',
  'Pranav',
  'Gokul',
  'Naveen'
];

interface TeamMember {
  id: string;
  name: string;
  status: string;
  saved: boolean;
}

const App: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: '', status: '', saved: false }
  ]);
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const saveMemberDetails = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member?.name || !member?.status) {
      alert('Please fill in name and task details');
      return;
    }
    
    setMembers(members.map(member => 
      member.id === id ? { ...member, saved: true } : member
    ));
  };

  const editMemberDetails = (id: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, saved: false } : member
    ));
  };

  const addMember = () => {
    // Only allow adding new member if previous member is saved
    if (members.every(member => member.saved)) {
      setMembers([...members, { id: Date.now().toString(), name: '', status: '', saved: false }]);
    } else {
      alert('Please save current member details first');
    }
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateMoM = (): string => {
    return `📅 Daily Stand-up Meeting - ${formatDate(date)}
===========================================

📋 Summary of Tasks and Updates
-------------------------------------------

${members.filter(m => m.saved).map(member => `
👤 Team Member: ${member.name}
🔸 Task/Update: ${member.status}
-------------------------------------------`).join('\n')}

Note: This is an automated task assignment email. Please reach out if you have any questions.

Best regards,
MoM Team`;
  };

  const sendEmailToAll = () => {
    const savedMembers = members.filter(m => m.saved);
    if (savedMembers.length === 0) {
      alert('No team members to send email to');
      return;
    }

    const subject = `Daily Tasks Assignment - ${formatDate(date)}`;
    const body = encodeURIComponent(generateMoM());
    const allEmails = TEAM_EMAILS.join(',');
    
    // Add all emails to both TO and CC to ensure everyone gets notifications
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${allEmails}&cc=${allEmails}&su=${encodeURIComponent(subject)}&body=${body}`, '_blank');
    setEmailSuccess(true);
    setTimeout(() => {
      setEmailSuccess(false);
    }, 3000);
  };

  const deleteMemberTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h1 className="text-center mb-4">Daily Task Assignment</h1>
      
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={date}
              onChange={handleDateChange}
            />
          </div>

          <h4 className="mb-3">Team Member Tasks</h4>
          
          {members.map((member) => (
            <div key={member.id} className="card mb-3">
              <div className="card-body">
                {!member.saved ? (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-11">
                        <select
                          className="form-select"
                          value={member.name}
                          onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                        >
                          <option value="">Select Team Member</option>
                          {TEAM_MEMBERS.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-1 d-flex align-items-center justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeMember(member.id)}
                          disabled={members.length === 1}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Task/Update/Blocker</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter task updates, progress, and any blockers..."
                        value={member.status}
                        onChange={(e) => handleMemberChange(member.id, 'status', e.target.value)}
                      />
                    </div>
                    
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => saveMemberDetails(member.id)}
                    >
                      Save Details
                    </button>
                  </>
                ) : (
                  <div className="saved-details">
                    <h5>{member.name}</h5>
                    <p className="mb-2">{member.status}</p>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => editMemberDetails(member.id)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {members.every(member => member.saved) && (
            <div className="mb-3">
              <button type="button" className="btn btn-outline-primary" onClick={addMember}>
                + Add Team Member
              </button>
            </div>
          )}
        </div>
      </div>

      {members.some(member => member.saved) && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Assigned Tasks</h5>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={sendEmailToAll}
            >
              Send Tasks to All Members
            </button>
          </div>
          <div className="card-body">
            <div className="assigned-tasks mb-3">
              {members
                .filter(m => m.saved)
                .map(member => (
                  <div key={member.id} className="task-item border rounded p-3 mb-3 position-relative">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-2">{member.name}</h5>
                        <p className="mb-0">{member.status}</p>
                      </div>
                      <div className="btn-group">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => editMemberDetails(member.id)}
                        >
                          Edit
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteMemberTask(member.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {emailSuccess && (
              <div className="alert alert-success" role="alert">
                Email opened in Gmail!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
