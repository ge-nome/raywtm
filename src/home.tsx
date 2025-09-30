import woman from './assets/2a.jpg'
import women from './assets/3.jpg'
import womenbanner from './assets/celeb.jpg'
import logo from './assets/cropped-wtm_logo.png'
import iwd from './assets/WTM-IWD25-SocialBanners-LinkedIn-1024x173.png'
import iwd2 from './assets/hERO.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'


const Home = () => {

    const [events, setevents] = useState([
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
    ])
    return (
        <div>
            <div className='grid border border-b-4 border-[#00bda4] w-[100%] h-[100px] items-center'>
                <div className='flex items-center justify-between w-[80%]' style={{margin:'auto'}}>
                    <img src={logo} alt="" className='w-[200px]'/>
                    <div className='flex gap-4'>
                        <a href="" className='text-[#000000] font-bold'>Upcoming Events</a>
                        <a href="" className='text-[#000000] font-bold'>Past Events</a>
                    </div>
                </div>
            </div>
            <div className='w-[100%] py-14 bg-[#ffffff] border border-0 border-t-1 border-[#00bda4]'>
                <div className='my-14 grid w-[80%] ' style={{margin:'auto'}}>
                    <h1 className='text-4xl my-8 text-center'>Upcoming Events</h1>
                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-6 items-center' >
                        {
                            events.map(({id, name, date})=>(
                                <Link to={'/event/'+id}>
                                    <div className='w-[100%] h-[350px] bg-white border border-1 border-gray-200 m-3 grid justify-center rounded-xl py-8'>
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
            <div className='relative h-[550px]'>
                <div className='w-[100%] h-[550px] bg-black'>
                    <img src={woman} alt="landing image" className='w-[100%] h-[100%] object-cover opacity-90'/>
                </div>
                <div className='absolute top-0 right-0 w-[100%] h-[500px] grid  items-center align-center my-6'>
                    <div className='bg-[#308af6] justify-right self-center w-[70%] bg-opacity-50 grid gap-7 px-10 py-10 rounded-br-4xl'>
                        <p className='text-center  text-5xl text-white font-bold'>
                            Welcome to Women Techmakers!  
                        </p>
                        <p className='text-center  text-lg loading-8 text-white'>
                            We’re on a mission to empower, inspire, and elevate women in technology. As part of the global Women Techmakers initiative, we provide resources, mentorship, and a supportive community to help women thrive in tech. Whether you're an aspiring developer, experienced engineer, or tech leader, our platform offers opportunities to learn, connect, and grow. Through events, workshops, and networking, we foster innovation and inclusivity in the industry. Join us in breaking barriers, shaping the future, and building a more diverse and equitable tech world. Together, we rise.  
                            #WomenInTech #WTM #EmpowerInnovateLead
                        </p>
                    </div>
                </div>
            </div>
            <div className='grid w-[80%] gap-8 h-[100%]' style={{margin:'100px auto', gridTemplateColumns:'20% 80%'}}>
                <h1 className='text-4xl mb-24 font-bold self-center'>What we do</h1>
                <div className='grid grid-cols-3 gap-8 items-start justify-between' >
                    <div className='text-center'>
                        <h3 className='text-2xl font-semibold mb-8'>Organize Events</h3>
                        <p>Host a meet-up, power panel, or an International Women’s Day event to educate, connect and inspire your tech community</p>
                    </div>
                    <div className='text-center'>
                        <h3 className='text-2xl font-semibold mb-8'>Create learning resources</h3>
                        <p>Film a video, create custom code snippets, or write a blog post, and share your knowledge with the community</p>
                    </div>
                    <div className='text-center'>
                        <h3 className='text-2xl font-semibold mb-8'>Do mentorship</h3>
                        <p>Mentor others and help empower the next generation of technologists</p>
                    </div>
                </div>
            </div>
            
            <div className='w-[100%] py-14 bg-[#ffffff] border border-0 border-t-1 border-[#00bda4]'>
                <div className='my-14 grid w-[80%] ' style={{margin:'auto'}}>
                    <h1 className='text-4xl my-8 text-center'>Past Events</h1>
                    <div className='grid sm:grid-cols-1 lg:grid-cols-4 gap-6 items-center' >
                        {
                            events.map(({id, name, date})=>(
                                <Link to={'/event/'+id}>
                                    <div className='w-[100%] h-[350px] bg-white border border-1 border-gray-200 m-3 grid justify-center rounded-xl py-8'>
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
            <div className='w-[100%]'>
                <img src={womenbanner} alt="" />
            </div>
            <div className='w-[100%] py-8 bg-[#00bca3] text-center text-white'>
                <p> &copy; 2025 All Rights Reserved</p>
            </div>
        </div>
    )
}
export default Home