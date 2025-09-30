import womenbanner from './assets/celeb.jpg'
import logo from './assets/cropped-wtm_logo.png'
import iwd2 from './assets/hERO.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDocuments } from './features/files/eventSlice'
import { RootState } from "./app/store"
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase-config'; 
import { useSelector } from 'react-redux'


const Event = () => {
    const {event, loading, error } = useSelector((state: RootState) => state.event);
    // const { token, user, department, level, pf, phone } = useSelector((state: RootState) => state.auth);

    const [events, setevents] = useState(
        {
            id:1,
            img:'',
            title:'',
            date:'',
            venue:'',
            rsvp:'',
            about:'We’re on a mission to empower, inspire, and elevate women in technology. As part of the global Women Techmakers initiative, we provide resources, mentorship, and a supportive community to help women thrive in tech. Whether you\'re an aspiring developer, experienced engineer, or tech leader, our platform offers opportunities to learn, connect, and grow. Through events, workshops, and networking, we foster innovation and inclusivity in the industry. Join us in breaking barriers, shaping the future, and building a more diverse and equitable tech world. Together, we rise. #WomenInTech #WTM #EmpowerInnovateLead',
            organizers:[
                {
                    id:1,
                    name:'Mentoring Young Children',
                    date:'27th Dec. 2024'
                },
                {
                    id:2,
                    name:'International Women\'s Day 2025 second quarter',
                    date:'27th Dec. 2024'
                },
                {
                    id:3,
                    name:'Kids are the Future of Tomorrow',
                    date:'27th Dec. 2024'
                },
                {
                    id:4,
                    name:'Artificial Intelligence Week',
                    date:'27th Dec. 2024'
                },
                {
                    id:5,
                    name:'Trends in Tech',
                    date:'27th Dec. 2024'
                },
                {
                    id:6,
                    name:'Web 3: Pros and Cons',
                    date:'27th Dec. 2024'
                }
            ],
            speakers:[
                {
                    id:1,
                    name:'Mentoring Young Children',
                    date:'27th Dec. 2024'
                },
                {
                    id:2,
                    name:'International Women\'s Day 2025 second quarter',
                    date:'27th Dec. 2024'
                },
                {
                    id:3,
                    name:'Kids are the Future of Tomorrow',
                    date:'27th Dec. 2024'
                },
                {
                    id:4,
                    name:'Artificial Intelligence Week',
                    date:'27th Dec. 2024'
                },
                {
                    id:5,
                    name:'Trends in Tech',
                    date:'27th Dec. 2024'
                },
                {
                    id:6,
                    name:'Web 3: Pros and Cons',
                    date:'27th Dec. 2024'
                }
            ],
            partners:[
                {
                    id:1,
                    name:'Mentoring Young Children',
                    date:'27th Dec. 2024'
                },
                {
                    id:2,
                    name:'International Women\'s Day 2025 second quarter',
                    date:'27th Dec. 2024'
                },
                {
                    id:3,
                    name:'Kids are the Future of Tomorrow',
                    date:'27th Dec. 2024'
                },
                {
                    id:4,
                    name:'Artificial Intelligence Week',
                    date:'27th Dec. 2024'
                },
                {
                    id:5,
                    name:'Trends in Tech',
                    date:'27th Dec. 2024'
                },
                {
                    id:6,
                    name:'Web 3: Pros and Cons',
                    date:'27th Dec. 2024'
                }
            ]
        }
    )
    
    return (
        <div>
            <div className='grid border border-b-4 border-[#00bda4] w-[100%] lg:h-[100px] h-[100%] items-center'>
                <div className='lg:flex items-center justify-between lg:w-[80%] w-[90%] pt-10 lg:p-0' style={{margin:'auto'}}>
                    <img src={logo} alt="" className='w-[200px]'/>
                    <div className='flex gap-4 py-7 justify-center'>
                        <a href="" className='text-[#000000] font-bold'>Upcoming Events</a>
                        <a href="" className='text-[#000000] font-bold justify-self-end'>Past Events</a>
                    </div>
                </div>
            </div>
            <div className='relative h-[100%] my-6 lg:w-[80%] w-[90%] m-[50px_auto]'>
                <div className='w-[100%]' style={{margin:'auto'}}>
                    <img src={iwd2} alt="landing image" className='w-[100%] h-[100%] object-cover lg:rounded-4xl rounded-xl'/>
                </div>
                <div className='lg:absolute lg:top-0 lg:left-0 lg:w-[60%] w-[100%] h-[100%] grid  lg:items-center lg:align-center'>
                    <div className='lg:bg-[#0f0f0f99] justify-right self-center w-[100%] lg:w-[70%] bg-opacity-70 lg:px-10 lg:py-10 pt-5'>
                        <p className='lg:text-center  lg:text-5xl lg:text-white font-bold loading-4'>
                            {events.title}
                        </p>
                        <p className='lg:text-center  lg:text-lg lg:text-white pt-3'>
                            Date: {events.date}
                        </p>
                        <p className='lg:text-center  lg:text-lg lg:text-white pt-3'>
                            Venue: {events.venue}
                        </p>
                    </div>
                </div>
                
            </div>
            <div className='py-10 bg-[#b8b8b830]'>
                <div className='lg:w-[80%] w-[90%] m-[auto] grid grid-cols-2 content-center'>
                    <div className='flex gap-2 justify-items-start items-center'>RSVP'd <span className='bg-[#00b698] text-white font-bold rounded-full grid justify-items-center items-center w-[50px] h-[50px]'>{events.rsvp}</span></div>
                    <button className='justify-self-end bg-[#008cff] px-3 rounded-lg font-bold text-white cursor-pointer'>RSVP!</button>
                </div>
            </div>
            <div className='grid lg:w-[80%] w-[90%] gap-4 h-[100%] sm:grid-cols-1 lg:grid-cols-[1fr_2fr] m-[40px_auto] lg:m-[100px_auto]'>
                <h1 className='text-xl lg:text-4xl sm:mb-6 lg:mb-24 font-bold self-center'>About this <span className='text-[#00bda4]'>event</span></h1>
                <div className='' >
                    <p>{events.about}</p>
                </div>
            </div>
            
            <div className='w-[100%] py-14 bg-[#f2f2f2] '>
                <div className='my-14 grid lg:w-[80%] w-[90%]' style={{margin:'auto'}}>
                    <h1 className='text-4xl my-8 text-center'>Organizers</h1>
                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-6 items-center' >
                        {
                            events.organizers.map(({id, name, date})=>(
                                <Link to={'/event/'+id}>
                                    <div className='w-[100%] h-[350px] bg-white border border-1 border-gray-200 grid justify-center rounded-xl py-8'>
                                        <div className='w-[200px] h-[200px] grid justify-center justify-self-center'>
                                            <img src={iwd2} alt="" className='w-[100%] h-[100%] object-cover rounded-full'/>
                                        </div>
                                        <div className='text-center px-5'>
                                            <h3 className='font-bold text-lg'>{name}</h3>
                                            <p>{date}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='w-[100%] py-14 bg-[#ffffff '>
                <div className='my-14 grid lg:w-[80%] w-[90%]' style={{margin:'auto'}}>
                    <h1 className='text-4xl my-8 text-center'>Speakers</h1>
                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-6 items-center' >
                        {
                            events.speakers.map(({id, name, date})=>(
                                <Link to={'/event/'+id}>
                                    <div className='w-[100%] h-[350px] bg-white m-3 grid justify-center rounded-xl py-8'>
                                        <div className='w-[200px] h-[200px] grid justify-center justify-self-center'>
                                            <img src={iwd2} alt="" className='w-[100%] h-[100%] object-cover rounded-full'/>
                                        </div>
                                        <div className='text-center px-5'>
                                            <h3 className='font-bold text-lg'>{name}</h3>
                                            <p>{date}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='w-[100%] py-14 bg-[#ffffff]'>
                <div className='my-14 grid lg:w-[80%] w-[90%] ' style={{margin:'auto'}}>
                    <h1 className='text-4xl my-8 text-center'>Partners</h1>
                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-6 items-center' >
                        {
                            events.partners.map(({id})=>(
                                <Link to={'/event/'+id}>
                                    <div className='w-[100%] h-[100%] bg-white m-3 grid justify-center rounded-xl py-8'>
                                        <div className='w-[200px] h-[200px] grid justify-center justify-self-center'>
                                            <img src={iwd2} alt="" className='w-[100%] h-[100%] object-cover rounded-full'/>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='w-[100%]'>
                <img src={womenbanner} alt="" />
            </div>
            <div className='w-[100%] py-8 bg-[#00bca3] text-center text-white'>
                <p> &copy; 2025 All Rights Reserved</p>
            </div>
        </div>
    )
}
export default Event