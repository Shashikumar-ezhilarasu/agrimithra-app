import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────
// Native-language mock data for all 6 languages
// ─────────────────────────────────────────────────────────────
const localizedNews: Record<string, any[]> = {
  hi: [
    {
      id: '1', type: 'योजना', title: 'PM-KISAN 16वीं किस्त जारी',
      description: 'सरकार ने PM-KISAN की 16वीं किस्त जारी कर दी है। किसान आधिकारिक पोर्टल पर अपनी स्थिति देख सकते हैं।',
      date: '2024-03-28', category: 'वित्तीय सहायता', link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2', type: 'समाचार', title: 'मानसून 2024: IMD ने सामान्य वर्षा की भविष्यवाणी की',
      description: 'भारत मौसम विभाग (IMD) ने 2024 के लिए सामान्य मानसून की भविष्यवाणी की है, जिससे करोड़ों किसानों को उम्मीद मिली है।',
      date: '2024-04-15', category: 'मौसम', link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3', type: 'योजना', title: 'नई जैविक कृषि सब्सिडी घोषित',
      description: 'चुनिंदा जिलों में जैविक खेती की ओर जाने वाले किसानों के लिए 50% नई सब्सिडी की घोषणा की गई है।',
      date: '2024-04-10', category: 'जैविक', link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4', type: 'समाचार', title: 'गेहूं का MSP ₹150 बढ़ा',
      description: 'आने वाले सीजन के लिए गेहूं का न्यूनतम समर्थन मूल्य बढ़ाकर ₹2,275 प्रति क्विंटल कर दिया गया है।',
      date: '2024-04-01', category: 'बाज़ार', link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5', type: 'योजना', title: 'किसान क्रेडिट कार्ड (KCC) सीमा बढ़ाई गई',
      description: 'किसान अब सरलीकृत दस्तावेज़ीकरण के साथ संशोधित KCC योजना के तहत अधिक क्रेडिट सीमा के लिए आवेदन कर सकते हैं।',
      date: '2024-04-18', category: 'वित्त', link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    },
  ],
  ta: [
    {
      id: '1', type: 'திட்டம்', title: 'PM-KISAN 16வது தவணை வெளியிடப்பட்டது',
      description: 'அரசாங்கம் PM-KISAN-ன் 16வது தவணையை வெளியிட்டுள்ளது. விவசாயிகள் அதிகாரப்பூர்வ போர்டலில் தங்கள் நிலையை சரிபார்க்கலாம்.',
      date: '2024-03-28', category: 'நிதி உதவி', link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2', type: 'செய்தி', title: 'பருவமழை 2024: IMD சாதாரண மழையை கணித்தது',
      description: 'இந்திய வானிலை ஆய்வு மையம் (IMD) 2024-க்கு சாதாரண பருவமழையை கணித்துள்ளது, மில்லியன் கணக்கான விவசாயிகளுக்கு நம்பிக்கை அளிக்கிறது.',
      date: '2024-04-15', category: 'வானிலை', link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3', type: 'திட்டம்', title: 'புதிய கரிம விவசாய மானியம்',
      description: 'தேர்ந்தெடுக்கப்பட்ட மாவட்டங்களில் கரிம விவசாயத்திற்கு மாறும் விவசாயிகளுக்கு 50% புதிய மானியம் அறிவிக்கப்பட்டுள்ளது.',
      date: '2024-04-10', category: 'கரிம', link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4', type: 'செய்தி', title: 'கோதுமை MSP ₹150 உயர்வு',
      description: 'வரவிருக்கும் பருவத்திற்கான கோதுமையின் குறைந்தபட்ச ஆதரவு விலை ₹2,275 குவிண்டல் என அதிகரிக்கப்பட்டுள்ளது.',
      date: '2024-04-01', category: 'சந்தை', link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5', type: 'திட்டம்', title: 'கிசான் கிரெடிட் கார்டு (KCC) வரம்பு மறுவாழ்வு',
      description: 'விவசாயிகள் இப்போது எளிமைப்படுத்தப்பட்ட ஆவணங்களுடன் மறுசீரமைக்கப்பட்ட KCC திட்டத்தின் கீழ் அதிக கடன் வரம்புக்கு விண்ணப்பிக்கலாம்.',
      date: '2024-04-18', category: 'நிதி', link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    },
  ],
  ml: [
    {
      id: '1', type: 'പദ്ധതി', title: 'PM-KISAN 16-ആം ഗഡു പുറത്തിറക്കി',
      description: 'സർക്കാർ PM-KISAN-ന്റെ 16-ആം ഗഡു പുറത്തിറക്കി. കർഷകർക്ക് ഔദ്യോഗിക പോർട്ടലിൽ അവരുടെ സ്ഥിതി പരിശോധിക്കാൻ കഴിയും.',
      date: '2024-03-28', category: 'സാമ്പത്തിക സഹായം', link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2', type: 'വാർത്ത', title: 'മൺസൂൺ 2024: IMD സാധാരണ മഴ പ്രവചിച്ചു',
      description: 'ഇന്ത്യ കാലാവസ്ഥ വകുപ്പ് (IMD) 2024-ൽ സാധാരണ മൺസൂൺ പ്രവചിച്ചു, കോടിക്കണക്കിന് കർഷകർക്ക് പ്രതീക്ഷ നൽകി.',
      date: '2024-04-15', category: 'കാലാവസ്ഥ', link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3', type: 'പദ്ധതി', title: 'പുതിയ ജൈവ കൃഷി സബ്സിഡി',
      description: 'തിരഞ്ഞെടുത്ത ജില്ലകളിൽ ജൈവ കൃഷിയിലേക്ക് മാറുന്ന കർഷകർക്ക് 50% പുതിയ സബ്സിഡി പ്രഖ്യാപിക്കപ്പെട്ടിരിക്കുന്നു.',
      date: '2024-04-10', category: 'ജൈവ', link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4', type: 'വാർത്ത', title: 'ഗോതമ്പ് MSP ₹150 ഉയർന്നു',
      description: 'വരുന്ന സീസണിൽ ഗോതമ്പിന്റെ ന്യൂനപക്ഷ പിന്തുണ വില ₹2,275 പ്രതി ക്വിന്റൽ ആക്കി ഉയർത്തി.',
      date: '2024-04-01', category: 'ചന്ത', link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5', type: 'പദ്ധതി', title: 'കിസാൻ ക്രെഡിറ്റ് കാർഡ് (KCC) പരിധി ഉയർത്തി',
      description: 'കർഷകർക്ക് ഇപ്പോൾ ലഘൂകരിച്ച രേഖകൾ ഉപയോഗിച്ച് പുനർനിർമ്മിച്ച KCC പദ്ധതിക്ക് കീഴിൽ ഉയർന്ന ക്രെഡിറ്റ് പരിധിക്ക് അപേക്ഷിക്കാം.',
      date: '2024-04-18', category: 'സാമ്പത്തികം', link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    },
  ],
  kn: [
    {
      id: '1', type: 'ಯೋಜನೆ', title: 'PM-KISAN 16ನೇ ಕಂತು ಬಿಡುಗಡೆ',
      description: 'ಸರ್ಕಾರ PM-KISAN ನ 16ನೇ ಕಂತನ್ನು ಬಿಡುಗಡೆ ಮಾಡಿದೆ. ರೈತರು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ತಮ್ಮ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಬಹುದು.',
      date: '2024-03-28', category: 'ಆರ್ಥಿಕ ಸಹಾಯ', link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2', type: 'ಸುದ್ದಿ', title: 'ಮಾನ್ಸೂನ್ 2024: IMD ಸಾಮಾನ್ಯ ಮಳೆ ಮುನ್ಸೂಚನೆ',
      description: 'ಭಾರತ ಹವಾಮಾನ ಇಲಾಖೆ (IMD) 2024ಕ್ಕೆ ಸಾಮಾನ್ಯ ಮಾನ್ಸೂನ್ ಅನ್ನು ಮುನ್ಸೂಚಿಸಿದ್ದು, ಕೋಟ್ಯಂತರ ರೈತರಿಗೆ ಆಶಾ ಮೂಡಿಸಿದೆ.',
      date: '2024-04-15', category: 'ಹವಾಮಾನ', link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3', type: 'ಯೋಜನೆ', title: 'ಹೊಸ ಸಾವಯವ ಕೃಷಿ ಸಬ್ಸಿಡಿ',
      description: 'ಆಯ್ದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಸಾವಯವ ಕೃಷಿಗೆ ಬದಲಾಗುವ ರೈತರಿಗೆ 50% ಹೊಸ ಸಬ್ಸಿಡಿ ಘೋಷಿಸಲಾಗಿದೆ.',
      date: '2024-04-10', category: 'ಸಾವಯವ', link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4', type: 'ಸುದ್ದಿ', title: 'ಗೋಧಿ MSP ₹150 ಏರಿಕೆ',
      description: 'ಮುಂಬರುವ ಬೆಳೆಗಾಲಕ್ಕೆ ಗೋಧಿಯ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ ₹2,275 ಪ್ರತಿ ಕ್ವಿಂಟಲ್‌ಗೆ ಹೆಚ್ಚಿಸಲಾಗಿದೆ.',
      date: '2024-04-01', category: 'ಮಾರುಕಟ್ಟೆ', link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5', type: 'ಯೋಜನೆ', title: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಮಿತಿ ಹೆಚ್ಚಳ',
      description: 'ರೈತರು ಈಗ ಸರಳೀಕೃತ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಷ್ಕೃತ KCC ಯೋಜನೆಯಡಿ ಹೆಚ್ಚಿನ ಕ್ರೆಡಿಟ್ ಮಿತಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.',
      date: '2024-04-18', category: 'ಹಣಕಾಸು', link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    },
  ],
  te: [
    {
      id: '1', type: 'పథకం', title: 'PM-KISAN 16వ వాయిదా విడుదల',
      description: 'ప్రభుత్వం PM-KISAN యొక్క 16వ వాయిదాను విడుదల చేసింది. రైతులు అధికారిక పోర్టల్‌లో తమ స్థితిని తనిఖీ చేయవచ్చు.',
      date: '2024-03-28', category: 'ఆర్థిక సహాయం', link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2', type: 'వార్త', title: 'మాన్సూన్ 2024: IMD సాధారణ వర్షపాతం అంచనా',
      description: 'భారత వాతావరణ శాఖ (IMD) 2024 సంవత్సరంలో సాధారణ మాన్సూన్‌ను అంచనా వేసింది, లక్షల మంది రైతులకు ఆశలు కల్పించింది.',
      date: '2024-04-15', category: 'వాతావరణం', link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3', type: 'పథకం', title: 'కొత్త సేంద్రీయ వ్యవసాయ సబ్సిడీ',
      description: 'ఎంపిక చేయబడిన జిల్లాల్లో సేంద్రీయ వ్యవసాయానికి మారే రైతులకు 50% కొత్త సబ్సిడీ ప్రకటించబడింది.',
      date: '2024-04-10', category: 'సేంద్రీయం', link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4', type: 'వార్త', title: 'గోధుమ MSP ₹150 పెరిగింది',
      description: 'రాబోయే సీజన్‌కు గోధుమ కనీస మద్దతు ధర ₹2,275 క్వింటాల్‌కు పెంచబడింది.',
      date: '2024-04-01', category: 'మార్కెట్', link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5', type: 'పథకం', title: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC) పరిమితి పెంపు',
      description: 'రైతులు ఇప్పుడు సరళీకరించిన పత్రాలతో సవరించిన KCC పథకం కింద అధిక రుణ పరిమితికి దరఖాస్తు చేసుకోవచ్చు.',
      date: '2024-04-18', category: 'ఆర్థికం', link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// English: try live NewsAPI, fall back to structured mock
// ─────────────────────────────────────────────────────────────
const englishMock = [
  {
    id: '1', type: 'scheme', title: 'PM-KISAN 16th Installment Released',
    description: 'The government has released the 16th installment of PM-KISAN. Farmers can check their status on the official portal.',
    date: '2024-03-28', category: 'Financial Aid', link: 'https://pmkisan.gov.in/',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '2', type: 'news', title: 'Monsoon 2024: IMD Predicts Normal Rainfall',
    description: 'The India Meteorological Department has predicted a normal monsoon for 2024, bringing hope to millions of farmers across India.',
    date: '2024-04-15', category: 'Weather', link: '#',
    image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '3', type: 'scheme', title: 'New Organic Farming Subsidy Announced',
    description: 'A new 50% subsidy has been announced for farmers transitioning to organic farming in selected districts across India.',
    date: '2024-04-10', category: 'Organic', link: '#',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '4', type: 'news', title: 'MSP for Wheat Increased by ₹150',
    description: 'The Minimum Support Price for Wheat has been increased to ₹2,275 per quintal for the upcoming Rabi season.',
    date: '2024-04-01', category: 'Market', link: '#',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: '5', type: 'scheme', title: 'Kisan Credit Card (KCC) Limit Revived',
    description: 'Farmers can now apply for higher credit limits under the revamped KCC scheme with simplified documentation requirements.',
    date: '2024-04-18', category: 'Financial', link: '#',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
  },
];

async function fetchEnglishNews(): Promise<any[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return englishMock;

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=agriculture+india+farmer&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) }
    );

    if (!res.ok) return englishMock;

    const data = await res.json();
    if (!data.articles?.length) return englishMock;

    // Map live articles to our schema
    return data.articles.slice(0, 5).map((a: any, i: number) => ({
      id: String(i + 1),
      type: 'news',
      title: a.title || 'Agriculture News',
      description: a.description || a.content || '',
      date: a.publishedAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      category: 'News',
      link: a.url || '#',
      image: a.urlToImage || englishMock[i % englishMock.length].image,
    }));
  } catch {
    return englishMock;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang') || 'en';

  // Non-English: return native-language mock immediately
  if (lang !== 'en') {
    const data = localizedNews[lang] || englishMock;
    return NextResponse.json(data);
  }

  // English: try live API, fall back to mock
  const items = await fetchEnglishNews();
  return NextResponse.json(items);
}
