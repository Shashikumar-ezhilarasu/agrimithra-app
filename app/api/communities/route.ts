import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CommunityCircle from '@/models/CommunityCircle';

export async function GET() {
  await dbConnect();
  
  let circles = await CommunityCircle.find({});
  
  // If no circles exist, seed some initial ones
  if (circles.length === 0) {
    const initialCircles = [
      {
        name: 'Rice Cultivators',
        description: 'A community for sharing best practices for high-yield rice farming.',
        category: 'Crops',
        memberCount: 1250,
        image: 'https://images.unsplash.com/photo-1536633340742-134a6ae50b9d?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'Organic Wheat Growers',
        description: 'Focusing on 100% natural and organic wheat production techniques.',
        category: 'Organic',
        memberCount: 840,
        image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'Drip Irrigation Experts',
        description: 'Discussing water conservation and modern irrigation technology.',
        category: 'Technology',
        memberCount: 2100,
        image: 'https://images.unsplash.com/photo-1463123010508-f4e1867113f3?q=80&w=2000&auto=format&fit=crop'
      },
      {
        name: 'Rural Agri-Business',
        description: 'Sharing tips on marketing crops and building local agri-businesses.',
        category: 'Business',
        memberCount: 560,
        image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2000&auto=format&fit=crop'
      }
    ];
    
    await CommunityCircle.insertMany(initialCircles);
    circles = await CommunityCircle.find({});
  }
  
  return NextResponse.json(circles);
}

export async function POST(req: Request) {
  await dbConnect();
  const { circleId, action } = await req.json();
  
  if (action === 'join') {
    const circle = await CommunityCircle.findByIdAndUpdate(
      circleId,
      { $inc: { memberCount: 1 } },
      { new: true }
    );
    return NextResponse.json(circle);
  } else if (action === 'leave') {
    const circle = await CommunityCircle.findByIdAndUpdate(
      circleId,
      { $inc: { memberCount: -1 } },
      { new: true }
    );
    return NextResponse.json(circle);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
