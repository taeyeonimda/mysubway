import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [stationName, setStationName] = useState('');
  const [responseData, setResponseData] = useState([]);

  const handleInputChange = (event) => {
    setStationName(event.target.value);
  };

  const handleKeyUp = (event) => {
    if(event.key ==='Enter'){
      handleInputChange(event);
      fetchData();
    }
  };

  const juan = (event) =>{
    console.log(event.target.value);
    handleInputChange(event); // 입력이 변경될 때 stationName 상태를 업데이트
    fetchData();

  };
  const noRyang = (event) =>{
    console.log(event.target.value);
    handleInputChange(event); // 입력이 변경될 때 stationName 상태를 업데이트
    fetchData();
  };

  const fetchData = () => {
    const apiUrl = `http://swopenapi.seoul.go.kr/api/subway/4c7466666368617a33306e57714442/json/realtimeStationArrival/0/50/${stationName}`;

    axios
      .get(apiUrl) // Axios로 API 호출
      .then((response) => {
        const jsonData = response.data.realtimeArrivalList
          .filter(item => item.subwayId === "1001" || item.subwayId === "1009")
          .map(item => {
            let status;
            switch(item.arvlCd){
  //             도착코드
  // (0:진입, 1:도착, 2:출발, 3:전역출발, 4:전역진입, 5:전역도착, 99:운행중)
              case "0" :
                status = "진입";
                break;
              case "1" :
                status = "출발";
                break;
              case "2" :
                status = "진입";
                break;
              case "3" :
                status = "전역출발";
                break;
              case "4" :
                  status = "전역진입";
                  break;
              case "5" :
                  status = "전역도착";
                  break;
              default:
                  status = "운행중";
                  break;
            }
            return{
              ...item,
              subwayId : item.subwayId === "1001" ? "1호선" : "9호선",
              arvlCd : status
            }
          }).sort((a, b) => a.subwayId.localeCompare(b.subwayId));

        console.log('jsonData : ', jsonData);
        setResponseData(jsonData);
      })
      .catch((error) => {
        console.error('오류:', error);
      });
  };

  useEffect(() => {
    let intervalId;
    // 입력 값이 비어 있지 않고 데이터가 있을 때만 20초에 한 번씩 데이터를 가져옵니다.
    if (stationName && responseData.length > 0) {
      intervalId = setInterval(() => {
        fetchData();
      }, 5000); // 20초마다 fetchData 함수 호출
    }

    return () => {
      // 컴포넌트가 언마운트될 때 clearInterval을 호출하여 인터벌을 정리합니다.
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [stationName, responseData]);

   // 상행 데이터를 필터링
   const updnLineUp = responseData.filter((item) => item.updnLine === "상행");
   // 하행 데이터를 필터링
   const updnLineDown = responseData.filter((item) => item.updnLine === "하행");
 


   return (
    <div className="App">
      <h1>지하철 역 데이터 조회</h1>
      <input
        type="text"
        placeholder="지하철 역 이름을 입력하세요"
        value={stationName}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
      />
      <button onClick={fetchData}>열차 데이터 가져오기</button>
      <button onClick={noRyang} value="노량진">노량진</button>
      <button onClick={juan} value="주안">주안</button>
      <h2>상행 열차 목록</h2>
      <table className="table-contrainer">
        <div className ="table">
        <thead>
          <tr>
            <th>No</th>
            <th>지하철호선ID</th>
            <th>상하행선구분</th>
            <th>도착지방면</th>
            <th>지하철역명</th>
            <th>환승노선수</th>
            <th>도착예정열차순번</th>
            <th>열차종류</th>
            <th>열차도착예정시간</th>
            <th>열차번호</th>
            <th>종착지하철역명</th>
            <th>첫번째도착메세지</th>
            <th>두번째도착메세지</th>
            <th>도착코드</th>
          </tr>
        </thead>
        <tbody>
          {updnLineUp.map((item, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{item.subwayId}</td>
              <td>{item.updnLine}</td>
              <td>{item.trainLineNm}</td>
              <td>{item.statnNm}</td>
              <td>{item.trnsitCo}</td>
              <td>{item.ordkey}</td>
              <td>{item.btrainSttus}</td>
              <td>{item.barvlDt}</td>
              <td>{item.btrainNo}</td>
              <td>{item.bstatnNm}</td>
              <td>{item.arvlMsg2}</td>
              <td>{item.arvlMsg3}</td>
              <td>{item.arvlCd}</td>
            </tr>
          ))}
        </tbody>
        </div>
      </table>

      <h2>하행 열차 목록</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>지하철호선ID</th>
            <th>상하행선구분</th>
            <th>도착지방면</th>
            <th>지하철역명</th>
            <th>환승노선수</th>
            <th>도착예정열차순번</th>
            <th>열차종류</th>
            <th>열차도착예정시간</th>
            <th>열차번호</th>
            <th>종착지하철역명</th>
            <th>첫번째도착메세지</th>
            <th>두번째도착메세지</th>
            <th>도착코드</th>
          </tr>
        </thead>
        <tbody>
          {updnLineDown.map((item, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{item.subwayId}</td>
              <td>{item.updnLine}</td>
              <td>{item.trainLineNm}</td>
              <td>{item.statnNm}</td>
              <td>{item.trnsitCo}</td>
              <td>{item.ordkey}</td>
              <td>{item.btrainSttus}</td>
              <td>{item.barvlDt}</td>
              <td>{item.btrainNo}</td>
              <td>{item.bstatnNm}</td>
              <td>{item.arvlMsg2}</td>
              <td>{item.arvlMsg3}</td>
              <td>{item.arvlCd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
