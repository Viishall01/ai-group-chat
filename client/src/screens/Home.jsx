import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import axios from '../config/axios';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/projects/all')
            .then((res) => setProjects(res.data.projects))
            .catch(err => console.log(err));
    }, []);

    const createProject = (e) => {
        e.preventDefault();
        axios.post('/projects/create', { name: projectName })
            .then((res) => {
                setProjects([...projects, res.data.project]);
                console.log("this is the project"+JSON.stringify(projects))
                setIsModalOpen(false);
                setProjectName('');
            })
            .catch(error => console.log(error));
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 relative">
            <h1 className="text-2xl font-bold text-white mb-6">Your Groups</h1>
            
            {/* Project List */}
            <div className="overflow-y-auto max-h-[500px] space-y-4 p-2 w-full max-w-4xl scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {projects.map((project) => (
                    <div key={project._id} 
                        onClick={() => navigate(`/project`, { state: { project } })} 
                        className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition transform hover:scale-105 cursor-pointer shadow-md border border-gray-600">
                        <div>
                            <h2 className="text-lg font-semibold text-white">{project.name}</h2>
                            <p className="text-gray-400 text-sm">Collaborators: {project.users.length}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Create Group Button */}
            <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                <FaPlus className="h-6 w-6" />
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-black p-6 rounded-lg shadow-2xl w-full max-w-md border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-6 text-gray-100 text-center">Create New Group</h2>
                        <form onSubmit={createProject}>
                            <input
                                type="text"
                                placeholder="Enter Group Name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full bg-neutral-900 p-3 rounded-md mb-4 outline-none text-white"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" className="px-5 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400 transition" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Home;
