// Cover Template Definitions
// Each template has: id, name, description, fields (with labels/types), and preview layout config

const COVER_TEMPLATES = {
  assignment: {
    id: 'assignment',
    name: 'Assignment Cover',
    icon: 'document',
    description: 'Standard academic assignment cover page',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Economics', required: true },
      { key: 'coverTitle', label: 'Cover Title', type: 'text', placeholder: 'Assignment', default: 'Assignment', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Academic Submission — Sixth Semester' },
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'programme', label: 'Programme', type: 'text', placeholder: 'B.A. (Economics Honours)' },
      { key: 'semester', label: 'Semester', type: 'text', placeholder: '6th Semester' },
      { key: 'classRoll', label: 'Class Roll No.', type: 'text', placeholder: '345' },
      { key: 'uniRoll', label: 'University Roll No.', type: 'text', placeholder: '24113695' },
      { key: 'submittedTo', label: 'Submitted To', type: 'text', placeholder: 'Department of Economics' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['coverTitle', 'subtitle'] },
      { type: 'details', title: 'Student details', numbering: '/ 01', items: ['name', 'programme', 'semester', 'classRoll', 'uniRoll', 'submittedTo'] },
      { type: 'footer', items: ['name', 'programme'] }
    ]
  },

  practical: {
    id: 'practical',
    name: 'Practical File',
    icon: 'flask',
    description: 'Lab manual / practical file cover',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Physics', required: true },
      { key: 'coverTitle', label: 'Cover Title', type: 'text', placeholder: 'Practical File', default: 'Practical File', required: true },
      { key: 'subjectName', label: 'Subject Name', type: 'text', placeholder: 'Optics & Modern Physics', required: true },
      { key: 'subjectCode', label: 'Subject Code', type: 'text', placeholder: 'PHY-CC-14' },
      { key: 'experimentNo', label: 'Experiment No.', type: 'text', placeholder: '04' },
      { key: 'experimentTitle', label: 'Experiment Title', type: 'text', placeholder: 'Determination of Wavelength' },
      { key: 'datePerformed', label: 'Date Performed', type: 'date', placeholder: '2026-08-15' },
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'rollNo', label: 'Roll No.', type: 'text', placeholder: '24113695' },
      { key: 'semester', label: 'Semester', type: 'text', placeholder: '4th Semester' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['coverTitle'] },
      { type: 'subtitle', items: ['subjectName', 'subjectCode'] },
      { type: 'experiment', items: ['experimentNo', 'experimentTitle', 'datePerformed'] },
      { type: 'details', title: 'Student details', numbering: '/ 02', items: ['name', 'rollNo', 'semester', 'department'] },
      { type: 'footer', items: ['name', 'rollNo'] }
    ]
  },

  project: {
    id: 'project',
    name: 'Project Report',
    icon: 'briefcase',
    description: 'Final year project report cover',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Computer Science', required: true },
      { key: 'projectTitle', label: 'Project Title', type: 'text', placeholder: 'AI-Powered Academic Cover Generator', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'A Final Year Project Report' },
      { key: 'name', label: 'Candidate Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'programme', label: 'Programme', type: 'text', placeholder: 'B.Sc. (Computer Science)' },
      { key: 'rollNo', label: 'Roll No.', type: 'text', placeholder: '24113695' },
      { key: 'guide', label: 'Project Guide', type: 'text', placeholder: 'Dr. R. K. Sharma' },
      { key: 'hod', label: 'HOD', type: 'text', placeholder: 'Dr. S. P. Singh' },
      { key: 'academicYear', label: 'Academic Year', type: 'text', placeholder: '2025–2026' },
      { key: 'submissionDate', label: 'Submission Date', type: 'date', placeholder: '2026-05-15' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['projectTitle'] },
      { type: 'subtitle', items: ['subtitle'] },
      { type: 'details', title: 'Submitted by', numbering: '/ 03', items: ['name', 'programme', 'rollNo', 'department'] },
      { type: 'guide', items: ['guide', 'hod'] },
      { type: 'meta', items: ['academicYear', 'submissionDate'] },
      { type: 'footer', items: ['name', 'programme'] }
    ]
  },

  seminar: {
    id: 'seminar',
    name: 'Seminar',
    icon: 'presentation',
    description: 'Seminar / paper presentation cover',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Commerce', required: true },
      { key: 'topic', label: 'Topic / Title', type: 'text', placeholder: 'Digital India: Transforming the Nation', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'A Seminar Paper Presentation' },
      { key: 'presentedTo', label: 'Presented To', type: 'text', placeholder: 'Department of Commerce' },
      { key: 'date', label: 'Date', type: 'date', placeholder: '2026-09-20' },
      { key: 'guidedBy', label: 'Guided By', type: 'text', placeholder: 'Prof. Anjali Verma' },
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'programme', label: 'Programme', type: 'text', placeholder: 'B.Com. (Honours)' },
      { key: 'semester', label: 'Semester', type: 'text', placeholder: '5th Semester' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['topic'] },
      { type: 'subtitle', items: ['subtitle'] },
      { type: 'details', title: 'Presented by', numbering: '/ 04', items: ['name', 'programme', 'semester'] },
      { type: 'guide', items: ['guidedBy', 'presentedTo'] },
      { type: 'meta', items: ['date'] },
      { type: 'footer', items: ['name', 'programme'] }
    ]
  },

  internship: {
    id: 'internship',
    name: 'Internship Report',
    icon: 'building',
    description: 'Internship / training report cover',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Management', required: true },
      { key: 'companyName', label: 'Company / Organization', type: 'text', placeholder: 'Tata Consultancy Services', required: true },
      { key: 'internshipTitle', label: 'Internship Title', type: 'text', placeholder: 'Summer Internship Report', required: true },
      { key: 'industry', label: 'Industry', type: 'text', placeholder: 'Information Technology' },
      { key: 'duration', label: 'Duration', type: 'text', placeholder: 'June 2026 – July 2026 (8 weeks)' },
      { key: 'supervisor', label: 'Supervisor / HR', type: 'text', placeholder: 'Mr. Rajesh Kumar' },
      { key: 'name', label: 'Candidate Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'programme', label: 'Programme', type: 'text', placeholder: 'BBA' },
      { key: 'rollNo', label: 'Roll No.', type: 'text', placeholder: '24113695' },
      { key: 'semester', label: 'Semester', type: 'text', placeholder: '6th Semester' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['internshipTitle'] },
      { type: 'subtitle', items: ['companyName', 'industry'] },
      { type: 'details', title: 'Submitted by', numbering: '/ 05', items: ['name', 'programme', 'rollNo', 'semester'] },
      { type: 'guide', items: ['supervisor'] },
      { type: 'meta', items: ['duration'] },
      { type: 'footer', items: ['name', 'programme'] }
    ]
  },

  thesis: {
    id: 'thesis',
    name: 'Thesis / Dissertation',
    icon: 'academic',
    description: 'Thesis, dissertation, or research cover',
    fields: [
      { key: 'university', label: 'University', type: 'text', placeholder: 'B. N. Mandal University', required: true },
      { key: 'college', label: 'College', type: 'text', placeholder: 'M. L. T. College, Saharsa', required: true },
      { key: 'location', label: 'Location', type: 'text', placeholder: 'Madhepura, Bihar' },
      { key: 'department', label: 'Department', type: 'text', placeholder: 'Department of Economics', required: true },
      { key: 'thesisTitle', label: 'Thesis Title', type: 'text', placeholder: 'Impact of Digital Literacy on Rural Development', required: true },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'A Dissertation Submitted in Partial Fulfilment' },
      { key: 'candidate', label: 'Candidate Name', type: 'text', placeholder: 'Amit Kumar', required: true },
      { key: 'programme', label: 'Programme', type: 'text', placeholder: 'M.A. Economics' },
      { key: 'rollNo', label: 'Roll No.', type: 'text', placeholder: '24113695' },
      { key: 'guide', label: 'Supervisor / Guide', type: 'text', placeholder: 'Dr. R. K. Sharma' },
      { key: 'hod', label: 'Head of Department', type: 'text', placeholder: 'Dr. S. P. Singh' },
      { key: 'external', label: 'External Examiner', type: 'text', placeholder: 'Prof. (Dr.) A. K. Jha' },
      { key: 'submissionDate', label: 'Submission Date', type: 'date', placeholder: '2026-06-30' },
      { key: 'year', label: 'Year', type: 'text', placeholder: '2026' }
    ],
    sections: [
      { type: 'header', items: ['university', 'college', 'location'] },
      { type: 'divider' },
      { type: 'title', items: ['thesisTitle'] },
      { type: 'subtitle', items: ['subtitle'] },
      { type: 'details', title: 'Submitted by', numbering: '/ 06', items: ['candidate', 'programme', 'rollNo', 'department'] },
      { type: 'guide', items: ['guide', 'hod', 'external'] },
      { type: 'meta', items: ['submissionDate', 'year'] },
      { type: 'footer', items: ['candidate', 'programme'] }
    ]
  }
};

// Theme Definitions
const COVER_THEMES = {
  navy: {
    id: 'navy',
    name: 'Navy & Gold',
    colors: {
      bg: '#0a1929',
      surface: '#0f2540',
      border: '#1e3a5f',
      primary: '#d4af37',
      accent: '#f4d03f',
      text: '#ffffff',
      textMuted: '#a8b8cc',
      textSubtle: '#7a8a9a',
      divider: '#1e3a5f',
      number: '#d4af37'
    }
  },
  forest: {
    id: 'forest',
    name: 'Forest & Copper',
    colors: {
      bg: '#0d1f17',
      surface: '#142b21',
      border: '#1f3a2e',
      primary: '#b87333',
      accent: '#d4955a',
      text: '#ffffff',
      textMuted: '#a8b8ac',
      textSubtle: '#7a8a7e',
      divider: '#1f3a2e',
      number: '#b87333'
    }
  },
  charcoal: {
    id: 'charcoal',
    name: 'Charcoal & Sage',
    colors: {
      bg: '#1a1d1a',
      surface: '#242824',
      border: '#3a3f3a',
      primary: '#9caf88',
      accent: '#b5c8a0',
      text: '#ffffff',
      textMuted: '#b5b8b5',
      textSubtle: '#8a8d8a',
      divider: '#3a3f3a',
      number: '#9caf88'
    }
  }
};

// Default values for new covers
const DEFAULT_VALUES = {
  assignment: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Economics',
    coverTitle: 'Assignment',
    subtitle: 'Academic Submission — Sixth Semester',
    name: 'Amit Kumar',
    programme: 'B.A. (Economics Honours)',
    semester: '6th Semester',
    classRoll: '345',
    uniRoll: '24113695',
    submittedTo: 'Department of Economics'
  },
  practical: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Physics',
    coverTitle: 'Practical File',
    subjectName: 'Optics & Modern Physics',
    subjectCode: 'PHY-CC-14',
    experimentNo: '04',
    experimentTitle: 'Determination of Wavelength of Light',
    datePerformed: '2026-08-15',
    name: 'Amit Kumar',
    rollNo: '24113695',
    semester: '4th Semester'
  },
  project: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Computer Science',
    projectTitle: 'AI-Powered Academic Cover Generator',
    subtitle: 'A Final Year Project Report',
    name: 'Amit Kumar',
    programme: 'B.Sc. (Computer Science)',
    rollNo: '24113695',
    guide: 'Dr. R. K. Sharma',
    hod: 'Dr. S. P. Singh',
    academicYear: '2025–2026',
    submissionDate: '2026-05-15'
  },
  seminar: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Commerce',
    topic: 'Digital India: Transforming the Nation',
    subtitle: 'A Seminar Paper Presentation',
    presentedTo: 'Department of Commerce',
    date: '2026-09-20',
    guidedBy: 'Prof. Anjali Verma',
    name: 'Amit Kumar',
    programme: 'B.Com. (Honours)',
    semester: '5th Semester'
  },
  internship: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Management',
    companyName: 'Tata Consultancy Services',
    internshipTitle: 'Summer Internship Report',
    industry: 'Information Technology',
    duration: 'June 2026 – July 2026 (8 weeks)',
    supervisor: 'Mr. Rajesh Kumar',
    name: 'Amit Kumar',
    programme: 'BBA',
    rollNo: '24113695',
    semester: '6th Semester'
  },
  thesis: {
    university: 'B. N. Mandal University',
    college: 'M. L. T. College, Saharsa',
    location: 'Madhepura, Bihar',
    department: 'Department of Economics',
    thesisTitle: 'Impact of Digital Literacy on Rural Development',
    subtitle: 'A Dissertation Submitted in Partial Fulfilment of the Requirements',
    candidate: 'Amit Kumar',
    programme: 'M.A. Economics',
    rollNo: '24113695',
    guide: 'Dr. R. K. Sharma',
    hod: 'Dr. S. P. Singh',
    external: 'Prof. (Dr.) A. K. Jha',
    submissionDate: '2026-06-30',
    year: '2026'
  }
};
