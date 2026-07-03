import { Link } from "react-router-dom";
import { Atom } from "lucide-react";

const UseCasesSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-8">
          <h2 className="font-grotesk text-3xl font-bold text-gray-900 mb-4">Explore use cases</h2>
          <p className="text-lg text-gray-600">
            How researchers put Garden to work
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-3xl mx-auto">
          <Link
            to="/use-cases/mlips"
            className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal rounded-lg flex items-center justify-center">
                    <Atom className="text-white" size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-grotesk text-2xl font-semibold text-gray-900 mb-3 group-hover:text-teal transition-colors">
                    Machine Learned Interatomic Potentials (MLIPs)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Run MLIP-driven atomistic simulation tasks like relaxation and structure prediction.
                    Libraries and GPUs pre-configured—you just need an .xyz file and a few lines of Python.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-medium">
                      Materials Science
                    </span>
                    <span className="px-3 py-1 bg-teal/15 text-deepTeal rounded-full text-sm font-medium">
                      Atomistic Simulation
                    </span>
                    <span className="px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-medium">
                      HPC & Cloud
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className="text-teal group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UseCasesSection;
