import Link from "next/link";
import cabinetData from "@/data/cabinet.json";

export default function CabinetPage() {
  const { members } = cabinetData;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-4">
              Cabinet Members
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The President's Cabinet advises on matters related to the duties of their respective offices. 
              Below are the members of President Trump's Cabinet.
            </p>
          </div>
        </div>
      </section>

      {/* Cabinet Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div 
            data-testid="cabinet-grid"
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/executive/cabinet/${member.id}`}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Photo */}
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-400">
                    {member.department}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Link 
            href="/executive"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Executive Branch
          </Link>
        </div>
      </section>
    </div>
  );
}
