import { Link } from "react-router-dom";
import { Atom } from "lucide-react";

const UseCasesSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Use Cases</h2>
          <p className="text-lg text-gray-600">
            Discover how Garden powers cutting-edge research workflows
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-3xl mx-auto">
          <Link
            to="/use-cases/mlips"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Atom className="text-white" size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    Machine Learned Interatomic Potentials (MLIPs)
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Run MLIP-driven atomistic simulation tasks like relaxation and structure prediction.
                    Libraries and GPUs pre-configured—you just need an .xyz file and a few lines of Python.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Materials Science
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      Atomistic Simulation
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      HPC & Cloud
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
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
