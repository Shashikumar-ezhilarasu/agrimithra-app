import { NextResponse } from 'next/server';
import { fertilizerKnowledge, farmingGuides } from '@/lib/knowledge-base';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all'; // 'fertilizers', 'pesticides', 'guides', 'all'
  const lang = searchParams.get('lang') || 'en';

  const response: any = {};

  if (type === 'all' || type === 'fertilizers') {
    response.fertilizers = fertilizerKnowledge.fertilizers.map(f => ({
      id: f.id,
      icon: f.icon,
      color: f.color,
      type: f.type,
      nutrient: f.nutrient,
      dosage: f.dosage,
      price: f.price,
      name: f.name[lang as keyof typeof f.name] || f.name.en,
      uses: f.uses[lang as keyof typeof f.uses] || f.uses.en,
      warning: f.warning[lang as keyof typeof f.warning] || f.warning.en,
    }));
  }

  if (type === 'all' || type === 'pesticides') {
    response.pesticides = fertilizerKnowledge.pesticides.map(p => ({
      id: p.id,
      icon: p.icon,
      color: p.color,
      targets: p.targets,
      dosage: p.dosage,
      price: p.price,
      name: p.name[lang as keyof typeof p.name] || p.name.en,
      uses: p.uses[lang as keyof typeof p.uses] || p.uses.en,
      safety: p.safety[lang as keyof typeof p.safety] || p.safety.en,
    }));
  }

  if (type === 'all' || type === 'guides') {
    response.guides = farmingGuides.map(g => ({
      id: g.id,
      icon: g.icon,
      duration: g.duration,
      profitPotential: g.profitPotential,
      title: g.title[lang as keyof typeof g.title] || g.title.en,
      steps: g.steps[lang as keyof typeof g.steps] || g.steps.en,
    }));
  }

  return NextResponse.json(response);
}
