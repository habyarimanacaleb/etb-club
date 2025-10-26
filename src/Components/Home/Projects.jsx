import React from "react";
import { Trash2, Drone, Home, Code2, Cog, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Icons = [
  <Home className="w-6 h-6 text-blue-600" />,
  <Trash2 className="w-6 h-6 text-green-600" />,
  <Drone className="w-6 h-6 text-blue-500" />,
  <Code2 className="w-6 h-6 text-indigo-500" />,
  <Cog className="w-6 h-6 text-gray-600" />,
  <Users className="w-6 h-6 text-green-500" />,
];

const Projects = () => {
  const [projectData, setProjectData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const ApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${ApiUrl}/api/projects`);
      const data = await response.json();
      setProjectData(data);
      toast.success("Projects loaded successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err);
      toast.error("Failed to load projects. Please try again later.");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  // 🔄 Loading Spinner
  if (loading) {
    return (
      <section id="projects" className="py-12 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-gray-200 to-green-500 bg-clip-text text-transparent">
          Projects & Prototypes
        </h2>
        <p className="text-gray-600 mt-2">
          Real projects built by our community members
        </p>

        <div className="flex flex-col justify-center items-center space-y-3 mt-12">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-t-blue-400 border-b-green-400 border-r-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </section>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <section id="projects" className="py-12 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-gray-200 to-green-500 bg-clip-text text-transparent">
          Projects & Prototypes
        </h2>
        <p className="text-red-500 mt-2">
          Error loading projects. Please try again later.
        </p>
      </section>
    );
  }

  // ⚠️ No Projects
  if (projectData.length === 0) {
    return (
      <section id="projects" className="py-12 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-gray-200 to-green-500 bg-clip-text text-transparent">
          Projects & Prototypes
        </h2>
        <p className="text-gray-500 mt-2">
          No projects available at the moment. Please check back later.
        </p>
      </section>
    );
  }

  // ✅ Projects Display
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <section id="projects" className="py-12 px-6 md:px-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-gray-200 to-green-500 bg-clip-text text-transparent">
          Projects & Prototypes
        </h2>
        <p className="text-gray-600 mt-2">
          Real projects built by our community members
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projectData.map((project, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-500 ease-in-out"
          >
            <article>
              <figure className="w-full h-48 flex justify-center items-center mb-4 bg-gradient-to-r from-blue-100 via-gray-200 to-green-100 rounded-t-2xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-gray-200 to-green-500 bg-clip-text text-transparent">{`ETB P00${
                  idx + 1
                }`}</div>
              </figure>
              <section className="px-6 pb-6">
                <div className="flex items-center space-x-3 mb-3 text-blue-600">
                  {Icons[idx % Icons.length]}
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                </div>

                <p className="text-gray-600 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tools?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </article>
            <button className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-sm hover:text-gray-800 transition duration-500 ease-in-out shadow">
              {project?.status || "opened"}
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default Projects;
