
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeDownload = () => {
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const { toast } = useToast();

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
    { id: 'creative', name: 'Creative', description: 'Bold and unique layout' },
    { id: 'academic', name: 'Academic', description: 'Formal and detailed' }
  ];

  const generateResume = async () => {
    setGenerating(true);
    try {
      // Fetch all portfolio data including social links and internships
      const [personalInfo, aboutInfo, experiences, internships, projects, education, certificates, achievements, socialLinks] = await Promise.all([
        supabase.from("personal_info").select("*").limit(1).maybeSingle(),
        supabase.from("about_info").select("*").limit(1).maybeSingle(),
        supabase.from("experiences").select("*").order("order_index"),
        supabase.from("internships").select("*").order("order_index"),
        supabase.from("projects").select("*").order("order_index"),
        supabase.from("education").select("*").order("order_index"),
        supabase.from("certificates").select("*").order("order_index"),
        supabase.from("achievements").select("*").order("order_index"),
        supabase.from("social_links").select("*").eq("is_active", true).order("order_index")
      ]);

      // Create HTML content for resume
      const resumeHTML = createResumeHTML({
        personalInfo: personalInfo.data,
        aboutInfo: aboutInfo.data,
        experiences: experiences.data || [],
        internships: internships.data || [],
        projects: projects.data || [],
        education: education.data || [],
        certificates: certificates.data || [],
        achievements: achievements.data || [],
        socialLinks: socialLinks.data || []
      }, selectedTemplate);

      // Create and download PDF
      await downloadHTMLAsPDF(resumeHTML, personalInfo.data?.name || 'Resume');

      toast({
        title: "Success",
        description: "Resume downloaded successfully as PDF!",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const extractUsernameFromUrl = (url: string, platform: string) => {
    if (!url) return '';
    
    try {
      // Remove protocol and www
      let cleanUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      // Extract username based on platform
      if (platform.toLowerCase().includes('github')) {
        return cleanUrl.replace('github.com/', '@');
      } else if (platform.toLowerCase().includes('linkedin')) {
        return cleanUrl.replace(/linkedin\.com\/in\//, '@').replace(/\/$/, '');
      } else if (platform.toLowerCase().includes('twitter')) {
        return cleanUrl.replace(/twitter\.com\//, '@').replace(/\/$/, '');
      } else if (platform.toLowerCase().includes('instagram')) {
        return cleanUrl.replace(/instagram\.com\//, '@').replace(/\/$/, '');
      } else if (url.includes('mailto:')) {
        return url.replace('mailto:', '');
      } else if (url.includes('tel:')) {
        return url.replace('tel:', '').replace(/\s/g, '');
      } else {
        // For other platforms, try to extract the last part of the URL
        const parts = cleanUrl.split('/');
        return parts[parts.length - 1] || cleanUrl;
      }
    } catch (error) {
      return url;
    }
  };

  const createResumeHTML = (data: any, template: string) => {
    const { personalInfo, aboutInfo, experiences, internships, projects, education, certificates, achievements, socialLinks } = data;
    
    // Create contact info from both personal info and social links
    const contactItems = [];
    
    if (personalInfo?.email) {
      contactItems.push(`<div class="contact-item"><strong>Email:</strong> ${personalInfo.email}</div>`);
    }
    if (personalInfo?.phone) {
      contactItems.push(`<div class="contact-item"><strong>Phone:</strong> ${personalInfo.phone}</div>`);
    }
    if (personalInfo?.location) {
      contactItems.push(`<div class="contact-item"><strong>Location:</strong> ${personalInfo.location}</div>`);
    }
    
    // Add social links with actual usernames
    socialLinks.forEach((social: any) => {
      const username = extractUsernameFromUrl(social.url, social.platform);
      contactItems.push(`<div class="contact-item"><strong>${social.platform}:</strong> ${username}</div>`);
    });
    
    // Fallback to personal info social links if no social_links table data
    if (socialLinks.length === 0) {
      if (personalInfo?.linkedin_url) {
        const username = extractUsernameFromUrl(personalInfo.linkedin_url, 'LinkedIn');
        contactItems.push(`<div class="contact-item"><strong>LinkedIn:</strong> ${username}</div>`);
      }
      if (personalInfo?.github_url) {
        const username = extractUsernameFromUrl(personalInfo.github_url, 'GitHub');
        contactItems.push(`<div class="contact-item"><strong>GitHub:</strong> ${username}</div>`);
      }
      if (personalInfo?.instagram_url) {
        const username = extractUsernameFromUrl(personalInfo.instagram_url, 'Instagram');
        contactItems.push(`<div class="contact-item"><strong>Instagram:</strong> ${username}</div>`);
      }
    }
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${personalInfo?.name || 'Resume'}</title>
        <style>
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          
          body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.4; 
            color: #000; 
            background: #fff;
            font-size: 11px;
          }
          
          .resume-container {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 15mm;
            background: #fff;
          }
          
          .header {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }
          
          .profile-image-container {
            flex-shrink: 0;
          }
          
          .profile-image {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            object-fit: cover;
            border: 1px solid #000;
          }
          
          .profile-placeholder {
            width: 80px;
            height: 80px;
            border: 1px solid #000;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            background: #f5f5f5;
          }
          
          .header-content {
            flex: 1;
          }
          
          .name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .subtitle {
            font-size: 11px;
            color: #333;
            margin-bottom: 10px;
          }
          
          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 10px;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .section {
            margin-bottom: 18px;
          }
          
          .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #000;
            letter-spacing: 0.5px;
          }
          
          .summary-text {
            text-align: justify;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          
          .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
          }
          
          .stat-item {
            text-align: center;
            border: 1px solid #000;
            padding: 8px 12px;
            border-radius: 4px;
          }
          
          .stat-number {
            font-weight: bold;
            font-size: 14px;
            display: block;
          }
          
          .stat-label {
            font-size: 9px;
            margin-top: 2px;
          }
          
          .experience-item, .education-item, .project-item, .achievement-item, .certificate-item {
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          
          .experience-item:last-child, .education-item:last-child, 
          .project-item:last-child, .achievement-item:last-child, 
          .certificate-item:last-child {
            border-bottom: none;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
          }
          
          .item-title {
            font-weight: bold;
            font-size: 12px;
          }
          
          .item-company {
            font-weight: 600;
            font-size: 11px;
            color: #333;
          }
          
          .item-location {
            font-size: 10px;
            color: #666;
          }
          
          .item-date {
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
            border: 1px solid #000;
            padding: 2px 6px;
            border-radius: 3px;
          }
          
          .item-description {
            margin-top: 5px;
          }
          
          .item-description ul {
            margin-left: 15px;
          }
          
          .item-description li {
            margin-bottom: 3px;
            font-size: 10px;
            line-height: 1.4;
          }
          
          .technologies {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          
          .tech-tag {
            background: #f0f0f0;
            border: 1px solid #ccc;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 500;
          }
          
          .achievement-content {
            margin-bottom: 5px;
          }
          
          .achievement-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 3px;
          }
          
          .achievement-description {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 3px;
          }
          
          .achievement-meta {
            font-size: 9px;
            color: #666;
          }
          
          .certificate-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3px;
          }
          
          .certificate-title {
            font-weight: bold;
            font-size: 11px;
          }
          
          .certificate-issuer {
            font-size: 10px;
            color: #333;
          }
          
          .certificate-date {
            font-size: 9px;
            color: #666;
            white-space: nowrap;
          }
          
          .credential-id {
            font-size: 9px;
            color: #666;
            font-family: monospace;
            margin-top: 3px;
          }
          
          @page {
            margin: 0;
            size: A4;
          }
          
          @media print {
            body { 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .resume-container {
              margin: 0;
              padding: 15mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <!-- Header Section -->
          <div class="header">
            <div class="profile-image-container">
              ${personalInfo?.profile_picture_url ? 
                `<img src="${personalInfo.profile_picture_url}" alt="Profile" class="profile-image" />` :
                `<div class="profile-placeholder">${personalInfo?.name ? personalInfo.name.charAt(0).toUpperCase() : 'U'}</div>`
              }
            </div>
            <div class="header-content">
              <h1 class="name">${personalInfo?.name || 'Your Name'}</h1>
              <div class="title">${personalInfo?.title || 'Professional Title'}</div>
              ${personalInfo?.subtitle ? `<div class="subtitle">${personalInfo.subtitle}</div>` : ''}
              
              <div class="contact-info">
                ${contactItems.join('')}
              </div>
            </div>
          </div>

          <!-- Professional Summary -->
          ${aboutInfo ? `
          <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary-text">${aboutInfo.summary.replace(/\n/g, '<br>')}</div>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-number">${aboutInfo.years_experience}</span>
                <div class="stat-label">Years Experience</div>
              </div>
              <div class="stat-item">
                <span class="stat-number">${aboutInfo.projects_completed}</span>
                <div class="stat-label">Projects Completed</div>
              </div>
              <div class="stat-item">
                <span class="stat-number">${aboutInfo.technologies_count}</span>
                <div class="stat-label">Technologies</div>
              </div>
              <div class="stat-item">
                <span class="stat-number">${aboutInfo.client_satisfaction}</span>
                <div class="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Work Experience -->
          ${experiences.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            ${experiences.map(exp => `
              <div class="experience-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${exp.title}</div>
                    <div class="item-company">${exp.company}</div>
                    <div class="item-location">${exp.location}</div>
                  </div>
                  <div class="item-date">${exp.duration}</div>
                </div>
                <div class="item-description">
                  <ul>
                    ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Internships -->
          ${internships && internships.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Internships</h2>
            ${internships.map(intern => `
              <div class="experience-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${intern.title}</div>
                    <div class="item-company">${intern.company}</div>
                    <div class="item-location">${intern.location}</div>
                  </div>
                  <div class="item-date">${intern.duration}</div>
                </div>
                <div class="item-description">
                  <ul>
                    ${intern.description.map(desc => `<li>${desc}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Projects -->
          ${projects.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Key Projects</h2>
            ${projects.slice(0, 4).map(project => `
              <div class="project-item">
                <div class="item-title">${project.title}</div>
                <div class="item-description">${project.description}</div>
                <div class="technologies">
                  ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${education.map(edu => `
              <div class="education-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-company">${edu.institution}</div>
                    <div class="item-location">${edu.location}</div>
                  </div>
                  <div class="item-date">${edu.duration}</div>
                </div>
                ${edu.grade ? `<div style="margin-top: 5px; font-size: 10px;"><strong>Grade:</strong> ${edu.grade}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Certifications -->
          ${certificates.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Certifications</h2>
            ${certificates.map(cert => `
              <div class="certificate-item">
                <div class="certificate-info">
                  <div>
                    <div class="certificate-title">${cert.title}</div>
                    <div class="certificate-issuer">${cert.issuer}</div>
                  </div>
                  <div class="certificate-date">${cert.date}</div>
                </div>
                ${cert.credential_id ? `<div class="credential-id">Credential ID: ${cert.credential_id}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Achievements -->
          ${achievements.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Key Achievements</h2>
            ${achievements.map(achievement => `
              <div class="achievement-item">
                <div class="achievement-content">
                  <div class="achievement-title">${achievement.title}</div>
                  <div class="achievement-description">${achievement.description}</div>
                  <div class="achievement-meta">${achievement.category} • ${achievement.date}</div>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  };

  const downloadHTMLAsPDF = async (htmlContent: string, fileName: string) => {
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '210mm';
    document.body.appendChild(tempDiv);

    try {
      // Convert HTML to canvas with high quality settings
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });

      // Create PDF with proper A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // If content is longer than one page, add multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height in mm
        position -= 297;
        
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
      
      // Download PDF with clean filename
      pdf.save(`${fileName.replace(/\s+/g, '_')}_Resume.pdf`);
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Choose Template
        </Button>
        <Button 
          onClick={generateResume} 
          disabled={generating}
          className="flex items-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download Resume PDF
            </>
          )}
        </Button>
      </div>

      {showTemplateSelector && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template.id);
                setShowTemplateSelector(false);
              }}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium mb-1">{template.name}</div>
              <div className="text-sm text-muted-foreground">{template.description}</div>
              {selectedTemplate === template.id && (
                <div className="text-xs text-primary mt-2 font-medium">✓ Selected</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeDownload;
