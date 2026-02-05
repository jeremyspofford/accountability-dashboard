import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VotingRecordSection from "./VotingRecordSection";

describe("VotingRecordSection", () => {
  const mockKeyVotes = [
    {
      date: "2024-01-15",
      bill: "H.R. 2847",
      title: "Climate Investment Act",
      vote: "Yea" as const,
      partyPosition: "Yea" as const,
      aligned: true,
    },
    {
      date: "2024-01-10",
      bill: "H.R. 1234",
      title: "Tax Reform Bill",
      vote: "Nay" as const,
      partyPosition: "Yea" as const,
      aligned: false,
    },
  ];

  it("renders voting record title", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.getByText("Voting Record")).toBeInTheDocument();
  });

  it("displays party loyalty percentage", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.getByText("Party Loyalty")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("shows ideology score when provided", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.getByText("Ideology Score")).toBeInTheDocument();
    expect(screen.getByText(/Conservative/)).toBeInTheDocument();
  });

  it("does not show ideology score when null", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={null}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.queryByText("Ideology Score")).not.toBeInTheDocument();
  });

  it("displays key votes", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.getByText("H.R. 2847")).toBeInTheDocument();
    expect(screen.getByText("Climate Investment Act")).toBeInTheDocument();
    expect(screen.getByText("H.R. 1234")).toBeInTheDocument();
    expect(screen.getByText("Tax Reform Bill")).toBeInTheDocument();
  });

  it("highlights votes that broke with party", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={mockKeyVotes}
      />
    );

    expect(screen.getByText("Broke with party")).toBeInTheDocument();
  });

  it("shows placeholder when no key votes", () => {
    render(
      <VotingRecordSection
        partyLoyalty={85}
        ideologyScore={0.3}
        keyVotes={[]}
      />
    );

    expect(screen.getByText(/Key votes data coming soon/)).toBeInTheDocument();
  });
});
