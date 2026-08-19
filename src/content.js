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
        t: ', building interfaces in React Native, TypeScript and Python — from the Figma file to the shipped screen.',
      },
    ],
    [
      { t: 'I studied at ' },
      { t: 'Link Academy', strong: true },
      {
        t: ' and now build React Native features the way a real team does: reusable components, feature branches, code review. On the side I keep one foot in data — pandas, scikit-learn and SQL.',
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
        t: '. Email is the fastest way to reach me — I usually reply the same day. I’m on LinkedIn too.',
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
