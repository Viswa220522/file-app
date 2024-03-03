import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

const App = () => {
  const [backendData, setBackendData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const data = sortedData.slice(firstIndex, lastIndex);
  const npages = Math.ceil(sortedData.length / dataPerPage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  const getData = async () => {
    try {
      const res = await Axios.get("http://localhost:8080/api");
      setBackendData(res.data);
      setFilteredData(res.data); // Initially, set filtered data to all data
      setSortedData(res.data); // Initially, set sorted data to all data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Filter data based on search query
    const filtered = backendData.filter(
      (item) =>
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, backendData]);

  useEffect(() => {
    // Sort data based on sort order
    const sorted = [...filteredData].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setSortedData(sorted);
  }, [sortOrder, filteredData]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="center">
      <h2> Customers Data </h2>
      <div className="center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSortChange}>
          Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
        <table cellspacing="15" border="2">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Customer name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, i) => (
              <tr key={i}>
                <td>{user.sno}</td>
                <td>{user.customer}</td>
                <td>{user.age}</td>
                <td>{user.phone}</td>
                <td>{user.location}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul>
          <li>
            <button onClick={prePage} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {numbers.map((number, i) => (
            <li
              className={currentPage === number ? "page-active" : "page-inactive"}
              key={i}
            >
              <button onClick={() => changePage(number)}>{number}</button>
            </li>
          ))}
          <li>
            <button onClick={nextPage} disabled={currentPage === npages}>
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changePage(n) {
    setCurrentPage(n);
  }

  function nextPage() {
    if (currentPage !== npages) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default App;