export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">How We Grade</h1>
      
      <section className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
        <p className="text-white/80 mb-4">
          Democracy works best when citizens can easily understand how their representatives 
          actually vote, who funds them, and whether they serve the people or special interests.
        </p>
        <p className="text-white/80">
          We use public data to create simple A-F grades that cut through the noise.
          No spin. No bias. Just facts.
        </p>
      </section>

      <section className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Grading Methodology</h2>
        <p className="text-white/80 mb-6">
          Each representative receives a score from 0-100, converted to a letter grade.
          The score is based on four weighted factors:
        </p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              💰 Donor Influence (35%)
            </h3>
            <p className="text-white/70">
              What percentage of their funding comes from PACs and large donors vs. small individual 
              contributions? Representatives funded primarily by special interests score lower.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              🗳️ Voting Independence (30%)
            </h3>
            <p className="text-white/70">
              Do they vote their conscience or just follow the party line? We measure how often 
              they break from their party on key votes. Independent thinkers score higher.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              📊 Financial Transparency (25%)
            </h3>
            <p className="text-white/70">
              Do they file complete financial disclosures on time? Are their stock trades 
              properly reported? Full compliance with ethics rules earns higher scores.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              📈 Wealth Growth (10%)
            </h3>
            <p className="text-white/70">
              How much has their net worth increased since taking office? Suspicious wealth 
              accumulation relative to their salary raises red flags.
            </p>
          </div>
        </div>
      </section>

      <section className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Grade Scale</h2>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <div className="grade-badge grade-a mx-auto mb-2">A</div>
            <p className="text-white/80 text-sm">90-100</p>
            <p className="text-white/60 text-xs">Excellent</p>
          </div>
          <div>
            <div className="grade-badge grade-b mx-auto mb-2">B</div>
            <p className="text-white/80 text-sm">80-89</p>
            <p className="text-white/60 text-xs">Good</p>
          </div>
          <div>
            <div className="grade-badge grade-c mx-auto mb-2">C</div>
            <p className="text-white/80 text-sm">70-79</p>
            <p className="text-white/60 text-xs">Average</p>
          </div>
          <div>
            <div className="grade-badge grade-d mx-auto mb-2">D</div>
            <p className="text-white/80 text-sm">60-69</p>
            <p className="text-white/60 text-xs">Poor</p>
          </div>
          <div>
            <div className="grade-badge grade-f mx-auto mb-2">F</div>
            <p className="text-white/80 text-sm">&lt;60</p>
            <p className="text-white/60 text-xs">Failing</p>
          </div>
        </div>
      </section>

      <section className="card mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Data Sources</h2>
        <ul className="space-y-3 text-white/80">
          <li>
            <strong className="text-blue-400">Congress.gov</strong> — Official voting records, 
            bill sponsorship, committee assignments
          </li>
          <li>
            <strong className="text-blue-400">OpenFEC</strong> — Campaign finance data, 
            donor breakdowns, PAC contributions
          </li>
          <li>
            <strong className="text-blue-400">Voteview</strong> — DW-NOMINATE ideology scores, 
            party loyalty analysis
          </li>
          <li>
            <strong className="text-blue-400">OpenSecrets</strong> — Industry contributions, 
            lobbying data
          </li>
        </ul>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold mb-4 text-white">Open Source</h2>
        <p className="text-white/80 mb-4">
          Democracy shouldn't be paywalled. This project is open source and free to use.
          Our methodology is transparent and our data is verifiable.
        </p>
        <p className="text-white/70 text-sm">
          Built by <a href="https://arialabs.ai" className="text-blue-400 hover:text-blue-300">Aria Labs</a>
        </p>
      </section>
    </div>
  );
}
