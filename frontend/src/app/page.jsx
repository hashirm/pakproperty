import React from 'react';
import { HeroSearch } from '@/components/home/HeroSearch';
import { CityCards } from '@/components/home/CityCards';
import { FeaturedSlider } from '@/components/home/FeaturedSlider';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { AgentShowcase } from '@/components/home/AgentShowcase';
import { NewsAndGuides } from '@/components/home/NewsAndGuides';

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero Search Area */}
      <HeroSearch />

      {/* 2. Top Cities in Pakistan */}
      <CityCards />

      {/* 3. Featured Verified Properties */}
      <FeaturedSlider />

      {/* 4. New Housing Schemes & Projects */}
      <ProjectsSection />

      {/* 5. Top Real Estate Agents & Agencies */}
      <AgentShowcase />

      {/* 6. Market Insights & Pakistani Property Guides */}
      <NewsAndGuides />
    </div>
  );
}
