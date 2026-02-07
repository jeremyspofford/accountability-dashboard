import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CampaignPositions from './CampaignPositions';

const mockPositionsData = {
  members: [
    {
      bioguide_id: 'T000001',
      name: 'Test Member',
      source: 'ontheissues',
      source_url: 'https://example.com/test',
      last_updated: '2026-02-06T00:00:00Z',
      positions: [
        {
          topic: 'Abortion is a woman\'s unrestricted right',
          stance: 'Strongly Supports',
          intensity: 5,
          quotes: ['Quote 1', 'Quote 2'],
          votes: []
        },
        {
          topic: 'Increase military spending',
          stance: 'Opposes',
          intensity: 2,
          quotes: ['Military quote'],
          votes: []
        }
      ]
    }
  ]
};

describe('CampaignPositions', () => {
  it('renders nothing when member not found', () => {
    const { container } = render(
      <CampaignPositions bioguideId="UNKNOWN" positionsData={mockPositionsData} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders positions for matching member', () => {
    render(
      <CampaignPositions bioguideId="T000001" positionsData={mockPositionsData} />
    );
    
    expect(screen.getByText('Policy Positions')).toBeInTheDocument();
    expect(screen.getByText('Abortion is a woman\'s unrestricted right')).toBeInTheDocument();
    expect(screen.getByText('Increase military spending')).toBeInTheDocument();
  });

  it('shows stance labels', () => {
    render(
      <CampaignPositions bioguideId="T000001" positionsData={mockPositionsData} />
    );
    
    expect(screen.getByText('Strongly Supports')).toBeInTheDocument();
    expect(screen.getByText('Opposes')).toBeInTheDocument();
  });

  it('links to source', () => {
    render(
      <CampaignPositions bioguideId="T000001" positionsData={mockPositionsData} />
    );
    
    const sourceLink = screen.getByText('Source: OnTheIssues →');
    expect(sourceLink).toHaveAttribute('href', 'https://example.com/test');
  });

  it('expands to show quotes when clicked', () => {
    render(
      <CampaignPositions bioguideId="T000001" positionsData={mockPositionsData} />
    );
    
    // Initially quotes are hidden
    expect(screen.queryByText('Quote 1')).not.toBeInTheDocument();
    
    // Click to expand
    const expandButtons = screen.getAllByText('▼ More');
    fireEvent.click(expandButtons[0]);
    
    // Now quotes should be visible
    expect(screen.getByText('Quote 1')).toBeInTheDocument();
  });

  it('renders nothing when positions array is empty', () => {
    const emptyData = {
      members: [{
        bioguide_id: 'EMPTY',
        name: 'Empty Member',
        source: 'test',
        source_url: 'https://example.com',
        last_updated: '2026-02-06T00:00:00Z',
        positions: []
      }]
    };
    
    const { container } = render(
      <CampaignPositions bioguideId="EMPTY" positionsData={emptyData} />
    );
    expect(container.firstChild).toBeNull();
  });
});
