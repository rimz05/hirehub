import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets, JobCategories, JobLocations } from '../assets/assets';
import JobCart from './JobCart';

const JobListing = () => {
  const { searchFilter, isSearched, setSearchFilter, jobs } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location) ? prev.filter((c) => c !== location) : [...prev, location]
    );
  };

  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 || selectedCategories.includes(job.category);

    const matchesLocation = (job) =>
      selectedLocation.length === 0 || selectedLocation.includes(job.location);

    const matchesTitle = (job) =>
      searchFilter.title === '' || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchesSearchLocation = (job) =>
      searchFilter.location === '' || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter((job) => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job));

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocation, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 px-4 bg-white">
        {/* Search summary */}
        {isSearched && (searchFilter.title !== '' || searchFilter.location !== '') && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="flex gap-2 flex-wrap">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, title: '' }))}
                    src={assets.cross_icon}
                    className="cursor-pointer"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter((prev) => ({ ...prev, location: '' }))}
                    src={assets.cross_icon}
                    className="cursor-pointer"
                  />
                </span>
              )}
            </div>
          </>
        )}

        <button onClick={() => setShowFilter((prev) => !prev)} className="px-6 py-1.5 border border-gray-400 lg:hidden mt-4">
          {showFilter ? 'Close' : 'Open'}
        </button>

        {/* Filters */}
        <div className={showFilter ? '' : 'max-lg:hidden 2xl:px-3'}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className={showFilter ? '' : 'max-lg:hidden 2xl:px-3'}>
          <h4 className="font-medium text-lg py-4">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocation.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job listing */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
            <JobCart job={job} key={index} />
          ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            {/* Prev */}
            <a href="#job-list">
              <img
                onClick={() =>
                  setCurrentPage((prev) => (prev === 1 ? Math.ceil(filteredJobs.length / 6) : prev - 1))
                }
                src={assets.left_arrow_icon}
                alt="Previous"
                className="cursor-pointer"
              />
            </a>

            {/* Page numbers */}
            {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
              <a href="#job-list" key={index}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                    currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {index + 1}
                </button>
              </a>
            ))}

            {/* Next */}
            <a href="#job-list">
              <img
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev === Math.ceil(filteredJobs.length / 6) ? 1 : prev + 1
                  )
                }
                src={assets.right_arrow_icon}
                alt="Next"
                className="cursor-pointer"
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
