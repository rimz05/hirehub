import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AppContext } from "./AppContext";

export const AppContextProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplication] = useState([]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/jobs`);

      if (data.success){
        setJobs(data.jobs);
        setUserApplication(data.userApplications)
      } 
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/company/company`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
        localStorage.setItem("companyData", JSON.stringify(data.company));
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setUserData(data.user);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    const storedCompanyData = localStorage.getItem("companyData");
    if (storedCompanyToken) setCompanyToken(storedCompanyToken);
    if (storedCompanyData) setCompanyData(JSON.parse(storedCompanyData));
  }, []);

  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendURL,
    userData,
    userApplications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
