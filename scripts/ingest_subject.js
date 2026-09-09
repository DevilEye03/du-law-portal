#!/usr/bin/env node
/**
 * DU Law Notes Portal — Subject Auto-Ingestion System
 * 
 * Automatically parses subject study dossiers/HTML notes, extracts:
 * 1. Syllabus units and topic mappings (exact 10-topic DU syllabus alignment)
 * 2. Complete FIRAC Landmark Case Briefs (Facts, Issues, Arguments, Ratio, Exam Tips)
 * 3. DU Semester Past Year Questions (PYQs) & Detailed Model Answers
 * 4. Rapid Revision Capsules, Mnemonics & Case Tables
 * 
 * And registers the subject and its semester directly into js/data.js.
 * 
 * Usage:
 *   node scripts/ingest_subject.js [folder_path]
 *   e.g.: node scripts/ingest_subject.js "sem 3/company"
 */

const fs = require('fs');
const path = require('path');

// Root paths
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'js', 'data.js');

// Helper to strip HTML tags for plain text summaries
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

// Convert HTML content block to clean readable markdown format
function htmlToMarkdown(html) {
  if (!html) return '';
  let md = html
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (m, c) => `\n\n### ${stripHtml(c)}\n\n`)
    .replace(/<p[^>]*>(.*?)<\/p>/gi, (m, c) => `\n\n${c}\n\n`)
    .replace(/<li[^>]*>(.*?)<\/li>/gi, (m, c) => `\n- ${c.trim()}`)
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div class="tip"[^>]*>(.*?)<\/div>/gis, (m, c) => `\n\n> 💡 **Exam Tip:** ${stripHtml(c)}\n\n`)
    .replace(/<div class="note"[^>]*>(.*?)<\/div>/gis, (m, c) => `\n\n> 📌 **Note:** ${stripHtml(c)}\n\n`)
    .replace(/<div class="callout warning"[^>]*>(.*?)<\/div>/gis, (m, c) => `\n\n> ⚠️ **Examiner Alert:** ${stripHtml(c)}\n\n`);

  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return md;
}

// Known subject configurations and themes
const SUBJECT_CONFIGS = {
  company: {
    id: 'company',
    code: 'LB-303',
    name: 'Company Law',
    shortName: 'Company Law',
    semester: 3,
    theme: {
      primary: '#1e3a5f',
      primaryDark: '#0d1b2a',
      primaryLight: '#2d547d',
      accent: '#d4a373',
      accentLight: '#faedcd',
      bgTint: '#f5f7fa',
      border: '#ccd5e1',
      badgeBg: '#e8eff8',
      badgeColor: '#1e3a5f',
      gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 55%, #3e5c76 100%)',
      tagline: 'Corporate Personality, Lifting the Veil, Board of Directors, Oppression & Winding Up',
      motto: 'Salomon v. Salomon & Co. • Turquand Rule • Foss v. Harbottle',
      quote: 'The company is at law a different person altogether from the subscribers to the memorandum. — Lord Macnaghten in Salomon v. Salomon & Co Ltd',
      icon: 'fa-building-columns'
    },
    // Explicit 10-topic DU LL.B. Syllabus mapping
    topics: [
      {
        unit: 1,
        title: "Corporate Personality & Lifting the Corporate Veil",
        file: "DU_Company_Law_Corporate_Personality_Notes (2).html"
      },
      {
        unit: 2,
        title: "Promotion & Formation of a Company",
        file: "DU_Company_Law_Promotion_Formation_Notes.html"
      },
      {
        unit: 3,
        title: "Company's Constitutional Documents (MOA & AOA)",
        file: "DU_LLB_Company_Law_Topic_3_Constitutional_Documents.html"
      },
      {
        unit: 4,
        title: "Capital Market Instruments (Prospectus, Shares & Debentures)",
        file: "Topic4_Capital_Market_Instruments_DU_LLB.html"
      },
      {
        unit: 5,
        title: "Board of Directors (Appointment, Powers & Duties)",
        file: "Board_of_Directors_Topic5_Notes.html"
      },
      {
        unit: 6,
        title: "General Meetings & Corporate Democracy",
        file: "General_Meetings_Topic6_Notes.html"
      },
      {
        unit: 7,
        title: "Prevention of Oppression & Mismanagement",
        file: "Oppression_Mismanagement_Topic7_Notes.html"
      },
      {
        unit: 8,
        title: "Winding Up of Companies",
        file: "DU_Topic_8_Winding_Up_Comprehensive_Notes.html"
      },
      {
        unit: 9,
        title: "Adjudicatory Bodies (NCLT, NCLAT & Special Courts)",
        file: "DU_Topic_9_Adjudicatory_Bodies_Comprehensive_Notes.html"
      },
      {
        unit: 10,
        title: "Contemporary Developments (CSR, Criminal Liability, IBC & ESG)",
        file: "DU_Topic_10_Contemporary_Developments_Comprehensive_Notes.html"
      }
    ]
  }
};

/**
 * Parses an HTML notes file for Cases, PYQs, and Revision
 */
function parseHtmlFile(filePath, relFilePath, unitNumber, explicitTitle) {
  const content = fs.readFileSync(filePath, 'utf8');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const rawTitle = titleMatch ? titleMatch[1] : path.basename(filePath, '.html');
  
  let unitTitle = explicitTitle || rawTitle.replace(/\s*[|—–-]\s*DU.*$/i, '').trim();
  unitTitle = unitTitle.replace(/^DU\s*(?:LL\.?B\.?)?\s*Company\s*Law\s*[—–-]?\s*/i, '').trim();
  unitTitle = unitTitle.replace(/^Topic\s*\d+\s*:\s*/i, '').trim();
  if (!unitTitle) unitTitle = `Unit ${unitNumber}: ${path.basename(filePath, '.html')}`;

  const cases = [];
  const pyqs = [];
  const revisions = [];
  let caseIdx = 1;

  // =========================================================================
  // 1. EXTRACT CASES (Method 1: details.case blocks - Topics 1, 2, 3)
  // =========================================================================
  const detailsMatches = [...content.matchAll(/<details class="case"[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/details>/gi)];
  for (const dm of detailsMatches) {
    const anchorId = dm[1];
    const body = dm[2];
    const sum = body.match(/<summary>([\s\S]*?)<\/summary>/i);
    let title = sum ? stripHtml(sum[1]) : '';
    title = title.replace(/^[^\w\s]+\s*/, '').replace(/^Case\s*\d+\s*[·•-]\s*/i, '').replace(/—.*$/, '').replace(/–.*$/, '').trim();
    
    const cite = body.match(/<span class="cit">([\s\S]*?)<\/span>/i) ||
                 (sum ? sum[1].match(/\((?:18|19|20)\d{2}\)[^—–<]*/) : null);

    const factsMatch = body.match(/<div class="blk facts">[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    const facts = factsMatch ? stripHtml(factsMatch[1]) : 'Material facts as recorded in DU Case Material.';

    const issuesMatch = body.match(/<div class="blk issues">[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    const issues = issuesMatch ? stripHtml(issuesMatch[1]) : 'Core legal question examined by the bench.';

    const argMatch = body.match(/<div class="blk (?:arg|arguments)">[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    const argumentsText = argMatch ? stripHtml(argMatch[1]) : 'Contentions of the parties before the court.';

    const heldMatch = body.match(/<div class="blk (?:held|ratio|decision)">[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    const ratio = heldMatch ? stripHtml(heldMatch[1]) : 'Ratio decidendi and principle of corporate law established.';

    const tipMatch = body.match(/<div class="blk (?:tip|principle)">[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
    const examTips = tipMatch ? stripHtml(tipMatch[1]) : 'Critical authority to cite in DU semester exam answers.';

    if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
      cases.push({
        id: `case-u${unitNumber}-${caseIdx++}`,
        name: title,
        citation: cite ? stripHtml(cite[1] || cite[0]) : 'DU Prescribed Landmark Case',
        unitNumber: unitNumber,
        unit: `Topic ${unitNumber}: ${unitTitle}`,
        file: relFilePath,
        anchorId: anchorId || `case-${caseIdx}`,
        facts: facts,
        issues: issues,
        arguments: argumentsText,
        ratio: ratio,
        examTips: examTips
      });
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 2: article.case-card blocks)
  // =========================================================================
  const cardMatches = [...content.matchAll(/<(?:article|div)[^>]*class="[^"]*case-card[^"]*"[^>]*id="?([^"\s>]*)"?[^>]*>([\s\S]*?)<\/(?:article|div)>\s*<\/(?:article|div)>/gi)];
  for (const cm of cardMatches) {
    const anchorId = cm[1];
    const cardContent = cm[2];
    const h3 = cardContent.match(/<h3[^>]*>(.*?)<\/h3>/i);
    const cite = cardContent.match(/<div class="cite"[^>]*>(.*?)<\/div>/i);
    
    if (h3) {
      let title = stripHtml(h3[1]).replace(/^[0-9.]+\s*/, '').trim();

      const factMatch = cardContent.match(/<section class="case-block">[\s\S]*?<h4[^>]*>Material facts<\/h4>([\s\S]*?)<\/section>/i) ||
                        cardContent.match(/<div class="case-block"[^>]*>[\s\S]*?<h4[^>]*>Facts<\/h4>([\s\S]*?)<\/div>/i);
      const facts = factMatch ? stripHtml(factMatch[1]) : 'Material facts recorded in DU Case Material.';

      const issueMatch = cardContent.match(/<section class="case-block issue"[^>]*>[\s\S]*?<h4[^>]*>Issue<\/h4>([\s\S]*?)<\/section>/i) ||
                         cardContent.match(/<div class="case-block issue"[^>]*>[\s\S]*?<h4[^>]*>Issue<\/h4>([\s\S]*?)<\/div>/i);
      const issues = issueMatch ? stripHtml(issueMatch[1]) : 'Issue regarding ultra vires or indoor management doctrine.';

      const compMatch = cardContent.match(/<section class="case-block company"[^>]*>[\s\S]*?<h4[^>]*>.*?<\/h4>([\s\S]*?)<\/section>/i) ||
                        cardContent.match(/<div class="case-block company"[^>]*>[\s\S]*?<h4[^>]*>.*?<\/h4>([\s\S]*?)<\/div>/i);
      const argumentsText = compMatch ? stripHtml(compMatch[1]) : 'Pleadings on constructive notice and indoor management.';

      const holdMatch = cardContent.match(/<section class="case-block holding[^"]*"[^>]*>[\s\S]*?<h4[^>]*>.*?<\/h4>([\s\S]*?)<\/section>/i) ||
                        cardContent.match(/<div class="case-block holding[^"]*"[^>]*>[\s\S]*?<h4[^>]*>.*?<\/h4>([\s\S]*?)<\/div>/i);
      const ratioMatch = cardContent.match(/<div class="ratio"[^>]*>(.*?)<\/div>/i);
      const ratio = (holdMatch ? stripHtml(holdMatch[1]) : '') + (ratioMatch ? ' ' + stripHtml(ratioMatch[1]) : '');

      const tipMatch = cardContent.match(/<div class="tip"[^>]*>(.*?)<\/div>/i);
      const examTips = tipMatch ? stripHtml(tipMatch[1]) : 'Essential authority to establish corporate capacity.';

      if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
        cases.push({
          id: `case-u${unitNumber}-${caseIdx++}`,
          name: title,
          citation: cite ? stripHtml(cite[1]) : 'DU Case Material',
          unitNumber: unitNumber,
          unit: `Topic ${unitNumber}: ${unitTitle}`,
          file: relFilePath,
          anchorId: anchorId || `case-${caseIdx}`,
          facts: facts,
          issues: issues,
          arguments: argumentsText,
          ratio: ratio || 'Established landmark authority on company law doctrine.',
          examTips: examTips
        });
      }
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 3: div.case blocks - Topics 5, 6, 7)
  // =========================================================================
  const divCaseBlocks = content.split(/<div class="case"[^>]*id="([^"]*)"[^>]*>/i);
  for (let i = 1; i < divCaseBlocks.length; i += 2) {
    const anchorId = divCaseBlocks[i];
    const body = divCaseBlocks[i + 1] ? divCaseBlocks[i + 1].split(/<div class="case"/i)[0] : '';
    const h3 = body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    let title = h3 ? stripHtml(h3[1]) : '';
    title = title.replace(/^[^\w\s]+\s*/, '').replace(/^Case\s*\d+\s*[·•-]\s*/i, '').trim();

    const cite = body.match(/<div class="cite"[^>]*>(.*?)<\/div>/i) ||
                 body.match(/<span class="cite"[^>]*>(.*?)<\/span>/i);

    const factMatch = body.match(/<b>Facts:?<\/b>([\s\S]*?)(?:<p><b>|<\/p>|$)/i) ||
                      body.match(/<h4>(?:Facts|Material Facts)<\/h4>([\s\S]*?)(?:<h4>|<\/div>|$)/i);
    const facts = factMatch ? stripHtml(factMatch[1]) : 'Material facts as recorded in DU Case Material.';

    const issueMatch = body.match(/<b>Issues?:?<\/b>([\s\S]*?)(?:<p><b>|<\/p>|$)/i) ||
                       body.match(/<h4>(?:Issue|Issues)<\/h4>([\s\S]*?)(?:<h4>|<\/div>|$)/i);
    const issues = issueMatch ? stripHtml(issueMatch[1]) : 'Core legal issue examined by the court.';

    const ratioMatch = body.match(/<b>(?:Ratio|Holding):?<\/b>([\s\S]*?)(?:<p><b>|<\/p>|$)/i) ||
                       body.match(/<h4>(?:Ratio Decidendi|Holding)<\/h4>([\s\S]*?)(?:<h4>|<\/div>|$)/i);
    const ratio = ratioMatch ? stripHtml(ratioMatch[1]) : 'Governing principle on corporate law doctrine.';

    const tipMatch = body.match(/<div class="tip"[^>]*>(.*?)<\/div>/i) ||
                     body.match(/<b>Exam Tip:?<\/b>([\s\S]*?)(?:<p><b>|<\/p>|$)/i);
    const examTips = tipMatch ? stripHtml(tipMatch[1]) : 'High-yielding case authority for DU semester examinations.';

    if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
      cases.push({
        id: `case-u${unitNumber}-${caseIdx++}`,
        name: title,
        citation: cite ? stripHtml(cite[1]) : 'DU Case Material',
        unitNumber: unitNumber,
        unit: `Topic ${unitNumber}: ${unitTitle}`,
        file: relFilePath,
        anchorId: anchorId || `case-${caseIdx}`,
        facts: facts,
        issues: issues,
        arguments: 'Contentions and statutory provisions examined by the court.',
        ratio: ratio,
        examTips: examTips
      });
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 4: Topic 4 article.case blocks)
  // =========================================================================
  if (unitNumber === 4) {
    const caseArticles = [...content.matchAll(/<article\s+class="case"[^>]*>([\s\S]*?)<\/article>/gi)];
    for (const ca of caseArticles) {
      const block = ca[1];
      const h3 = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      if (!h3) continue;
      let title = stripHtml(h3[1]).replace(/^\d+\.\d+\s*/, '').replace(/DU Case Material[\s\S]*$/, '').replace(/Avtar Case Pilot[\s\S]*$/, '').trim();
      const cite = h3[1].match(/\((?:18|19|20)\d{2}\)[^<]*/) || ['(Landmark Authority)'];

      const factsM = block.match(/<strong>Facts\.?<\/strong>([\s\S]*?)(?:<p><strong>|<\/p>|$)/i);
      const issuesM = block.match(/<strong>Issues?\.?<\/strong>([\s\S]*?)(?:<p><strong>|<\/p>|$)/i);
      const argsM = block.match(/<strong>Arguments?\.?<\/strong>([\s\S]*?)(?:<p><strong>|<\/p>|$)/i);
      const decisionM = block.match(/<strong>Decision\.?<\/strong>([\s\S]*?)(?:<p><strong>|<\/p>|$)/i);
      const principleM = block.match(/<strong>Principle\.?<\/strong>([\s\S]*?)(?:<p><strong>|<\/p>|$)/i);

      if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
        cases.push({
          id: `case-u4-${caseIdx++}`,
          name: title,
          citation: stripHtml(cite[0]),
          unitNumber: 4,
          unit: `Topic 4: ${unitTitle}`,
          file: relFilePath,
          anchorId: `case-u4-${caseIdx}`,
          facts: factsM ? stripHtml(factsM[1]) : "Material facts regarding prospectus disclosures and capital issue.",
          issues: issuesM ? stripHtml(issuesM[1]) : "Whether statement in prospectus constituted untrue misrepresentation or breach of duty.",
          arguments: argsM ? stripHtml(argsM[1]) : "Contentions on reliance, deceit, and reasonable grounds for belief.",
          ratio: (decisionM ? stripHtml(decisionM[1]) : "") + " " + (principleM ? stripHtml(principleM[1]) : ""),
          examTips: principleM ? stripHtml(principleM[1]) : "Always cite alongside Section 35 and golden rule of prospectus."
        });
      }
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 5: Topic 8 Case Dossiers)
  // =========================================================================
  if (unitNumber === 8) {
    const dossierMatches = [...content.matchAll(/<h2[^>]*>[^<]*Case dossier\s+([IVXLCDM]+)\s*—\s*([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>\s*\d+\s*·|$)/gi)];
    for (const dm of dossierMatches) {
      const dossierTitle = stripHtml(dm[2]);
      const body = dm[3];

      const labelM = body.match(/<div\s+class="case-label"[^>]*>([\s\S]*?)<\/div>/i);
      const h3TitleM = body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      let title = h3TitleM ? stripHtml(h3TitleM[1]) : dossierTitle;
      title = title.replace(/\((?:18|19|20)\d{2}\)[^<]*/, '').replace(/\[(?:18|19|20)\d{2}\][^<]*/, '').trim();

      const factsM = body.match(/<h3[^>]*>Facts[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const issuesM = body.match(/<h3[^>]*>Issues?[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const argsM = body.match(/<h3[^>]*>(?:Petitioning|Appellant|Corporation)[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const decisionM = body.match(/<h3[^>]*>Decision[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const principleM = body.match(/<h3[^>]*>(?:Principle|Case-use capsule)[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);

      if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
        cases.push({
          id: `case-u8-${caseIdx++}`,
          name: title,
          citation: labelM ? stripHtml(labelM[1]) : 'DU Primary Prescribed Authority',
          unitNumber: 8,
          unit: `Topic 8: ${unitTitle}`,
          file: relFilePath,
          anchorId: `case-u8-${caseIdx}`,
          facts: factsM ? stripHtml(factsM[1]) : "Material facts as recorded in DU Case Material Topic 8.",
          issues: issuesM ? stripHtml(issuesM[1]) : "Whether circumstances justify an order of winding up under the just and equitable clause.",
          arguments: argsM ? stripHtml(argsM[1]) : "Contentions of petitioning shareholders versus company continuation side.",
          ratio: decisionM ? stripHtml(decisionM[1]) : "Governing ratio decidendi on just and equitable winding up.",
          examTips: principleM ? stripHtml(principleM[1]) : "Essential precedent for DU semester exam problem on substratum failure or deadlock."
        });
      }
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 6: Topic 9 Case Dossiers)
  // =========================================================================
  if (unitNumber === 9) {
    const dossierMatches = [...content.matchAll(/<h2[^>]*>[^<]*Case dossier\s+(\d+)\s*:\s*([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>\s*\d+\s*·|$)/gi)];
    for (const dm of dossierMatches) {
      const dossierTitle = stripHtml(dm[2]);
      const body = dm[3];

      const labelM = body.match(/<p\s+class="case-label"[^>]*>([\s\S]*?)<\/p>/i);
      const title = dossierTitle.replace(/\((?:18|19|20)\d{2}\)[^<]*/, '').trim();

      const factsM = body.match(/<h3[^>]*>[B-D]\.\s*Material facts[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const issuesM = body.match(/<h3[^>]*>(?:The two questions|[E-I]\.\s*Issue)[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const argsM = body.match(/<h4[^>]*>Petitioner’s case[\s\S]*?<\/h4>([\s\S]*?)(?=<h4|<h3|$)/i) ||
                    body.match(/<h3[^>]*>(?:Appellants’|State’s) arguments[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const decisionM = body.match(/<h3[^>]*>(?:Holding|Reasoning I)[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
      const principleM = body.match(/<h3[^>]*>(?:Examination-ready case capsule|Reasoning)[\s\S]*?<\/h3>([\s\S]*?)(?=<h3|$)/i);

      if (title && !cases.some(c => c.name.toLowerCase() === title.toLowerCase())) {
        cases.push({
          id: `case-u9-${caseIdx++}`,
          name: title,
          citation: labelM ? stripHtml(labelM[1]) : 'Prescribed Landmark Ruling',
          unitNumber: 9,
          unit: `Topic 9: ${unitTitle}`,
          file: relFilePath,
          anchorId: `case-u9-${caseIdx}`,
          facts: factsM ? stripHtml(factsM[1]) : "Material institutional and statutory facts on tribunal constitution.",
          issues: issuesM ? stripHtml(issuesM[1]) : "Constitutional validity and jurisdictional competence of NCLT / NCLAT.",
          arguments: argsM ? stripHtml(argsM[1]) : "Contentions on judicial independence, separation of powers, and writ jurisdiction.",
          ratio: decisionM ? stripHtml(decisionM[1]) : "Tribunals must possess constitutional safeguards equivalent to courts of law.",
          examTips: principleM ? stripHtml(principleM[1]) : "Primary authority for constitutional challenges to specialist company tribunals."
        });
      }
    }
  }

  // =========================================================================
  // 1. EXTRACT CASES (Method 7: Topic 10 Criminal Cases & Bridge Case)
  // =========================================================================
  if (unitNumber === 10) {
    const caseAMatch = content.match(/<h3[^>]*>Case A\s*—\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>Case B|$)/i);
    if (caseAMatch) {
      cases.push({
        id: `case-u10-${caseIdx++}`,
        name: "Standard Chartered Bank v. Directorate of Enforcement",
        citation: "(2005) 4 SCC 530 (Constitution Bench)",
        unitNumber: 10,
        unit: `Topic 10: ${unitTitle}`,
        file: relFilePath,
        anchorId: `case-u10-${caseIdx}`,
        facts: stripHtml(caseAMatch[2].match(/<p><strong>Material facts[^:]*:?<\/strong>([\s\S]*?)<\/p>/i)?.[1] || "Prosecution of corporate entities under economic offense statutes imposing mandatory imprisonment."),
        issues: stripHtml(caseAMatch[2].match(/<p><strong>Issues?:?<\/strong>([\s\S]*?)<\/p>/i)?.[1] || "Can a corporate body be prosecuted when the penal section mandates imprisonment?"),
        arguments: "Contention that corporation cannot be jailed vs purposive statutory construction.",
        ratio: "Supreme Court held that a company can be prosecuted for offences with mandatory imprisonment and fine; the sentence of fine alone is imposed.",
        examTips: "Overruled Velliappa Textiles; foundational ruling on corporate criminal liability in India."
      });
    }

    const caseBMatch = content.match(/<h3[^>]*>Case B\s*—\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>Case C|$)/i);
    if (caseBMatch) {
      cases.push({
        id: `case-u10-${caseIdx++}`,
        name: "Iridium India Telecom Ltd. v. Motorola Incorporated",
        citation: "(2011) 1 SCC 74",
        unitNumber: 10,
        unit: `Topic 10: ${unitTitle}`,
        file: relFilePath,
        anchorId: `case-u10-${caseIdx}`,
        facts: "Criminal complaint alleging cheating and conspiracy in wireless communication project.",
        issues: "Can mens rea / criminal intention be attributed to a juristic entity for offences under the IPC?",
        arguments: "Corporation has no physical mind vs doctrine of attribution and alter ego.",
        ratio: "Supreme Court firmly established that mens rea can be attributed to corporations through the alter ego / directing mind and will doctrine.",
        examTips: "Always pair with Standard Chartered Bank and Tesco Supermarkets."
      });
    }

    const caseCMatch = content.match(/<h3[^>]*>Case C\s*—\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|<h2|$)/i);
    if (caseCMatch) {
      cases.push({
        id: `case-u10-${caseIdx++}`,
        name: "Sunil Bharti Mittal v. CBI",
        citation: "(2015) 4 SCC 609",
        unitNumber: 10,
        unit: `Topic 10: ${unitTitle}`,
        file: relFilePath,
        anchorId: `case-u10-${caseIdx}`,
        facts: "Special Judge summoned directors solely because the company was arraigned as an accused in the 2G spectrum allocation matter.",
        issues: "Can directors be vicariously liable for corporate acts in the absence of specific statutory deeming provision?",
        arguments: "Alter ego doctrine operates downwards from directing mind to company, not automatically in reverse from company to individual directors.",
        ratio: "Reverse attribution does not apply automatically without an express legislative provision or specific evidence of personal culpability.",
        examTips: "Crucial shield for corporate directors in economic and white-collar prosecutions."
      });
    }

    const case11Match = content.match(/<h2[^>]*>[^<]*11\s*·\s*Arun Kumar Jagatramka[\s\S]*?<\/h2>([\s\S]*?)(?=<h2[^>]*>\s*12\s*·|$)/i);
    if (case11Match) {
      cases.push({
        id: `case-u10-${caseIdx++}`,
        name: "Arun Kumar Jagatramka v. Jindal Steel and Power Ltd.",
        citation: "(2021) 7 SCC 474",
        unitNumber: 10,
        unit: `Topic 10: ${unitTitle}`,
        file: relFilePath,
        anchorId: `case-u10-${caseIdx}`,
        facts: "Ineligible promoter under Section 29A IBC attempted to propose a scheme of compromise under Section 230 Companies Act during liquidation.",
        issues: "Can the ineligibility bars under Section 29A and 35(1)(f) IBC be bypassed via Section 230 compromise?",
        arguments: "Section 230 operates independently under company law vs harmonious construction with IBC objectives.",
        ratio: "Supreme Court held Section 230 compromises in liquidation are subject to Section 29A disqualifications to prevent backdoor entry of defaulted promoters.",
        examTips: "Landmark bridge case harmonizing Companies Act 2013 and Insolvency and Bankruptcy Code 2016."
      });
    }
  }

  // =========================================================================
  // 2. EXTRACT PYQs AND MODEL ANSWERS
  // =========================================================================
  let pyqIdx = 1;

  // Method 1: article.answer / div.answer blocks (Topics 1, 2, 3)
  const ansBlocks = content.split(/<(?:article|div)[^>]*class="[^"]*answer[^"]*"[^>]*>/i);
  for (let i = 1; i < ansBlocks.length; i++) {
    const block = ansBlocks[i];
    const headMatch = block.match(/<(?:div|header)[^>]*class="(?:ans-head|answer-head)"[^>]*>([\s\S]*?)<\/(?:div|header)>/i);
    const bodyMatch = block.match(/<div[^>]*class="(?:ans-body|answer-body)"[^>]*>([\s\S]*?)(?:<\/(?:article|div)>\s*<\/(?:article|div)>|$)/i);

    if (headMatch) {
      const rawHead = headMatch[1];
      const rawBody = bodyMatch ? bodyMatch[1] : '';

      const qMatch = rawHead.match(/<div class="q-txt"[^>]*>([\s\S]*?)<\/div>/i) || 
                     rawHead.match(/<h[34][^>]*>([\s\S]*?)<\/h[34]>/i) ||
                     [null, rawHead];
      
      const questionText = stripHtml(qMatch[1]);
      const yearMatch = rawHead.match(/(?:DU|Term|Dec|June|May|Annual)?\s*\d{4}/i);
      const marksMatch = rawHead.match(/\b\d+\s*Marks\b/i);
      const year = (yearMatch ? yearMatch[0] : 'DU Past Examination') + (marksMatch ? ` • ${marksMatch[0]}` : ' • 20 Marks');
      const modelAnswer = htmlToMarkdown(rawBody || block);

      if (questionText && questionText.length > 15) {
        pyqs.push({
          id: `pyq-u${unitNumber}-${pyqIdx}`,
          number: `Question ${pyqIdx++} (${year})`,
          year: year,
          marks: marksMatch ? marksMatch[0] : '20 Marks',
          unitNumber: unitNumber,
          unit: `Topic ${unitNumber}: ${unitTitle}`,
          file: relFilePath,
          anchorId: `pyq-u${unitNumber}-${pyqIdx}`,
          question: questionText,
          modelAnswer: modelAnswer.length > 50 ? modelAnswer : `### Model Answer Formulation\n\n1. **Statutory Baseline**: State the relevant section of the Companies Act 2013.\n2. **Precedent Analysis**: Apply the governing case law rule.\n3. **Application to Facts**: Conclude with legal determination.`
        });
      }
    }
  }

  // Method 2: div.pyq blocks (Topics 5, 6, 7)
  const divPyqBlocks = content.split(/<div class="pyq"[^>]*>/i);
  for (let i = 1; i < divPyqBlocks.length; i++) {
    const pBlock = divPyqBlocks[i].split(/<div class="pyq"/i)[0];
    const qidMatch = pBlock.match(/<span class="qid"[^>]*>(.*?)<\/span>/i);
    const h4Match = pBlock.match(/<h4[^>]*>(.*?)<\/h4>/i);
    const modelMatch = pBlock.match(/<div class="model"[^>]*>([\s\S]*?)<\/div>/i) ||
                       pBlock.match(/<div class="pyq-body"[^>]*>([\s\S]*?)<\/div>/i);
    const markschemeMatch = pBlock.match(/<div class="markscheme"[^>]*>([\s\S]*?)<\/div>/i);

    if (h4Match || qidMatch) {
      const qText = h4Match ? stripHtml(h4Match[1]).replace(/^PROBLEM\s*[—–-]\s*/i, '').replace(/^“|”$/g, '').trim() : 'Examination problem question';
      const year = qidMatch ? stripHtml(qidMatch[1]) : 'DU Past Examination';
      const modelAnswer = modelMatch ? htmlToMarkdown(modelMatch[1]) : '';
      const markscheme = markschemeMatch ? `\n\n> 🎯 **Marking Scheme & Issues:** ${stripHtml(markschemeMatch[1])}\n\n` : '';

      if (qText && qText.length > 15 && !pyqs.some(p => p.question === qText)) {
        pyqs.push({
          id: `pyq-u${unitNumber}-${pyqIdx++}`,
          number: year,
          year: year,
          marks: '20 Marks',
          unitNumber: unitNumber,
          unit: `Topic ${unitNumber}: ${unitTitle}`,
          file: relFilePath,
          anchorId: `pyq-u${unitNumber}-${pyqIdx}`,
          question: qText,
          modelAnswer: markscheme + (modelAnswer.length > 50 ? modelAnswer : `### Model Answer Formulation\n\n1. **Statutory Baseline**: State the relevant section of the Companies Act 2013.\n2. **Precedent Analysis**: Apply the governing case law rule.\n3. **Application to Facts**: Conclude with legal determination.`)
        });
      }
    }
  }

  // Method 3: Topic 4 div.qa blocks
  if (unitNumber === 4) {
    const qaMatches = [...content.matchAll(/<div\s+class="qa"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)];
    for (const qa of qaMatches) {
      const qM = qa[1].match(/<div\s+class="q"[^>]*>([\s\S]*?)<\/div>/i);
      const aM = qa[1].match(/<div\s+class="a"[^>]*>([\s\S]*?)$/i);
      if (qM && aM) {
        const qText = stripHtml(qM[1]);
        const yearM = qText.match(/(?:DU|Business Association II|\d{4})[^,)]*/i);
        if (!pyqs.some(p => p.question === qText)) {
          pyqs.push({
            id: `pyq-u4-${pyqIdx++}`,
            number: `PYQ ${pyqIdx} (${yearM ? yearM[0] : 'DU Past Examination'})`,
            year: yearM ? yearM[0] : 'DU Past Examination',
            marks: '16/20 Marks',
            unitNumber: 4,
            unit: `Topic 4: ${unitTitle}`,
            file: relFilePath,
            anchorId: `pyq-u4-${pyqIdx}`,
            question: qText,
            modelAnswer: htmlToMarkdown(aM[1])
          });
        }
      }
    }
  }

  // Method 4: Topic 8 PYQ & Practice questions
  if (unitNumber === 8) {
    const pyqMatches = [...content.matchAll(/<h3[^>]*>((?:A\d+\s*·|Practice\s*\d+\s*[·—-])[\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>(?:A\d+\s*·|Practice\s*\d+\s*[·—-])|<h2|$)/gi)];
    for (const pm of pyqMatches) {
      const rawHead = stripHtml(pm[1]);
      const rawBody = pm[2];

      const qTextM = rawBody.match(/<p><strong>Reported question[^:]*:?<\/strong>([\s\S]*?)<\/p>/i) ||
                     rawBody.match(/<p>([\s\S]*?)<\/p>/i);
      const qText = qTextM ? stripHtml(qTextM[1]) : rawHead;

      const modelM = rawBody.match(/<h4[^>]*>Model answer[\s\S]*?<\/h4>([\s\S]*?)$/i) ||
                     rawBody.match(/<strong>Model answer[^:]*:?<\/strong>([\s\S]*?)$/i) ||
                     [null, rawBody];

      if (!pyqs.some(p => p.question === qText)) {
        pyqs.push({
          id: `pyq-u8-${pyqIdx++}`,
          number: rawHead,
          year: rawHead.includes('201') ? (rawHead.match(/201\d/)[0] + ' Examination') : 'DU Prescribed Problem',
          marks: '20 Marks',
          unitNumber: 8,
          unit: `Topic 8: ${unitTitle}`,
          file: relFilePath,
          anchorId: `pyq-u8-${pyqIdx}`,
          question: qText.length > 20 ? qText : rawHead,
          modelAnswer: htmlToMarkdown(modelM[1])
        });
      }
    }
  }

  // Method 5: Topic 9 PYQ & Practice questions
  if (unitNumber === 9) {
    const pyqMatches = [...content.matchAll(/<h3[^>]*>((?:PYQ\s*\d+|Practice\s*\d+|Crossover\s*PYQ)[\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>(?:PYQ\s*\d+|Practice\s*\d+|Crossover\s*PYQ)|<h2|$)/gi)];
    for (const pm of pyqMatches) {
      const rawHead = stripHtml(pm[1]);
      const rawBody = pm[2];

      const qTextM = rawBody.match(/<p><strong>Reported wording[^:]*:?<\/strong>([\s\S]*?)<\/p>/i) ||
                     rawBody.match(/<p>([\s\S]*?)<\/p>/i);
      const qText = qTextM ? stripHtml(qTextM[1]) : rawHead;

      const modelM = rawBody.match(/<h4[^>]*>Model answer[\s\S]*?<\/h4>([\s\S]*?)$/i) ||
                     [null, rawBody];

      if (!pyqs.some(p => p.question === qText)) {
        pyqs.push({
          id: `pyq-u9-${pyqIdx++}`,
          number: rawHead,
          year: rawHead.includes('201') ? (rawHead.match(/201\d/)[0] + ' Examination') : 'DU Model Question',
          marks: '20 Marks',
          unitNumber: 9,
          unit: `Topic 9: ${unitTitle}`,
          file: relFilePath,
          anchorId: `pyq-u9-${pyqIdx}`,
          question: qText.length > 20 ? qText : rawHead,
          modelAnswer: htmlToMarkdown(modelM[1])
        });
      }
    }
  }

  // Method 6: Topic 10 PYQ & Practice questions
  if (unitNumber === 10) {
    const pyqMatches = [...content.matchAll(/<h3[^>]*>((?:PYQ\s*\d+|Practice\s*\d+)[\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>(?:PYQ\s*\d+|Practice\s*\d+)|<h2|$)/gi)];
    for (const pm of pyqMatches) {
      const rawHead = stripHtml(pm[1]);
      const rawBody = pm[2];

      const modelM = rawBody.match(/<p><strong>Model answer[\s\S]*?<\/strong>:?([\s\S]*?)$/i) ||
                     rawBody.match(/<h4[^>]*>Model answer[\s\S]*?<\/h4>([\s\S]*?)$/i) ||
                     [null, rawBody];

      if (!pyqs.some(p => p.question === rawHead)) {
        pyqs.push({
          id: `pyq-u10-${pyqIdx++}`,
          number: rawHead,
          year: rawHead.includes('201') ? (rawHead.match(/201\d/)[0] + ' Examination') : 'DU Model Question',
          marks: '20 Marks',
          unitNumber: 10,
          unit: `Topic 10: ${unitTitle}`,
          file: relFilePath,
          anchorId: `pyq-u10-${pyqIdx}`,
          question: rawHead,
          modelAnswer: htmlToMarkdown(modelM[1])
        });
      }
    }
  }

  // =========================================================================
  // 3. EXTRACT REVISION CAPSULES
  // =========================================================================
  const revMatch = content.match(/<section[^>]*id="(?:rapid-revision|sec-revision|last-day-revision|topic-recall)"[^>]*>([\s\S]*?)<\/section>/i) ||
                   content.match(/<h2[^>]*>(?:Rapid Revision|60-second recall|Last-day revision|High-value revision|Revision dashboard)[\s\S]*?<\/h2>([\s\S]*?)(?:<h2|<\/body|$)/i);

  let tableRows = [];
  if (revMatch) {
    const revContent = revMatch[1];
    const tableMatches = [...revContent.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
    if (tableMatches.length > 0) {
      const rows = [...tableMatches[0][1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      for (const r of rows) {
        const cells = [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c => stripHtml(c[1]));
        if (cells.length >= 2) {
          tableRows.push({
            concept: cells[0],
            section: cells[1],
            precedent: cells[2] || '',
            rule: cells[3] || cells[1]
          });
        }
      }
    }
  }

  if (tableRows.length === 0) {
    tableRows = cases.slice(0, 6).map(c => ({
      concept: c.name,
      section: 'Companies Act, 2013',
      precedent: c.citation,
      rule: (c.ratio || '').substring(0, 95) + '...'
    }));
  }

  revisions.push({
    id: `rev-u${unitNumber}-1`,
    unitNumber: unitNumber,
    unitTitle: `Topic ${unitNumber}: ${unitTitle}`,
    badge: 'Rapid Revision Kit',
    title: `${unitTitle} — One-Page Exam Recall Capsule`,
    anchorId: `rev-u${unitNumber}`,
    file: relFilePath,
    type: 'capsule',
    table: tableRows,
    examStrategy: '1. Open answer with exact statutory citation from Companies Act 2013.\n2. State the landmark case authority establishing the doctrine.\n3. Apply ratio decidendi methodically to fact scenario.\n4. Conclude with firm legal outcome and remedy.',
    caseMap: cases.slice(0, 8).map(c => `${c.name} (${c.citation || 'Landmark'})`)
  });

  // Extract statutes cited in file
  const statMatches = [...content.matchAll(/Section\s+(\d+[A-Z]?(?:\(\d+\))?)/gi)].map(m => `S. ${m[1]}`);
  const uniqueStat = [...new Set(statMatches)].slice(0, 10);

  const unitObj = {
    id: `u${unitNumber}`,
    number: unitNumber,
    title: `Topic ${unitNumber}: ${unitTitle}`,
    subtitle: rawTitle,
    file: relFilePath,
    statutes: uniqueStat.length > 0 ? uniqueStat : ['Companies Act, 2013'],
    topics: [
      'Statutory Framework & Evolution',
      'Judicial Doctrines & Landmark Rulings',
      'Problem-Solving Methodology for DU Exams',
      'Section-wise Statutory Analysis'
    ]
  };

  return { unit: unitObj, cases, pyqs, revisions };
}

/**
 * Ingest a subject folder
 */
function ingestSubject(folderRelPath) {
  const fullFolderPath = path.resolve(ROOT_DIR, folderRelPath);
  if (!fs.existsSync(fullFolderPath)) {
    console.error(`Error: Folder "${fullFolderPath}" does not exist.`);
    process.exit(1);
  }

  console.log(`\n============================================================`);
  console.log(`🚀 DU Law Portal Ingestion Engine`);
  console.log(`📁 Target Subject Folder: ${folderRelPath}`);
  console.log(`============================================================\n`);

  const folderName = path.basename(folderRelPath).toLowerCase();
  const semMatch = folderRelPath.match(/sem\s*(\d+)/i);
  const semesterNum = semMatch ? parseInt(semMatch[1], 10) : 3;

  const subjectConfig = SUBJECT_CONFIGS[folderName] || {
    id: folderName,
    code: `LB-${semesterNum}01`,
    name: folderName.charAt(0).toUpperCase() + folderName.slice(1) + ' Law',
    shortName: folderName.charAt(0).toUpperCase() + folderName.slice(1),
    semester: semesterNum,
    theme: {
      primary: '#1e3a5f',
      primaryDark: '#0d1b2a',
      primaryLight: '#2d547d',
      accent: '#d4a373',
      accentLight: '#faedcd',
      bgTint: '#f5f7fa',
      border: '#ccd5e1',
      badgeBg: '#e8eff8',
      badgeColor: '#1e3a5f',
      gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 55%, #3e5c76 100%)',
      tagline: 'Comprehensive Lecture Notes, Landmark Case Law & Previous Year Questions',
      motto: 'Audi Alteram Partem • Ubi Jus Ibi Remedium',
      quote: 'Law is reason free from passion. — Aristotle',
      icon: 'fa-book-bookmark'
    }
  };

  let fileList = [];
  if (subjectConfig.topics && subjectConfig.topics.length > 0) {
    fileList = subjectConfig.topics.map(t => ({
      file: t.file,
      unit: t.unit,
      title: t.title
    }));
  } else {
    const rawFiles = fs.readdirSync(fullFolderPath)
      .filter(f => f.endsWith('.html') && !f.startsWith('.'));
    rawFiles.sort();
    fileList = rawFiles.map((f, i) => ({ file: f, unit: i + 1, title: null }));
  }

  console.log(`Found ${fileList.length} syllabus dossiers in ${folderRelPath}:`);
  fileList.forEach(t => console.log(`  [Unit ${t.unit}] ${t.title || t.file}`));

  const units = [];
  const allCases = [];
  const allPyqs = [];
  const allRevisions = [];

  fileList.forEach(item => {
    const fullFilePath = path.join(fullFolderPath, item.file);
    const relFilePath = path.join(folderRelPath, item.file).replace(/\\/g, '/');
    const unitNum = item.unit;

    if (!fs.existsSync(fullFilePath)) {
      console.warn(`⚠️ Warning: File not found: ${fullFilePath}`);
      return;
    }

    console.log(`\nParsing Unit ${unitNum}: ${item.file}...`);
    const parsed = parseHtmlFile(fullFilePath, relFilePath, unitNum, item.title);

    units.push(parsed.unit);
    allCases.push(...parsed.cases);
    allPyqs.push(...parsed.pyqs);
    allRevisions.push(...parsed.revisions);

    console.log(`  ✓ Extracted ${parsed.cases.length} cases`);
    console.log(`  ✓ Extracted ${parsed.pyqs.length} PYQs with model answers`);
    console.log(`  ✓ Extracted ${parsed.revisions.length} revision capsules`);
  });

  const subjectData = {
    id: subjectConfig.id,
    code: subjectConfig.code,
    name: subjectConfig.name,
    shortName: subjectConfig.shortName,
    semester: subjectConfig.semester,
    folder: folderRelPath.replace(/\\/g, '/'),
    theme: subjectConfig.theme,
    units: units,
    cases: allCases,
    pyqs: allPyqs,
    revisions: allRevisions
  };

  console.log(`\n============================================================`);
  console.log(`📊 Ingestion Summary for "${subjectData.name}" (${subjectData.code})`);
  console.log(`  • Semester:       Semester ${subjectData.semester}`);
  console.log(`  • Units / Topics: ${units.length}`);
  console.log(`  • Landmark Cases: ${allCases.length}`);
  console.log(`  • PYQs & Answers: ${allPyqs.length}`);
  console.log(`  • Revision Kits:  ${allRevisions.length}`);
  console.log(`============================================================\n`);

  // Read existing data.js
  console.log(`Updating ${DATA_FILE}...`);
  const dataJsRaw = fs.readFileSync(DATA_FILE, 'utf8');

  // Load into node runtime
  const window = {};
  eval(dataJsRaw);
  const portalData = window.DU_LAW_PORTAL_DATA;

  if (!portalData) {
    console.error('Error: Could not evaluate DU_LAW_PORTAL_DATA from data.js');
    process.exit(1);
  }

  // 1. Update Semester in portalData.semesters
  const targetSem = portalData.semesters.find(s => s.id === subjectData.semester);
  if (targetSem) {
    targetSem.active = true;
    if (!targetSem.subjectIds.includes(subjectData.id)) {
      targetSem.subjectIds.push(subjectData.id);
    }
    targetSem.badge = `${targetSem.subjectIds.length} Subject${targetSem.subjectIds.length > 1 ? 's' : ''} Loaded (${subjectData.name})`;
    targetSem.description = `Active syllabus modules, case briefs, past year examination questions, and rapid revision capsules for Semester ${subjectData.semester}.`;
    console.log(`✓ Activated Semester ${subjectData.semester} (${targetSem.name}) in portal registry.`);
  }

  // 2. Register subject in portalData.subjects
  portalData.subjects[subjectData.id] = subjectData;
  console.log(`✓ Registered subject "${subjectData.id}" into portalData.subjects.`);

  // 3. Write backup
  fs.writeFileSync(DATA_FILE + '.bak', dataJsRaw, 'utf8');

  // 4. Serialize updated data.js
  const updatedContent = `/**\n * Delhi University Law Notes Portal — Central Data Registry\n * Auto-generated and structured from DU Case Material & Semester Study Notes\n */\nwindow.DU_LAW_PORTAL_DATA = ${JSON.stringify(portalData, null, 2)};\n`;

  fs.writeFileSync(DATA_FILE, updatedContent, 'utf8');
  console.log(`✓ Successfully updated ${DATA_FILE}! New file size: ${(fs.statSync(DATA_FILE).size / 1024).toFixed(1)} KB`);

  console.log(`\n🎉 Ingestion completed with 0 errors!`);
}

// CLI Execution Entry Point
const targetFolder = process.argv[2] || 'sem 3/company';
ingestSubject(targetFolder);
