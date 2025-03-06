import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import Calendar from "react-calendar"; // Import the calendar component
import "react-calendar/dist/Calendar.css"; // Import the calendar styles
import "./SuperiorAnalytics.css";
import axios from "axios";
import { format } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Colors for the donut chart

const Card = ({ title, number, onClick }) => {
  return (
    <div className="pl-warden-card" onClick={onClick}>
      <h2 className="pl-warden-card-title">{title}</h2>
      <p className="pl-warden-card-number">{number}</p>
    </div>
  );
};

const Dashboard1 = () => {
  const [selectedGender, setSelectedGender] = useState("Boys"); 
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNames, setShowNames] = useState(false);
  const [highlightedData, setHighlightedData] = useState(null);
  const [showChartPopup, setShowChartPopup] = useState(false);
  const [chartPopupData, setChartPopupData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState("overall");
  const [years, setYears] = useState(null);
  const [fetchedData, setFetchData] = useState({
    boys: {},
    girls: {},
  });
  const [showNameList, setShowNameList] = useState(false);
  const [nameListData, setNameListData] = useState([]);
  const [fetchedPassAnalysis, setFetchedPassAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(selectedYear);
  
  

  // New state for calendar visibility
  const handleGenderToggle = () => {
    setSelectedGender((prev) => (prev === "Boys" ? "Girls" : "Boys"));
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

    // pass measure fetching
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/pass_measures_superior');
          const fetchedData = response.data;
    
          // Extract years from the fetched data
          const years = fetchedData.primary_years;
          setYears(years);
    
          // Parse data for boys and girls
          const boysData = fetchedData.data.Male;
          const girlsData = fetchedData.data.Female;
    
          // Set the parsed data into state
          setFetchData({
            boys: boysData,
            girls: girlsData,
          });
        } catch (err) {
          console.error("Error Fetching data", err);
        }
      };
    
      fetchData();
    }, []);

  const BoySelectedData = fetchedData?.boys?.[selectedYear] || {};
  const GirlSelectedData = fetchedData?.girls?.[selectedYear] || {};

  const cardDataBoys = [
    { title: "Outgoing", number: BoySelectedData?.exitTimeCount },
    { title: "Arrive", number: BoySelectedData?.reEntryTimeCount },
    {
      title: "Waiting",
      number: BoySelectedData?.activeOutsideCount,
      names: {
        names: BoySelectedData?.activeOutsideNames,
        passtypes: BoySelectedData?.activeOutsidePassTypes
      }
    },
    {
      title: "Overtime",
      number: BoySelectedData?.overdueReturnCount,
      names: {
        names: BoySelectedData?.overdueReturnNames,
        late_by: BoySelectedData?.overdueReturnLateBy
      }
      // names: [
      //   { name: "Frank", time: "10 min" },
      //   { name: "Grace", time: "15 min" },
      //   { name: "Hannah", time: "20 min" },
      //   { name: "heman", time: "18 min" },
      //   { name: "karol", time: "15 min" },
      //   { name: "sheperd", time: "20 min" },
      //   { name: "Alice", time: "14 min" },
      // ],
    },
  ];

  const cardDataGirls = [
    { title: "Outgoing", number: GirlSelectedData?.exitTimeCount },
    { title: "Arrive", number: GirlSelectedData?.reEntryTimeCount },
    {
      title: "Waiting",
      number: GirlSelectedData?.activeOutsideCount,
      names: {
        names: GirlSelectedData?.activeOutsideNames,
        passtypes: GirlSelectedData?.activeOutsidePassTypes
      }
    },
    {
      title: "Overtime",
      number: GirlSelectedData?.overdueReturnCount,
      names: {
        names: GirlSelectedData?.overdueReturnNames,
        late_by: GirlSelectedData?.overdueReturnLateBy
      }
      // names: [
      //   { name: "Grace", time: "15 min" },
      //   { name: "Alice", time: "10 min" },
      //   { name: "Sophia", time: "20 min" },
      //   { name: "Olivia", time: "18 min" },
      // ],
    },
  ];

  const cardData = selectedGender === "Boys" ? cardDataBoys : cardDataGirls;


  const chartDataBoys = [
    { name: "OD", value: BoySelectedData?.passTypeCounts?.od },
    { name: "Leave", value: BoySelectedData?.passTypeCounts?.leave },
    { name: "Stay Pass", value: BoySelectedData?.passTypeCounts?.staypass },
    { name: "Out Pass", value: BoySelectedData?.passTypeCounts?.outpass },
  ];

  const chartDataGirls = [
    { name: "OD", value: GirlSelectedData?.passTypeCounts?.od },
    { name: "Leave", value: GirlSelectedData?.passTypeCounts?.leave },
    { name: "Stay Pass", value: GirlSelectedData?.passTypeCounts?.staypass },
    { name: "Out Pass", value: GirlSelectedData?.passTypeCounts?.outpass },
  ];
  
  const chartData = selectedGender === "Boys" ? chartDataBoys : chartDataGirls;
  

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleCardClick = (card) => {
    if (card.title === "Waiting" || card.title === "Overtime") {
      setSelectedCard(card);
      setShowNames(true);
    } else {
      setShowNames(false);
    }
  };

  const closeModal = () => {
    setShowNames(false);
    setShowChartPopup(false);
  };

  const handlePieMouseEnter = (data) => {
    if (window.innerWidth < 769) return; // Prevent hover effect on mobile
    setHighlightedData(data);
  };

  const handlePieMouseLeave = () => {
    setHighlightedData(null);
  };

  const handlePieClick = async (data) => {
    if (!data || !data.value) return;
    setIsLoading(true);
    setError(null);
  
    console.log(data.name.trim().toLowerCase().replace(/\s+/g, ''));
    console.log(selectedYear)
    console.log(selectedGender === 'Boys' ? "Male" : "Female");
    
    try {
      const response = await axios.post('/api/pass_analysis_superior', {
        type: data.name.trim().toLowerCase().replace(/\s+/g, ''), // Pass type (e.g., "od", "leave")
        year: selectedYear, // Selected year (e.g., "1", "2", "3", "4")
        gender: selectedGender === 'Boys' ? "Male" : "Female"
      }, { withCredentials: true });
  
      if (response.status === 200) {
        const fetchedData = response.data;
        setFetchedPassAnalysis(fetchedData);
  
        // Update the modal content with fetched data
        const popupChartData = Object.entries(fetchedData.reasonTypeCounts || {}).map(([reason, count]) => ({
          name: reason,
          value: count,
          color: getRandomColor(),
        }));
  
        setChartPopupData({
          title: data.name,
          count: data.value,
          dates: [], // You can update this if needed
          popupChartData,
        });
  
        setShowChartPopup(true);
      } else {
        throw new Error(response.data.error || "Failed to fetch pass analysis data");
      }
    } catch (error) {
      console.error("Error fetching pass analysis data:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");  // Converts to yyyy-mm-dd
    console.log(formattedDate);
    
    setSelectedDate(formattedDate);
    setShowCalendar(false); // Hide the calendar after selecting the date
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('/api/pass_analysis_by_date_superior', {
        type: chartPopupData?.title.trim().toLowerCase().replace(/\s+/g, ''), // Pass type (e.g., "od", "leave")
        year: selectedYear, // Selected year (e.g., "1", "2", "3", "4")
        gender: selectedGender === 'Boys' ? "Male" : "Female",
        date: formattedDate, // Selected date
      }, { withCredentials: true });
  
      if (response.status === 200) {
        const fetchedData = response.data;
        
        setFetchedPassAnalysis(fetchedData);
        
        // Update the modal content with fetched data
        const popupChartData = Object.entries(fetchedData.reasonTypeCounts || {}).map(([reason, count]) => ({
          name: reason,
          value: count,
          color: getRandomColor(),
        }));
        
        setChartPopupData(prev => ({
          ...prev,
          popupChartData,
        }));
      } else {
        throw new Error(response.data.error || "Failed to fetch pass analysis data");
      }
    } catch (error) {
      console.error("Error fetching pass analysis data:", error);
      setError(error.message || "Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleToggleCalendar = () => {
    setShowCalendar((prev) => !prev); // Toggle calendar visibility
  };

  const handleTotalClick = () => {
    const names = fetchedPassAnalysis?.activePasses?.names || [];
    setNameListData(names);
    setShowNameList(true);
  };
  
  const handleReturningClick = () => {
    const names = fetchedPassAnalysis?.toFieldMatch?.names || [];
    setNameListData(names);
    setShowNameList(true);
  };
  
  const handleOvertimeClick = () => {
    const names = fetchedPassAnalysis?.overduePasses?.names || [];
    setNameListData(names);
    setShowNameList(true);
  };
  
  return (
    <div
      className={`pl-warden-dashboard-container ${
        showChartPopup ? "pl-warden-blurred-background" : ""
      }`}
    >
      <div className="pl-warden-title-container">
        Analytics - {selectedGender}
      </div>

      <div className="pl-warden-dropdown-container">
        <div className="select">
          <label className="pl-warden-dropdown-label">Select Year:</label>
          <select
          className="pl-warden-dropdown"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="overall">Overall</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select>
          
        </div>

        <div className="toggle-container">
          <span className="toggle-label">Boys</span>
          <label className="switch">
            <input
              type="checkbox"
              onChange={handleGenderToggle}
              checked={selectedGender === "Girls"}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">Girls</span>
        </div>
      </div>
      {/* Cards Section */}
      <div className="pl-warden-cards">
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            number={card.number}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Donut Chart Section */}
      <div className="pl-warden-chart-container">
        <PieChart width={900} height={500}>
          <Pie
            data={chartData}
            cx="50%" // Center it within its container
            cy="40%"
            innerRadius={130}
            outerRadius={200}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={handlePieMouseEnter}
            onMouseLeave={handlePieMouseLeave}
            onClick={handlePieClick}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className={
                  highlightedData && highlightedData.name === entry.name
                    ? "highlighted"
                    : ""
                }
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            align="right"
            verticalAlign="middle"
            layout="vertical"
            // onClick={handleLegendClick}
            wrapperStyle={{
              display: "flex",
              flexDirection: "column", // 🔥 Stack items in a single column
              width: "150px", // Adjust width for better alignment
              position: "absolute",
              right: 30, // Aligns legend to the right
              top: "40%", // Centers vertically
              transform: "translateY(-50%)",
              fontSize: "20px", // Adjust font size for better readability
              fontWeight: "bold",
              textAlign: "left", // Align text to the left
              justifyContent: "center", // Centers items properly
              alignItems: "flex-start", // Aligns text properly
              lineHeight: "2rem", // Adds spacing between legend items
            }}
          />
        </PieChart>
      </div>

      {/* Modal for Waiting & Overtime */}
      {showNames && selectedCard && (
        <div className="pl-warden-modal-overlay" onClick={closeModal}>
          <div
            className="pl-warden-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pl-warden-close-button" onClick={closeModal}>
              ×
            </button>
            <h3>{selectedCard.title} Names:</h3>
            <ul>
            {selectedCard.names.names.map((entry, i) => (
                <li key={i} className="text-left">
                  <strong>{i + 1}.</strong> 
                  {typeof entry === "string" ? entry : entry.name}{" "}
                  {selectedCard.names.late_by && (
                    <span className="pl-warden-time">({selectedCard.names.late_by[i]})</span>
                  )}
                  {selectedCard.names.passtypes && (
                    <span className="pl-warden-time">({selectedCard.names.passtypes[i]})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal for Chart Data */}
      {showChartPopup && chartPopupData && (
      <div className="pl-warden-modal-overlay" onClick={closeModal}>
        <div
          className="pl-warden-popup-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="pl-warden-close-button" onClick={closeModal}>
            ×
          </button>
          {/* Date Selector Button */}
          {chartPopupData.title !== "Out Pass" && (
            <button className="pl-warden-toggle-button" onClick={handleToggleCalendar}>
              {new Date(selectedDate).toISOString().split("T")[0]}
            </button>
          )}
          {/* Calendar (only shown when `showCalendar` is true) */}
          {showCalendar && (
            <Calendar
              onChange={handleDateChange}
              value={new Date(selectedDate)} // Ensure selectedDate is formatted correctly
            />
          )}

          {isLoading && <p>Loading...</p>}
          {error && <p className="pl-warden-error">{error}</p>}

          {!isLoading && !error && (
            <>
              <h3 className="pl-warden-popup-title">
                {chartPopupData.title} Details
              </h3>

              <div className="pl-warden-popup-count" onClick={handleTotalClick}>
                <h4>Total Count:</h4>
                <p>
                  <strong>{fetchedPassAnalysis?.activePasses?.count}</strong>
                </p>
              </div>

              <div className="pl-warden-popup-returning" onClick={handleReturningClick}>
              {chartPopupData.title != "Out Pass" ? (
                  <h4>Returning ({selectedDate}):</h4>
                ) : (
                  <h4>Returning Students:</h4>
                )}
                <p>
                  <strong>{fetchedPassAnalysis?.toFieldMatch?.count}</strong>
                </p>
              </div>

              <div className="pl-warden-popup-overtime" onClick={handleOvertimeClick}>
              {chartPopupData.title != "Out Pass" ? (
                <h4>OverDay ({selectedDate}):</h4>
              ) : (
                <h4>Over Time:</h4>
              )}
                <p>
                  <strong>{fetchedPassAnalysis?.overduePasses?.count}</strong>
                </p>
              </div>

              {showNameList && (
                <div className="pl-warden-name-list-popup">
                  <h4>Names:</h4>
                  <ul>
                    {nameListData.length > 0 ? (
                      nameListData.map((name, index) => <li key={index}>{name}</li>)
                    ) : (
                      <li>No names available</li>
                    )}
                  </ul>
                  <button onClick={() => setShowNameList(false)}>Close</button>
                </div>
              )}

              <div className="pl-warden-pie-chart-container">
                <PieChart width={500} height={250}>
                  <Pie
                    data={
                      chartPopupData?.popupChartData || [
                        { name: "No Data", value: 1 },
                      ]
                    }
                    cx="40%"
                    cy="55%"
                    innerRadius={0}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartPopupData?.popupChartData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    className="pl-warden-recharts-pie"
                    align="right"
                    verticalAlign="middle"
                    layout="vertical"
                    wrapperStyle={{
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      position: "absolute",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </div>
            </>
          )}
        </div>
      </div>
    )}
    </div>
  );
};

export default Dashboard1;
