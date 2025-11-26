import React, { useState } from 'react';
import { Copy, Check, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

const MessageTemplatesPage = () => {
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      category: 'Project Start',
      title: 'Project Kickoff',
      icon: CheckCircle,
      template: `Hallo [KLANT_NAAM],

Bedankt voor je vertrouwen in ons! We zijn verheugd om te starten met je Shopify project: [PROJECT_NAAM].

📋 Project Details:
- Start datum: [START_DATUM]
- Verwachte oplevering: [EIND_DATUM]
- Scope: [PROJECT_SCOPE]

👥 Je team:
- Project Manager: [PM_NAAM]
- Developer: [DEV_NAAM]
- Designer: [DESIGNER_NAAM]

📞 Volgende stappen:
1. Kickoff meeting plannen
2. Requirements doorspreken
3. Design mockups opstellen

Heb je vragen? Neem gerust contact op!

Met vriendelijke groet,
[JOUW_NAAM]`
    },
    {
      id: 2,
      category: 'Progress Update',
      title: 'Weekly Progress Update',
      icon: MessageSquare,
      template: `Hallo [KLANT_NAAM],

Hierbij een update over de voortgang van je project: [PROJECT_NAAM].

✅ Deze week voltooid:
- [TAAK_1]
- [TAAK_2]
- [TAAK_3]

🔄 Komende week:
- [VOLGENDE_TAAK_1]
- [VOLGENDE_TAAK_2]
- [VOLGENDE_TAAK_3]

📊 Voortgang: [PERCENTAGE]% voltooid
⏰ Planning: Op schema / [DAGEN] vertraging

💬 Feedback nodig:
- [FEEDBACK_PUNT_1]
- [FEEDBACK_PUNT_2]

Vragen of opmerkingen? Laat het me weten!

Groet,
[JOUW_NAAM]`
    },
    {
      id: 3,
      category: 'Issue Report',
      title: 'Technical Issue Report',
      icon: AlertCircle,
      template: `Hallo [KLANT_NAAM],

We hebben een technisch probleem geïdentificeerd in je project: [PROJECT_NAAM].

🚨 Probleem:
[PROBLEEM_BESCHRIJVING]

🔍 Oorzaak:
[OORZAAK_ANALYSE]

🛠️ Oplossing:
[OPLOSSINGS_PLAN]

⏱️ Verwachte oplostijd: [TIJD_SCHATTING]
📈 Impact op planning: [IMPACT_BESCHRIJVING]

We houden je op de hoogte van de voortgang. Sorry voor het ongemak!

Met vriendelijke groet,
[JOUW_NAAM]`
    },
    {
      id: 4,
      category: 'Project Completion',
      title: 'Project Delivery',
      icon: CheckCircle,
      template: `Hallo [KLANT_NAAM],

Geweldig nieuws! Je Shopify project "[PROJECT_NAAM]" is voltooid! 🎉

🚀 Wat is er opgeleverd:
- [DELIVERABLE_1]
- [DELIVERABLE_2]
- [DELIVERABLE_3]

🔗 Links:
- Live website: [WEBSITE_URL]
- Admin toegang: [ADMIN_URL]
- Documentatie: [DOCS_URL]

📋 Volgende stappen:
1. Website testen en feedback geven
2. Training sessie plannen
3. Go-live datum bepalen

🎯 Support:
- [SUPPORT_PERIODE] gratis support
- Documentatie en handleidingen
- Contactgegevens voor vragen

Bedankt voor je vertrouwen en samenwerking!

Met trots,
[JOUW_NAAM]`
    },
    {
      id: 5,
      category: 'Follow-up',
      title: 'Post-Launch Check-in',
      icon: Mail,
      template: `Hallo [KLANT_NAAM],

Het is nu [TIJD_PERIODE] geleden dat je website live is gegaan. Hoe bevalt alles?

📊 Quick check:
- Hoe ervaar je de website performance?
- Zijn er nog vragen over het gebruik?
- Heb je feedback of verbeterpunten?

🔧 Mogelijke optimalisaties:
- [OPTIMALISATIE_1]
- [OPTIMALISATIE_2]
- [OPTIMALISATIE_3]

📈 Volgende fase:
Denk je na over uitbreidingen zoals:
- Extra functionaliteiten
- Marketing integraties
- Performance optimalisaties

Laten we binnenkort een keer bijpraten!

Groet,
[JOUW_NAAM]`
    },
    {
      id: 6,
      category: 'Invoice',
      title: 'Invoice Notification',
      icon: Mail,
      template: `Hallo [KLANT_NAAM],

Hierbij stuur ik je de factuur voor: [PROJECT_NAAM]

📄 Factuur details:
- Factuurnummer: [FACTUUR_NUMMER]
- Datum: [FACTUUR_DATUM]
- Bedrag: €[BEDRAG]
- Betaaltermijn: [BETAAL_TERMIJN] dagen

💳 Betaalinformatie:
- IBAN: [IBAN_NUMMER]
- BIC: [BIC_CODE]
- Referentie: [REFERENTIE]

📋 Geleverde diensten:
- [DIENST_1]: [BEDRAG_1]
- [DIENST_2]: [BEDRAG_2]
- [DIENST_3]: [BEDRAG_3]

Vragen over de factuur? Neem gerust contact op!

Met vriendelijke groet,
[JOUW_NAAM]`
    }
  ];

  const copyToClipboard = async (template, id) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(template);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = template;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedTemplate(id);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Kopiëren mislukt. Probeer het opnieuw.');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Project Start': return 'bg-green-500/20 text-green-400';
      case 'Progress Update': return 'bg-blue-500/20 text-blue-400';
      case 'Issue Report': return 'bg-red-500/20 text-red-400';
      case 'Project Completion': return 'bg-purple-500/20 text-purple-400';
      case 'Follow-up': return 'bg-yellow-500/20 text-yellow-400';
      case 'Invoice': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Message Templates</h1>
          <p className="text-white/70">Kopieer en gebruik deze templates voor klantcommunicatie</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <div key={template.id} className="gradient-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{template.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => copyToClipboard(template.template, template.id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    copiedTemplate === template.id 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                  title="Kopieer template"
                >
                  {copiedTemplate === template.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-white/80 text-sm whitespace-pre-wrap font-mono">
                  {template.template}
                </pre>
              </div>
              
              {copiedTemplate === template.id && (
                <div className="mt-3 p-2 bg-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Template gekopieerd naar klembord!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="gradient-card rounded-xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">📝 Hoe te gebruiken:</h2>
        <div className="space-y-3 text-white/70">
          <p>• Klik op het kopieer-icoon om een template naar je klembord te kopiëren</p>
          <p>• Vervang de placeholders (bijv. [KLANT_NAAM], [PROJECT_NAAM]) met echte gegevens</p>
          <p>• Pas de template aan naar je eigen stijl en behoeften</p>
          <p>• Gebruik de templates in je email client of messaging platform</p>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplatesPage;
