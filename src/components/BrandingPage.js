import React, { useState } from 'react';
import { FileText, Copy, Download } from 'lucide-react';

const BrandingPage = ({ setActiveTab }) => {
  const [copyToast, setCopyToast] = useState('');
  const colors = [
    { hex: '#59BAFF', rgb: '89 186 255', cmyk: '54 14 0 0' },
    { hex: '#02002D', rgb: '2 0 45', cmyk: '90 85 48 69' },
    { hex: '#3B4862', rgb: '59 72 98', cmyk: '82 70 40 26' },
    { hex: '#6E6D89', rgb: '110 109 137', cmyk: '62 56 50 6' },
    { hex: '#191360', rgb: '25 19 96', cmyk: '100 100 27 28' },
    { hex: '#D2F3FE', rgb: '210 243 254', cmyk: '16 0 1 0' },
    { hex: '#6F6F6F', rgb: '111 111 111', cmyk: '57 49 48 15' },
    { hex: '#FAFAFA', rgb: '239 239 239', cmyk: '5 3 3 0' },
  ];
  const brandingTools = [
    {
      id: 'meteor-branding',
      title: 'Meteor Branding',
      description: 'Brand guidelines and assets',
      logo: '/branding.png',
      badgeClass: 'bg-slate-900/80',
      external: false
    },
    {
      id: 'templates',
      title: 'Templates',
      description: 'Brand templates collection',
      logo: '/branding.png',
      badgeClass: 'bg-slate-900/80',
      external: false
    },
    {
      id: 'canva',
      title: 'Canva',
      description: 'Design platform for graphics',
      logo: '/Canva.png',
      badgeClass: 'bg-white',
      external: true,
      url: 'https://www.canva.com/folder/FAFlIEMEtxg'
    },
    {
      id: 'figma',
      title: 'Figma',
      description: 'Collaborative design tool',
      logo: '/Figma.png',
      badgeClass: 'bg-white',
      external: true,
      url: 'https://www.figma.com/files/team/1245743302420148172/recents-and-sharing?fuid=1245740596127828302'
    }
  ];

  const handleCardClick = (tool) => {
    if (tool.external) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!setActiveTab) return;

    if (tool.id === 'meteor-branding') {
      setActiveTab('branding-meteor');
    } else if (tool.id === 'templates') {
      setActiveTab('branding-templates');
    }
  };

  const handleCopyColor = async (hex) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(hex);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = hex;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      // Show toast notification
      setCopyToast(`${hex} gekopieerd!`);
      setTimeout(() => setCopyToast(''), 2000);
    } catch (e) {
      console.error('Failed to copy color', e);
      setCopyToast('Kopiëren mislukt');
      setTimeout(() => setCopyToast(''), 2000);
    }
  };

  const handleDownloadFont = (fontName) => {
    const link = document.createElement('a');
    if (fontName === 'Acherus') {
      link.href = '/Acherus Grotesque.zip';
      link.download = 'Acherus Grotesque.zip';
    } else {
      link.href = `/${fontName}.zip`;
      link.download = `${fontName}.zip`;
    }
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Branding</h1>
          <p className="text-white/60">Design tools and brand resources</p>
        </div>
      </div>

      {/* Branding Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brandingTools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <div
              key={tool.id}
              onClick={() => handleCardClick(tool)}
              className="glass-effect rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-200 group border border-white/10 hover:border-white/20"
            >
              {/* Logo badge */}
              <div className={`w-16 h-16 rounded-xl ${tool.badgeClass || 'bg-slate-900/60'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 p-2`}>
                {tool.logo ? (
                  <img 
                    src={tool.logo} 
                    alt={`${tool.title} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : Icon ? (
                  <Icon className="w-8 h-8 text-white" />
                ) : (
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {tool.description}
                </p>
              </div>

              {/* External link indicator */}
              {tool.external && (
                <div className="mt-4 flex items-center text-white/40 text-xs">
                  <span>External link</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Color palette */}
      <div className="glass-effect rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Colors</h2>
          <span className="text-xs text-white/40 flex items-center gap-1">
            <Copy className="w-3 h-3" />
            Klik om HEX te kopiëren
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleCopyColor(color.hex)}
              className="group flex items-center gap-3 rounded-lg hover:bg-white/5 border border-white/10 hover:border-blue-400/60 transition-colors px-3 py-2 text-left"
            >
              <div
                className="w-8 h-8 rounded-md border border-white/10 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-[11px] leading-tight text-white/70 space-y-0.5 flex-1">
                <div>
                  <span className="font-semibold text-white mr-1">HEX</span>
                  <span className="font-mono group-active:text-blue-300">{color.hex}</span>
                </div>
                <div>
                  <span className="font-semibold text-white mr-1">RGB</span>
                  <span className="font-mono text-white/60">{color.rgb}</span>
                </div>
                <div>
                  <span className="font-semibold text-white mr-1">CMYK</span>
                  <span className="font-mono text-white/60">{color.cmyk}</span>
                </div>
              </div>
              <Copy className="w-3 h-3 text-white/40 group-hover:text-white/70" />
            </button>
          ))}
        </div>
      </div>

      {/* Fonts widget */}
      <div className="glass-effect rounded-xl p-5 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Fonts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-white/10 px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-white/40">Heading</span>
                <div className="text-sm font-semibold text-white">Acherus</div>
              </div>
              <button
                onClick={() => handleDownloadFont('Acherus')}
                className="p-1.5 rounded-md border border-white/20 hover:border-blue-400/60 hover:bg-white/5 transition-colors"
                title="Download Acherus font"
              >
                <Download className="w-3 h-3 text-white/60 hover:text-white" />
              </button>
            </div>
            <div className="mt-1 text-lg text-white/90" style={{ fontFamily: 'Acherus, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              Meteor Branding Headline
            </div>
          </div>
          <div className="rounded-lg border border-white/10 px-4 py-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wide text-white/40">Body</span>
                <div className="text-sm font-semibold text-white">Nexa</div>
              </div>
              <button
                onClick={() => handleDownloadFont('Nexa')}
                className="p-1.5 rounded-md border border-white/20 hover:border-blue-400/60 hover:bg-white/5 transition-colors"
                title="Download Nexa font"
              >
                <Download className="w-3 h-3 text-white/60 hover:text-white" />
              </button>
            </div>
            <div className="mt-1 text-[13px] leading-relaxed text-white/80" style={{ fontFamily: 'Nexa, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              Dit is een voorbeeld van body copy in Nexa. Gebruik dit font voor langere teksten en beschrijvingen.
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="glass-effect rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Brand Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-2">Design Guidelines</h3>
            <p className="text-white/60 text-sm">
              Access our complete brand guidelines including logos, colors, typography, and usage rules.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Asset Library</h3>
            <p className="text-white/60 text-sm">
              Download high-resolution logos, icons, and other brand assets for your projects.
            </p>
          </div>
        </div>
      </div>

      {/* Copy Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {copyToast}
        </div>
      )}
    </div>
  );
};

export default BrandingPage;
