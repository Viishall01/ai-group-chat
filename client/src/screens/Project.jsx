import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { disconnectSocket, initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'

const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const messageEndRef = useRef(null); // 👈 Scroll reference
    const socketRef = useRef(null); // 👈 Store socket instance


    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }


    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")


    }


    useEffect(() => {

        // Initialize socket only once
        socketRef.current = initializeSocket(project._id);

        receiveMessage("project-message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        axios.get(`/projects/get-project/${location.state.project._id}`).then((res) => {
            setProject(res.data.project);
        });

        axios.get('/users/all').then(res => { setUsers(res.data.users) }).catch(err => { console.log(err) })
    
        return () => {
            disconnectSocket(); // Cleanup socket connection on unmount
        };

    }, [])

    useEffect(() => {
        // Auto-scroll to the latest message
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    
    return (
        <main className='h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
            <section className="flex flex-col h-full w-full md:w-2/3 lg:w-2/3 bg-gray-800 shadow-lg rounded-lg overflow-hidden relative">
            <header className="relative flex items-center px-4 py-3 bg-gray-900 text-white">
                {/* Left Side - Add Collaborator Button */}
                <button 
                className="flex items-center gap-2 text-sm md:text-base font-semibold hover:text-gray-400"
                onClick={() => setIsModalOpen(true)}
                >
                    <i className="ri-add-fill text-lg md:text-xl"></i> 
                    <span className="hidden sm:inline">Add Collaborator</span>
                </button>

                {/* Center - Project Name (Perfectly Centered) */}
                <div className="absolute left-1/2 -translate-x-1/2 text-sm md:text-lg font-semibold truncate max-w-[60%] md:max-w-none">
                    {location.state.project.name}
                </div>

                {/* Right Side - Group Icon Button */}
                <button 
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
                className="p-2 hover:text-gray-400 ml-auto"
                >
                    <i className="ri-group-fill text-lg md:text-xl"></i>
                </button>
            </header>

                {/* Conversation Area */}
                <div className="conversation-area flex-grow flex flex-col p-2 overflow-y-auto space-y-3">
                    <div className="message-box w-full bg-gray-700 rounded-lg">
                    {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-54'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md m-2`}>
                                <small className='opacity-65 text-xs text-blue-600'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ?

                                        <div
                                            className='overflow-auto text-black rounded-sm py-1 '
                                        >
                                            <Markdown
                                                children={msg.message}
                                            />
                                        </div>
                                        : <div className='text-black'>{msg.message}</div>}
                                </div>
                            </div>
                        ))}
                        <div ref={messageEndRef}></div>

                    </div>
                    
                </div>
                
                <div className="inputField w-full flex border-t border-gray-700 p-2 bg-gray-900">
                    <input value={message} onChange={(e) => setMessage(e.target.value)}  onKeyDown={(e) => e.key === 'Enter' && send()} type="text"className='p-2 flex-grow bg-gray-700 text-white border-none outline-none rounded-l-lg resize-none h-12' placeholder='Enter message' />
                    <button onClick={send} className='px-5 bg-gray-700 text-white hover:bg-gray-600 rounded-r-lg'><i className="ri-send-plane-fill"></i></button>
                </div>
            </section>
            {isSidePanelOpen && (
                <div className="absolute top-0 right-0 h-full w-64 bg-gray-800 shadow-lg p-6 transition-transform transform translate-x-0 ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Participants</h2>
                        <button onClick={() => setIsSidePanelOpen(false)} className="p-2 text-gray-400 hover:text-gray-200">
                            <i className="ri-close-fill text-xl"></i>
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {users.map(user => (
                            <li key={user._id} className="p-3 border-b border-gray-700 bg-gray-700 rounded-lg hover:bg-gray-600">
                                {user.email}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => console.log('Logout clicked')} className="mt-6 w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold">
                        Logout
                    </button>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select Users</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:text-gray-400'>
                                <i className="ri-close-fill text-lg"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-6 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div key={user._id} className={`user flex gap-3 items-center p-3 rounded-lg cursor-pointer ${selectedUserId.has(user._id) ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`} onClick={() => handleUserClick(user._id)}>
                                    <div className='w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full text-white'>
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className='text-sm font-medium'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button onClick={addCollaborators} className='w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
