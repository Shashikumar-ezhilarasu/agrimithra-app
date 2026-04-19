import { NextResponse } from 'next/server';

export async function GET() {
  const newsAndSchemes = [
    {
      id: '1',
      type: 'scheme',
      title: 'PM-KISAN 16th Installment Released',
      description: 'The government has released the 16th installment of PM-KISAN. Farmers can check their status on the official portal.',
      date: '2024-03-28',
      category: 'Financial Aid',
      link: 'https://pmkisan.gov.in/',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '2',
      type: 'news',
      title: 'Monsoon 2024: IMD Predicts Normal Rainfall',
      description: 'The India Meteorological Department (IMD) has predicted a normal monsoon for the year 2024, bringing hope to millions of farmers.',
      date: '2024-04-15',
      category: 'Weather',
      link: '#',
      image: 'https://images.unsplash.com/photo-1514582685836-af031f40b3d3?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '3',
      type: 'scheme',
      title: 'New Organic Farming Subsidy',
      description: 'A new 50% subsidy has been announced for farmers transitioning to organic farming in selected districts.',
      date: '2024-04-10',
      category: 'Organic',
      link: '#',
      image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '4',
      type: 'news',
      title: 'MSP for Wheat Increased by ₹150',
      description: 'The Minimum Support Price for Wheat has been increased to ₹2,275 per quintal for the upcoming season.',
      date: '2024-04-01',
      category: 'Market',
      link: '#',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop'
    },
    {
      id: '5',
      type: 'scheme',
      title: 'Kisan Credit Card (KCC) Limit Revived',
      description: 'Farmers can now apply for higher credit limits under the revamped KCC scheme with simplified documentation.',
      date: '2024-04-18',
      category: 'Financial',
      link: '#',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b273b86f?q=80&w=2000&auto=format&fit=crop'
    }
  ];

  return NextResponse.json(newsAndSchemes);
}
