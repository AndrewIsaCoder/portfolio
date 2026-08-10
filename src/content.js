// Textele și linkurile — singurul loc de editat pentru conținut.
// Datele din secțiunile „about" vin din CV (Andrei_Stoian_CV.pdf).

export const name = 'Stoian Andrei'
export const role = 'Frontend Developer'

export const email = 'stoian.andrei239@gmail.com'
export const links = {
  linkedin: 'https://www.linkedin.com/in/stoian-andrei-8175b22ab/',
}

// Paragrafele sunt liste de fragmente; `strong` îl scrie negru, restul e gri.
export const about = {
  paragraphs: [
    [
      { t: 'Frontend & mobile developer', strong: true },
      {
        t: ', building applications in React Native, TypeScript and Python — from Figma design to shipped screen.',
      },
    ],
    [
      { t: 'After studying at ' },
      { t: 'Link Academy', strong: true },
      { t: ', I interned at ' },
      { t: 'Access Memory', strong: true },
      {
        t: ', building React Native features and reusable UI components alongside senior developers.',
      },
    ],
  ],
  listTitle: 'Certifications:',
  list: [
    { label: 'Certified Associate Python Programmer', note: '2026' },
    { label: 'Certified AI & Python Developer', note: '2024' },
    { label: 'Web Front-End Development', note: '2025' },
    { label: 'Cybersecurity', note: '2025' },
    { label: 'Introduction to Programming', note: '2025' },
  ],
}

export const chat = {
  paragraphs: [
    [
      { t: 'Based in Bucharest', strong: true },
      {
        t: ', open to frontend, mobile and junior full-stack roles. Fastest by email — I usually reply the same day.',
      },
    ],
  ],
  listTitle: 'Stack:',
  list: [
    { label: 'TypeScript & JavaScript', note: 'daily' },
    { label: 'React Native, React, Vue, Angular', note: 'daily' },
    { label: 'Python, pandas, scikit-learn', note: 'projects' },
    { label: 'SQL, REST APIs, ETL basics', note: 'projects' },
    { label: 'Git, GitHub, Figma, VS Code', note: 'tools' },
  ],
}
