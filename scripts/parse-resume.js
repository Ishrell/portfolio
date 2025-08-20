// Parse resume PDF into a structured JSON for the app content.
// Heuristic, fault-tolerant parser: best-effort extraction; falls back to defaults when uncertain.
// Usage: node scripts/parse-resume.js

import { createRequire } from 'module';
import fs from 'fs/promises';
import path from 'path';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const ROOT = path.resolve(process.cwd());
const PDF_PATH = path.join(ROOT, 'public', 'Internship-21BCE5092.pdf');
const OUTPUT_PATH = path.join(ROOT, 'src', 'content.json');

function sanitize(str) {
  return (str || '').replace(/\u0000/g, '').replace(/\s+/g, ' ').trim();
}

function splitLines(text) {
  return text.split(/\r?\n/).map(sanitize).filter(Boolean);
}

function extractSections(lines) {
  const sections = {};
  const anchors = [
    'experience', 'internship', 'internships', 'work experience',
    'projects', 'education', 'skills', 'technical skills', 'certifications', 'awards', 'achievements'
  ];

  const indices = [];
  lines.forEach((line, i) => {
    const lc = line.toLowerCase();
    if (anchors.some(a => lc.includes(a))) {
      indices.push({ i, key: anchors.find(a => lc.includes(a)) });
    }
  });
  indices.sort((a,b)=>a.i-b.i);
  for (let k = 0; k < indices.length; k++) {
    const { i, key } = indices[k];
    const end = (indices[k+1]?.i ?? lines.length);
    const chunk = lines.slice(i, end);
    sections[key] = chunk;
  }
  return sections;
}

function parseInternships(sectionLines) {
  if (!sectionLines?.length) return [];
  const items = [];
  let current = null;
  for (const line of sectionLines) {
    const m = line.match(/^(.*?)(?:\s+[-\u2014]\s+)?(Intern|Trainee|Internship|Researcher).*?(\b20\d{2}.*)?$/i);
    if (m) {
      if (current) items.push(current);
      current = {
        company: sanitize(m[1]) || 'Company',
        role: sanitize(m[2] || 'Intern'),
        dates: sanitize(m[3] || ''),
        bullets: [],
        tech: [],
        outcomes: ''
      };
      continue;
    }
    if (!current) continue;
    if (/^\s*[\u2022\-\*]/.test(line)) {
      current.bullets.push(line.replace(/^[\s\u2022\-\*]+/, ''));
    } else if (/\b(Java|Python|React|Node|MongoDB|Express|QRadar|Kali|Linux|API|Docker|AWS|Framer|Tailwind)\b/i.test(line)) {
      const techs = line.split(/[,;•]\s*/).map(sanitize).filter(Boolean);
      current.tech.push(...techs);
    } else if (/Outcome|Result|Impact/i.test(line)) {
      current.outcomes = line.replace(/^.*?:\s*/, '');
    }
  }
  if (current) items.push(current);
  return items.filter(i=>i.company && i.role);
}

function parseCerts(sectionLines) {
  if (!sectionLines?.length) return [];
  const out = [];
  for (const line of sectionLines) {
    const m = line.match(/^(.*?)(?:\s+[-\u2014]\s+)?(Certification|Certificate|Certified)(?:\s+[-\u2014]\s+)?(.*)$/i);
    if (m) {
      out.push({
        title: sanitize(m[1] || 'Certification'),
        issuer: sanitize(m[3] || ''),
        category: 'General',
        status: 'Certified'
      });
    }
  }
  return out;
}

function parseSkills(sectionLines) {
  if (!sectionLines?.length) return [];
  const blob = sectionLines.join(', ');
  const tokens = blob.split(/[,;•\n]/).map(sanitize).filter(Boolean);
  const categories = [
    { name: 'Full Stack Development', match: /React|Node|Express|MongoDB|Vite|Tailwind|Bootstrap|HTML|CSS|JavaScript/i },
    { name: 'AI & ML', match: /Python|TensorFlow|PyTorch|Pandas|NumPy|Scikit|OpenCV|ML|DL/i },
    { name: 'Cybersecurity', match: /Kali|QRadar|Burp|Nmap|Wireshark|Metasploit|Linux/i },
  ];
  const out = categories.map(c => ({ category: c.name, items: [] }));
  for (const t of tokens) {
    const hit = out.find(c => categories[out.indexOf(c)].match.test(t));
    if (hit) hit.items.push(t);
  }
  const leftovers = tokens.filter(t => !out.some(c => c.items.includes(t)) && t.length > 1);
  if (leftovers.length) out.push({ category: 'Additional', items: leftovers });
  return out.filter(c => c.items.length);
}

function parseEducation(sectionLines) {
  if (!sectionLines?.length) return [];
  const out = [];
  for (const line of sectionLines) {
    const m = line.match(/^(M\.?S\.?|B\.?Tech|B\.?E\.?|Bachelor|Master|\+2|Class X)[^\d]*(\d{4}[^\d]+\d{4}|\d{4}.*)?/i);
    if (m) {
      out.push({ degree: sanitize(m[1]), school: '', dates: sanitize(m[2] || ''), details: '' });
    }
  }
  return out;
}

async function main() {
  try {
    const pdfBuf = await fs.readFile(PDF_PATH);
    const data = await (pdfParse.default ? pdfParse.default(pdfBuf) : pdfParse(pdfBuf));
    const text = sanitize(data.text || '');
    const lines = splitLines(text);
    const sections = extractSections(lines);

    const internships = parseInternships(sections['experience'] || sections['internship'] || sections['internships'] || []);
    const certifications = parseCerts(sections['certifications'] || sections['awards'] || sections['achievements'] || []);
    const skills = parseSkills(sections['technical skills'] || sections['skills'] || []);
    const education = parseEducation(sections['education'] || []);

    const content = {
      meta: { generatedAt: new Date().toISOString(), source: 'Internship-21BCE5092.pdf' },
      internships,
      certifications,
      skills,
      education,
    };

    await fs.writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Wrote ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('Failed to parse resume:', err.message);
    try {
      await fs.access(OUTPUT_PATH);
    } catch {
      const fallback = {
        meta: { generatedAt: new Date().toISOString(), source: 'fallback' },
        internships: [], certifications: [], skills: [], education: []
      };
      await fs.writeFile(OUTPUT_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
      console.log(`Created fallback ${OUTPUT_PATH}`);
    }
    process.exitCode = 1;
  }
}

main();
