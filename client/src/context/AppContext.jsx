import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) =>{

    const backendURL = import.meta.env.VITE_BACKEND_URL
    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:''
    })
    const [isSearched, setIsSearched] = useState(false)
    const [ jobs, setJobs] = useState([])

    const [showRecruiterLogin,setShowRecruiterLogin]  = useState(false)


    const [companyToken, setCompanyToken] = useState(null)
    const[companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplication] = useState([])

    // function to fetch jobs
    const fetchJobs = async ()=>{
        try {
            const {data} = await axios.get(backendURL +'api/jobs')
            if(data.success){
                setJobs(data.jobs)
                console.log(data.jobs)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
       
    }

    // to fetch company data
    const fetchCompanyData = async()=>{
        try{

            const {data}  = await axios.get(backendURL + '/api/company/company', {headers: {token: companyToken}})

            if(data.success){
                setCompanyData(data.company)
                localStorage.setItem('companyData', JSON.stringify(data.company));
                console.log(data);
            }else{

                toast.error(data.message)
            }

        }
        catch(error){
            toast.error(error.message)

        }
    }

    // fuction to fetch user data

    const fetchUserData = async () =>{
        try {

            const token = await getToken()
            const {data} = await axios.get(backendURL + '/api/users/user', 
                {headers:{Authorization:`Bearer ${token}`}}
            )

            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        fetchJobs();
    
        const storedCompanyToken = localStorage.getItem('comapanyToken');
        const storedCompanyData = localStorage.getItem('companyData'); // ✅ get companyData from localStorage
    
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken);
        }
    
        if (storedCompanyData) {
            setCompanyData(JSON.parse(storedCompanyData)); // ✅ set in state
        }
    }, []);

    useEffect(()=>{
        if(companyToken)
            fetchCompanyData()
    }, [companyToken])

    useEffect(()=>{
        if(user){
            fetchUserData()
        }

    },[user])

    const value ={
        setSearchFilter,searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs, showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendURL
    }
    

    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}