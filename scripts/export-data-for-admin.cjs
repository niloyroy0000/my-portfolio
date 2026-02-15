/**
 * Data Export Script for Portfolio Admin Migration
 *
 * This script exports portfolio data to JSON files that can be imported
 * into the admin portal's MongoDB database.
 *
 * Usage:
 *   cd biswajitpanday.github.io
 *   node scripts/export-data-for-admin.cjs
 *
 * Output:
 *   Creates JSON files in ../portfolio-admin/migration-data/
 */

const fs = require('fs');
const path = require('path');

// Output directory for JSON files
const OUTPUT_DIR = path.join(__dirname, '../../portfolio-admin/migration-data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('='.repeat(60));
console.log('Portfolio Data Export Script');
console.log('='.repeat(60));
console.log(`Output directory: ${OUTPUT_DIR}\n`);

// Helper function to write JSON file
function writeJSON(filename, data) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✓ Exported ${filename} (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
}

// Extract content between balanced brackets/braces starting from a position
function extractBalanced(str, startPos, openChar, closeChar) {
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let result = '';

  for (let i = startPos; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';

    // Handle string boundaries (skip escaped quotes)
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }

    if (!inString) {
      if (char === openChar) depth++;
      if (char === closeChar) depth--;
    }

    result += char;

    if (depth === 0 && result.includes(openChar)) {
      return result;
    }
  }
  return result;
}

// Convert TypeScript object literal to JSON
function tsToJson(str) {
  // First, handle all string types - protect from comment removal
  const strings = [];

  // Protect double-quoted strings
  let protected = str.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // Protect backtick template literals (convert to double-quoted strings)
  protected = protected.replace(/`([^`]*)`/g, (match, content) => {
    // Escape any double quotes and newlines in the content
    const escaped = content
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    const converted = `"${escaped}"`;
    strings.push(converted);
    return `__STRING_${strings.length - 1}__`;
  });

  // Now safely remove comments (no strings to worry about)
  protected = protected
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Restore strings
  let result = protected.replace(/__STRING_(\d+)__/g, (_, idx) => strings[parseInt(idx)]);

  result = result
    // Handle new Date() calls
    .replace(/new Date\(\)/g, `"${new Date().toISOString()}"`)
    .replace(/new Date\(["']([^"']+)["']\)/g, '"$1"')
    // Handle trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Quote unquoted keys
    .replace(/([{,\[]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    // Handle undefined
    .replace(/:\s*undefined/g, ': null');

  // Properly convert single quotes to double quotes and handle control characters
  let output = '';
  let i = 0;
  while (i < result.length) {
    const char = result[i];

    if (char === '"') {
      // Already double-quoted string, copy until closing quote
      output += char;
      i++;
      while (i < result.length && result[i] !== '"') {
        if (result[i] === '\\') {
          output += result[i] + result[i + 1];
          i += 2;
        } else if (result[i] === '\n') {
          // Escape newlines in strings
          output += '\\n';
          i++;
        } else if (result[i] === '\r') {
          // Escape carriage returns
          output += '\\r';
          i++;
        } else if (result[i] === '\t') {
          // Escape tabs
          output += '\\t';
          i++;
        } else {
          output += result[i];
          i++;
        }
      }
      if (i < result.length) {
        output += result[i];
        i++;
      }
    } else if (char === "'") {
      // Single-quoted string - convert to double quotes
      output += '"';
      i++;
      while (i < result.length && result[i] !== "'") {
        if (result[i] === '\\') {
          output += result[i] + result[i + 1];
          i += 2;
        } else if (result[i] === '"') {
          // Escape any double quotes inside
          output += '\\"';
          i++;
        } else if (result[i] === '\n') {
          // Escape newlines in strings
          output += '\\n';
          i++;
        } else if (result[i] === '\r') {
          // Escape carriage returns
          output += '\\r';
          i++;
        } else if (result[i] === '\t') {
          // Escape tabs
          output += '\\t';
          i++;
        } else {
          output += result[i];
          i++;
        }
      }
      output += '"';
      if (i < result.length) i++;
    } else {
      output += char;
      i++;
    }
  }

  return output;
}

// Parse array of objects from TypeScript source
function parseArrayFromSource(content, varPattern) {
  const match = content.match(varPattern);
  if (!match) return [];

  const arrayStart = content.indexOf('[', match.index + match[0].length);
  if (arrayStart === -1) return [];

  const arrayStr = extractBalanced(content, arrayStart, '[', ']');

  // Parse individual objects
  const objects = [];
  let pos = 1; // Skip opening [

  while (pos < arrayStr.length - 1) {
    // Skip whitespace and commas
    while (pos < arrayStr.length && /[\s,]/.test(arrayStr[pos])) pos++;

    if (arrayStr[pos] === '{') {
      const objStr = extractBalanced(arrayStr, pos, '{', '}');
      try {
        const jsonStr = tsToJson(objStr);
        const parsed = JSON.parse(jsonStr);
        objects.push(parsed);
      } catch (e) {
        // Try to provide helpful debug info
        const preview = objStr.substring(0, 100).replace(/\n/g, ' ');
        // For debugging: show first failed object's full error
        if (objects.length === 0 && process.env.DEBUG) {
          const fullJson = tsToJson(objStr);
          console.log('\n--- DEBUG: Full transformed JSON ---');
          console.log(fullJson);
          console.log(`\n--- Error: ${e.message} ---\n`);
          // Find the error position
          const match = e.message.match(/position (\d+)/);
          if (match) {
            const pos = parseInt(match[1]);
            console.log(`Around position ${pos}:`);
            console.log(fullJson.substring(pos - 50, pos + 50));
          }
        }
        console.log(`  ⚠ Could not parse object: ${preview}...`);
      }
      pos += objStr.length;
    } else {
      pos++;
    }
  }

  return objects;
}

// ============================================
// Export Projects
// ============================================
async function exportProjects() {
  try {
    const dataPath = path.join(__dirname, '../data/portfolioData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    const projects = parseArrayFromSource(content, /export const projects:\s*Project\[\]\s*=/);

    if (projects.length === 0) {
      console.log('⚠ Could not find or parse projects array');
    }

    writeJSON('projects.json', projects);
    return projects;
  } catch (error) {
    console.log('⚠ Error exporting projects:', error.message);
    return [];
  }
}

// ============================================
// Export Certifications
// ============================================
async function exportCertifications() {
  try {
    const dataPath = path.join(__dirname, '../data/certificationsData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    const certs = parseArrayFromSource(content, /export const certifications:\s*Certification\[\]\s*=/);

    if (certs.length === 0) {
      console.log('⚠ Could not find or parse certifications array');
    }

    writeJSON('certifications.json', certs);
    return certs;
  } catch (error) {
    console.log('⚠ Error exporting certifications:', error.message);
    return [];
  }
}

// ============================================
// Export Skills
// ============================================
async function exportSkills() {
  try {
    const dataPath = path.join(__dirname, '../data/skillsData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    const skillTrees = [];

    // Parse skills as single objects (not arrays)
    const parseSkillTree = (varName) => {
      const idx = content.indexOf(`export const ${varName}: SkillNode =`);
      if (idx === -1) return null;

      const objStart = content.indexOf('{', idx);
      if (objStart === -1) return null;

      const objStr = extractBalanced(content, objStart, '{', '}');
      try {
        const jsonStr = tsToJson(objStr);
        return JSON.parse(jsonStr);
      } catch (e) {
        console.log(`  ⚠ Could not parse ${varName}: ${e.message.substring(0, 50)}`);
        return null;
      }
    };

    const skills1 = parseSkillTree('skills1');
    if (skills1) {
      skillTrees.push({ name: 'skills1', nodes: skills1.children || [] });
    }

    const skills2 = parseSkillTree('skills2');
    if (skills2) {
      skillTrees.push({ name: 'skills2', nodes: skills2.children || [] });
    }

    writeJSON('skills.json', skillTrees);
    return skillTrees;
  } catch (error) {
    console.log('⚠ Error exporting skills:', error.message);
    return [];
  }
}

// ============================================
// Export Testimonials
// ============================================
async function exportTestimonials() {
  try {
    const dataPath = path.join(__dirname, '../data/testimonialsData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    const testimonials = parseArrayFromSource(content, /export const testimonials:\s*Testimonial\[\]\s*=/);

    if (testimonials.length === 0) {
      console.log('⚠ Could not find or parse testimonials array');
    }

    writeJSON('testimonials.json', testimonials);
    return testimonials;
  } catch (error) {
    console.log('⚠ Error exporting testimonials:', error.message);
    return [];
  }
}

// ============================================
// Export Blog Posts
// ============================================
async function exportBlogPosts() {
  try {
    const dataPath = path.join(__dirname, '../data/blogData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    const posts = parseArrayFromSource(content, /export const blogPosts:\s*BlogPost\[\]\s*=/);

    if (posts.length === 0) {
      console.log('⚠ Could not find or parse blogPosts array');
    }

    writeJSON('blogPosts.json', posts);
    return posts;
  } catch (error) {
    console.log('⚠ Error exporting blog posts:', error.message);
    return [];
  }
}

// ============================================
// Export Timeline
// ============================================
async function exportTimeline() {
  try {
    const dataPath = path.join(__dirname, '../data/timelineData.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');

    // Note: Variable is 'timeLineItems' (capital L)
    const timeline = parseArrayFromSource(content, /export const timeLineItems:\s*TimelineItem\[\]\s*=/);

    if (timeline.length === 0) {
      console.log('⚠ Could not find or parse timeLineItems array');
    }

    writeJSON('timeline.json', timeline);
    return timeline;
  } catch (error) {
    console.log('⚠ Error exporting timeline:', error.message);
    return [];
  }
}

// ============================================
// Main Export Function
// ============================================
async function main() {
  console.log('Exporting data...\n');

  const results = {
    projects: await exportProjects(),
    certifications: await exportCertifications(),
    skills: await exportSkills(),
    testimonials: await exportTestimonials(),
    blogPosts: await exportBlogPosts(),
    timeline: await exportTimeline(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('Export Summary:');
  console.log('='.repeat(60));
  console.log(`Projects: ${results.projects.length}`);
  console.log(`Certifications: ${results.certifications.length}`);
  console.log(`Skill Trees: ${results.skills.length}`);
  console.log(`Testimonials: ${results.testimonials.length}`);
  console.log(`Blog Posts: ${results.blogPosts.length}`);
  console.log(`Timeline: ${results.timeline.length}`);
  console.log('='.repeat(60));
  console.log(`\nJSON files saved to: ${OUTPUT_DIR}`);
  console.log('\nNext step: Run the import script in portfolio-admin:');
  console.log('  cd ../portfolio-admin');
  console.log('  npm run migrate:import');
}

main().catch(console.error);
