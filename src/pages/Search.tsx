import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, type Dog, type SearchFilters } from '../services/api';
import toast from 'react-hot-toast';
import ReactConfetti from 'react-confetti';
import Modal from 'react-modal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Search = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([0, 20]);
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDogs: 0
  });
  const DOGS_PER_PAGE = 20;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedList = await api.getBreeds();
        setBreeds(breedList);
      } catch {
        toast.error('Failed to fetch breeds');
      }
    };
    fetchBreeds();
  }, []);

  const isDirty = searchQuery !== '' ||
    selectedBreeds.length > 0 ||
    ageRange[0] !== 0 || ageRange[1] !== 20 || // or whatever your default is
    sortOrder !== 'breed:asc'; // assuming this is your default

  const searchDogs = async (page = 1, sortOverride?: string) => {
    setIsLoading(true);
    try {
      const zipCodesArray = searchQuery
        .split(',')
        .map(zip => zip.trim())
        .filter(zip => zip.length > 0);

      const filters: SearchFilters = {
        breeds: selectedBreeds.length ? selectedBreeds : undefined,
        ageMin: ageRange[0] || undefined,
        ageMax: ageRange[1] || undefined,
        sort: sortOverride ?? sortOrder,
        zipCodes: zipCodesArray.length > 0 ? zipCodesArray : undefined,
        size: DOGS_PER_PAGE,
        from: (page - 1) * DOGS_PER_PAGE
      };

      const searchResult = await api.searchDogs(filters);
      if (searchResult.resultIds.length > 0) {
        const dogsData = await api.getDogs(searchResult.resultIds);
        setDogs(dogsData);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(searchResult.total / DOGS_PER_PAGE),
          totalDogs: searchResult.total
        });
      } else {
        setDogs([]);
        setPagination({ currentPage: 1, totalPages: 1, totalDogs: 0 });
        toast('No dogs found matching your criteria');
      }
    } catch {
      toast.error('Failed to search dogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      searchDogs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleResetFilters = (e: React.FormEvent) => {
    setSearchQuery('');
    setSelectedBreeds([]);
    setAgeRange([0, 20]); 
    setSortOrder('breed:asc'); // or your default
    e.preventDefault();
    searchDogs(1); // or whatever function you use to re-fetch
  };
  
  useEffect(() => {
    searchDogs();
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      await logout();
      navigate('/');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDogs(1);
  };

  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds(prev => {
      if (prev.includes(breed)) {
        return prev.filter(b => b !== breed);
      } else {
        return [...prev, breed];
      }
    });
  };

  const filteredBreeds = breeds.filter(breed => 
    breed.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      if (prev.includes(dogId)) {
        return prev.filter(id => id !== dogId);
      } else {
        return [...prev, dogId];
      }
    });
  };

  const handleMatch = async () => {
    if (favorites.length < 2) {
      toast.error('Please select at least 2 dogs to find a match');
      return;
    }
    try {
      setIsLoading(true);
      const matchId = await api.getMatch(favorites);
      const [matchedDogData] = await api.getDogs([matchId]);
      setMatchedDog(matchedDogData);
      setIsModalOpen(true);
      setShowConfetti(true);
      // Stop confetti after 5 seconds
    //setTimeout(() => setShowConfetti(false),10000);
    } catch (error) {
      toast.error('Failed to find a match');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowConfetti(false);
    setMatchedDog(null);
  };

  return (
    <div className="min-h-screen bg-gradient-radial">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 900 }}>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={100}
            recycle={true}
            run={true}
            wind={0.05}
            gravity={0.1}
            initialVelocityX={15}
            confettiSource={{ x: 0, y: 0, w: 10, h: window.innerHeight }}
          />
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={100}
            recycle={true}
            run={true}
            wind={-0.05}
            gravity={0.1}
            initialVelocityX={-15}
            confettiSource={{ x: window.innerWidth - 10, y: 0, w: 10, h: window.innerHeight }}
          />
        </div>
      )}
      
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  className="modal-content"
  overlayClassName="modal-overlay"
>
  {showConfetti && (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 900 }}
    >
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={100}
        recycle={false}
        run={true}
        wind={0}
        gravity={0.3}
      />
    </div>
  )}

  {matchedDog && (
    <div
      className="rounded-[2rem] p-1 max-w-xl mx-auto relative shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #FFD6E8, #E0C8FF)',
      }}
    >
      <div
        className="rounded-[2rem] relative overflow-hidden"
        style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2
          className="text-5xl bold text-white mb-6"
          style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            fontFamily: "'Borel', cursive",
            fontStyle: "bold",
          }}
        >
          It's a Match! 🎉
        </h2>

        <div
          className="w-40 h-40 mx-auto mb-6 rounded-xl overflow-hidden shadow-xl"
        >
          <img
            src={matchedDog.img}
            alt={matchedDog.name}
            className="w-60% h-auto object-cover"
          />
        </div>

        <p className="text-4xl text-white leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif",fontSize: "1rem" }}>
          Heya! I am <strong className="font-semibold" style={{color: '#7C3AED'}}>{matchedDog.name}</strong>, your{' '}
          <strong className="font-semibold" style={{color: '#7C3AED'}}>{matchedDog.age}</strong> years old{' '}
          <strong className="font-semibold" style={{color: '#7C3AED'}}>{matchedDog.breed}</strong>, waiting for you at{' '}
          <strong className="font-semibold" style={{color: '#7C3AED'}}>{matchedDog.zip_code}</strong>.
        </p>
      </div>
    </div>
  )}
</Modal>


      <nav className="navbar">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span role="img" aria-label="paw" style={{ fontSize: "2rem", marginLeft: "1rem" }}>🐾</span>

            <h1 className="text-xl font-semibold text-purple-600" style={{ fontFamily: "'Borel', cursive", paddingTop: "1rem", textShadow: "1px 0 currentColor, -1px 0 currentColor",marginBottom: "1.5rem" }}>DogFinder</h1>
            </div>
            <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Poppins', sans-serif",fontSize: "1rem" }}>Hi, <span style={{ fontWeight: 600, color: '#7C3AED' }}>{user?.name}</span>!</span>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>
        </div>
        </nav>



      <main className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Borel', cursive", paddingTop: "1rem", textShadow: "1px 0 currentColor, -1px 0 currentColor",marginBottom: "1.5rem" }}>Find Your Perfect Furry Friend</h1>
          <p className="text-xl text-gray-600 mb-8" style={{ fontFamily: "'Poppins', sans-serif",fontSize: "1rem" }}>Browse through our lovely dogs and find your perfect match!</p>
        </motion.div>
        <br/>
        <div className="grid grid-cols-12 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="col-span-3"
                style={{ position: 'sticky', top: 10, alignSelf: 'start', zIndex: 20 }}
            >
                
                <div className="filter-card">
                <h2 className="filter-title">Filters</h2>

                {/* Breed Filter Section */}
                <div className="section">
                    <label className="section-label">Breed</label>
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Search breeds..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="filter-input focus-purple"
                    />
                    <div className="breed-scroll">
                        <div className="breed-list">
                        {filteredBreeds.map((breed) => (
                            <label key={breed} className="breed-label hover:bg-purple">
                            <input
                                type="checkbox"
                                checked={selectedBreeds.includes(breed)}
                                onChange={() => handleBreedToggle(breed)}
                                className="breed-checkbox"
                            />
                            <span className="breed-text">{breed}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>

                {/* Age Range Slider */}
                <div className="section">
                    <label className="section-label">Age Range</label>
                    <div className="age-slider">
                    <Slider
                        range
                        min={0}
                        max={20}
                        value={ageRange}
                        onChange={(value: number | number[]) => setAgeRange(value as number[])}
                        className="mb-4"
                        trackStyle={[{ backgroundColor: '#7C3AED' }]}
                        handleStyle={[
                        { borderColor: '#7C3AED', backgroundColor: '#7C3AED', boxShadow: '0 0 0 5px rgba(124, 58, 237, 0.12)' },
                        { borderColor: '#7C3AED', backgroundColor: '#7C3AED', boxShadow: '0 0 0 5px rgba(124, 58, 237, 0.12)' },
                        ]}
                        railStyle={{ backgroundColor: '#E5E7EB' }}
                    />
                    <div className="slider-range">
                        <span>{ageRange[0]} years - {ageRange[1]} years</span>
                        {/* <span>{ageRange[1]} years</span> */}
                    </div>
                    </div>
                </div>


                {/* Search and Match Buttons */}
                <div className="search-section">
                    <input
                    type="text"
                    placeholder="Enter zip codes (comma-separated)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="filter-input flex-grow focus-purple"
                    />
                    <div className="flex gap-3">
                        
                        <button
                            onClick={handleResetFilters}
                            disabled={!isDirty}
                            className="search-btn"
                            style={{
                                backgroundColor: isDirty ? '#7425eb' : '#f3f4f6', // gray-200 / gray-100
                                color: isDirty ? '#1f2937' : '#9ca3af',           // gray-800 / gray-400
                                cursor: isDirty ? 'pointer' : 'not-allowed'
                            }}
                            onMouseEnter={(e) => {
                                if (isDirty) e.currentTarget.style.backgroundColor = '#7425eb'; // hover gray-300
                            }}
                            onMouseLeave={(e) => {
                                if (isDirty) e.currentTarget.style.backgroundColor = '#e5e7eb'; // restore gray-200
                            }}
                            >
                            Reset
                        </button>
                        <button
                            onClick={handleSearch}
                            className="search-btn hover:bg-blue"
                            style={{ marginRight: "0.5rem" }}
                            >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Match Button */}
                <div>
                    <button
                    onClick={handleMatch}
                    disabled={favorites.length < 2}
                    className={`find-match-btn ${favorites.length < 2 ? 'disabled' : 'enabled'} hover:bg-purple-dark`}
                    >
                    Find Match ({favorites.length} selected)
                    </button>
                </div>
                </div>
            </motion.div>


          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="col-span-9">
          {dogs.length > 0 && (
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 px-4">
                {/* Sort Dropdown */}
                <div style={{ paddingLeft: "1rem" }}>
                <select
                    value={sortOrder}
                    onChange={(e) => {
                    const newSort = e.target.value;
                    setSortOrder(newSort);
                    e.preventDefault();
                    searchDogs(1, newSort);
                    }}
                    className="filter-select focus-purple"
                >
                    <option value="breed:asc">Breed (A-Z)</option>
                    <option value="breed:desc">Breed (Z-A)</option>
                    <option value="age:asc">Age (Youngest)</option>
                    <option value="age:desc">Age (Oldest)</option>
                </select>
                </div>

                {/* Dogs Count */}
                <div
                    style={{
                        display: 'inline-block',
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '16px',
                        padding: '8px 20px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: 500,
                    }}
                    >
                    Showing{' '}
                    <span style={{ fontWeight: 600, color: '#7C3AED' }}>
                        {(pagination.currentPage - 1) * DOGS_PER_PAGE + 1}
                    </span>{' '}
                    -{' '}
                    <span style={{ fontWeight: 600, color: '#7C3AED' }}>
                        {Math.min(pagination.currentPage * DOGS_PER_PAGE, pagination.totalDogs)}
                    </span>{' '}
                    of{' '}
                    <span style={{ fontWeight: 600, color: '#7C3AED' }}>
                        {pagination.totalDogs}
                    </span>{' '}
                    dogs
                </div>


                {/* Pagination */}
                {pagination.totalPages > 1 && (
                <div className="flex items-center flex-wrap gap-2" style={{ paddingRight: "1rem" }}>
                    <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`pagination-button ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                    Prev
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                    )
                    .map((page, index, array) => (
                        <React.Fragment key={page}>
                        {index > 0 && page - array[index - 1] > 1 && (
                            <span className="text-gray-400">...</span>
                        )}
                        <button
                            onClick={() => handlePageChange(page)}
                            className={`pagination-number ${pagination.currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                        </React.Fragment>
                    ))}

                    <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`pagination-button ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                    Next
                    </button>
                </div>
                )}
            </div>
            )}


            {/* Dogs Grid */}
            <div className="grid auto-cols-fr auto-rows-fr gap-x-8 gap-y-16 p-4 pb-8 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-w-[1600px] mx-auto">
                {dogs.map((dog) => (
                    <motion.div
                        key={dog.id}
                        whileHover={{ scale: 1.02 }}
                        className="dog-card mx-auto w-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="aspect-[4/3] relative overflow-hidden rounded-2xl">
                                <img
                                    src={dog.img}
                                    alt={dog.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                onClick={() => toggleFavorite(dog.id)}
                                className="absolute top-4 right p-2 rounded-full transition-transform hover:scale-110"
                                style={{
                                    right: '0.25rem',
                                    top: '0.25rem',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // black with low opacity
                                    backdropFilter: 'blur(2px)', // optional: adds a blur effect behind the button
                                }}
                                >
                                {favorites.includes(dog.id) ? (
                                    <span role="img" aria-label="favorited" className="text-2xl" style={{ fontSize: "1rem"}}>❤️</span>
                                ) : (
                                    <span role="img" aria-label="not favorited" className="text-2xl" style={{ fontSize: "1rem"}}>🤍</span>
                                )}
                                </button>
                            </div>
                            <div className="mt-6 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-90"style={{ color: '#7C3AED',fontFamily: "'Borel', cursive", fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                                        {dog.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        I am a <span style={{ fontWeight: 600 }}>{dog.breed}</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <span role="img" aria-label="location" className="text-blue-500">📍</span>
                                        <span className="text-sm text-gray-500">{dog.zip_code}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span role="img" aria-label="age" className="text-yellow-500">⭐</span>
                                        <span className="text-sm text-gray-500">{dog.age} years old</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
  <div className="mt-10 flex justify-center items-center flex-wrap gap-3">
    <button
      onClick={() => handlePageChange(pagination.currentPage - 1)}
      disabled={pagination.currentPage === 1}
      className={`pagination-button ${
        pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      Prev
    </button>

    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
      .filter(
        (page) =>
          page === 1 ||
          page === pagination.totalPages ||
          (page >= pagination.currentPage - 2 &&
            page <= pagination.currentPage + 2)
      )
      .map((page, index, array) => (
        <React.Fragment key={page}>
          {index > 0 && page - array[index - 1] > 1 && (
            <span className="text-gray-400">...</span>
          )}
          <button
            onClick={() => handlePageChange(page)}
            className={`pagination-number ${
              pagination.currentPage === page ? 'active' : ''
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

    <button
      onClick={() => handlePageChange(pagination.currentPage + 1)}
      disabled={pagination.currentPage === pagination.totalPages}
      className={`pagination-button ${
        pagination.currentPage === pagination.totalPages
          ? 'opacity-50 cursor-not-allowed'
          : ''
      }`}
    >
      Next
    </button>
  </div>

)}
  <br/>

            {dogs.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500 text-lg">No dogs found matching your criteria</div>
            )}

            {isLoading && (
              <div className="text-center py-12 text-gray-500 text-lg">Fetching dogs...</div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Search;
